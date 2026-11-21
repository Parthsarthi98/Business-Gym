import { useMemo } from "react";
import type { CallRecord } from "../../shared/types";
import { buyers, getBuyer, getMethod, getScenario, settings } from "../lib/library";
import { buyerLevel, buyerRecord, methodAverages, PHASES, phaseSeries, recommendDrill, scoredCalls } from "../lib/progress";

/** Last ten scores as small bars on a fixed 0-10 scale; hover or tap a bar for its value. */
function Spark({ values, label }: { values: number[]; label: string }) {
  const last = values.slice(-10);
  const w = 120;
  const h = 32;
  const gap = 2;
  const bw = last.length ? (w - gap * (last.length - 1)) / 10 : 0;
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${label}: last scores ${last.join(", ") || "none"}`}>
      <line x1="0" y1={h - 0.5} x2={w} y2={h - 0.5} className="spark-axis" />
      {last.map((v, i) => {
        const bh = Math.max(2, (v / 10) * (h - 2));
        return (
          <rect key={i} x={i * (bw + gap)} y={h - bh} width={bw} height={bh} rx="2" className="spark-bar">
            <title>{`Score ${v}/10`}</title>
          </rect>
        );
      })}
    </svg>
  );
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

export function Progress({ calls }: { calls: CallRecord[] }) {
  const series = useMemo(() => phaseSeries(calls), [calls]);
  const rec = useMemo(() => recommendDrill(calls), [calls]);
  const methodsAvg = useMemo(() => methodAverages(calls), [calls]);
  const total = scoredCalls(calls).length;

  return (
    <div>
      <h1>Progress</h1>
      <section className="card">
        <div className="eyebrow">Next recommended drill</div>
        <div className="title">
          {getBuyer(rec.setup.buyerId).name} · {getScenario(rec.setup.scenarioId).name} · {getMethod(rec.setup.methodId).shortName}
        </div>
        <p className="muted small">{rec.reason}</p>
      </section>

      <section className="card">
        <h2>Skills</h2>
        <p className="muted small">
          Average of your last five scored calls, out of 10. Bars show up to the last ten. {total} scored call{total === 1 ? "" : "s"} so far.
        </p>
        {PHASES.map((p) => {
          const recent = avg(series[p.id].slice(-5));
          return (
            <div key={p.id} className="skill-row">
              <div className="grow">
                <div>{p.label}</div>
                <div className="big-num">{recent === null ? "–" : recent.toFixed(1)}</div>
              </div>
              <Spark values={series[p.id]} label={p.label} />
            </div>
          );
        })}
      </section>

      <section className="card">
        <h2>Methods</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Calls</th>
              <th>Average</th>
            </tr>
          </thead>
          <tbody>
            {methodsAvg.map(({ method, calls: n, average }) => (
              <tr key={method.id}>
                <td>{method.name}</td>
                <td>{n}</td>
                <td>{average === null ? "–" : average.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>Buyer ladder</h2>
        <p className="muted small">
          A buyer's level rises when your last {settings.difficulty.windowCalls} calls with them average {settings.difficulty.raiseWhenAverageAtLeast} or more,
          and drops below {settings.difficulty.lowerWhenAverageBelow}.
        </p>
        <table className="table">
          <thead>
            <tr>
              <th>Buyer</th>
              <th>Won</th>
              <th>Lost</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            {buyers.map((b) => {
              const r = buyerRecord(calls, b.id);
              return (
                <tr key={b.id}>
                  <td>
                    {b.ladderRank}. {b.name}
                  </td>
                  <td>{r.wins}</td>
                  <td>{r.losses}</td>
                  <td>{buyerLevel(calls, b.id)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
