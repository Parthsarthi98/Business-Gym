import { useMemo, useState } from "react";
import { z } from "zod";
import type { CallRecord, CallSetup, CoachReport } from "../../shared/types";
import { buyerSystemPrompt, claudeAppCoachPrompt } from "../../shared/prompts";
import { getBuyer, getMethod, getProduct, getScenario, methods, rubric, settings } from "../lib/library";
import { buyerLevel, buyerMemory } from "../lib/progress";
import { loadClaudeAppDraft, saveCall, saveClaudeAppDraft } from "../lib/storage";

// Free practice: the call happens in Claude's own voice mode (covered by a Claude plan),
// and the coach's verdict is pasted back here so progress tracking still works.

const Phase = z.object({ score: z.number(), reached: z.boolean(), reason: z.string() });
const Imported = z.object({
  outcome: z.enum(["won", "buyer-ended", "rep-ended"]),
  nextStep: z.string().optional().default(""),
  phases: z.object({ opener: Phase, discovery: Phase, objectionHandling: Phase, close: Phase }),
  overall: z.string(),
  moments: z.array(z.object({ quote: z.string(), whatHappened: z.string(), betterWording: z.string() })),
  weakestMoment: z.object({ turnIndex: z.number(), quote: z.string(), buyerLineBefore: z.string(), whyItMatters: z.string(), rewrite: z.string() }),
  ethicsFlags: z.array(z.object({ quote: z.string(), concern: z.string(), honestAlternative: z.string() })),
  alternativeMethod: z.object({ methodId: z.string(), whatItWouldTry: z.string() }),
  factualSummary: z.string(),
});

/** Finds the coach's JSON block in a pasted reply and checks it has every field. */
export function parseCoachReply(text: string): z.infer<typeof Imported> {
  const fenced = [...text.matchAll(/```(?:json)?\s*([\s\S]*?)```/g)].map((m) => m[1]).pop();
  const candidate = fenced ?? text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  let raw: unknown;
  try {
    raw = JSON.parse(candidate);
  } catch {
    throw new Error("Couldn't find the coach's JSON block. Copy the whole reply, including the part in the code block at the end.");
  }
  const parsed = Imported.safeParse(raw);
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path.join(".") || "unknown";
    throw new Error(`The coach's JSON is missing or has a wrong field (${field}). Ask the coach to "give the JSON block again, exactly in the requested shape".`);
  }
  return parsed.data;
}

const clamp = (n: number) => Math.max(0, Math.min(10, Math.round(n)));

interface Props {
  setup: CallSetup;
  calls: CallRecord[];
  onExit: () => void;
  onLogged: (callId: string) => void;
}

export function ClaudeAppSession({ setup: initialSetup, calls, onExit, onLogged }: Props) {
  const existing = loadClaudeAppDraft();
  const resume = existing && JSON.stringify(existing.setup) === JSON.stringify(initialSetup) ? existing : null;
  const [draft, setDraft] = useState(resume ?? { setup: initialSetup, startedAt: new Date().toISOString(), transcript: "", coachReply: "" });
  const [copied, setCopied] = useState<string | null>(null);
  const [show, setShow] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<typeof draft>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    saveClaudeAppDraft(next);
  };

  const { setup } = draft;
  const buyer = getBuyer(setup.buyerId);
  const scenario = getScenario(setup.scenarioId);
  const method = getMethod(setup.methodId);
  const product = getProduct(setup.productId);
  const level = buyerLevel(calls, buyer.id);

  const buyerPrompt = useMemo(
    () =>
      buyerSystemPrompt(
        { buyer, scenario, product, difficulty: settings.difficulty.levels[level - 1], memory: buyerMemory(calls, buyer.id) },
        "claude-app",
      ),
    [buyer, scenario, product, level, calls],
  );
  const coachPrompt = useMemo(
    () =>
      claudeAppCoachPrompt(
        {
          buyer,
          scenario,
          method,
          product,
          rubric,
          otherMethods: methods.filter((m) => m.id !== method.id).map(({ id, name, coreMoves }) => ({ id, name, coreMoves })),
        },
        draft.transcript,
      ),
    [buyer, scenario, method, product, draft.transcript],
  );

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2500);
    } catch {
      setShow(key); // clipboard blocked: show the text so it can be copied by hand
    }
  };

  const save = async () => {
    setError(null);
    try {
      const data = parseCoachReply(draft.coachReply);
      const report: CoachReport = {
        phases: {
          opener: { ...data.phases.opener, score: data.phases.opener.reached ? clamp(data.phases.opener.score) : 0 },
          discovery: { ...data.phases.discovery, score: data.phases.discovery.reached ? clamp(data.phases.discovery.score) : 0 },
          objectionHandling: {
            ...data.phases.objectionHandling,
            score: data.phases.objectionHandling.reached ? clamp(data.phases.objectionHandling.score) : 0,
          },
          close: { ...data.phases.close, score: data.phases.close.reached ? clamp(data.phases.close.score) : 0 },
        },
        overall: data.overall,
        moments: data.moments,
        weakestMoment: { ...data.weakestMoment, turnIndex: -1 },
        ethicsFlags: data.ethicsFlags,
        alternativeMethod: data.alternativeMethod,
        factualSummary: data.factualSummary,
      };
      const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
      await saveCall({
        id,
        startedAt: draft.startedAt,
        durationSec: 0,
        setup,
        mode: "claude-app",
        difficultyLevel: level,
        turns: [],
        rawTranscript: draft.transcript,
        outcome: data.outcome,
        nextStep: data.nextStep || undefined,
        report,
      });
      saveClaudeAppDraft(null);
      onLogged(id);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const Prompt = ({ id, label, text, disabled }: { id: string; label: string; text: string; disabled?: boolean }) => (
    <>
      <div className="btn-row">
        <button className="btn primary" disabled={disabled} onClick={() => copy(id, text)}>
          {copied === id ? "Copied" : label}
        </button>
        <a className="btn ghost" href="https://claude.ai/new" target="_blank" rel="noreferrer">
          Open Claude
        </a>
      </div>
      <button className="text-btn small" onClick={() => setShow(show === id ? null : id)}>
        {show === id ? "Hide prompt" : "Show prompt"}
      </button>
      {show === id && <textarea className="input mono" rows={8} readOnly value={text} onFocus={(e) => e.currentTarget.select()} />}
    </>
  );

  return (
    <div className="screen claude-app">
      <header className="debrief-head">
        <button className="text-btn" onClick={onExit}>
          ‹ Back
        </button>
        <span className="pill pill-free">
          <span className="dot" />
          Free · Claude app
        </span>
      </header>
      <h1>Practise in the Claude app</h1>
      <p className="muted">
        {buyer.name} · {scenario.name} · {method.name} · level {level}. Uses your Claude plan's usage, not API credit. Your progress here is saved
        on this phone, so you can switch apps and come back.
      </p>

      <section className="card step">
        <div className="step-num">1</div>
        <h2>Start the call</h2>
        <ol className="small">
          <li>Copy the buyer prompt and paste it as the first message of a new Claude chat.</li>
          <li>Turn on voice mode and say “start”.</li>
          <li>Run the call. Say “end call” when you are done.</li>
          <li>
            Leave voice mode and type <b>TRANSCRIPT</b>. Claude writes out the whole call. Copy that message.
          </li>
        </ol>
        <Prompt id="buyer" label="Copy buyer prompt" text={buyerPrompt} />
      </section>

      <section className="card step">
        <div className="step-num">2</div>
        <h2>Paste the transcript</h2>
        <textarea
          className="input"
          rows={6}
          placeholder="REP: Hi Priya…&#10;BUYER: …"
          value={draft.transcript}
          onChange={(e) => update({ transcript: e.target.value })}
        />
      </section>

      <section className={`card step ${draft.transcript.trim() ? "" : "dim"}`}>
        <div className="step-num">3</div>
        <h2>Get the coach's review</h2>
        <p className="small">
          Paste this into a <b>new</b> Claude chat, not the buyer chat, so the coach judges the call cold. The prompt already includes your transcript.
        </p>
        <Prompt id="coach" label="Copy coach prompt" text={coachPrompt} disabled={!draft.transcript.trim()} />
      </section>

      <section className={`card step ${draft.transcript.trim() ? "" : "dim"}`}>
        <div className="step-num">4</div>
        <h2>Save it to your progress</h2>
        <p className="small">Copy the coach's whole reply, including the JSON block at the end, and paste it here.</p>
        <textarea className="input" rows={6} value={draft.coachReply} onChange={(e) => (setError(null), update({ coachReply: e.target.value }))} />
        {error && <div className="alert error small">{error}</div>}
        <button className="btn primary block" disabled={!draft.coachReply.trim()} onClick={save}>
          Save to my progress
        </button>
      </section>

      <button
        className="text-btn danger"
        onClick={() => {
          if (!confirm("Discard this Claude-app session?")) return;
          saveClaudeAppDraft(null);
          onExit();
        }}
      >
        Discard session
      </button>
    </div>
  );
}
