// Browser-side calls to the app's own server functions. API keys never reach the browser.
import type { BuyerRequest, CoachReport, CoachRequest, RetryReport, RetryRequest } from "../../shared/types";
import { loadAccessCode } from "./storage";

export interface ServerStatus {
  anthropic: boolean;
  deepgram: boolean;
  elevenlabs: boolean;
  accessCodeSet: boolean;
  accessOk: boolean;
}

const headers = () => ({ "content-type": "application/json", "x-access-code": loadAccessCode() });

async function errorText(res: Response): Promise<string> {
  try {
    const j = (await res.json()) as { error?: string };
    return j.error ?? `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

export async function getStatus(): Promise<ServerStatus> {
  const res = await fetch("/api/status", { headers: headers() });
  if (!res.ok) throw new Error(`Server unreachable (${res.status}).`);
  return res.json();
}

export async function getSttToken(): Promise<string> {
  const res = await fetch("/api/stt-token", { method: "POST", headers: headers() });
  if (!res.ok) throw new Error(await errorText(res));
  return ((await res.json()) as { token: string }).token;
}

export async function fetchSpeech(text: string, voiceId: string, signal: AbortSignal): Promise<ArrayBuffer> {
  const res = await fetch("/api/tts", { method: "POST", headers: headers(), body: JSON.stringify({ text, voiceId }), signal });
  if (!res.ok) throw new Error(await errorText(res));
  return res.arrayBuffer();
}

/** Streams the buyer's reply. Calls onText for each chunk; resolves when the stream ends. */
export async function streamBuyer(req: BuyerRequest, onText: (t: string) => void, signal: AbortSignal): Promise<void> {
  const res = await fetch("/api/buyer", { method: "POST", headers: headers(), body: JSON.stringify(req), signal });
  if (!res.ok || !res.body) throw new Error(await errorText(res));
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    onText(decoder.decode(value, { stream: true }));
  }
}

export async function requestCoach(req: CoachRequest): Promise<CoachReport> {
  const res = await fetch("/api/coach?mode=call", { method: "POST", headers: headers(), body: JSON.stringify(req) });
  if (!res.ok) throw new Error(await errorText(res));
  return res.json();
}

export async function requestRetryReview(req: RetryRequest): Promise<RetryReport> {
  const res = await fetch("/api/coach?mode=retry", { method: "POST", headers: headers(), body: JSON.stringify(req) });
  if (!res.ok) throw new Error(await errorText(res));
  return res.json();
}
