import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { checkAccess, json, readJson, requireKeys } from "./_lib";
import { coachSystemPrompt, coachUserPrompt, retryUserPrompt } from "../shared/prompts";
import type { CoachRequest, RetryRequest } from "../shared/types";
import { fallbackOptions, profileOf } from "./_models";

const Phase = z.object({ score: z.number().int(), reached: z.boolean(), reason: z.string() });

const CoachReportSchema = z.object({
  phases: z.object({ opener: Phase, discovery: Phase, objectionHandling: Phase, close: Phase }),
  overall: z.string(),
  moments: z.array(z.object({ quote: z.string(), whatHappened: z.string(), betterWording: z.string() })),
  weakestMoment: z.object({
    turnIndex: z.number().int(),
    quote: z.string(),
    buyerLineBefore: z.string(),
    whyItMatters: z.string(),
    rewrite: z.string(),
  }),
  ethicsFlags: z.array(z.object({ quote: z.string(), concern: z.string(), honestAlternative: z.string() })),
  alternativeMethod: z.object({ methodId: z.string(), whatItWouldTry: z.string() }),
  factualSummary: z.string(),
});

const RetrySchema = z.object({
  score: z.number().int(),
  verdict: z.string(),
  comparedToOriginal: z.string(),
  stillToFix: z.string(),
});

const clamp = (n: number) => Math.max(0, Math.min(10, Math.round(n)));

// Reviews a finished call (mode "call") or a single replayed moment (mode "retry").
export async function POST(req: Request): Promise<Response> {
  const denied = checkAccess(req) ?? requireKeys("ANTHROPIC_API_KEY");
  if (denied) return denied;

  const mode = new URL(req.url).searchParams.get("mode") ?? "call";
  const client = new Anthropic();

  try {
    if (mode === "retry") {
      const body = await readJson<RetryRequest>(req);
      const profile = profileOf(body.profile);
      const res = await client.beta.messages.parse({
        model: profile.coachModel,
        max_tokens: 16000,
        output_config: { effort: profile.coachEffort, format: betaZodOutputFormat(RetrySchema) },
        system: coachSystemPrompt(),
        // If a safety classifier declines, the API retries on a fallback model inside the same call.
        ...fallbackOptions(profile.coachModel),
        messages: [{ role: "user", content: retryUserPrompt(body) }],
      });
      if (res.stop_reason === "refusal" || !res.parsed_output) return json({ error: "The coach could not review this retry." }, 502);
      return json({ ...res.parsed_output, score: clamp(res.parsed_output.score) });
    }

    const body = await readJson<CoachRequest>(req);
    const profile = profileOf(body.profile);
    const res = await client.beta.messages.parse({
      model: profile.coachModel,
      max_tokens: 16000,
      output_config: { effort: profile.coachEffort, format: betaZodOutputFormat(CoachReportSchema) },
      system: coachSystemPrompt(),
      ...fallbackOptions(profile.coachModel),
      messages: [{ role: "user", content: coachUserPrompt(body) }],
    });
    if (res.stop_reason === "refusal" || !res.parsed_output) return json({ error: "The coach could not review this call." }, 502);
    const report = res.parsed_output;
    for (const p of Object.values(report.phases)) p.score = p.reached ? clamp(p.score) : 0;
    return json(report);
  } catch (e) {
    const msg = e instanceof Anthropic.APIError ? `Claude API ${e.status}: ${e.message}` : (e as Error).message;
    return json({ error: msg }, 502);
  }
}
