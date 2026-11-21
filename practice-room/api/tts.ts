import { checkAccess, json, readJson, requireKeys } from "./_lib";
import settingsJson from "../data/settings.json";
import type { Settings } from "../shared/types";

const settings = settingsJson as Settings;

// Proxies one sentence to ElevenLabs and streams the audio back.
export async function POST(req: Request): Promise<Response> {
  const denied = checkAccess(req) ?? requireKeys("ELEVENLABS_API_KEY");
  if (denied) return denied;
  const { text, voiceId } = await readJson<{ text: string; voiceId: string }>(req);
  if (!text || text.length > 800) return json({ error: "Text must be 1 to 800 characters." }, 400);
  if (!/^[A-Za-z0-9]{10,40}$/.test(voiceId ?? "")) return json({ error: "Invalid voice id." }, 400);

  const url =
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream` +
    `?output_format=${encodeURIComponent(settings.voice.ttsOutputFormat)}`;
  const upstream = await fetch(url, {
    method: "POST",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY!, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({ text, model_id: settings.voice.ttsModel }),
    signal: req.signal,
  });
  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text();
    return json({ error: `ElevenLabs error ${upstream.status}: ${detail.slice(0, 300)}` }, 502);
  }
  return new Response(upstream.body, { headers: { "content-type": "audio/mpeg", "cache-control": "no-store" } });
}
