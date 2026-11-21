// Streaming speech-to-text over a Deepgram WebSocket, authenticated with a short-lived token.
import type { Settings } from "../../shared/types";

export interface SttEvents {
  /** Partial words while you are still speaking. */
  onInterim: (text: string) => void;
  /** A finalised segment. speechFinal = Deepgram detected the end of an utterance. */
  onFinal: (text: string, speechFinal: boolean) => void;
  /** Silence long enough to treat your turn as finished. */
  onUtteranceEnd: () => void;
  onClose: (unexpected: boolean, reason: string) => void;
}

export class DeepgramStream {
  private ws: WebSocket;
  private closing = false;

  private constructor(ws: WebSocket, events: SttEvents) {
    this.ws = ws;
    ws.onmessage = (e) => {
      let msg: any;
      try {
        msg = JSON.parse(e.data as string);
      } catch {
        return;
      }
      if (msg.type === "Results") {
        const text: string = msg.channel?.alternatives?.[0]?.transcript ?? "";
        if (msg.is_final) {
          if (text) events.onFinal(text, Boolean(msg.speech_final));
          else if (msg.speech_final) events.onFinal("", true);
        } else if (text) events.onInterim(text);
      } else if (msg.type === "UtteranceEnd") {
        events.onUtteranceEnd();
      }
    };
    ws.onclose = (e) => events.onClose(!this.closing, e.reason || `code ${e.code}`);
    ws.onerror = () => {
      /* onclose follows with details */
    };
  }

  static open(token: string, sampleRate: number, s: Settings["voice"], events: SttEvents): Promise<DeepgramStream> {
    const params = new URLSearchParams({
      model: s.sttModel,
      language: s.sttLanguage,
      encoding: "linear16",
      sample_rate: String(sampleRate),
      channels: "1",
      interim_results: "true",
      endpointing: String(s.endpointingMs),
      utterance_end_ms: String(s.utteranceEndMs),
      smart_format: "true",
    });
    const ws = new WebSocket(`wss://api.deepgram.com/v1/listen?${params}`, ["bearer", token]);
    ws.binaryType = "arraybuffer";
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Speech-to-text connection timed out.")), 8000);
      ws.onopen = () => {
        clearTimeout(timer);
        resolve(new DeepgramStream(ws, events));
      };
      ws.onclose = (e) => {
        clearTimeout(timer);
        reject(new Error(`Speech-to-text connection refused (${e.reason || `code ${e.code}`}).`));
      };
    });
  }

  get open() {
    return this.ws.readyState === WebSocket.OPEN;
  }

  send(pcm: ArrayBuffer) {
    if (this.ws.readyState === WebSocket.OPEN) this.ws.send(pcm);
  }

  close() {
    this.closing = true;
    if (this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ type: "CloseStream" }));
      } catch {
        /* ignore */
      }
    }
    this.ws.close();
  }
}
