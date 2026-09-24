# Logic Gym

A private daily reasoning trainer. Each morning it shows twenty questions in three
timed blocks (Pace, Load, Chains) plus one longer Day Problem to carry through the
day and answer at night. Multiple-choice and quantitative questions are marked
instantly; written answers are graded by Claude. It saves history and tracks which
reasoning moves are weakest so future days target them.

## Dual N-Back (`#/n-back`)

A separate trainer page, linked from the Daily Gym header. Levels run from N=1 to
N=100. Each session is 20+N trials with exactly 6 position and 6 sound matches in the
20 scored trials. Press `A` for a position match and `L` for a sound match (or tap the
buttons). Scoring is hits ÷ (hits + misses + false alarms): 80% or more moves you up a
level, and under 50% three sessions in a row moves you down. Level, settings and the
last 50 sessions are saved in the browser.

Sync: the Web Audio clock drives everything. Tones are scheduled on it
sample-accurately, the square is drawn when that clock (corrected for speaker latency)
reaches each trial, and key presses are mapped to trials on the same clock. The
optional "Letters" mode uses the device's speech voice, which can start slightly late.

## Stack

- React frontend (Vite), built to match the parchment design in the brief.
- Supabase for the database, authentication, and edge functions (added in step two).
- The Anthropic API key lives only in a Supabase Edge Function secret. The browser
  never holds it or calls Claude directly.
- Hosted on Lovable.

## Build order

1. **A working day, hardcoded (this step).** Renders one full set in the correct
   style, lets you answer and choose options, marks the multiple-choice instantly,
   and reveals the marking guide and model answer. No Claude calls yet.
2. **Live content and grading.** A Supabase Edge Function generates the daily set and
   grades written answers with Claude. The day's set and answers are saved.
3. **Login, history, progress.** Supabase Auth, Row Level Security, the streak, the
   per-move ledger, and a progress page.
4. **Fresh daily sets and polish.** A new set each day, biased toward the weakest
   moves, and a tidied mobile layout.

## Run locally (for reference only)

```
npm install
npm run dev
```

The site is meant to be hosted on Lovable; local commands are not required.
