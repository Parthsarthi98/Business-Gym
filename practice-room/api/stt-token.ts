import { checkAccess, json, requireKeys } from "./_lib";

// Mints a short-lived Deepgram token so the browser can open the streaming socket
// without ever seeing the real API key. The token only needs to be valid for the handshake.
export async function POST(req: Request): Promise<Response> {
  const denied = checkAccess(req) ?? requireKeys("DEEPGRAM_API_KEY");
  if (denied) return denied;
  const res = await fetch("https://api.deepgram.com/v1/auth/grant", {
    method: "POST",
    headers: { Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ ttl_seconds: 60 }),
  });
  if (!res.ok) {
    const detail = await res.text();
    return json({ error: `Deepgram refused the token request (${res.status}). ${detail.slice(0, 300)}` }, 502);
  }
  const data = (await res.json()) as { access_token: string; expires_in?: number };
  return json({ token: data.access_token, expiresIn: data.expires_in ?? 60 });
}
