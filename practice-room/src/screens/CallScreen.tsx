import { useEffect, useRef, useState } from "react";
import type { CallRecord } from "../../shared/types";
import type { CallPlan } from "../App";
import { CallEngine, type CallState } from "../call/engine";
import { requestRetryReview } from "../lib/api";
import { getBuyer, getMethod, getProduct, getScenario, settings } from "../lib/library";
import { buyerLevel, buyerMemory, weakestTurnIndex } from "../lib/progress";
import { loadCaptions, saveCall, saveCaptions } from "../lib/storage";
import { fmtTime, Initials, LinkPill } from "../components";

interface Props {
  plan: CallPlan;
  calls: CallRecord[];
  onExit: () => void;
  onFinished: (callId: string) => void;
  onSwitchToText: () => void;
}

export function CallScreen({ plan, calls, onExit, onFinished, onSwitchToText }: Props) {
  const buyer = getBuyer(plan.setup.buyerId);
  const scenario = getScenario(plan.setup.scenarioId);
  const replay = plan.replayOf;
  const weakest = replay?.report?.weakestMoment;
  const [state, setState] = useState<CallState | null>(null);
  const [captions, setCaptions] = useState(loadCaptions());
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const engineRef = useRef<CallEngine | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const level = buyerLevel(calls, buyer.id);
    const startedAt = new Date().toISOString();
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const replayAt = replay ? weakestTurnIndex(replay) : null;
    const seedTurns = replay && replayAt !== null ? replay.turns.slice(0, replayAt) : undefined;

    const engine = new CallEngine({
      buyer,
      scenario,
      product: getProduct(plan.setup.productId),
      mode: plan.mode,
      difficulty: settings.difficulty.levels[level - 1],
      memory: buyerMemory(calls, buyer.id),
      seedTurns,
      onChange: setState,
      onEnded: async (r) => {
        setSaving(true);
        const record: CallRecord = {
          id,
          startedAt,
          durationSec: r.durationSec,
          setup: plan.setup,
          mode: plan.mode,
          difficultyLevel: level,
          turns: r.turns,
          outcome: r.outcome,
          nextStep: r.nextStep,
          replayOf: replay?.id,
        };
        if (replay && weakest && seedTurns) {
          const retryTurns = r.turns.slice(seedTurns.length);
          if (retryTurns.some((t) => t.speaker === "rep")) {
            try {
              record.retryReport = await requestRetryReview({
                method: getMethod(plan.setup.methodId),
                product: getProduct(plan.setup.productId),
                buyer,
                original: weakest,
                retryTurns: [...seedTurns.slice(-1), ...retryTurns],
              });
            } catch {
              /* the debrief offers a retry of the review */
            }
          }
        }
        await saveCall(record);
        onFinished(id);
      },
    });
    engineRef.current = engine;
    void engine.start(plan.audio);
    return () => engine.dispose();
    // The engine is created once per call screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [state?.turns.length, state?.turns[state.turns.length - 1]?.text]);

  if (!state) return <div className="splash">Connecting…</div>;

  if (state.status === "failed") {
    return (
      <div className="call failed">
        <h1>Call did not start</h1>
        <div className="alert error">{state.failure}</div>
        <p className="muted">Nothing was faked: no voice session is running. You can fix the problem and try again, or switch to a clearly labelled text-only demo.</p>
        <button className="btn primary block" onClick={onSwitchToText}>
          Switch to text-only demo
        </button>
        <button className="btn ghost block" onClick={onExit}>
          Back
        </button>
      </div>
    );
  }

  const textMode = state.link !== "live" && state.link !== "connecting";
  const showCaptions = captions || state.forceCaptions;
  const activityText = {
    idle: "",
    listening: "Listening…",
    "rep-speaking": "You're speaking",
    "buyer-thinking": `${buyer.name.split(" ")[0]} is thinking…`,
    "buyer-speaking": `${buyer.name.split(" ")[0]} is speaking`,
  }[state.activity];
  const lastBuyer = [...state.turns].reverse().find((t) => t.speaker === "buyer");

  return (
    <div className={`call ${textMode ? "text-mode" : ""}`}>
      <header className="call-top">
        <LinkPill link={state.link} />
        <span className="timer" aria-label="Call time">
          {fmtTime(state.elapsedMs)}
        </span>
      </header>

      {replay && weakest && (
        <div className="alert info small">
          Replay: retry your weakest moment. Suggested wording: “{weakest.rewrite}”
        </div>
      )}
      {state.notice && <div className="alert warn small">{state.notice}</div>}

      <section className="call-center">
        <Initials name={buyer.name} speaking={state.activity === "buyer-speaking"} size={textMode ? 64 : 120} />
        <h1 className="call-name">{buyer.name}</h1>
        <div className="muted">
          {buyer.role} · {buyer.company}
        </div>
        <div className="mood" aria-label="Buyer mood">
          Mood: <b>{state.mood}</b>
        </div>
        {!textMode && <div className="activity">{activityText}</div>}
        {!textMode && showCaptions && (
          <div className="captions">
            {state.caption || (state.activity !== "rep-speaking" ? lastBuyer?.text : "")}
            {state.interim && <div className="interim">You: {state.interim}</div>}
          </div>
        )}
      </section>

      {textMode && (
        <div className="chat" ref={logRef}>
          {state.turns.map((t, i) => (
            <div key={i} className={`bubble ${t.speaker}`}>
              {t.text}
              {t.interrupted && " —"}
            </div>
          ))}
          {state.activity === "buyer-thinking" && <div className="bubble buyer typing">…</div>}
        </div>
      )}

      <footer className="call-bottom">
        {textMode ? (
          <form
            className="composer"
            onSubmit={(e) => {
              e.preventDefault();
              engineRef.current?.sendText(draft);
              setDraft("");
            }}
          >
            <input className="input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type what you would say…" autoFocus />
            <button className="btn primary" disabled={!draft.trim()}>
              Send
            </button>
          </form>
        ) : (
          <div className="hint">Say “end call” or tap to hang up</div>
        )}
        <div className="call-actions">
          {!textMode && (
            <button
              className="btn round ghost"
              aria-pressed={captions}
              onClick={() => {
                setCaptions(!captions);
                saveCaptions(!captions);
              }}
            >
              CC
            </button>
          )}
          <button className="btn hangup" disabled={saving} onClick={() => engineRef.current?.hangUp("rep")} aria-label="Hang up">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85a1 1 0 0 1-1.41-.01L.29 13.08a1 1 0 0 1 0-1.41C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67a1 1 0 0 1 0 1.41l-2.48 2.48a1 1 0 0 1-1.41.01 11.3 11.3 0 0 0-2.66-1.85 1 1 0 0 1-.56-.9v-3.1A15 15 0 0 0 12 9z" />
            </svg>
          </button>
          {!textMode && <span className="btn round placeholder" />}
        </div>
        {saving && <div className="muted small center">Saving the call…</div>}
      </footer>
    </div>
  );
}
