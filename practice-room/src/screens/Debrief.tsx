import { useCallback, useEffect, useState } from "react";
import type { CallRecord } from "../../shared/types";
import type { CallPlan } from "../App";
import type { ServerStatus } from "../lib/api";
import { requestCoach, requestRetryReview } from "../lib/api";
import { getBuyer, getMethod, getProduct, getScenario, methods, rubric } from "../lib/library";
import { PHASES, weakestTurnIndex } from "../lib/progress";
import { deleteCall, getCall, loadProfile, saveCall } from "../lib/storage";
import { unlockAudio } from "../call/engine";
import { fmtTime, OUTCOME_LABEL, ScoreBar } from "../components";
import { voiceReadiness } from "../lib/readiness";

interface Props {
  callId: string;
  status: ServerStatus;
  onClose: () => void;
  onChanged: () => void;
  onStartPlan: (p: CallPlan) => void;
}

export function Debrief({ callId, status, onClose, onChanged, onStartPlan }: Props) {
  const [call, setCall] = useState<CallRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const runCoach = useCallback(async (c: CallRecord) => {
    setBusy(true);
    setError(null);
    try {
      if (c.replayOf) {
        const original = await getCall(c.replayOf);
        const w = original?.report?.weakestMoment;
        const at = original ? weakestTurnIndex(original) : null;
        if (!original || !w || at === null) throw new Error("The original call is no longer available.");
        const seed = original.turns.slice(0, at);
        c = {
          ...c,
          retryReport: await requestRetryReview({
            profile: c.profile ?? "standard",
            method: getMethod(c.setup.methodId),
            product: getProduct(c.setup.productId),
            buyer: getBuyer(c.setup.buyerId),
            original: w,
            retryTurns: [...seed.slice(-1), ...c.turns.slice(seed.length)],
          }),
        };
      } else {
        const method = getMethod(c.setup.methodId);
        c = {
          ...c,
          report: await requestCoach({
            profile: c.profile ?? "standard",
            buyer: getBuyer(c.setup.buyerId),
            scenario: getScenario(c.setup.scenarioId),
            method,
            otherMethods: methods.filter((m) => m.id !== method.id).map(({ id, name, coreMoves }) => ({ id, name, coreMoves })),
            product: getProduct(c.setup.productId),
            rubric,
            turns: c.turns,
            outcome: c.outcome,
            nextStep: c.nextStep,
            durationSec: c.durationSec,
          }),
        };
      }
      await saveCall(c);
      setCall(c);
      onChanged();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [onChanged]);

  useEffect(() => {
    void getCall(callId).then((c) => {
      if (!c) return setError("Call not found.");
      setCall(c);
      const repSpoke = c.turns.some((t) => t.speaker === "rep");
      const needsReview = c.replayOf ? !c.retryReport : !c.report;
      if (repSpoke && needsReview) void runCoach(c);
    });
  }, [callId, runCoach]);

  if (!call) return <div className="splash">{error ?? "Loading…"}</div>;

  const buyer = getBuyer(call.setup.buyerId);
  const scenario = getScenario(call.setup.scenarioId);
  const method = getMethod(call.setup.methodId);
  const r = call.report;
  const repWords = call.turns.filter((t) => t.speaker === "rep").reduce((n, t) => n + t.text.split(/\s+/).length, 0);
  const allWords = call.turns.reduce((n, t) => n + t.text.split(/\s+/).length, 0) || 1;
  const cutIns = call.turns.filter((t) => t.cutIn).length;
  const interruptions = call.turns.filter((t) => t.interrupted).length;
  const claudeApp = call.mode === "claude-app";
  const repSpoke = claudeApp || call.turns.some((t) => t.speaker === "rep");
  const canReplay = r && weakestTurnIndex(call) !== null && status.anthropic;

  const replay = (mode: "voice" | "text") =>
    onStartPlan({ setup: call.setup, mode, profile: loadProfile(), audio: mode === "voice" ? unlockAudio() : null, replayOf: call });
  const again = (mode: "voice" | "text") => onStartPlan({ setup: call.setup, mode, profile: loadProfile(), audio: mode === "voice" ? unlockAudio() : null });
  const voiceReady = voiceReadiness(status, loadProfile()).ready;

  return (
    <div className="debrief screen">
      <header className="debrief-head">
        <button className="text-btn" onClick={onClose}>
          ‹ Done
        </button>
        <span className="muted small">{new Date(call.startedAt).toLocaleString()}</span>
      </header>

      <h1>{call.replayOf ? "Replay review" : "Coach's debrief"}</h1>
      <p className="muted">
        {buyer.name} · {scenario.name} · {method.name} ·{" "}
        {claudeApp
          ? "Claude app"
          : `${fmtTime(call.durationSec * 1000)} · ${call.mode === "voice" ? "voice" : "text demo"} · ${call.profile === "saver" ? "Saver" : "Standard"}`}{" "}
        · level {call.difficultyLevel}
      </p>

      <div className={`outcome outcome-${call.outcome}`}>
        <b>{OUTCOME_LABEL[call.outcome]}</b>
        {call.nextStep && <span>: {call.nextStep}</span>}
      </div>

      {!repSpoke && <div className="alert info">You did not say anything on this call, so there is nothing to review.</div>}
      {busy && (
        <div className="card loading">
          <div className="spinner" />
          The coach is reviewing your call. This usually takes 30 to 90 seconds.
        </div>
      )}
      {error && (
        <div className="alert error">
          The review failed: {error}
          <button className="btn small" onClick={() => runCoach(call)}>
            Try again
          </button>
        </div>
      )}

      {call.retryReport && (
        <section className="card">
          <h2>Your retry: {call.retryReport.score}/10</h2>
          <p>{call.retryReport.verdict}</p>
          <p className="muted">{call.retryReport.comparedToOriginal}</p>
          <p>
            <b>Next:</b> {call.retryReport.stillToFix}
          </p>
        </section>
      )}

      {r && (
        <>
          <section className="card">
            <h2>Scores against {method.shortName}</h2>
            {PHASES.map((p) => (
              <div key={p.id} className="phase">
                <div className="phase-head">
                  <span>{p.label}</span>
                  {!r.phases[p.id].reached && <span className="chip">not reached</span>}
                </div>
                <ScoreBar score={r.phases[p.id].score} reached={r.phases[p.id].reached} />
                <p className="small muted">{r.phases[p.id].reason}</p>
              </div>
            ))}
            <p className="overall">{r.overall}</p>
          </section>

          <section className="card weakest">
            <h2>Your weakest moment</h2>
            {r.weakestMoment.buyerLineBefore && (
              <div className="quote buyer">
                <span className="who">{buyer.name.split(" ")[0]}</span>“{r.weakestMoment.buyerLineBefore}”
              </div>
            )}
            <div className="quote rep">
              <span className="who">You said</span>“{r.weakestMoment.quote}”
            </div>
            <p className="small">{r.weakestMoment.whyItMatters}</p>
            <div className="quote better">
              <span className="who">Say this instead</span>“{r.weakestMoment.rewrite}”
            </div>
            {canReplay && (
              <div className="btn-row">
                {voiceReady && (
                  <button className="btn primary" onClick={() => replay("voice")}>
                    Replay this moment
                  </button>
                )}
                <button className={`btn ${voiceReady ? "ghost" : "primary"}`} onClick={() => replay("text")}>
                  Replay as text demo
                </button>
              </div>
            )}
          </section>

          {r.ethicsFlags.length > 0 && (
            <section className="card ethics">
              <h2>Would be deceptive with a real buyer</h2>
              {r.ethicsFlags.map((f, i) => (
                <div key={i} className="flag">
                  <div className="quote rep">“{f.quote}”</div>
                  <p className="small">{f.concern}</p>
                  <p className="small">
                    <b>Honest alternative:</b> {f.honestAlternative}
                  </p>
                </div>
              ))}
            </section>
          )}

          <section className="card">
            <h2>Moments to rework</h2>
            {r.moments.map((m, i) => (
              <div key={i} className="moment">
                <div className="quote rep">“{m.quote}”</div>
                <p className="small muted">{m.whatHappened}</p>
                <div className="quote better">“{m.betterWording}”</div>
              </div>
            ))}
          </section>

          <section className="card">
            <h2>Another method's take: {getMethod(r.alternativeMethod.methodId).name}</h2>
            <p>{r.alternativeMethod.whatItWouldTry}</p>
          </section>
        </>
      )}

      {!claudeApp && (
        <>
      <section className="card stats">
          <div>
            <b>{Math.round((repWords / allWords) * 100)}%</b>
            <span>your share of words</span>
          </div>
          <div>
            <b>{cutIns}</b>
            <span>times the buyer cut in</span>
          </div>
          <div>
            <b>{interruptions}</b>
            <span>times you cut the buyer off</span>
          </div>
        </section>
  
        <button className="text-btn" onClick={() => setShowTranscript((s) => !s)}>
          {showTranscript ? "Hide transcript" : "Show transcript"}
        </button>
        {showTranscript && (
          <div className="transcript card">
            {call.turns.map((t, i) => (
              <p key={i} className={t.speaker}>
                <span className="who">
                  {fmtTime(t.at)} {t.speaker === "rep" ? "You" : buyer.name.split(" ")[0]}
                  {t.cutIn ? " (cut in)" : ""}
                </span>
                {t.text}
                {t.interrupted ? " —" : ""}
              </p>
            ))}
          </div>
        )}
        </>
      )}
      {claudeApp && call.rawTranscript && (
        <>
          <button className="text-btn" onClick={() => setShowTranscript((v) => !v)}>
            {showTranscript ? "Hide transcript" : "Show transcript"}
          </button>
          {showTranscript && <pre className="transcript card raw">{call.rawTranscript}</pre>}
        </>
      )}

      <div className="btn-row bottom-actions">
        {voiceReady && (
          <button className="btn primary" onClick={() => again("voice")}>
            Call again
          </button>
        )}
        <button
          className="btn ghost danger"
          onClick={async () => {
            if (!confirm("Delete this call from your history? This cannot be undone.")) return;
            await deleteCall(call.id);
            onChanged();
            onClose();
          }}
        >
          Delete call
        </button>
      </div>
    </div>
  );
}
