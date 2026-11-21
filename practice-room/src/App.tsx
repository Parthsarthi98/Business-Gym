import { useCallback, useEffect, useState } from "react";
import type { CallRecord, CallSetup } from "../shared/types";
import { getStatus, type ServerStatus } from "./lib/api";
import { listCalls, loadAccessCode, saveAccessCode } from "./lib/storage";
import { Home } from "./screens/Home";
import { CallScreen } from "./screens/CallScreen";
import { Debrief } from "./screens/Debrief";
import { History } from "./screens/History";
import { Progress } from "./screens/Progress";
import { Library } from "./screens/Library";
import { SettingsScreen } from "./screens/SettingsScreen";

export interface CallPlan {
  setup: CallSetup;
  mode: "voice" | "text";
  audio: AudioContext | null;
  replayOf?: CallRecord;
}

type Tab = "home" | "history" | "progress" | "library" | "settings";
type Route = { name: Tab } | { name: "call"; plan: CallPlan } | { name: "debrief"; callId: string };

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "home", label: "Call", icon: "M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" },
  { id: "history", label: "History", icon: "M13 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-2.05-4.95L15 10h7V3l-2.64 2.64A8.96 8.96 0 0 0 13 3zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8z" },
  { id: "progress", label: "Progress", icon: "M4 19h16v2H2V3h2zm3-2V10h3v7zm5 0V6h3v11zm5 0v-4h3v4z" },
  { id: "library", label: "Library", icon: "M4 4h6a3 3 0 0 1 2 .78A3 3 0 0 1 14 4h6v15h-6a2 2 0 0 0-2 2 2 2 0 0 0-2-2H4zm2 2v11h4a4 4 0 0 1 1 .13V7a1 1 0 0 0-1-1zm12 0h-4a1 1 0 0 0-1 1v10.13A4 4 0 0 1 14 17h4z" },
  { id: "settings", label: "Settings", icon: "M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1L15 3h-4l-.4 2.9a7.4 7.4 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.5 7.5 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.4 7.4 0 0 0 1.7 1L11 21h4l.4-2.9a7.4 7.4 0 0 0 1.7-1l2.5 1 2-3.5zM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" },
];

export function App() {
  const [route, setRoute] = useState<Route>({ name: "home" });
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [calls, setCalls] = useState<CallRecord[]>([]);

  const refreshStatus = useCallback(async () => {
    try {
      setStatus(await getStatus());
      setStatusError(null);
    } catch (e) {
      setStatusError((e as Error).message);
    }
  }, []);
  const refreshCalls = useCallback(async () => setCalls(await listCalls()), []);

  useEffect(() => {
    void refreshStatus();
    void refreshCalls();
  }, [refreshStatus, refreshCalls]);

  if (statusError) {
    return (
      <Gate title="Can't reach the Practice Room server">
        <p>{statusError}</p>
        <button className="btn primary" onClick={refreshStatus}>
          Try again
        </button>
      </Gate>
    );
  }
  if (!status) return <div className="splash">Practice Room</div>;
  if (!status.accessCodeSet) {
    return (
      <Gate title="Server not set up yet">
        <p>
          The server has no <code>APP_ACCESS_CODE</code>. Set it (and your API keys) in <code>.env.local</code> for local use, or in Vercel's
          environment variables, then reload. The app will not run without it, so nobody else can spend your API credit.
        </p>
      </Gate>
    );
  }
  if (!status.accessOk) return <AccessGate wrong={Boolean(loadAccessCode())} onSaved={refreshStatus} />;

  if (route.name === "call") {
    return (
      <CallScreen
        key={`${route.plan.mode}-${route.plan.replayOf?.id ?? "new"}`}
        plan={route.plan}
        calls={calls}
        onExit={() => setRoute({ name: "home" })}
        onFinished={async (id) => {
          await refreshCalls();
          setRoute({ name: "debrief", callId: id });
        }}
        onSwitchToText={() => setRoute({ name: "call", plan: { ...route.plan, mode: "text", audio: null } })}
      />
    );
  }
  if (route.name === "debrief") {
    return (
      <Debrief
        callId={route.callId}
        onClose={() => setRoute({ name: "home" })}
        onChanged={refreshCalls}
        onStartPlan={(plan) => setRoute({ name: "call", plan })}
        status={status}
      />
    );
  }

  return (
    <div className="shell">
      <main className="screen">
        {route.name === "home" && <Home status={status} calls={calls} onStart={(plan) => setRoute({ name: "call", plan })} />}
        {route.name === "history" && <History calls={calls} onOpen={(id) => setRoute({ name: "debrief", callId: id })} />}
        {route.name === "progress" && <Progress calls={calls} />}
        {route.name === "library" && <Library />}
        {route.name === "settings" && <SettingsScreen status={status} onChanged={refreshCalls} onStatusRefresh={refreshStatus} />}
      </main>
      <nav className="tabbar">
        {TABS.map((t) => (
          <button key={t.id} className={route.name === t.id ? "active" : ""} onClick={() => setRoute({ name: t.id })}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={t.icon} />
            </svg>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function Gate({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="gate">
      <h1>{title}</h1>
      {children}
    </div>
  );
}

function AccessGate({ wrong, onSaved }: { wrong: boolean; onSaved: () => void }) {
  const [code, setCode] = useState("");
  return (
    <Gate title="Practice Room">
      <p>Enter the access code you set on the server. It is stored only on this device.</p>
      {wrong && <p className="error-text">That code did not match. Try again.</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveAccessCode(code.trim());
          onSaved();
        }}
      >
        <input className="input" type="password" autoComplete="current-password" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Access code" />
        <button className="btn primary block" disabled={!code.trim()}>
          Continue
        </button>
      </form>
    </Gate>
  );
}
