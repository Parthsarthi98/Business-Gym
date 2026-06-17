// These shapes match the JSON the generator edge function will produce in step two,
// so the same code renders hardcoded and Claude-generated sets alike.

export type BlockId = "A" | "B" | "C";
export type Difficulty = "Tough" | "Advanced";

export type QFormat =
  | "mcq"
  | "quant"
  | "integration"
  | "track-state"
  | "filter"
  | "multi-chain"
  | "cross-impact"
  | "branching";

export interface Question {
  id: number;
  block: BlockId;
  format: QFormat;
  reasoning_move: string; // one or more taxonomy codes, e.g. "B6" or "C2 C5"
  difficulty: Difficulty;
  stem: string;
  data?: string; // optional figures or table, shown in a monospace block
  options?: string[]; // four strings for mcq and quant, no letter prefix
  correct_option?: "A" | "B" | "C" | "D";
  marking_guide?: string;
  model_answer?: string;
  common_shortfall?: string; // optional: the trap a strong answer still falls into
}

export interface DayProblem {
  title: string;
  subtitle: string;
  case: string; // paragraphs separated by a blank line
  prompt: string;
  how_to_work_it: string;
  marking_guide: string;
  model_answer: string;
}

export interface DailySet {
  date: string;
  questions: Question[];
  day_problem: DayProblem;
}

// What the grading edge function returns for a free-text answer (step two).
export interface Grade {
  verdict: "pass" | "partial" | "miss";
  score: number; // 0 to 5
  criteria_hit: string[];
  criteria_missed: string[];
  error_tags: string[];
  feedback: string;
}

// ---- Block presentation (matches the uploaded design) ----

export interface BlockMeta {
  id: BlockId;
  name: string;
  blurb: string;
  timebox: string;
}

export const BLOCKS: Record<BlockId, BlockMeta> = {
  A: { id: "A", name: "Pace", blurb: "warm up fast, low memory load", timebox: "~5 min · Q1-7" },
  B: { id: "B", name: "Load", blurb: "hold every fact, combine all of it", timebox: "~7 min · Q8-14" },
  C: { id: "C", name: "Chains", blurb: "trace several chains into one net verdict", timebox: "~7-8 min · Q15-20" },
};

export const FORMAT_LABEL: Record<QFormat, string> = {
  mcq: "MCQ",
  quant: "Quant",
  integration: "Integration",
  "track-state": "Track state",
  filter: "Filter",
  "multi-chain": "Multi-chain",
  "cross-impact": "Cross-impact",
  branching: "Branching",
};

export function isAutoMarked(q: Question): boolean {
  return q.format === "mcq" || q.format === "quant";
}
