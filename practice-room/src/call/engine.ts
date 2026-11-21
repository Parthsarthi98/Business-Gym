// The live call: turn-taking, the buyer's streamed reply, sentence-chunked speech, and
// interruptions both ways (you can talk over the buyer; the buyer cuts in if you ramble).
import type { Buyer, BuyerRequest, CallOutcome, Product, Scenario, Turn } from "../../shared/types";
import { MarkerStreamParser } from "../../shared/markers";
import { fetchSpeech, getSttToken, streamBuyer } from "../lib/api";
import { settings } from "../lib/library";
import { Mic } from "../voice/mic";
import { SentenceChunker } from "../voice/sentences";
import { SpeechQueue } from "../voice/player";
import { DeepgramStream } from "../voice/stt";

export type Link = "connecting" | "live" | "text-demo" | "lost";
export type Activity = "idle" | "listening" | "rep-speaking" | "buyer-thinking" | "buyer-speaking";

export interface CallState {
  status: "starting" | "active" | "ended" | "failed";
  link: Link;
  activity: Activity;
  mood: string;
  turns: Turn[];
  interim: string;
  caption: string;
  elapsedMs: number;
  notice?: string;
  failure?: string;
  forceCaptions?: boolean;
}

export interface CallResult {
  turns: Turn[];
  outcome: CallOutcome;
  nextStep?: string;
  durationSec: number;
}

export interface EngineOptions {
  buyer: Buyer;
  scenario: Scenario;
  product: Product;
  mode: "voice" | "text";
  difficulty: BuyerRequest["difficulty"];
  memory: BuyerRequest["memory"];
  /** Replay: the conversation up to the moment being retried. */
  seedTurns?: Turn[];
  onChange: (s: CallState) => void;
  onEnded: (r: CallResult) => void;
}

const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean);
const normalise = (s: string) => words(s).join(" ");

let sharedCtx: AudioContext | null = null;
/** Must be called inside a tap handler: iPhone Safari only allows audio to start from a user gesture. */
export function unlockAudio(): AudioContext {
  if (!sharedCtx || sharedCtx.state === "closed") sharedCtx = new AudioContext();
  void sharedCtx.resume();
  return sharedCtx;
}

export class CallEngine {
  state: CallState;
  private o: EngineOptions;
  private ctx: AudioContext | null = null;
  private mic: Mic | null = null;
  private stt: DeepgramStream | null = null;
  private queue: SpeechQueue | null = null;
  private timer: number | undefined;
  private startTime = 0;
  private timeOffset = 0;

  // Rep speech not yet committed as a turn.
  private repFinal: string[] = [];
  private repStartedAt: number | null = null;
  private lastRepWordAt = 0;
  private cutInDone = false;
  private skipWords = 0;
  private mergeIntoLastRep = false;

  // The buyer turn currently being generated or spoken.
  private buyerAbort: AbortController | null = null;
  private buyerTurnIdx: number | null = null;
  private buyerStreamDone = false;
  private pending: { nextStep?: string; endCall: boolean } = { endCall: false };
  private graceUntil = 0;
  private nextStep?: string;
  private lastBuyerText = "";
  private lastBuyerEndedAt = 0;

  constructor(o: EngineOptions) {
    this.o = o;
    this.state = {
      status: "starting",
      link: o.mode === "voice" ? "connecting" : "text-demo",
      activity: "idle",
      mood: o.buyer.startingMood,
      turns: o.seedTurns ? o.seedTurns.map((t) => ({ ...t })) : [],
      interim: "",
      caption: "",
      elapsedMs: 0,
    };
  }

  private set(patch: Partial<CallState>) {
    this.state = { ...this.state, ...patch };
    this.o.onChange(this.state);
  }

  private now() {
    return performance.now() - this.startTime + this.timeOffset;
  }

  async start(ctx: AudioContext | null) {
    this.startTime = performance.now();
    const seed = this.state.turns;
    this.timeOffset = seed.length ? seed[seed.length - 1].at + 1000 : 0;

    if (this.o.mode === "voice") {
      if (!ctx) return this.fail("Audio is not available in this browser.");
      this.ctx = ctx;
      try {
        const token = await getSttToken();
        this.stt = await DeepgramStream.open(token, ctx.sampleRate, settings.voice, {
          onInterim: (t) => this.onInterim(t),
          onFinal: (t, sf) => this.onFinal(t, sf),
          onUtteranceEnd: () => this.commitRepTurn(),
          onClose: (unexpected, reason) => {
            if (unexpected && this.state.status === "active") this.linkLost(`Speech-to-text disconnected (${reason}).`);
          },
        });
        this.mic = await Mic.start(ctx, (pcm) => this.stt?.send(pcm));
      } catch (e) {
        return this.fail(`Live voice could not start: ${(e as Error).message}`);
      }
      let warnedVoice = false;
      const onVoiceFallback = (id: string) => {
        if (warnedVoice) return;
        warnedVoice = true;
        this.set({ notice: `Sarvam did not accept the voice "${id}", so the buyer is using Sarvam's default voice. Change it in the buyer's data file.` });
      };
      this.queue = new SpeechQueue(ctx, (text, signal) => fetchSpeech(text, this.o.buyer.voice.sarvamSpeaker, signal, onVoiceFallback), {
        onSentenceStart: (text) => this.set({ activity: "buyer-speaking", caption: text }),
        onIdle: () => {
          if (this.buyerStreamDone) this.finishBuyerTurn();
        },
        onError: (msg) => this.set({ notice: `The buyer's voice failed: ${msg}. Showing captions instead.`, forceCaptions: true }),
      });
      this.set({ link: "live" });
    }

    this.timer = window.setInterval(() => this.tick(), 500);
    this.set({ status: "active", activity: "listening" });

    if (seed.length) {
      const last = seed[seed.length - 1];
      if (last.speaker === "buyer") this.speakScripted(last.text);
    } else if (this.o.scenario.buyerOpensCall) {
      const greeting = this.o.buyer.phoneGreeting;
      this.set({ turns: [{ speaker: "buyer", text: greeting, at: 0, mood: this.o.buyer.startingMood }] });
      this.speakScripted(greeting);
    }
  }

  private fail(message: string) {
    this.cleanup();
    this.set({ status: "failed", failure: message, link: this.o.mode === "voice" ? "lost" : "text-demo" });
  }

  private linkLost(reason: string) {
    this.mic?.stop();
    this.mic = null;
    this.set({
      link: "lost",
      notice: `${reason} Live voice has stopped. You can keep going by typing, or end the call.`,
      forceCaptions: true,
    });
  }

  private speakScripted(text: string) {
    if (!this.queue) return;
    this.queue.resetTurn();
    this.buyerStreamDone = true;
    this.buyerTurnIdx = null;
    this.pending = { endCall: false };
    for (const s of new SentenceChunker().push(text + " ")) this.queue.enqueue(s);
    this.set({ activity: "buyer-thinking" });
  }

  // ------------------------------------------------------------------ your speech

  private buyerActive() {
    return this.state.activity === "buyer-thinking" || this.state.activity === "buyer-speaking" || Boolean(this.queue?.busy);
  }

  /** True when the transcript is most likely the buyer's own voice picked up by the mic. */
  private isEcho(text: string) {
    const heard = words(text);
    if (!heard.length) return true;
    const recent = performance.now() - this.lastBuyerEndedAt < 2000 ? this.lastBuyerText : "";
    const ref = new Set(words(`${this.queue?.currentText ?? ""} ${this.state.caption} ${recent}`));
    const overlap = heard.filter((w) => ref.has(w)).length / heard.length;
    return overlap >= 0.6;
  }

  private maybeBargeIn(text: string) {
    if (!this.buyerActive() || performance.now() < this.graceUntil) return false;
    if (words(text).length < settings.voice.bargeInMinWords || this.isEcho(text)) return false;
    this.interruptBuyer();
    return true;
  }

  /** Late transcripts of the buyer's last words, delivered just after they stopped speaking. */
  private isLateEcho(text: string) {
    return performance.now() - this.lastBuyerEndedAt < 2000 && this.isEcho(text);
  }

  private onInterim(text: string) {
    if (this.state.status !== "active" || this.isLateEcho(text)) return;
    if (this.buyerActive() && !this.maybeBargeIn(text)) return;
    this.repStartedAt ??= this.now();
    this.lastRepWordAt = performance.now();
    this.set({ interim: text, activity: "rep-speaking" });
  }

  private onFinal(text: string, speechFinal: boolean) {
    if (this.state.status !== "active") return;
    if (text && this.isLateEcho(text)) text = "";
    if (text) {
      if (this.buyerActive() && !this.maybeBargeIn(text)) return;
      let t = text;
      if (this.skipWords > 0) {
        const ws = t.split(/\s+/);
        t = ws.slice(this.skipWords).join(" ");
        this.skipWords = Math.max(0, this.skipWords - ws.length);
      }
      if (t) {
        this.repFinal.push(t);
        this.repStartedAt ??= this.now();
        this.lastRepWordAt = performance.now();
      }
      this.set({ interim: "", activity: "rep-speaking" });
    }
    if (speechFinal && this.repFinal.length) this.commitRepTurn();
  }

  private interruptBuyer() {
    const heard = this.queue?.stop() ?? "";
    this.buyerAbort?.abort();
    this.buyerAbort = null;
    const turns = [...this.state.turns];
    if (this.buyerTurnIdx !== null) {
      if (heard.trim()) {
        turns[this.buyerTurnIdx] = { ...turns[this.buyerTurnIdx], text: heard.trim(), interrupted: true };
      } else {
        // The buyer had not started speaking: drop the reply and treat your speech as one turn.
        turns.splice(this.buyerTurnIdx, 1);
        this.mergeIntoLastRep = true;
      }
    } else if (!this.buyerStreamDone || !heard.trim()) {
      this.mergeIntoLastRep = true;
    }
    this.buyerTurnIdx = null;
    this.pending = { endCall: false };
    this.set({ turns, caption: "", activity: "rep-speaking" });
  }

  private commitRepTurn() {
    if (this.state.status !== "active") return;
    const text = this.repFinal.join(" ").trim();
    const at = this.repStartedAt ?? this.now();
    this.repFinal = [];
    this.repStartedAt = null;
    this.cutInDone = false;
    if (!text) return;
    this.addRepText(text, at, true);
  }

  /** Adds your words to the transcript, checks for "end call", then asks the buyer to reply. */
  private addRepText(raw: string, at: number, reply: boolean) {
    let text = raw.trim();
    const norm = normalise(text);
    const endPhrase = settings.call.endCallPhrases.find((p) => norm === p || norm.endsWith(` ${p}`));
    if (endPhrase) text = text.replace(new RegExp(`${endPhrase.split(" ").join("\\W+")}\\W*$`, "i"), "").trim();

    const turns = [...this.state.turns];
    const last = turns[turns.length - 1];
    if (text) {
      if (this.mergeIntoLastRep && last?.speaker === "rep") turns[turns.length - 1] = { ...last, text: `${last.text} ${text}` };
      else turns.push({ speaker: "rep", text, at });
    }
    this.mergeIntoLastRep = false;
    this.set({ turns, interim: "" });

    if (endPhrase) return this.hangUp("rep");
    if (reply && text) void this.requestBuyerReply();
  }

  /** Text mode, or after the voice link drops. */
  sendText(text: string) {
    if (this.state.status !== "active" || !text.trim()) return;
    if (this.buyerActive()) this.interruptBuyer();
    this.addRepText(text, this.now(), true);
  }

  private tick() {
    if (this.state.status !== "active") return;
    const elapsed = this.now();
    this.set({ elapsedMs: elapsed });
    if (elapsed > settings.call.maxCallMinutes * 60_000) return this.hangUp("rep");

    // The buyer cuts in when you talk past their patience without pausing.
    if (this.state.link === "live" && this.repStartedAt !== null && !this.cutInDone && !this.buyerActive()) {
      const talking = (elapsed - this.repStartedAt) / 1000;
      if (talking > this.o.buyer.patienceSeconds && performance.now() - this.lastRepWordAt < 2500) this.cutIn(talking);
    }
  }

  private cutIn(secondsTalking: number) {
    const interim = this.state.interim;
    const text = [...this.repFinal, interim].join(" ").trim();
    const at = this.repStartedAt ?? this.now();
    this.repFinal = [];
    this.repStartedAt = null;
    this.cutInDone = true;
    this.skipWords = interim ? interim.split(/\s+/).length : 0;
    this.addRepText(text, at, false);
    this.graceUntil = performance.now() + 3000;
    void this.requestBuyerReply({ secondsTalking });
  }

  // ------------------------------------------------------------------ the buyer's reply

  private async requestBuyerReply(cutIn?: { secondsTalking: number }) {
    this.buyerAbort?.abort();
    const abort = new AbortController();
    this.buyerAbort = abort;
    this.buyerTurnIdx = null;
    this.buyerStreamDone = false;
    this.pending = { endCall: false };
    this.queue?.resetTurn();
    const chunker = new SentenceChunker();
    let spoken = "";
    let raw = "";
    let mood = this.state.mood;
    const parser = new MarkerStreamParser({
      onMood: (m) => {
        mood = m;
        this.set({ mood: m });
      },
      onNextStep: (s) => (this.pending.nextStep = s),
      onEndCall: () => (this.pending.endCall = true),
    });

    const req: BuyerRequest = {
      buyer: this.o.buyer,
      scenario: this.o.scenario,
      product: this.o.product,
      difficulty: this.o.difficulty,
      memory: this.o.memory,
      turns: this.state.turns,
      cutIn,
    };
    this.set({ activity: "buyer-thinking", notice: undefined });

    const onText = (chunk: string) => {
      if (abort.signal.aborted) return;
      const before = raw.length;
      raw += chunk;
      const signalAt = raw.indexOf("[[");
      const usable = signalAt >= 0 ? raw.slice(before, Math.max(before, signalAt)) : chunk;
      const say = parser.push(usable);
      if (!say) return;
      spoken += say;
      const turns = [...this.state.turns];
      if (this.buyerTurnIdx === null) {
        if (!spoken.trim()) return;
        turns.push({ speaker: "buyer", text: "", at: this.now(), mood, cutIn: Boolean(cutIn) });
        this.buyerTurnIdx = turns.length - 1;
      }
      turns[this.buyerTurnIdx] = { ...turns[this.buyerTurnIdx], text: spoken.trim(), mood };
      this.set({ turns });
      if (this.queue) for (const s of chunker.push(say)) this.queue.enqueue(s);
    };

    try {
      await streamBuyer(req, onText, abort.signal);
    } catch (e) {
      if (abort.signal.aborted) return;
      this.set({ notice: `The buyer could not reply: ${(e as Error).message}` });
    }
    if (abort.signal.aborted) return;

    const tail = parser.flush();
    if (tail) onText(tail);
    if (this.queue) {
      const rest = chunker.flush();
      if (rest) this.queue.enqueue(rest);
    }
    const err = /\[\[ERROR: (.*?)\]\]/.exec(raw);
    if (err) this.set({ notice: `The buyer could not reply: ${err[1]}` });
    if (raw.includes("[[REFUSAL]]")) this.set({ notice: "The buyer model declined to continue this reply." });

    this.buyerStreamDone = true;
    if (!this.queue || !this.queue.busy) this.finishBuyerTurn();
  }

  private finishBuyerTurn() {
    if (this.state.status !== "active") return;
    const { nextStep, endCall } = this.pending;
    this.pending = { endCall: false };
    this.buyerTurnIdx = null;
    this.buyerAbort = null;
    if (nextStep) this.nextStep = nextStep;
    const last = this.state.turns[this.state.turns.length - 1];
    if (last?.speaker === "buyer") this.lastBuyerText = last.text;
    this.lastBuyerEndedAt = performance.now();
    this.set({ activity: "listening", caption: "" });
    if (endCall) this.hangUp("buyer");
  }

  // ------------------------------------------------------------------ ending

  hangUp(by: "rep" | "buyer") {
    if (this.state.status === "ended") return;
    const leftover = [...this.repFinal, this.state.interim].join(" ").trim();
    const turns = [...this.state.turns];
    if (leftover && by === "rep") turns.push({ speaker: "rep", text: leftover, at: this.repStartedAt ?? this.now() });
    if (this.buyerTurnIdx !== null && this.queue) {
      const heard = this.queue.stop();
      if (heard) turns[this.buyerTurnIdx] = { ...turns[this.buyerTurnIdx], text: heard, interrupted: true };
      else turns.splice(this.buyerTurnIdx, 1);
    }
    this.cleanup();
    const durationSec = Math.max(0, (this.now() - this.timeOffset) / 1000);
    this.set({ status: "ended", turns, activity: "idle" });
    const outcome: CallOutcome = this.nextStep ? "won" : by === "buyer" ? "buyer-ended" : "rep-ended";
    this.o.onEnded({ turns, outcome, nextStep: this.nextStep, durationSec });
  }

  /** Stops everything without producing a result (used when leaving a failed call). */
  dispose() {
    this.cleanup();
  }

  private cleanup() {
    window.clearInterval(this.timer);
    this.buyerAbort?.abort();
    this.queue?.stop();
    this.mic?.stop();
    this.stt?.close();
    this.mic = null;
    this.stt = null;
  }
}
