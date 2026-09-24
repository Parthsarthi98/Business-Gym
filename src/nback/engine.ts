// Dual N-Back engine. No React here: sequence generation, scoring, level rules,
// and the audio clock that drives both the sound and the square.
//
// Sync model: the AudioContext clock is the single source of truth. Every trial
// has a fixed onset on that clock. Tones are scheduled on it sample-accurately,
// and the square is drawn when the audio "heard" time (context time minus output
// latency) is inside the trial's stimulus window. Key presses are mapped onto the
// same heard time, so the trial a press belongs to matches what you saw and heard.

export const MIN_N = 1;
export const MAX_N = 100;
export const SCORED_TRIALS = 20; // Jaeggi et al.: 20 + N trials per session
export const STIMULUS_MS = 500;

// 3x3 grid without the centre cell.
export const GRID_CELLS = [0, 1, 2, 3, 5, 6, 7, 8];

// Eight tones a minor third apart (A4 to F#6). Equal spacing on a log scale makes
// every pair equally easy to tell apart, and the range carries well on phone speakers.
const TONE_FREQS = [440, 523.25, 622.25, 739.99, 880, 1046.5, 1244.51, 1479.98];
export const LETTERS = ["C", "H", "K", "L", "Q", "R", "S", "T"];

export type Modality = "pos" | "sound";
export type SoundMode = "tones" | "letters";

export interface Trial {
  pos: number; // index into GRID_CELLS
  sound: number; // index into TONE_FREQS / LETTERS
  posMatch: boolean;
  soundMatch: boolean;
}

export interface Tally {
  hits: number;
  misses: number;
  falseAlarms: number;
  correctRejections: number;
}

export interface SessionResult {
  n: number;
  pos: Tally;
  sound: Tally;
  posPct: number;
  soundPct: number;
  pct: number; // combined
  date: string;
}

function randInt(max: number, rng: () => number) {
  return Math.floor(rng() * max);
}

function randOther(avoid: number, max: number, rng: () => number) {
  const v = randInt(max - 1, rng);
  return v >= avoid ? v + 1 : v;
}

function shuffle<T>(arr: T[], rng: () => number) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(i + 1, rng);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Exactly 6 position targets and 6 sound targets per 20 scored trials, 2 of them
// shared. No accidental matches: a non-target is always different from N back.
export function generateTrials(n: number, rng: () => number = Math.random): Trial[] {
  const kinds = shuffle(
    [
      ...Array(2).fill("both"),
      ...Array(4).fill("pos"),
      ...Array(4).fill("sound"),
      ...Array(SCORED_TRIALS - 10).fill("none"),
    ] as ("both" | "pos" | "sound" | "none")[],
    rng
  );
  const trials: Trial[] = [];
  for (let i = 0; i < n + SCORED_TRIALS; i++) {
    if (i < n) {
      trials.push({ pos: randInt(8, rng), sound: randInt(8, rng), posMatch: false, soundMatch: false });
      continue;
    }
    const kind = kinds[i - n];
    const posMatch = kind === "both" || kind === "pos";
    const soundMatch = kind === "both" || kind === "sound";
    const back = trials[i - n];
    trials.push({
      pos: posMatch ? back.pos : randOther(back.pos, 8, rng),
      sound: soundMatch ? back.sound : randOther(back.sound, 8, rng),
      posMatch,
      soundMatch,
    });
  }
  return trials;
}

export type Responses = { pos: boolean; sound: boolean }[];

function tally(trials: Trial[], responses: Responses, n: number, m: Modality): Tally {
  const t: Tally = { hits: 0, misses: 0, falseAlarms: 0, correctRejections: 0 };
  for (let i = n; i < trials.length; i++) {
    const target = m === "pos" ? trials[i].posMatch : trials[i].soundMatch;
    const pressed = responses[i]?.[m] ?? false;
    if (target && pressed) t.hits++;
    else if (target) t.misses++;
    else if (pressed) t.falseAlarms++;
    else t.correctRejections++;
  }
  return t;
}

// Brain Workshop scoring: hits / (hits + misses + false alarms). Correct
// rejections are ignored, so doing nothing scores 0, not 70%.
function pctOf(...ts: Tally[]) {
  const hits = ts.reduce((s, t) => s + t.hits, 0);
  const denom = ts.reduce((s, t) => s + t.hits + t.misses + t.falseAlarms, 0);
  return denom === 0 ? 0 : Math.round((hits / denom) * 100);
}

export function scoreSession(trials: Trial[], responses: Responses, n: number): SessionResult {
  const pos = tally(trials, responses, n, "pos");
  const sound = tally(trials, responses, n, "sound");
  return {
    n,
    pos,
    sound,
    posPct: pctOf(pos),
    soundPct: pctOf(sound),
    pct: pctOf(pos, sound),
    date: new Date().toISOString(),
  };
}

export const ADVANCE_PCT = 80;
export const FALLBACK_PCT = 50;
export const FALLBACK_STRIKES = 3;

// Returns the next level and strike count. 80%+ moves up; under 50% three
// sessions in a row moves down.
export function nextLevel(n: number, strikes: number, pct: number) {
  if (pct >= ADVANCE_PCT) return { n: Math.min(MAX_N, n + 1), strikes: 0 };
  if (pct < FALLBACK_PCT) {
    if (strikes + 1 >= FALLBACK_STRIKES) return { n: Math.max(MIN_N, n - 1), strikes: 0 };
    return { n, strikes: strikes + 1 };
  }
  return { n, strikes };
}

// ---------------------------------------------------------------- audio

type AC = AudioContext & { outputLatency?: number };

let ctx: AC | null = null;
let master: GainNode | null = null;
let buffers: AudioBuffer[] = [];

function makeTone(c: AudioContext, freq: number): AudioBuffer {
  const sr = c.sampleRate;
  const dur = 0.45;
  const len = Math.floor(sr * dur);
  const buf = c.createBuffer(1, len, sr);
  const d = buf.getChannelData(0);
  const attack = 0.006 * sr;
  const release = 0.14 * sr;
  let peak = 0;
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    const w = 2 * Math.PI * freq * t;
    // A few harmonics give the tone body so it cuts through on small speakers.
    const s = Math.sin(w) + 0.4 * Math.sin(2 * w) + 0.18 * Math.sin(3 * w) + 0.06 * Math.sin(4 * w);
    let env = 1;
    if (i < attack) env = i / attack;
    else if (i > len - release) env = Math.pow((len - i) / release, 2);
    d[i] = s * env;
    peak = Math.max(peak, Math.abs(d[i]));
  }
  for (let i = 0; i < len; i++) d[i] = (d[i] / peak) * 0.95;
  return buf;
}

// Must be called from a user gesture (click / key) so browsers allow sound.
export async function initAudio(volume: number) {
  if (!ctx) {
    ctx = new AudioContext({ latencyHint: "interactive" }) as AC;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -12;
    comp.knee.value = 6;
    comp.ratio.value = 4;
    comp.attack.value = 0.002;
    comp.release.value = 0.1;
    master = ctx.createGain();
    master.connect(comp).connect(ctx.destination);
    buffers = TONE_FREQS.map((f) => makeTone(ctx!, f));
  }
  if (ctx.state !== "running") await ctx.resume();
  setVolume(volume);
  return ctx;
}

export function setVolume(v: number) {
  if (master && ctx) master.gain.setTargetAtTime(v, ctx.currentTime, 0.01);
}

// Context time that is reaching the speaker at performance time `perfMs`.
export function heardAt(perfMs: number = performance.now()): number {
  if (!ctx) return 0;
  const ts = ctx.getOutputTimestamp?.();
  if (ts && ts.contextTime && ts.performanceTime) {
    return ts.contextTime + (perfMs - ts.performanceTime) / 1000;
  }
  const latency = ctx.outputLatency || ctx.baseLatency || 0;
  return ctx.currentTime - (performance.now() - perfMs) / 1000 - latency;
}

function playTone(sound: number, when: number) {
  if (!ctx || !master) return null;
  const src = ctx.createBufferSource();
  src.buffer = buffers[sound];
  src.connect(master);
  src.start(when);
  return src;
}

let voice: SpeechSynthesisVoice | null = null;
function pickVoice() {
  const vs = window.speechSynthesis?.getVoices() ?? [];
  voice = vs.find((v) => v.lang.startsWith("en") && v.localService) ?? vs.find((v) => v.lang.startsWith("en")) ?? null;
}
if (typeof window !== "undefined" && window.speechSynthesis) {
  pickVoice();
  window.speechSynthesis.onvoiceschanged = pickVoice;
}

function speakLetter(sound: number, volume: number) {
  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(LETTERS[sound]);
  if (voice) u.voice = voice;
  u.rate = 1.1;
  u.volume = Math.min(1, volume);
  synth.speak(u);
}

export function previewSound(mode: SoundMode, sound: number, volume: number) {
  if (mode === "letters") speakLetter(sound, volume);
  else if (ctx) playTone(sound, ctx.currentTime + 0.02);
}

// ---------------------------------------------------------------- session runner

export interface Frame {
  trial: number; // -1 before the first onset
  visible: boolean; // square on screen
}

export interface RunnerOpts {
  n: number;
  intervalMs: number;
  soundMode: SoundMode;
  volume: number;
  onFrame: (f: Frame) => void;
  onDone: (result: SessionResult) => void;
}

const LEAD_IN = 0.8; // seconds before the first trial
const LOOKAHEAD = 0.2; // schedule tones this far ahead of the audio clock

export class Runner {
  readonly trials: Trial[];
  readonly responses: Responses;
  private t0 = 0;
  private interval: number;
  private scheduled = 0;
  private timer = 0;
  private raf = 0;
  private lastTrial = -2;
  private lastVisible = false;
  private sources: AudioBufferSourceNode[] = [];
  private stopped = false;

  constructor(private o: RunnerOpts) {
    this.trials = generateTrials(o.n);
    this.responses = this.trials.map(() => ({ pos: false, sound: false }));
    this.interval = o.intervalMs / 1000;
  }

  get total() {
    return this.trials.length;
  }

  start() {
    if (!ctx) throw new Error("initAudio first");
    this.t0 = ctx.currentTime + LEAD_IN;
    this.schedule();
    this.timer = window.setInterval(() => this.schedule(), 25);
    const tick = () => {
      if (this.stopped) return;
      this.frame();
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private schedule() {
    if (!ctx || this.o.soundMode !== "tones") return;
    while (this.scheduled < this.total) {
      const onset = this.t0 + this.scheduled * this.interval;
      if (onset > ctx.currentTime + LOOKAHEAD) break;
      const src = playTone(this.trials[this.scheduled].sound, Math.max(onset, ctx.currentTime));
      if (src) this.sources.push(src);
      this.scheduled++;
    }
    // Keep only sources that may still be playing.
    if (this.sources.length > 4) this.sources = this.sources.slice(-4);
  }

  private trialAt(heard: number) {
    return Math.floor((heard - this.t0) / this.interval);
  }

  private frame() {
    const h = heardAt();
    if (h >= this.t0 + this.total * this.interval) {
      this.finish();
      return;
    }
    const k = this.trialAt(h);
    const visible = k >= 0 && h - (this.t0 + k * this.interval) < STIMULUS_MS / 1000;
    if (k !== this.lastTrial && k >= 0 && this.o.soundMode === "letters") {
      speakLetter(this.trials[k].sound, this.o.volume);
    }
    if (k !== this.lastTrial || visible !== this.lastVisible) {
      this.lastTrial = k;
      this.lastVisible = visible;
      this.o.onFrame({ trial: k, visible });
    }
  }

  // Returns true/false for a counted response, or null if ignored
  // (before trial N, outside the session, or already answered this trial).
  respond(m: Modality, eventTimeMs: number): { trial: number; correct: boolean } | null {
    if (this.stopped) return null;
    const k = this.trialAt(heardAt(eventTimeMs));
    if (k < this.o.n || k >= this.total) return null;
    if (this.responses[k][m]) return null;
    this.responses[k][m] = true;
    const t = this.trials[k];
    return { trial: k, correct: m === "pos" ? t.posMatch : t.soundMatch };
  }

  private finish() {
    this.halt();
    this.o.onDone(scoreSession(this.trials, this.responses, this.o.n));
  }

  halt() {
    if (this.stopped) return;
    this.stopped = true;
    clearInterval(this.timer);
    cancelAnimationFrame(this.raf);
    for (const s of this.sources) {
      try {
        s.stop();
      } catch {
        /* already ended */
      }
    }
    window.speechSynthesis?.cancel();
  }
}
