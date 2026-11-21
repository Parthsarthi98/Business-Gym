// Helpers shared by the server functions. Files starting with "_" are not deployed as endpoints.

export const MAX_BODY_BYTES = 400_000;

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export function missingKeys(...names: string[]): string[] {
  return names.filter((n) => !process.env[n]);
}

/**
 * Every endpoint that spends API credit requires the access code.
 * If APP_ACCESS_CODE is not set, the server refuses to run rather than staying open.
 */
export function checkAccess(req: Request): Response | null {
  const expected = process.env.APP_ACCESS_CODE;
  if (!expected) return json({ error: "APP_ACCESS_CODE is not set on the server. Set it before using the app." }, 503);
  if (req.headers.get("x-access-code") !== expected) return json({ error: "Wrong or missing access code." }, 401);
  return null;
}

export async function readJson<T>(req: Request): Promise<T> {
  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) throw new Error("Request too large.");
  return JSON.parse(text) as T;
}

export function requireKeys(...names: string[]): Response | null {
  const missing = missingKeys(...names);
  return missing.length ? json({ error: `Missing on the server: ${missing.join(", ")}.`, missing }, 503) : null;
}
