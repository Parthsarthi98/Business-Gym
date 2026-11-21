import { useState } from "react";
import type { ServerStatus } from "../lib/api";
import { listCalls, deleteCall, loadAccessCode, loadCustomProduct, saveAccessCode, saveCustomProduct } from "../lib/storage";

export function SettingsScreen({ status, onChanged, onStatusRefresh }: { status: ServerStatus; onChanged: () => void; onStatusRefresh: () => void }) {
  const custom = loadCustomProduct();
  const [name, setName] = useState(custom?.name ?? "");
  const [oneLiner, setOneLiner] = useState(custom?.oneLiner ?? "");
  const [brief, setBrief] = useState(custom?.freeText ?? "");
  const [saved, setSaved] = useState(false);
  const [code, setCode] = useState(loadAccessCode());

  const keyRow = (label: string, ok: boolean) => (
    <div className="row static">
      <span className="row-label">{label}</span>
      <span className={ok ? "ok-text" : "error-text"}>{ok ? "Configured" : "Missing"}</span>
    </div>
  );

  return (
    <div>
      <h1>Settings</h1>

      <section className="card rows">
        <h2>Server keys</h2>
        {keyRow("Claude (buyer and coach)", status.anthropic)}
        {keyRow("Deepgram (speech-to-text)", status.deepgram)}
        {keyRow("Sarvam (text-to-speech)", status.sarvam)}
        <p className="muted small">Keys live only on the server. This page shows whether each is set, never its value.</p>
      </section>

      <section className="card">
        <h2>Your product</h2>
        <p className="muted small">
          Paste a real product brief to practise with it. Include pricing, proof points and limitations: the coach treats any claim not in the brief
          as invented.
        </p>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" />
        <input className="input" value={oneLiner} onChange={(e) => setOneLiner(e.target.value)} placeholder="One-line description" />
        <textarea className="input" rows={8} value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Brief: what it does, pricing, proof, limitations, competitors" />
        <div className="btn-row">
          <button
            className="btn primary"
            disabled={!name.trim() || !brief.trim()}
            onClick={() => {
              saveCustomProduct({ id: "custom", name: name.trim(), fictional: false, oneLiner: oneLiner.trim() || name.trim(), freeText: brief.trim() });
              setSaved(true);
            }}
          >
            Save product
          </button>
          {custom && (
            <button
              className="btn ghost"
              onClick={() => {
                saveCustomProduct(null);
                setName("");
                setOneLiner("");
                setBrief("");
              }}
            >
              Remove
            </button>
          )}
        </div>
        {saved && <p className="ok-text small">Saved. Pick it under Product on the Call screen.</p>}
      </section>

      <section className="card">
        <h2>Access code</h2>
        <input className="input" type="password" value={code} onChange={(e) => setCode(e.target.value)} />
        <button
          className="btn ghost"
          onClick={() => {
            saveAccessCode(code.trim());
            onStatusRefresh();
          }}
        >
          Update code
        </button>
      </section>

      <section className="card">
        <h2>Your data</h2>
        <p className="muted small">
          Calls are stored in this browser only. The only data that leaves the device is what the speech and model services need to run a call and
          review it.
        </p>
        <div className="btn-row">
          <button
            className="btn ghost"
            onClick={async () => {
              const blob = new Blob([JSON.stringify(await listCalls(), null, 2)], { type: "application/json" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = `practice-room-history-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(a.href);
            }}
          >
            Export history
          </button>
          <button
            className="btn ghost danger"
            onClick={async () => {
              if (!confirm("Delete every saved call on this device? This cannot be undone.")) return;
              for (const c of await listCalls()) await deleteCall(c.id);
              onChanged();
            }}
          >
            Delete all history
          </button>
        </div>
      </section>
    </div>
  );
}
