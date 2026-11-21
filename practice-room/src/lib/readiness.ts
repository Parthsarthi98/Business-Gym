import type { ProfileId } from "../../shared/types";
import type { ServerStatus } from "./api";
import { settings } from "./library";
import { browserSttSupported } from "../voice/browserStt";

/** Whether a live voice call can start with this cost setting, and what is missing if not. */
export function voiceReadiness(status: ServerStatus, profileId: ProfileId) {
  const browserStt = settings.profiles[profileId].stt === "browser";
  const missingKeys = [!browserStt && !status.deepgram && "DEEPGRAM_API_KEY", !status.sarvam && "SARVAM_API_KEY"].filter(Boolean) as string[];
  const sttMissing = browserStt && !browserSttSupported();
  return { ready: status.anthropic && missingKeys.length === 0 && !sttMissing, missingKeys, sttMissing };
}
