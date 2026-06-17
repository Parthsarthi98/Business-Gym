import { useState } from "react";
import { FORMAT_LABEL, isAutoMarked, type Question } from "../types";

const LETTERS = ["A", "B", "C", "D"] as const;

export interface CardResult {
  id: number;
  auto: boolean;
  submitted: boolean;
  correct?: boolean; // only for auto-marked
}

interface Props {
  q: Question;
  onResult: (r: CardResult) => void;
}

export function QuestionCard({ q, onResult }: Props) {
  const auto = isAutoMarked(q);
  const [choice, setChoice] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const moves = q.reasoning_move.split(/\s+/).filter(Boolean);
  const canSubmit = auto ? choice !== null : text.trim().length > 0;
  const correct = auto && choice === q.correct_option;

  function submit() {
    if (!canSubmit || submitted) return;
    setSubmitted(true);
    onResult({ id: q.id, auto, submitted: true, correct: auto ? correct : undefined });
  }

  return (
    <div className={`q ${q.block}`}>
      <div className="q-head">
        <span className="q-num">{q.id}</span>
        <span className="q-tags">
          <span className={`tag fmt ${q.block}`}>{FORMAT_LABEL[q.format]}</span>
          {moves.map((m) => (
            <span className="tag move" key={m}>
              {m}
            </span>
          ))}
          <span className={`tag diff-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
        </span>
      </div>

      <div className="q-body">{q.stem}</div>
      {q.data && <div className="data">{q.data}</div>}

      {auto ? (
        <ul className="opts">
          {(q.options ?? []).map((opt, i) => {
            const letter = LETTERS[i];
            const classes = ["opt"];
            if (!submitted && choice === letter) classes.push("selected");
            if (submitted && letter === q.correct_option) classes.push("is-correct");
            if (submitted && choice === letter && letter !== q.correct_option) classes.push("is-wrong");
            return (
              <li key={letter} style={{ listStyle: "none" }}>
                <button
                  type="button"
                  className={classes.join(" ")}
                  disabled={submitted}
                  onClick={() => setChoice(letter)}
                >
                  <span className="opt-key">{letter}</span>
                  <span>{opt}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <textarea
          className="answerbox"
          placeholder="Write your answer here. Name the verdict, every flaw by its move, a specific measurable test that survives the obvious confound, and the likely real outcome."
          value={text}
          disabled={submitted}
          onChange={(e) => setText(e.target.value)}
        />
      )}

      {!submitted && (
        <button type="button" className="btn" disabled={!canSubmit} onClick={submit}>
          Submit answer
        </button>
      )}

      {submitted && <Reveal q={q} auto={auto} correct={correct} />}
    </div>
  );
}

function Reveal({ q, auto, correct }: { q: Question; auto: boolean; correct: boolean }) {
  if (auto) {
    return (
      <div className="reveal">
        <span className={`verdict ${correct ? "correct" : "incorrect"}`}>
          {correct ? "Correct" : "Not quite"}
        </span>
        <span className="mark-label">Correct answer: {q.correct_option}</span>
        {q.model_answer && <p className="feedback">{q.model_answer}</p>}
      </div>
    );
  }

  // Free-text: in step one, grading by Claude is not wired up yet, so we reveal
  // the marking guide and model answer to mark yourself against.
  return (
    <div className="reveal">
      <span className="verdict placeholder">Self-mark for now</span>
      <p>Claude grading is wired up in step two. For now, mark yourself against the guide below.</p>

      {q.marking_guide && (
        <>
          <span className="mark-label">A complete answer contains</span>
          <p>{q.marking_guide}</p>
        </>
      )}
      {q.common_shortfall && (
        <>
          <span className="mark-label">Common shortfall</span>
          <p>{q.common_shortfall}</p>
        </>
      )}
      {q.model_answer && (
        <>
          <span className="mark-label">Model answer</span>
          <div className="model">{q.model_answer}</div>
        </>
      )}
    </div>
  );
}
