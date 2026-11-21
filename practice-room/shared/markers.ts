// The buyer model writes a few bracketed markers that are never spoken aloud:
//   [mood: skeptical]            at the start of every reply
//   [NEXT STEP: demo on Tuesday] when the buyer agrees to a next step
//   [END CALL]                   when the buyer hangs up
// This parser strips them from streamed text and reports them as events.

export interface MarkerEvents {
  onMood?: (mood: string) => void;
  onNextStep?: (what: string) => void;
  onEndCall?: () => void;
}

export class MarkerStreamParser {
  private pending = "";
  private inMarker = false;

  constructor(private events: MarkerEvents) {}

  /** Feed a chunk of model text; returns the speakable text found so far. */
  push(chunk: string): string {
    let out = "";
    for (const ch of chunk) {
      if (this.inMarker) {
        this.pending += ch;
        if (ch === "]") {
          this.handleMarker(this.pending.slice(1, -1));
          this.pending = "";
          this.inMarker = false;
        } else if (this.pending.length > 300) {
          // Not a real marker; release it as text.
          out += this.pending;
          this.pending = "";
          this.inMarker = false;
        }
      } else if (ch === "[") {
        this.inMarker = true;
        this.pending = "[";
      } else {
        out += ch;
      }
    }
    return out;
  }

  /** Call at end of stream. Returns any unterminated text. */
  flush(): string {
    const rest = this.inMarker ? "" : this.pending;
    this.pending = "";
    this.inMarker = false;
    return rest;
  }

  private handleMarker(body: string) {
    const text = body.trim();
    const mood = /^mood\s*:\s*(.+)$/i.exec(text);
    if (mood) return this.events.onMood?.(mood[1].trim().toLowerCase());
    const next = /^next\s*step\s*:\s*(.+)$/i.exec(text);
    if (next) return this.events.onNextStep?.(next[1].trim());
    if (/^end\s*call$/i.test(text)) return this.events.onEndCall?.();
    // Unknown bracketed text (e.g. a stage direction) is dropped, never spoken.
  }
}

/** Removes all markers from a finished string (used for transcripts). */
export function stripMarkers(text: string): string {
  return text.replace(/\[[^\]]{0,300}\]/g, "").replace(/\s{2,}/g, " ").trim();
}
