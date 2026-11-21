import { useEffect, type ReactNode } from "react";
import type { Link } from "./call/engine";

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-head">
          <h2>{title}</h2>
          <button className="text-btn" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}

const LINK_LABEL: Record<Link, string> = {
  connecting: "Connecting voice…",
  live: "Live voice",
  "text-demo": "Text-only demo",
  lost: "Voice lost · text mode",
};

export function LinkPill({ link }: { link: Link }) {
  return (
    <span className={`pill pill-${link}`} role="status">
      <span className="dot" />
      {LINK_LABEL[link]}
    </span>
  );
}

export function ScoreBar({ score, reached }: { score: number; reached: boolean }) {
  return (
    <div className="scorebar" aria-label={reached ? `${score} out of 10` : "Not reached"}>
      <div className="scorebar-track">
        <div className={`scorebar-fill ${score >= 7 ? "good" : score >= 5 ? "mid" : "low"}`} style={{ width: `${reached ? score * 10 : 0}%` }} />
      </div>
      <span className="scorebar-num">{reached ? score : "–"}</span>
    </div>
  );
}

export function Initials({ name, speaking, size = 96 }: { name: string; speaking?: boolean; size?: number }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
  return (
    <div className={`avatar ${speaking ? "speaking" : ""}`} style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {initials}
    </div>
  );
}

export const fmtTime = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export const OUTCOME_LABEL = { won: "Next step agreed", "buyer-ended": "Buyer ended the call", "rep-ended": "You ended the call" } as const;
