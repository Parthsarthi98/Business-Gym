// Splits streamed text into sentences so speech can start before the whole reply is written.

const ABBREVIATIONS = /\b(Mr|Mrs|Ms|Dr|St|vs|etc|e\.g|i\.e|approx|Inc|Ltd|Co)\.$/i;

export class SentenceChunker {
  private buf = "";

  push(text: string): string[] {
    this.buf += text;
    const out: string[] = [];
    for (;;) {
      const cut = this.findBreak();
      if (cut < 0) break;
      const sentence = this.buf.slice(0, cut).trim();
      this.buf = this.buf.slice(cut);
      if (sentence) out.push(sentence);
    }
    return out;
  }

  flush(): string {
    const rest = this.buf.trim();
    this.buf = "";
    return rest;
  }

  private findBreak(): number {
    const re = /[.!?]+["')\]]?\s/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(this.buf))) {
      const end = m.index + m[0].length;
      const candidate = this.buf.slice(0, m.index + 1);
      if (candidate.trim().length < 8 || ABBREVIATIONS.test(candidate)) continue;
      return end;
    }
    // Very long clause with no full stop yet: break at a comma or dash so speech can start.
    if (this.buf.length > 180) {
      const idx = Math.max(this.buf.lastIndexOf(", ", 180), this.buf.lastIndexOf(" — ", 180));
      if (idx > 40) return idx + 2;
    }
    return -1;
  }
}
