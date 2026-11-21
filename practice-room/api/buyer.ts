import Anthropic from "@anthropic-ai/sdk";
import { checkAccess, json, readJson, requireKeys } from "./_lib";
import { buyerMessages, buyerSystemPrompt } from "../shared/prompts";
import type { BuyerRequest } from "../shared/types";
import { fallbackOptions, fastThinking, profileOf } from "./_models";

// Streams the buyer's next reply as plain text. The browser splits it into sentences for speech.
// In-band signals at the end of the stream: "[[REFUSAL]]" or "[[ERROR: ...]]".
export async function POST(req: Request): Promise<Response> {
  const denied = checkAccess(req) ?? requireKeys("ANTHROPIC_API_KEY");
  if (denied) return denied;

  let body: BuyerRequest;
  try {
    body = await readJson<BuyerRequest>(req);
  } catch (e) {
    return json({ error: (e as Error).message }, 400);
  }

  const profile = profileOf(body.profile);
  const model = profile.buyerModel;
  const client = new Anthropic();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const s = client.beta.messages.stream(
          {
            model,
            max_tokens: 2000,
            // Thinking off for the lowest delay before the buyer starts speaking.
            thinking: fastThinking(model),
            output_config: { effort: profile.buyerEffort },
            // The persona prompt is identical for every turn of a call, so cache it.
            system: [{ type: "text", text: buyerSystemPrompt(body), cache_control: { type: "ephemeral" } }],
            messages: buyerMessages(body),
            ...fallbackOptions(model),
          },
          { signal: req.signal },
        );
        for await (const event of s) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await s.finalMessage();
        if (final.stop_reason === "refusal") controller.enqueue(encoder.encode("[[REFUSAL]]"));
      } catch (e) {
        if (!req.signal.aborted) {
          const msg = e instanceof Anthropic.APIError ? `Claude API ${e.status}: ${e.message}` : (e as Error).message;
          controller.enqueue(encoder.encode(`[[ERROR: ${msg.replace(/\]\]/g, "")}]]`));
        }
      } finally {
        try {
          controller.close();
        } catch {
          /* already closed by an abort */
        }
      }
    },
  });

  return new Response(stream, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-accel-buffering": "no" },
  });
}
