// Per-model request options. Models differ in how thinking is switched off and in
// whether the API offers a server-side fallback when a safety filter declines.
import settingsJson from "../data/settings.json";
import type { CostProfile, ProfileId, Settings } from "../shared/types";

export const settings = settingsJson as Settings;

/** Unknown profile ids fall back to the default, so a client can only pick a configured setting. */
export function profileOf(id: unknown): CostProfile {
  const key = (typeof id === "string" && id in settings.profiles ? id : settings.defaultProfile) as ProfileId;
  return settings.profiles[key];
}

const isHaiku = (model: string) => model.startsWith("claude-haiku");
const isSonnet55 = (model: string) => model === "claude-sonnet-5-5";

/** Thinking off, for the fastest buyer reply. Each model spells this differently. */
export function fastThinking(model: string) {
  if (isSonnet55(model)) return { type: "between_tools" as const };
  if (isHaiku(model)) return { type: "disabled" as const };
  return { type: "adaptive" as const }; // Opus 5.5 cannot turn thinking off; low effort keeps it short.
}

/** Server-side fallback on a refusal. Not offered for Haiku. */
export function fallbackOptions(model: string): { betas?: ["server-side-fallback-2026-07-01"]; fallbacks?: "default" } {
  return isHaiku(model) ? {} : { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" };
}
