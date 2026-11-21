// Captures the microphone as 16-bit PCM in ~100 ms chunks using an AudioWorklet.
// Raw PCM works the same on iPhone Safari and Android Chrome, unlike MediaRecorder formats.

const WORKLET = `
class PcmCapture extends AudioWorkletProcessor {
  constructor() { super(); this.size = Math.round(sampleRate / 10); this.buf = new Int16Array(this.size); this.n = 0; }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (!ch) return true;
    for (let i = 0; i < ch.length; i++) {
      const s = Math.max(-1, Math.min(1, ch[i]));
      this.buf[this.n++] = s < 0 ? s * 0x8000 : s * 0x7fff;
      if (this.n === this.buf.length) {
        // Transferring the buffer empties this.buf, so the next one is sized from this.size.
        this.port.postMessage(this.buf.buffer, [this.buf.buffer]);
        this.buf = new Int16Array(this.size); this.n = 0;
      }
    }
    return true;
  }
}
registerProcessor("pcm-capture", PcmCapture);
`;

export class Mic {
  private constructor(
    private stream: MediaStream,
    private source: MediaStreamAudioSourceNode,
    private node: AudioWorkletNode,
  ) {}

  static async start(ctx: AudioContext, onChunk: (pcm: ArrayBuffer) => void): Promise<Mic> {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error("This browser cannot use the microphone (it needs HTTPS).");
    const stream = await navigator.mediaDevices.getUserMedia({
      // Echo cancellation stops the buyer's voice from the speaker being heard as you.
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 },
    });
    const url = URL.createObjectURL(new Blob([WORKLET], { type: "application/javascript" }));
    try {
      await ctx.audioWorklet.addModule(url);
    } finally {
      URL.revokeObjectURL(url);
    }
    const source = ctx.createMediaStreamSource(stream);
    const node = new AudioWorkletNode(ctx, "pcm-capture");
    node.port.onmessage = (e) => onChunk(e.data as ArrayBuffer);
    source.connect(node);
    // The worklet must be connected to run on some browsers; it outputs silence.
    node.connect(ctx.destination);
    return new Mic(stream, source, node);
  }

  stop() {
    this.node.port.onmessage = null;
    this.source.disconnect();
    this.node.disconnect();
    this.stream.getTracks().forEach((t) => t.stop());
  }
}
