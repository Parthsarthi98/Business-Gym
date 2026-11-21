import { json, missingKeys } from "./_lib";

// Reports which keys are configured (never their values) and whether the access code is right.
export async function GET(req: Request): Promise<Response> {
  const expected = process.env.APP_ACCESS_CODE;
  return json({
    anthropic: missingKeys("ANTHROPIC_API_KEY").length === 0,
    deepgram: missingKeys("DEEPGRAM_API_KEY").length === 0,
    sarvam: missingKeys("SARVAM_API_KEY").length === 0,
    accessCodeSet: Boolean(expected),
    accessOk: Boolean(expected) && req.headers.get("x-access-code") === expected,
  });
}
