import { checkAccess, json, readJson, requireKeys } from "./_lib";
import settingsJson from "../data/settings.json";
import type { Settings } from "../shared/types";

const settings = settingsJson as Settings;

function sarvam(text: string, speaker: string | undefined, signal: AbortSignal) {
  return fetch("https://api.sarvam.ai/text-to-speech/stream", {
    method: "POST",
    headers: { "api-subscription-key": process.env.SARVAM_API_KEY!, "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      ...(speaker ? { speaker } : {}),
      model: settings.voice.ttsModel,
      language_code: settings.voice.ttsLanguage,
      pace: settings.voice.ttsPace,
      output_audio_codec: "mp3",
      output_audio_bitrate: settings.voice.ttsBitrate,
      // Reads numbers and English terms naturally (e.g. "43,200" as a whole number).
      enable_preprocessing: true,
    }),
    signal,
  });
}

// Sends one sentence to Sarvam (Bulbul) and streams the MP3 audio back.
export async function POST(req: Request): Promise<Response> {
  const denied = checkAccess(req) ?? requireKeys("SARVAM_API_KEY");
  if (denied) return denied;
  const { text, voiceId } = await readJson<{ text: string; voiceId: string }>(req);
  if (!text || text.length > 800) return json({ error: "Text must be 1 to 800 characters." }, 400);
  if (!/^[a-z0-9_]{2,60}$/.test(voiceId ?? "")) return json({ error: "Invalid voice id (Sarvam voice ids are lowercase)." }, 400);

  let upstream = await sarvam(text, voiceId, req.signal);
  let fellBack = false;
  if (upstream.status === 400 || upstream.status === 422) {
    // Most likely the voice id is not valid for this model. Retry once with Sarvam's default
    // voice and tell the app, which shows a notice instead of changing the voice silently.
    const first = await upstream.text();
    if (/speaker/i.test(first)) {
      upstream = await sarvam(text, undefined, req.signal);
      fellBack = true;
    } else {
      return json({ error: `Sarvam error ${upstream.status}: ${first.slice(0, 300)}` }, 502);
    }
  }
  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text();
    return json({ error: `Sarvam error ${upstream.status}: ${detail.slice(0, 300)}` }, 502);
  }
  const headers: Record<string, string> = { "content-type": "audio/mpeg", "cache-control": "no-store" };
  if (fellBack) headers["x-voice-fallback"] = voiceId;
  return new Response(upstream.body, { headers });
}
