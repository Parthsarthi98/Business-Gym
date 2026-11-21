// The phone's built-in speech recognition (Web Speech API). Free, used by the Saver setting.
// Quality and support vary by browser: Chrome on Android works best; iPhone Safari is less reliable.
import type { SttEvents } from "./stt";

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
};

const Ctor = (): (new () => Recognition) | undefined =>
  (window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition }).SpeechRecognition ??
  (window as unknown as { webkitSpeechRecognition?: new () => Recognition }).webkitSpeechRecognition;

export const browserSttSupported = () => typeof window !== "undefined" && Boolean(Ctor());

export class BrowserStt {
  private closing = false;
  private restarts: number[] = [];

  private constructor(private rec: Recognition, private events: SttEvents) {}

  static open(lang: string, events: SttEvents): Promise<BrowserStt> {
    const C = Ctor();
    if (!C) return Promise.reject(new Error("This browser has no built-in speech recognition. Use Chrome or Safari, or switch to the Standard setting."));
    const rec = new C();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;
    const stt = new BrowserStt(rec, events);
    return new Promise((resolve, reject) => {
      let started = false;
      const timer = setTimeout(() => {
        if (started) return;
        stt.close();
        reject(new Error("Speech recognition did not start within 8 seconds. Check the microphone permission, or switch to Standard."));
      }, 8000);
      rec.onstart = () => {
        if (!started) {
          started = true;
          clearTimeout(timer);
          resolve(stt);
        }
      };
      rec.onerror = (e) => {
        if (!started) {
          clearTimeout(timer);
          return reject(new Error(`Speech recognition could not start (${e.error}).`));
        }
        if (e.error === "not-allowed" || e.error === "service-not-allowed" || e.error === "audio-capture") {
          stt.closing = true;
          events.onClose(true, `speech recognition stopped: ${e.error}`);
        }
        // "no-speech" and "aborted" are normal pauses; onend restarts recognition.
      };
      rec.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          const text = r[0].transcript.trim();
          if (r.isFinal) {
            if (text) events.onFinal(text, true);
          } else interim += `${text} `;
        }
        if (interim.trim()) events.onInterim(interim.trim());
      };
      // Browsers stop recognition after a silence; restart it for as long as the call runs.
      rec.onend = () => {
        if (stt.closing) return;
        const now = Date.now();
        stt.restarts = [...stt.restarts.filter((t) => now - t < 10_000), now];
        if (stt.restarts.length > 6) {
          stt.closing = true;
          return events.onClose(true, "speech recognition keeps stopping");
        }
        try {
          rec.start();
        } catch {
          /* already restarting */
        }
      };
      try {
        rec.start();
      } catch (err) {
        reject(err as Error);
      }
    });
  }

  send() {
    /* the browser captures the microphone itself */
  }

  close() {
    this.closing = true;
    try {
      this.rec.abort();
    } catch {
      /* already stopped */
    }
  }
}
