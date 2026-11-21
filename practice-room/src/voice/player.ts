// Plays the buyer's reply sentence by sentence. Each sentence's audio is fetched as soon as
// the sentence is complete (in parallel) and played strictly in order. stop() cuts playback
// instantly, which is how you interrupt the buyer.

type Fetcher = (text: string, signal: AbortSignal) => Promise<ArrayBuffer>;

interface Item {
  text: string;
  audio: Promise<AudioBuffer>;
}

export interface QueueEvents {
  onSentenceStart?: (text: string) => void;
  onIdle?: () => void;
  onError?: (message: string) => void;
}

export class SpeechQueue {
  private items: Item[] = [];
  private playing = false;
  private current: { source: AudioBufferSourceNode; text: string; startedAt: number; duration: number } | null = null;
  private abort = new AbortController();
  private spokenSentences: string[] = [];

  constructor(
    private ctx: AudioContext,
    private fetcher: Fetcher,
    private events: QueueEvents = {},
  ) {}

  get busy() {
    return this.playing || this.items.length > 0;
  }

  /** Text of the sentence currently playing, for echo filtering and captions. */
  get currentText() {
    return this.current?.text ?? "";
  }

  enqueue(text: string) {
    const signal = this.abort.signal;
    const audio = this.fetcher(text, signal).then((bytes) => this.ctx.decodeAudioData(bytes));
    audio.catch(() => undefined); // handled when played
    this.items.push({ text, audio });
    if (!this.playing) void this.playNext();
  }

  private async playNext(): Promise<void> {
    const item = this.items.shift();
    if (!item) {
      this.playing = false;
      this.events.onIdle?.();
      return;
    }
    this.playing = true;
    const signal = this.abort.signal;
    let buffer: AudioBuffer;
    try {
      buffer = await item.audio;
    } catch (e) {
      if (signal.aborted) return;
      this.events.onError?.((e as Error).message);
      return this.playNext();
    }
    if (signal.aborted) return;
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.ctx.destination);
    this.current = { source, text: item.text, startedAt: this.ctx.currentTime, duration: buffer.duration };
    this.events.onSentenceStart?.(item.text);
    source.onended = () => {
      if (signal.aborted || this.current?.source !== source) return;
      this.spokenSentences.push(item.text);
      this.current = null;
      void this.playNext();
    };
    source.start();
  }

  /**
   * Stops everything. Returns the text the listener actually heard: finished sentences plus
   * the share of the current sentence that had played, estimated by elapsed time.
   */
  stop(): string {
    this.abort.abort();
    this.abort = new AbortController();
    let partial = "";
    if (this.current) {
      const { source, text, startedAt, duration } = this.current;
      const frac = duration > 0 ? Math.min(1, (this.ctx.currentTime - startedAt) / duration) : 0;
      const words = text.split(/\s+/);
      partial = words.slice(0, Math.floor(words.length * frac)).join(" ");
      try {
        source.onended = null;
        source.stop();
      } catch {
        /* already stopped */
      }
      this.current = null;
    }
    this.items = [];
    this.playing = false;
    const heard = [...this.spokenSentences, partial].filter(Boolean).join(" ");
    this.spokenSentences = [];
    return heard;
  }

  /** Clears the record of spoken sentences at the start of a new buyer turn. */
  resetTurn() {
    this.spokenSentences = [];
  }
}
