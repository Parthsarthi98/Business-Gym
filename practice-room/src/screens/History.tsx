import type { CallRecord } from "../../shared/types";
import { getBuyer, getMethod, getScenario } from "../lib/library";
import { callAverage } from "../lib/progress";
import { fmtTime, OUTCOME_LABEL } from "../components";

export function History({ calls, onOpen }: { calls: CallRecord[]; onOpen: (id: string) => void }) {
  return (
    <div>
      <h1>History</h1>
      <p className="muted small">Stored only on this device.</p>
      {calls.length === 0 && <div className="card muted">No calls yet. Your transcripts, scores and rewrites will appear here.</div>}
      <div className="list">
        {calls.map((c) => {
          const avg = callAverage(c);
          return (
            <button key={c.id} className="card list-item" onClick={() => onOpen(c.id)}>
              <div className="grow">
                <div className="title">
                  {getBuyer(c.setup.buyerId).name} · {getScenario(c.setup.scenarioId).name}
                  {c.replayOf && <span className="chip">replay</span>}
                  {c.mode === "text" && <span className="chip">text</span>}
                </div>
                <div className="muted small">
                  {new Date(c.startedAt).toLocaleDateString()} · {getMethod(c.setup.methodId).shortName} · {fmtTime(c.durationSec * 1000)}
                </div>
                <div className={`small outcome-text outcome-${c.outcome}`}>{OUTCOME_LABEL[c.outcome]}</div>
              </div>
              <div className="score-badge">
                {c.retryReport ? c.retryReport.score : avg !== null ? avg.toFixed(1) : "–"}
                <span>/10</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
