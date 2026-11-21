// Types shared by the browser app and the server functions.
// The data files in /data must match these shapes; `npm run typecheck` catches mismatches.

export type PhaseId = "opener" | "discovery" | "objectionHandling" | "close";

export interface Method {
  id: string;
  name: string;
  shortName: string;
  origin: string;
  evidenceType: string;
  fits: string[];
  strains: string[];
  coreMoves: string[];
  coachCriteria: Record<PhaseId, string[]>;
  ethicsGuardrails: string[];
}

export interface Buyer {
  id: string;
  ladderRank: number;
  difficulty: "easy" | "medium" | "hard";
  name: string;
  role: string;
  company: string;
  companyContext: string;
  budget: string;
  targets: string;
  competingVendors: string[];
  personality: string;
  startingMood: string;
  situation: string;
  secretlyWants: string;
  withholds: string[];
  hangsUpWhen: string[];
  earnsNextStep: string[];
  speechStyle: string;
  patienceSeconds: number;
  voice: { elevenLabsVoiceId: string; label: string };
  phoneGreeting: string;
}

export interface Scenario {
  id: string;
  order: number;
  name: string;
  summary: string;
  defaultMethods: string[];
  suggestedBuyers: string[];
  repBrief: string;
  buyerBrief: string;
  buyerOpensCall: boolean;
  phaseFocus: PhaseId[];
  winCondition: string;
}

/** A product brief. Ship files in /data/products, or paste your own in Settings. */
export interface Product {
  id: string;
  name: string;
  fictional: boolean;
  oneLiner: string;
  whatItDoes?: string[];
  pricing?: Record<string, string>;
  proof?: string[];
  limitations?: string[];
  competitors?: { name: string; position: string }[];
  truthRules?: string;
  /** Free-text brief for products pasted in the app. */
  freeText?: string;
}

export interface Rubric {
  phases: { id: PhaseId; name: string; description: string }[];
  scoreAnchors: Record<string, string>;
  notReachedRule: string;
  ethicsRules: string[];
  ethicsPenalty: string;
}

export interface Settings {
  models: { buyer: string; buyerEffort: "low" | "medium" | "high"; coach: string; coachEffort: "low" | "medium" | "high" | "xhigh" | "max" };
  voice: {
    sttModel: string;
    sttLanguage: string;
    endpointingMs: number;
    utteranceEndMs: number;
    ttsModel: string;
    ttsOutputFormat: string;
    bargeInMinWords: number;
  };
  call: { maxCallMinutes: number; endCallPhrases: string[] };
  difficulty: {
    levels: { level: number; name: string; description: string }[];
    raiseWhenAverageAtLeast: number;
    lowerWhenAverageBelow: number;
    windowCalls: number;
  };
}

export interface Turn {
  speaker: "rep" | "buyer";
  text: string;
  /** Milliseconds since the call started. */
  at: number;
  /** Buyer turn cut short because the rep talked over it. */
  interrupted?: boolean;
  /** Buyer turn that cut in while the rep was still talking. */
  cutIn?: boolean;
  mood?: string;
}

export interface CallSetup {
  buyerId: string;
  scenarioId: string;
  methodId: string;
  productId: string;
}

/** Everything the server needs to play the buyer for one reply. */
export interface BuyerRequest {
  buyer: Buyer;
  scenario: Scenario;
  product: Product;
  difficulty: { level: number; name: string; description: string };
  /** Neutral summaries of earlier calls between this rep and this buyer, oldest first. */
  memory: { date: string; summary: string }[];
  turns: Turn[];
  /** Set when the rep has talked past the buyer's patience and the buyer should cut in. */
  cutIn?: { secondsTalking: number };
}

export interface PhaseScore {
  score: number;
  reached: boolean;
  reason: string;
}

export interface CoachReport {
  phases: Record<PhaseId, PhaseScore>;
  overall: string;
  moments: { quote: string; whatHappened: string; betterWording: string }[];
  weakestMoment: {
    turnIndex: number;
    quote: string;
    buyerLineBefore: string;
    whyItMatters: string;
    rewrite: string;
  };
  ethicsFlags: { quote: string; concern: string; honestAlternative: string }[];
  alternativeMethod: { methodId: string; whatItWouldTry: string };
  factualSummary: string;
}

export interface CoachRequest {
  buyer: Buyer;
  scenario: Scenario;
  method: Method;
  otherMethods: Pick<Method, "id" | "name" | "coreMoves">[];
  product: Product;
  rubric: Rubric;
  turns: Turn[];
  outcome: CallOutcome;
  nextStep?: string;
  durationSec: number;
}

export interface RetryReport {
  score: number;
  verdict: string;
  comparedToOriginal: string;
  stillToFix: string;
}

export interface RetryRequest {
  method: Method;
  product: Product;
  buyer: Buyer;
  original: CoachReport["weakestMoment"];
  retryTurns: Turn[];
}

export type CallOutcome = "won" | "buyer-ended" | "rep-ended";

export interface CallRecord {
  id: string;
  startedAt: string;
  durationSec: number;
  setup: CallSetup;
  mode: "voice" | "text";
  difficultyLevel: number;
  turns: Turn[];
  outcome: CallOutcome;
  nextStep?: string;
  report?: CoachReport;
  /** Set when this call is a replay of one moment from another call. */
  replayOf?: string;
  retryReport?: RetryReport;
}
