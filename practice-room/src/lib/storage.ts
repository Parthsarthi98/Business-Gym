// Local-first persistence. Calls live in IndexedDB on this device; small preferences in localStorage.
import { createStore, del, entries, get, set } from "idb-keyval";
import type { CallRecord, CallSetup, Product, ProfileId } from "../../shared/types";

const callStore = createStore("practice-room", "calls");

export async function saveCall(c: CallRecord): Promise<void> {
  await set(c.id, c, callStore);
}
export async function getCall(id: string): Promise<CallRecord | undefined> {
  return get<CallRecord>(id, callStore);
}
export async function listCalls(): Promise<CallRecord[]> {
  const all = await entries<string, CallRecord>(callStore);
  return all.map(([, v]) => v).sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}
export async function deleteCall(id: string): Promise<void> {
  await del(id, callStore);
}

function readLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function writeLocal(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode); the app still works for this session */
  }
}

export const loadAccessCode = () => readLocal<string>("pr.accessCode") ?? "";
export const saveAccessCode = (code: string) => writeLocal("pr.accessCode", code);
export const loadLastSetup = () => readLocal<CallSetup>("pr.lastSetup");
export const saveLastSetup = (s: CallSetup) => writeLocal("pr.lastSetup", s);
export const loadCustomProduct = () => readLocal<Product>("pr.customProduct");
export const saveCustomProduct = (p: Product | null) => writeLocal("pr.customProduct", p);
/** Practice mode: an API cost setting, or free practice in the Claude app. */
export type Mode = ProfileId | "claude-app";
export const loadMode = (): Mode => {
  const m = readLocal<Mode>("pr.mode");
  return m === "standard" || m === "saver" || m === "claude-app" ? m : "standard";
};
export const saveMode = (m: Mode) => {
  writeLocal("pr.mode", m);
  if (m !== "claude-app") writeLocal("pr.profile", m);
};
/** The API cost setting to use for app calls (the last one chosen). */
export const loadProfile = (): ProfileId => (readLocal<ProfileId>("pr.profile") === "saver" ? "saver" : "standard");
export interface ClaudeAppDraft {
  setup: CallSetup;
  startedAt: string;
  transcript: string;
  coachReply: string;
}
export const loadClaudeAppDraft = () => readLocal<ClaudeAppDraft>("pr.claudeAppDraft");
export const saveClaudeAppDraft = (d: ClaudeAppDraft | null) => writeLocal("pr.claudeAppDraft", d);
export const loadCaptions = () => readLocal<boolean>("pr.captions") ?? false;
export const saveCaptions = (on: boolean) => writeLocal("pr.captions", on);
