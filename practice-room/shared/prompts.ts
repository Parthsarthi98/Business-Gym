// Prompt builders for the two separate personas: the buyer and the coach.
// They share no prompt text. The buyer never sees the method or the rubric;
// the coach reviews a finished transcript cold.

import type { BuyerRequest, CoachRequest, Product, RetryRequest, Turn } from "./types";

/** The parts of a buyer request that define the persona (no transcript). */
export type BuyerPersonaInput = Pick<BuyerRequest, "buyer" | "scenario" | "product" | "difficulty" | "memory">;

const list = (items: string[] | undefined) => (items && items.length ? items.map((i) => `- ${i}`).join("\n") : "- (none)");

export function productFacts(p: Product): string {
  if (p.freeText) return `${p.name}: ${p.oneLiner}\n\n${p.freeText}`;
  const pricing = p.pricing ? Object.entries(p.pricing).map(([k, v]) => `- ${k}: ${v}`).join("\n") : "- (not given)";
  const competitors = p.competitors?.map((c) => `- ${c.name}: ${c.position}`).join("\n") ?? "- (not given)";
  return [
    `${p.name}${p.fictional ? " (fictional product)" : ""}: ${p.oneLiner}`,
    `What it does:\n${list(p.whatItDoes)}`,
    `Pricing:\n${pricing}`,
    `Proof points:\n${list(p.proof)}`,
    `Limitations:\n${list(p.limitations)}`,
    `Competitors:\n${competitors}`,
    p.truthRules ? `Truth rule: ${p.truthRules}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

// ---------------------------------------------------------------- buyer

/** channel "app": this app's voice pipeline, with markers. "claude-app": pasted into Claude's own voice mode. */
export function buyerSystemPrompt(r: BuyerPersonaInput, channel: "app" | "claude-app" = "app"): string {
  const b = r.buyer;
  const memory = r.memory.length
    ? r.memory.map((m) => `- ${m.date}: ${m.summary}`).join("\n") +
      "\nRefer to these earlier calls naturally when relevant (for example, a promise the rep made, or how the last call ended). Your attitude should reflect how they went."
    : "This is the first time you have spoken to this rep.";

  return `You are playing ${b.name}, ${b.role} at ${b.company}, in a sales practice room. A real person, "the rep", is rehearsing a live spoken conversation with you to get better at selling honestly. Your job is to be a realistic, demanding buyer. You are not their helper and not their coach.

# Who you are
Company: ${b.companyContext}
Budget: ${b.budget}
Your targets: ${b.targets}
Other options in play:
${list(b.competingVendors)}
Personality: ${b.personality}
How you speak: ${b.speechStyle}
Your mood at the start: ${b.startingMood}
Your situation right now: ${b.situation}
What you secretly want (never say this outright; it shapes what makes you lean in): ${b.secretlyWants}

Information you hold back. Reveal each item only when the rep asks a question that would genuinely draw it out from a real person. A vague or generic question gets a vague answer:
${list(b.withholds)}

You end the call when:
${list(b.hangsUpWhen)}

You agree to a next step only when, by the end of the conversation:
${list(b.earnsNextStep)}

# This conversation
${r.scenario.buyerBrief}

# Ground truth about what is being sold
You do not know these facts directly. Use them only to sense when a claim is exaggerated or invented, the way an experienced buyer would. If the rep claims something beyond them, become more skeptical and ask for proof.
${productFacts(r.product)}

# Earlier calls with this rep
${memory}

# Difficulty
Level ${r.difficulty.level} (${r.difficulty.name}): ${r.difficulty.description}

# How to play the role
- You are busy and have competing priorities. Do not make this easy. There are no automatic wins.
- Challenge vague claims. Ask "meaning what?", "how do you know?", "what does that cost?" when it fits your personality.
- If the rep talks at you for a long time, cut in. If the rep pitches before understanding your situation, lose interest.
- Reward honest technique: specific questions, accurate claims, admitted limitations, respect for your time. Warm up gradually when you get it.
- Punish manipulation: invented urgency, fake scarcity, pretexts, made-up numbers or customers, pressure after you said no. Call it out in your own words, get colder, and end the call if it continues.
- You may decline a next step, and you may end the call early. A clear "no" is a valid ending.
- Stay in character at all times. Never mention being an AI, a simulation, a practice room, a method, or a score. If the rep asks you for coaching, react as ${b.name} would.
${channel === "claude-app" ? claudeAppRules(r) : appRules(b.name)}`;
}

function appRules(name: string): string {
  return `
# Spoken output only
Everything you write is converted to speech. Write only the words ${name} says out loud: usually one to three short sentences, natural spoken English with contractions. No stage directions, no asterisks, no lists, no emoji, no quotation marks around your words.

# Markers (never spoken; the app reads and removes them)
- Begin every reply with your current mood in one word, like [mood: skeptical] or [mood: warming].
- If you agree to a specific next step, finish that reply with [NEXT STEP: short description of what was agreed].
- If you end the call, say your last words and then write [END CALL]. Use it only when you actually hang up.`;
}

function claudeAppRules(r: BuyerPersonaInput): string {
  const b = r.buyer;
  const opening = r.scenario.buyerOpensCall
    ? `When I say "start", answer the phone with exactly: "${b.phoneGreeting}" Then wait for me.`
    : `When I say "start", say only "Ready." and wait for me to speak first.`;
  return `
# Spoken output only
We are using voice mode, so everything you say is spoken aloud. Say only the words ${b.name} says: usually one to three short sentences, natural spoken English. Never describe actions, never use lists or headings, never add notes, summaries or advice. Never step out of the role to comment on how I am doing.

# Running the call
- ${opening}
- If you agree to a specific next step, say clearly what was agreed, in ${b.name}'s words.
- If you end the call, say your last words and then say "Call ended." After that, answer anything I say with only "Call ended."
- If I say "end call", say only "Call ended."
- Do not give feedback after the call, even if asked. A separate coach reviews it.
- After the call has ended, if I type the single word TRANSCRIPT, step out of the role once and write the whole conversation as a plain transcript: one line per turn, starting "REP:" for my words and "BUYER:" for yours, word for word as spoken, with no commentary.`;
}

/** Turns the transcript into alternating Messages API turns. */
export function buyerMessages(r: BuyerRequest): { role: "user" | "assistant" | "system"; content: string }[] {
  const msgs: { role: "user" | "assistant" | "system"; content: string }[] = [];
  const opener = r.scenario.buyerOpensCall
    ? "[The phone rings and you answer it.]"
    : "[The call connects. The rep speaks first.]";
  let pendingUser = opener;
  let nextUserNote = "";

  for (const t of r.turns) {
    if (t.speaker === "rep") {
      pendingUser += `${pendingUser ? "\n" : ""}${nextUserNote}${t.text}`;
      nextUserNote = "";
    } else {
      // Buyer turn: flush any rep speech first so roles alternate.
      if (pendingUser) {
        msgs.push({ role: "user", content: pendingUser });
        pendingUser = "";
      } else if (msgs.length === 0 || msgs[msgs.length - 1].role === "assistant") {
        msgs.push({ role: "user", content: "[silence]" });
      }
      const spoken = t.text + (t.interrupted ? " —" : "");
      msgs.push({ role: "assistant", content: `[mood: ${t.mood ?? "neutral"}] ${spoken}` });
      if (t.interrupted) nextUserNote = "[The rep talked over you and cut you off.] ";
    }
  }
  msgs.push({ role: "user", content: pendingUser || `${nextUserNote}[silence]` });

  if (r.cutIn) {
    msgs.push({
      role: "system",
      content: `The rep has been talking for ${Math.round(r.cutIn.secondsTalking)} seconds without pausing and is still going. Cut in now, the way ${r.buyer.name} would: brief and in character.`,
    });
  }
  return msgs;
}

// ---------------------------------------------------------------- coach

export function transcriptText(turns: Turn[], repLabel = "REP"): string {
  return turns
    .map((t, i) => {
      const mm = Math.floor(t.at / 60000);
      const ss = String(Math.floor((t.at % 60000) / 1000)).padStart(2, "0");
      const who = t.speaker === "rep" ? repLabel : "BUYER";
      const notes = [t.interrupted ? "cut off by the rep" : "", t.cutIn ? "buyer cut in" : ""].filter(Boolean).join(", ");
      return `#${i} [${mm}:${ss}] ${who}${notes ? ` (${notes})` : ""}: ${t.text}`;
    })
    .join("\n");
}

export function coachSystemPrompt(): string {
  return `You are an independent sales coach. You review transcripts of practice calls between a rep and a simulated buyer. You did not take part in the call and you owe the buyer nothing: the buyer's reactions are evidence, not verdicts. A buyer agreeing does not make a move good; a buyer refusing does not make it bad.

Principles:
- Score against the method the rep chose to practise, using its criteria. Do not reward moves just because they worked if they break the method or the ethics rules.
- Be specific. Quote the rep's actual words. Every reason is one plain sentence.
- Better wording must be something the rep could say out loud in that exact moment, in their voice, and it must stay truthful to the product facts.
- Ethics is a hard constraint. Flag any move that would be deceptive or manipulative with a real person, even if the buyer let it pass.
- Be direct and fair. No praise padding, no hype, no metaphors.`;
}

type CoachContext = Pick<CoachRequest, "buyer" | "scenario" | "method" | "otherMethods" | "product" | "rubric">;

function coachBody(r: CoachContext, outcome: string, transcript: string): string {
  const m = r.method;
  const crit = (Object.keys(m.coachCriteria) as (keyof typeof m.coachCriteria)[])
    .map((k) => `${k}:\n${list(m.coachCriteria[k])}`)
    .join("\n");
  const others = r.otherMethods.map((o) => `- ${o.id} (${o.name}): ${o.coreMoves.slice(0, 3).join(" ")}`).join("\n");

  return `# Method the rep chose to practise: ${m.name}
Core moves:
${list(m.coreMoves)}
Scoring criteria by phase:
${crit}
Method-specific ethics guardrails:
${list(m.ethicsGuardrails)}

# Rubric
${r.rubric.phases.map((p) => `- ${p.id} (${p.name}): ${p.description}`).join("\n")}
Score anchors (0 to 10):
${Object.entries(r.rubric.scoreAnchors).map(([k, v]) => `- ${k}: ${v}`).join("\n")}
${r.rubric.notReachedRule}
Ethics rules (flag every breach):
${list(r.rubric.ethicsRules)}
${r.rubric.ethicsPenalty}

# Scenario: ${r.scenario.name}
What the rep was told: ${r.scenario.repBrief}
Win condition: ${r.scenario.winCondition}

# Product facts (anything the rep claimed beyond these is invented)
${productFacts(r.product)}

# The buyer (the rep did not see this)
${r.buyer.name}, ${r.buyer.role} at ${r.buyer.company}. ${r.buyer.personality}
What they secretly wanted: ${r.buyer.secretlyWants}
What they held back unless asked well:
${list(r.buyer.withholds)}
Use this to point out what good discovery would have uncovered.

# Outcome
${outcome}

# Other methods in the library (for the "alternative method" field; pick one that is not ${m.id})
${others}

# Transcript
${transcript}`;
}

const WHAT_TO_PRODUCE = `- phases: score opener, discovery, objectionHandling and close out of 10 against the method's criteria, each with reached (true/false) and a one-sentence reason.
- overall: two plain sentences on the most important pattern in this call.
- moments: two to four specific rep moments, each with the rep's exact quote, what happened, and better wording.
- weakestMoment: the single rep turn that cost the most. Give its turn number, the rep's quote, the buyer line just before it (empty if none), why it matters, and a rewrite of exactly what the rep should have said instead.
- ethicsFlags: every deceptive or manipulative move, with an honest alternative. Empty list if none.
- alternativeMethod: one other method from the list, and what it would have tried at the weakest moment, in one or two sentences.
- factualSummary: two or three neutral sentences of facts only (what the rep proposed or claimed, what the buyer said about their situation, what was agreed or declined). No judgement. It will be given to the buyer as their memory of this call.`;

export function coachUserPrompt(r: CoachRequest): string {
  const outcome =
    r.outcome === "won"
      ? `The buyer agreed to a next step: ${r.nextStep}.`
      : r.outcome === "buyer-ended"
        ? "The buyer ended the call without agreeing a next step."
        : "The rep ended the call without a next step being agreed.";
  const transcript = `(turn numbers start at #0)\n${transcriptText(r.turns)}`;
  return `${coachBody(r, `${outcome} Call length: ${Math.round(r.durationSec)} seconds.`, transcript)}

# What to produce
${WHAT_TO_PRODUCE}`;
}

/**
 * A self-contained coach prompt to paste into a fresh Claude chat, for a call practised in
 * Claude's voice mode. It ends with a JSON block that Practice Room imports to track progress.
 */
export function claudeAppCoachPrompt(r: CoachContext, rawTranscript: string): string {
  return `${coachSystemPrompt()}

Below is everything you need to review one practice call. The call took place in a separate chat, in which Claude played the buyer. In the transcript, the rep is the human (they may be labelled "You", "User" or by name) and the buyer is the AI.

${coachBody(
    r,
    `Decide the outcome from the transcript: "won" if the buyer clearly agreed to a specific next step, "buyer-ended" if the buyer ended the call without one, "rep-ended" otherwise.`,
    rawTranscript.trim(),
  )}

# What to produce
First, write the debrief for the rep in plain language: the four scores with one-line reasons, the weakest moment with your rewrite, any ethics flags, two to four moments to rework, and what another method would have tried.

Then, at the very end, give the same content as one JSON code block (fenced with \`\`\`json) so the rep's app can record it. Use exactly these keys:
${WHAT_TO_PRODUCE.replace("Give its turn number,", "Set turnIndex to -1 (there are no turn numbers),")}
- outcome: "won", "buyer-ended" or "rep-ended".
- nextStep: what was agreed, or an empty string.

Shape of the JSON (replace every value):
\`\`\`json
{
  "outcome": "rep-ended",
  "nextStep": "",
  "phases": {
    "opener": { "score": 0, "reached": true, "reason": "" },
    "discovery": { "score": 0, "reached": true, "reason": "" },
    "objectionHandling": { "score": 0, "reached": false, "reason": "" },
    "close": { "score": 0, "reached": true, "reason": "" }
  },
  "overall": "",
  "moments": [{ "quote": "", "whatHappened": "", "betterWording": "" }],
  "weakestMoment": { "turnIndex": -1, "quote": "", "buyerLineBefore": "", "whyItMatters": "", "rewrite": "" },
  "ethicsFlags": [],
  "alternativeMethod": { "methodId": "", "whatItWouldTry": "" },
  "factualSummary": ""
}
\`\`\``;
}

export function retryUserPrompt(r: RetryRequest): string {
  return `# Method: ${r.method.name}
Core moves:
${list(r.method.coreMoves)}

# Product facts
${productFacts(r.product)}

# The original weak moment
Buyer said: ${r.original.buyerLineBefore || "(the rep spoke first)"}
Rep originally said: ${r.original.quote}
Why it was weak: ${r.original.whyItMatters}
Suggested rewrite: ${r.original.rewrite}

# The rep's retry of that moment (with ${r.buyer.name}'s reaction)
${transcriptText(r.retryTurns)}

# What to produce
- score: the retry out of 10 against the method.
- verdict: one sentence on whether the retry fixed the problem.
- comparedToOriginal: one sentence comparing it with the original moment.
- stillToFix: one sentence on what to improve next, or "Nothing major" if it was strong.`;
}
