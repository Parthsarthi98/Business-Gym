import { useMemo, useState } from "react";
import type { CallRecord, CallSetup } from "../../shared/types";
import type { CallPlan } from "../App";
import type { ServerStatus } from "../lib/api";
import { buyers, getBuyer, getMethod, getProduct, getScenario, methods, products, scenarios, settings } from "../lib/library";
import { buyerLevel, buyerRecord, recommendDrill } from "../lib/progress";
import { loadLastSetup, saveLastSetup } from "../lib/storage";
import { unlockAudio } from "../call/engine";
import { Initials, Sheet } from "../components";

type Picker = "buyer" | "scenario" | "method" | "product" | null;

export function Home({ status, calls, onStart }: { status: ServerStatus; calls: CallRecord[]; onStart: (p: CallPlan) => void }) {
  const rec = useMemo(() => recommendDrill(calls), [calls]);
  const last = loadLastSetup();
  const [setup, setSetup] = useState<CallSetup>(last ?? { ...rec.setup, productId: products()[0].id });
  const [picker, setPicker] = useState<Picker>(null);
  const [briefOpen, setBriefOpen] = useState(false);

  const buyer = getBuyer(setup.buyerId);
  const scenario = getScenario(setup.scenarioId);
  const method = getMethod(setup.methodId);
  const product = getProduct(setup.productId);
  const level = buyerLevel(calls, buyer.id);
  const levelInfo = settings.difficulty.levels[level - 1];
  const record = buyerRecord(calls, buyer.id);
  const isDefaultMethod = scenario.defaultMethods.includes(method.id);
  const isLast = last && JSON.stringify(last) === JSON.stringify(setup);

  const missingVoice = [!status.deepgram && "DEEPGRAM_API_KEY", !status.elevenlabs && "ELEVENLABS_API_KEY"].filter(Boolean) as string[];
  const voiceReady = status.anthropic && missingVoice.length === 0;
  const secure = window.isSecureContext;

  const update = (patch: Partial<CallSetup>) => setSetup((s) => ({ ...s, ...patch }));
  const start = (mode: "voice" | "text") => {
    saveLastSetup(setup);
    onStart({ setup, mode, audio: mode === "voice" ? unlockAudio() : null });
  };

  return (
    <div className="home">
      <header className="home-head">
        <h1>Practice Room</h1>
        <span className={`pill ${voiceReady ? "pill-live" : "pill-text-demo"}`}>
          <span className="dot" />
          {voiceReady ? "Voice ready" : "Voice unavailable"}
        </span>
      </header>

      {!isLast && (
        <button
          className="card rec-card"
          onClick={() => setSetup({ ...rec.setup, productId: setup.productId })}
          aria-label="Use the recommended drill"
        >
          <div className="eyebrow">Recommended next drill</div>
          <div className="rec-title">
            {getBuyer(rec.setup.buyerId).name} · {getScenario(rec.setup.scenarioId).name} · {getMethod(rec.setup.methodId).shortName}
          </div>
          <p className="muted small">{rec.reason}</p>
          <span className="link">Use this drill</span>
        </button>
      )}

      <section className="card buyer-card" onClick={() => setPicker("buyer")}>
        <Initials name={buyer.name} size={56} />
        <div className="grow">
          <div className="eyebrow">Buyer · rung {buyer.ladderRank} of {buyers.length}</div>
          <div className="title">{buyer.name}</div>
          <div className="muted small">
            {buyer.role}, {buyer.company}
          </div>
          <div className="chips">
            <span className={`chip diff-${buyer.difficulty}`}>{buyer.difficulty}</span>
            <span className="chip">Level {level}: {levelInfo.name}</span>
            <span className="chip">
              {record.wins}W · {record.losses}L
            </span>
          </div>
        </div>
        <span className="chev">›</span>
      </section>

      <div className="rows card">
        <Row label="Scenario" value={scenario.name} onClick={() => setPicker("scenario")} />
        <Row label="Method" value={method.name} tag={isDefaultMethod ? "default" : "override"} onClick={() => setPicker("method")} />
        <Row label="Product" value={product.name + (product.fictional ? " (fictional)" : "")} onClick={() => setPicker("product")} />
      </div>

      <button className="text-btn brief-toggle" onClick={() => setBriefOpen((o) => !o)}>
        {briefOpen ? "Hide your brief" : "Show your brief"}
      </button>
      {briefOpen && (
        <div className="card brief">
          <p>{scenario.repBrief}</p>
          <p className="muted small">Win condition: {scenario.winCondition}</p>
          <p className="muted small">
            {method.name} fits: {method.fits.join(", ")}. Strains: {method.strains.join(", ")}.
          </p>
        </div>
      )}

      <div className="start-area">
        {!status.anthropic && (
          <div className="alert error">
            Can't start: <code>ANTHROPIC_API_KEY</code> is missing on the server. The buyer and coach need it.
          </div>
        )}
        {status.anthropic && !voiceReady && (
          <div className="alert warn">
            Live voice is unavailable: {missingVoice.map((k) => <code key={k}>{k}</code>)} missing on the server. A voice call will not start.
            You can run a text-only demo instead; it is clearly labelled and uses typing, not speech.
          </div>
        )}
        {voiceReady && !secure && (
          <div className="alert warn">This page is not on HTTPS, so the browser will block the microphone. Open the HTTPS address to use voice.</div>
        )}
        {voiceReady && (
          <button className="btn primary call-btn" onClick={() => start("voice")}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
            </svg>
            {isLast ? "Quick start: call again" : "Start call"}
          </button>
        )}
        {status.anthropic && (
          <button className={`btn ${voiceReady ? "ghost" : "secondary call-btn"}`} onClick={() => start("text")}>
            Start text-only demo
          </button>
        )}
      </div>

      {picker === "buyer" && (
        <Sheet title="Choose a buyer" onClose={() => setPicker(null)}>
          {buyers.map((b) => (
            <button key={b.id} className={`option ${b.id === setup.buyerId ? "selected" : ""}`} onClick={() => (update({ buyerId: b.id }), setPicker(null))}>
              <Initials name={b.name} size={40} />
              <div className="grow">
                <div className="title">
                  {b.ladderRank}. {b.name} <span className={`chip diff-${b.difficulty}`}>{b.difficulty}</span>
                </div>
                <div className="muted small">
                  {b.role}, {b.company}. Level {buyerLevel(calls, b.id)}.
                </div>
              </div>
            </button>
          ))}
        </Sheet>
      )}
      {picker === "scenario" && (
        <Sheet title="Choose a scenario" onClose={() => setPicker(null)}>
          {scenarios.map((s) => (
            <button
              key={s.id}
              className={`option ${s.id === setup.scenarioId ? "selected" : ""}`}
              onClick={() => (update({ scenarioId: s.id, methodId: s.defaultMethods[0] }), setPicker(null))}
            >
              <div className="grow">
                <div className="title">{s.name}</div>
                <div className="muted small">{s.summary}</div>
                <div className="muted small">Default: {s.defaultMethods.map((id) => getMethod(id).shortName).join(" or ")}</div>
              </div>
            </button>
          ))}
        </Sheet>
      )}
      {picker === "method" && (
        <Sheet title="Choose a method" onClose={() => setPicker(null)}>
          <p className="muted small">No method is best everywhere. Override the default to run the same scenario two ways and compare.</p>
          {methods.map((m) => (
            <button key={m.id} className={`option ${m.id === setup.methodId ? "selected" : ""}`} onClick={() => (update({ methodId: m.id }), setPicker(null))}>
              <div className="grow">
                <div className="title">
                  {m.name} {scenario.defaultMethods.includes(m.id) && <span className="chip">default here</span>}
                </div>
                <div className="muted small">Fits: {m.fits.slice(0, 3).join(", ")}</div>
                <div className="muted small">Strains: {m.strains[0]}</div>
              </div>
            </button>
          ))}
        </Sheet>
      )}
      {picker === "product" && (
        <Sheet title="Choose a product" onClose={() => setPicker(null)}>
          {products().map((p) => (
            <button key={p.id} className={`option ${p.id === setup.productId ? "selected" : ""}`} onClick={() => (update({ productId: p.id }), setPicker(null))}>
              <div className="grow">
                <div className="title">
                  {p.name} {p.fictional && <span className="chip">fictional</span>}
                </div>
                <div className="muted small">{p.oneLiner}</div>
              </div>
            </button>
          ))}
          <p className="muted small">Add your own product brief in Settings.</p>
        </Sheet>
      )}
    </div>
  );
}

function Row({ label, value, tag, onClick }: { label: string; value: string; tag?: string; onClick: () => void }) {
  return (
    <button className="row" onClick={onClick}>
      <span className="row-label">{label}</span>
      <span className="row-value">
        {value} {tag && <span className={`chip ${tag === "override" ? "chip-accent" : ""}`}>{tag}</span>}
      </span>
      <span className="chev">›</span>
    </button>
  );
}
