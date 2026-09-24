import { useCallback, useEffect, useRef, useState } from "react";
import {
  ADVANCE_PCT,
  FALLBACK_PCT,
  FALLBACK_STRIKES,
  GRID_CELLS,
  LETTERS,
  MAX_N,
  MIN_N,
  Runner,
  SCORED_TRIALS,
  initAudio,
  nextLevel,
  previewSound,
  setVolume,
  type Frame,
  type Modality,
  type SessionResult,
  type SoundMode,
} from "./engine";
import "./nback.css";

const STORE_KEY = "nback.v1";

interface Saved {
  n: number;
  best: number;
  strikes: number;
  intervalMs: number;
  soundMode: SoundMode;
  volume: number;
  feedback: boolean;
  history: SessionResult[];
}

const DEFAULTS: Saved = {
  n: 2,
  best: 2,
  strikes: 0,
  intervalMs: 3000,
  soundMode: "tones",
  volume: 0.9,
  feedback: true,
  history: [],
};

function load(): Saved {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function save(s: Saved) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(s));
  } catch {
    /* storage unavailable: progress lasts for this visit only */
  }
}

type Flash = "hit" | "wrong" | "missed" | null;
type Phase = "idle" | "running" | "done";

const clampN = (v: number) => Math.max(MIN_N, Math.min(MAX_N, Math.round(v) || MIN_N));

export function NBack() {
  const [s, setS] = useState<Saved>(load);
  const [phase, setPhase] = useState<Phase>("idle");
  const [frame, setFrame] = useState<Frame>({ trial: -1, visible: false });
  const [flash, setFlash] = useState<Record<Modality, Flash>>({ pos: null, sound: null });
  const [pressed, setPressed] = useState<Record<Modality, boolean>>({ pos: false, sound: false });
  const [result, setResult] = useState<{ r: SessionResult; from: number; to: number } | null>(null);
  const runner = useRef<Runner | null>(null);
  const flashTimers = useRef<Record<Modality, number>>({ pos: 0, sound: 0 });
  const sRef = useRef(s);
  sRef.current = s;

  const update = useCallback((patch: Partial<Saved>) => {
    setS((prev) => {
      const next = { ...prev, ...patch };
      save(next);
      return next;
    });
  }, []);

  const showFlash = useCallback((m: Modality, f: Flash) => {
    clearTimeout(flashTimers.current[m]);
    setFlash((p) => ({ ...p, [m]: f }));
    flashTimers.current[m] = window.setTimeout(() => setFlash((p) => ({ ...p, [m]: null })), 380);
  }, []);

  const stop = useCallback(() => {
    runner.current?.halt();
    runner.current = null;
    setPhase("idle");
    setFrame({ trial: -1, visible: false });
    setPressed({ pos: false, sound: false });
  }, []);

  const start = useCallback(async () => {
    const cur = sRef.current;
    await initAudio(cur.volume);
    runner.current?.halt();
    setResult(null);
    setPressed({ pos: false, sound: false });
    let prevTrial = -1;
    const r = new Runner({
      n: cur.n,
      intervalMs: cur.intervalMs,
      soundMode: cur.soundMode,
      volume: cur.volume,
      onFrame: (f) => {
        if (f.trial !== prevTrial) {
          // Previous trial just closed: point out targets that were not pressed.
          const done = prevTrial;
          if (sRef.current.feedback && done >= cur.n && runner.current) {
            const t = runner.current.trials[done];
            const resp = runner.current.responses[done];
            if (t.posMatch && !resp.pos) showFlash("pos", "missed");
            if (t.soundMatch && !resp.sound) showFlash("sound", "missed");
          }
          prevTrial = f.trial;
          setPressed({ pos: false, sound: false });
        }
        setFrame(f);
      },
      onDone: (res) => {
        runner.current = null;
        const prev = sRef.current;
        const lvl = nextLevel(prev.n, prev.strikes, res.pct);
        update({
          n: lvl.n,
          strikes: lvl.strikes,
          best: Math.max(prev.best, lvl.n),
          history: [res, ...prev.history].slice(0, 50),
        });
        setResult({ r: res, from: prev.n, to: lvl.n });
        setFrame({ trial: -1, visible: false });
        setPhase("done");
      },
    });
    runner.current = r;
    setPhase("running");
    r.start();
  }, [showFlash, update]);

  const respond = useCallback(
    (m: Modality, timeStamp: number) => {
      const r = runner.current;
      if (!r) return;
      const res = r.respond(m, timeStamp);
      if (!res) return;
      setPressed((p) => ({ ...p, [m]: true }));
      if (sRef.current.feedback) showFlash(m, res.correct ? "hit" : "wrong");
    },
    [showFlash]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "SELECT") return;
      const k = e.key.toLowerCase();
      if (runner.current) {
        if (k === "a") respond("pos", e.timeStamp);
        else if (k === "l") respond("sound", e.timeStamp);
        else if (k === "escape") stop();
        else return;
        e.preventDefault();
      } else if (k === " " || k === "enter") {
        e.preventDefault();
        start();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [respond, start, stop]);

  // Background tabs throttle timers and pause drawing, which would break sync.
  useEffect(() => {
    const onHide = () => document.hidden && runner.current && stop();
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      runner.current?.halt();
    };
  }, [stop]);

  const running = phase === "running";
  const total = s.n + SCORED_TRIALS;
  const activeCell = running && frame.visible && runner.current ? GRID_CELLS[runner.current.trials[frame.trial].pos] : -1;
  const canAnswer = running && frame.trial >= s.n;

  return (
    <div className="nb">
      <nav className="nb-nav">
        <a href="#/">← Daily Gym</a>
        <span>Dual N-Back</span>
      </nav>

      <header className="nb-head">
        <div className="nb-level">
          <button
            className="nb-step"
            aria-label="Lower level"
            disabled={running || s.n <= MIN_N}
            onClick={() => update({ n: clampN(s.n - 1), strikes: 0 })}
          >
            −
          </button>
          <label className="nb-n">
            <span>N</span>
            <input
              type="number"
              min={MIN_N}
              max={MAX_N}
              value={s.n}
              disabled={running}
              onChange={(e) => update({ n: clampN(Number(e.target.value)), strikes: 0 })}
            />
          </label>
          <button
            className="nb-step"
            aria-label="Raise level"
            disabled={running || s.n >= MAX_N}
            onClick={() => update({ n: clampN(s.n + 1), strikes: 0 })}
          >
            +
          </button>
        </div>
        <div className="nb-stats">
          <span>
            Best <b>{s.best}</b>
          </span>
          <span>
            Strikes <b>{s.strikes}/{FALLBACK_STRIKES}</b>
          </span>
          <span>
            Trial <b>{running && frame.trial >= 0 ? `${frame.trial + 1}/${total}` : `–/${total}`}</b>
          </span>
        </div>
      </header>

      <div className="nb-grid" aria-hidden>
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className={`nb-cell${i === 4 ? " nb-centre" : ""}${i === activeCell ? " on" : ""}`} />
        ))}
      </div>

      <div className="nb-answers">
        {(["pos", "sound"] as Modality[]).map((m) => (
          <button
            key={m}
            className={`nb-answer ${flash[m] ?? ""}${pressed[m] ? " pressed" : ""}`}
            disabled={!canAnswer}
            onPointerDown={(e) => {
              e.preventDefault();
              respond(m, e.timeStamp);
            }}
          >
            <kbd>{m === "pos" ? "A" : "L"}</kbd>
            {m === "pos" ? "Position" : "Sound"}
          </button>
        ))}
      </div>

      <div className="nb-controls">
        {running ? (
          <button className="nb-primary" onClick={stop}>
            Stop <kbd>Esc</kbd>
          </button>
        ) : (
          <button className="nb-primary" onClick={start}>
            Start N={s.n} <kbd>Space</kbd>
          </button>
        )}
      </div>

      {result && phase === "done" && <Results {...result} />}

      <section className="nb-settings" aria-disabled={running}>
        <div className="nb-row">
          <span className="nb-label">Sound</span>
          <div className="nb-seg">
            {(["tones", "letters"] as SoundMode[]).map((m) => (
              <button
                key={m}
                className={s.soundMode === m ? "on" : ""}
                disabled={running}
                onClick={() => update({ soundMode: m })}
              >
                {m === "tones" ? "Tones" : "Letters"}
              </button>
            ))}
          </div>
          <button
            className="nb-link"
            disabled={running}
            onClick={async () => {
              await initAudio(s.volume);
              previewSound(s.soundMode, Math.floor(Math.random() * 8), s.volume);
            }}
          >
            Test sound
          </button>
        </div>
        {s.soundMode === "letters" && (
          <p className="nb-hint">
            Letters ({LETTERS.join(" ")}) use your device's speech voice, which can start up to a few hundred
            milliseconds late. Tones are scheduled on the audio clock and stay exactly in sync with the square.
          </p>
        )}
        <div className="nb-row">
          <span className="nb-label">Pace</span>
          <div className="nb-seg">
            {[2000, 2500, 3000, 3500].map((ms) => (
              <button
                key={ms}
                className={s.intervalMs === ms ? "on" : ""}
                disabled={running}
                onClick={() => update({ intervalMs: ms })}
              >
                {(ms / 1000).toFixed(1)}s
              </button>
            ))}
          </div>
        </div>
        <div className="nb-row">
          <span className="nb-label">Volume</span>
          <input
            type="range"
            min={0.2}
            max={1.5}
            step={0.05}
            value={s.volume}
            onChange={(e) => {
              const v = Number(e.target.value);
              update({ volume: v });
              setVolume(v);
            }}
          />
        </div>
        <div className="nb-row">
          <span className="nb-label">Feedback</span>
          <div className="nb-seg">
            {[true, false].map((v) => (
              <button key={String(v)} className={s.feedback === v ? "on" : ""} onClick={() => update({ feedback: v })}>
                {v ? "On" : "Off"}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="nb-help">
        <p>
          Each trial shows a square and plays a sound at the same moment. Press <kbd>A</kbd> when the square is
          in the same place as {s.n} {s.n === 1 ? "trial" : "trials"} ago, and <kbd>L</kbd> when the sound is
          the same as {s.n} back. Press both if both match. You can answer any time until the next trial starts.
        </p>
        <p>
          A session is {SCORED_TRIALS}+N trials, with 6 position and 6 sound matches in the {SCORED_TRIALS} scored
          ones. Score is hits ÷ (hits + misses + false alarms). {ADVANCE_PCT}% or more moves you up a level; under{" "}
          {FALLBACK_PCT}% {FALLBACK_STRIKES} times in a row moves you down. Levels run from {MIN_N} to {MAX_N}.
        </p>
      </section>

      {s.history.length > 0 && (
        <section className="nb-history">
          <div className="nb-row">
            <span className="nb-label">Recent sessions</span>
            <button
              className="nb-link"
              disabled={running}
              onClick={() => confirm("Clear history and reset level to 2?") && update({ ...DEFAULTS, intervalMs: s.intervalMs, soundMode: s.soundMode, volume: s.volume, feedback: s.feedback })}
            >
              Reset
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>N</th>
                <th>Position</th>
                <th>Sound</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {s.history.slice(0, 12).map((h) => (
                <tr key={h.date}>
                  <td>{new Date(h.date).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                  <td>{h.n}</td>
                  <td>{h.posPct}%</td>
                  <td>{h.soundPct}%</td>
                  <td className={h.pct >= ADVANCE_PCT ? "up" : h.pct < FALLBACK_PCT ? "down" : ""}>{h.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

function Results({ r, from, to }: { r: SessionResult; from: number; to: number }) {
  const verdict = to > from ? `Level up: N=${to}` : to < from ? `Level down: N=${to}` : `Stay at N=${to}`;
  return (
    <section className="nb-result">
      <div className="nb-result-head">
        <span className="nb-big">{r.pct}%</span>
        <span className={`nb-verdict ${to > from ? "up" : to < from ? "down" : ""}`}>{verdict}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th />
            <th>Hits</th>
            <th>Misses</th>
            <th>False alarms</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {(
            [
              ["Position", r.pos, r.posPct],
              ["Sound", r.sound, r.soundPct],
            ] as const
          ).map(([name, t, pct]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{t.hits}</td>
              <td>{t.misses}</td>
              <td>{t.falseAlarms}</td>
              <td>{pct}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
