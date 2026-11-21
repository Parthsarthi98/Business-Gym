import { useState } from "react";
import { buyers, methods, scenarios, getMethod } from "../lib/library";

export function Library() {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (id: string) => setOpen((o) => (o === id ? null : id));
  return (
    <div>
      <h1>Library</h1>
      <p className="muted small">
        Methods, buyers and scenarios are editable data files in the <code>data/</code> folder of the app. No method is best everywhere: each one
        says where it fits and where it strains.
      </p>

      <h2>Methods</h2>
      {methods.map((m) => (
        <div key={m.id} className="card expander">
          <button className="expander-head" onClick={() => toggle(m.id)} aria-expanded={open === m.id}>
            <span className="title">{m.name}</span>
            <span className="chev">{open === m.id ? "–" : "+"}</span>
          </button>
          {open === m.id && (
            <div className="expander-body small">
              <p>{m.origin}</p>
              <p>
                <b>Evidence:</b> {m.evidenceType}
              </p>
              <p>
                <b>Fits:</b> {m.fits.join("; ")}
              </p>
              <p>
                <b>Strains:</b> {m.strains.join("; ")}
              </p>
              <b>Core moves</b>
              <ul>
                {m.coreMoves.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <b>Ethics guardrails</b>
              <ul>
                {m.ethicsGuardrails.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}

      <h2>Scenarios</h2>
      {scenarios.map((s) => (
        <div key={s.id} className="card">
          <div className="title">{s.name}</div>
          <p className="small muted">{s.summary}</p>
          <p className="small">Default method: {s.defaultMethods.map((id) => getMethod(id).name).join(" or ")}</p>
        </div>
      ))}

      <h2>Buyers</h2>
      {buyers.map((b) => (
        <div key={b.id} className="card">
          <div className="title">
            {b.ladderRank}. {b.name} <span className={`chip diff-${b.difficulty}`}>{b.difficulty}</span>
          </div>
          <p className="small muted">
            {b.role}, {b.company}. {b.personality}
          </p>
          <p className="small">Voice: {b.voice.label}</p>
        </div>
      ))}
    </div>
  );
}
