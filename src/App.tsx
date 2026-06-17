import { useMemo, useState } from "react";
import { sampleSet } from "./data/sampleSet";
import { BLOCKS, type BlockId } from "./types";
import { QuestionCard, type CardResult } from "./components/QuestionCard";
import { DayProblemPanel } from "./components/DayProblemPanel";

const BLOCK_ORDER: BlockId[] = ["A", "B", "C"];

export function App() {
  const set = sampleSet;
  const [results, setResults] = useState<Record<number, CardResult>>({});

  function onResult(r: CardResult) {
    setResults((prev) => ({ ...prev, [r.id]: r }));
  }

  const byBlock = useMemo(() => {
    return BLOCK_ORDER.map((b) => ({
      block: b,
      questions: set.questions.filter((q) => q.block === b),
    }));
  }, [set]);

  const autoQs = set.questions.filter((q) => q.format === "mcq" || q.format === "quant");
  const autoAnswered = autoQs.filter((q) => results[q.id]).length;
  const autoCorrect = autoQs.filter((q) => results[q.id]?.correct).length;
  const freeQs = set.questions.filter((q) => !(q.format === "mcq" || q.format === "quant"));
  const freeAnswered = freeQs.filter((q) => results[q.id]).length;

  return (
    <div className="container">
      <header className="app-head">
        <h1>
          Daily <em>Gym</em>
        </h1>
        <p className="subtitle">Twenty in the morning, one to carry through the day.</p>
        <div className="meta">
          <span>
            Date <b>{set.date}</b>
          </span>
          <span>
            Morning <b>~20 min</b>
          </span>
          <span>
            Day Problem <b>answer at night</b>
          </span>
          <span>
            Level <b>Tough / Advanced</b>
          </span>
        </div>
      </header>

      <p className="note">
        Do the twenty in one sitting, against the clock, in order. The load rises on purpose and the last
        six come when you are tiring, that is the point. Commit to your answer, then submit to reveal.
      </p>

      {byBlock.map(({ block, questions }) => {
        const meta = BLOCKS[block];
        return (
          <section key={block}>
            <div className={`block ${block}`}>
              <h2>
                {block} · {meta.name}
              </h2>
              <span className="blurb">{meta.blurb}</span>
              <span className="timebox">{meta.timebox}</span>
            </div>
            {questions.map((q) => (
              <QuestionCard key={q.id} q={q} onResult={onResult} />
            ))}
          </section>
        );
      })}

      <DayProblemPanel dp={set.day_problem} />

      <div className="summary">
        <h2>Where you are</h2>
        <p>
          Pace and quant: <b>{autoCorrect}</b> right of <b>{autoAnswered}</b> answered, {autoQs.length} in
          the set.
        </p>
        <p>
          Load and chains: <b>{freeAnswered}</b> of {freeQs.length} written and submitted (graded by Claude
          from step two).
        </p>
        <p>
          The multiple-choice questions are marked instantly here. The written answers and the Day Problem
          are graded by Claude through the secure server function once that is connected.
        </p>
      </div>

      <footer>
        <span>Logic Gym — Daily Gym</span>
        <span>Twenty against the clock · one through the day · log · drill the weakest</span>
      </footer>
    </div>
  );
}
