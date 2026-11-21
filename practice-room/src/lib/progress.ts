// Progress, difficulty and the next recommended drill, all derived from local call history.
import type { CallRecord, CallSetup, PhaseId } from "../../shared/types";
import { buyers, getScenario, methods, scenarios, settings } from "./library";

export const PHASES: { id: PhaseId; label: string }[] = [
  { id: "opener", label: "Opener" },
  { id: "discovery", label: "Discovery" },
  { id: "objectionHandling", label: "Objection handling" },
  { id: "close", label: "Close" },
];

/** Scored, full calls only (replays and unscored calls are excluded). Oldest first. */
export function scoredCalls(calls: CallRecord[]): CallRecord[] {
  return calls.filter((c) => c.report && !c.replayOf).sort((a, b) => a.startedAt.localeCompare(b.startedAt));
}

/** Average of the phases that were reached in one call, or null if none were. */
export function callAverage(c: CallRecord): number | null {
  if (!c.report) return null;
  const reached = Object.values(c.report.phases).filter((p) => p.reached);
  if (!reached.length) return 0;
  return reached.reduce((s, p) => s + p.score, 0) / reached.length;
}

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

/** Per-phase score series (reached phases only), oldest first. */
export function phaseSeries(calls: CallRecord[]): Record<PhaseId, number[]> {
  const out = { opener: [], discovery: [], objectionHandling: [], close: [] } as Record<PhaseId, number[]>;
  for (const c of scoredCalls(calls))
    for (const p of PHASES) {
      const s = c.report!.phases[p.id];
      if (s.reached) out[p.id].push(s.score);
    }
  return out;
}

export function methodAverages(calls: CallRecord[]) {
  return methods.map((m) => {
    const cs = scoredCalls(calls).filter((c) => c.setup.methodId === m.id);
    return { method: m, calls: cs.length, average: mean(cs.map((c) => callAverage(c) ?? 0)) };
  });
}

/**
 * Difficulty level per buyer. Walks this buyer's calls in order: when the last N calls at the
 * current level average at least the raise threshold, the level goes up; below the lower
 * threshold, it goes down. Derived from history, so there is no hidden state to drift.
 */
export function buyerLevel(calls: CallRecord[], buyerId: string): number {
  const { raiseWhenAverageAtLeast, lowerWhenAverageBelow, windowCalls, levels } = settings.difficulty;
  const max = levels.length;
  let level = 1;
  let window: number[] = [];
  for (const c of scoredCalls(calls).filter((c) => c.setup.buyerId === buyerId)) {
    window.push(callAverage(c) ?? 0);
    if (window.length > windowCalls) window.shift();
    const avg = mean(window) ?? 0;
    if (window.length >= windowCalls && avg >= raiseWhenAverageAtLeast && level < max) {
      level++;
      window = [];
    } else if (window.length >= 2 && avg < lowerWhenAverageBelow && level > 1) {
      level--;
      window = [];
    }
  }
  return level;
}

export function buyerRecord(calls: CallRecord[], buyerId: string) {
  const cs = calls.filter((c) => !c.replayOf && c.setup.buyerId === buyerId);
  return { wins: cs.filter((c) => c.outcome === "won").length, losses: cs.filter((c) => c.outcome !== "won").length };
}

/** Neutral memories the buyer gets about earlier calls with this rep (last three). */
export function buyerMemory(calls: CallRecord[], buyerId: string) {
  return scoredCalls(calls)
    .filter((c) => c.setup.buyerId === buyerId && c.report?.factualSummary)
    .slice(-3)
    .map((c) => ({
      date: new Date(c.startedAt).toDateString(),
      summary:
        c.report!.factualSummary +
        (c.outcome === "won" ? ` You agreed to: ${c.nextStep}.` : c.outcome === "buyer-ended" ? " You ended that call." : " The rep ended that call without a next step."),
    }));
}

export interface Recommendation {
  setup: Omit<CallSetup, "productId">;
  reason: string;
}

export function recommendDrill(calls: CallRecord[]): Recommendation {
  const scored = scoredCalls(calls);
  if (!scored.length) {
    return {
      setup: { buyerId: buyers[0].id, scenarioId: "discovery", methodId: "spin" },
      reason: "Start at the bottom of the buyer ladder with a discovery call. It shows how much the buyer holds back until you ask well.",
    };
  }

  // Buyer: the lowest rung not yet beaten (two wins and a recent average of 7 or more).
  const current =
    buyers.find((b) => {
      const rec = buyerRecord(calls, b.id);
      const recent = scored.filter((c) => c.setup.buyerId === b.id).slice(-3);
      const avg = mean(recent.map((c) => callAverage(c) ?? 0)) ?? 0;
      return rec.wins < 2 || avg < 7;
    }) ?? buyers[buyers.length - 1];

  // Skill: weakest phase over the last ten scored calls.
  const recent = scored.slice(-10);
  const phaseAvg = PHASES.map((p) => {
    const xs = recent.map((c) => c.report!.phases[p.id]).filter((s) => s.reached).map((s) => s.score);
    return { phase: p, avg: mean(xs) ?? 0, n: xs.length };
  });
  const untested = phaseAvg.find((p) => p.n === 0);
  const weakest = untested ?? [...phaseAvg].sort((a, b) => a.avg - b.avg)[0];
  const skillReason = untested
    ? `You have not reached ${weakest.phase.label.toLowerCase()} in a scored call yet.`
    : `${weakest.phase.label} is your weakest skill lately (average ${weakest.avg.toFixed(1)}/10).`;

  // Scenario: one that focuses on that phase, least recently practised.
  const lastUsed = (id: string) => scored.filter((c) => c.setup.scenarioId === id).map((c) => c.startedAt).pop() ?? "";
  const scenario = scenarios
    .filter((s) => s.phaseFocus.includes(weakest.phase.id))
    .sort((a, b) => lastUsed(a.id).localeCompare(lastUsed(b.id)))[0] ?? getScenario("discovery");

  // Method: the scenario's default method you score lowest with (so you practise the weak one).
  const mAvg = methodAverages(calls);
  const method =
    [...scenario.defaultMethods].sort(
      (a, b) => (mAvg.find((x) => x.method.id === a)?.average ?? -1) - (mAvg.find((x) => x.method.id === b)?.average ?? -1),
    )[0] ?? scenario.defaultMethods[0];

  return {
    setup: { buyerId: current.id, scenarioId: scenario.id, methodId: method },
    reason: `${skillReason} ${current.name} is the next buyer on the ladder you have not yet beaten.`,
  };
}

/** Index of the rep turn the coach marked as weakest, checked against the quote. */
export function weakestTurnIndex(c: CallRecord): number | null {
  const w = c.report?.weakestMoment;
  if (!w) return null;
  if (c.turns[w.turnIndex]?.speaker === "rep") return w.turnIndex;
  const probe = w.quote.toLowerCase().slice(0, 30);
  const i = c.turns.findIndex((t) => t.speaker === "rep" && t.text.toLowerCase().includes(probe));
  return i >= 0 ? i : null;
}
