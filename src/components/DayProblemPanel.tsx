import { useState } from "react";
import type { DayProblem } from "../types";

export function DayProblemPanel({ dp }: { dp: DayProblem }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const canSubmit = text.trim().length > 0;

  return (
    <div className="dayproblem">
      <p className="eyebrow">Day Problem · carry it, answer tonight</p>
      <h2>{dp.title}</h2>
      <p className="dp-sub">{dp.subtitle}</p>

      <div className="case">{dp.case}</div>

      <div className="prompt">{dp.prompt}</div>
      <p className="howto">{dp.how_to_work_it}</p>

      {!submitted ? (
        <>
          <textarea
            className="answerbox"
            placeholder="Write your structured answer tonight. Trace every chain, name the decisive variables and how you would measure them, then commit to a recommendation and its single biggest risk."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="button" className="btn" disabled={!canSubmit} onClick={() => setSubmitted(true)}>
            Submit night answer
          </button>
        </>
      ) : (
        <div className="reveal">
          <span className="verdict placeholder">Self-mark for now</span>
          <p>Claude grading is wired up in step two. For now, mark yourself against the assessment below.</p>
          <span className="mark-label">A strong answer</span>
          <p>{dp.marking_guide}</p>
          <span className="mark-label">Model answer</span>
          <div className="model">{dp.model_answer}</div>
        </div>
      )}
    </div>
  );
}
