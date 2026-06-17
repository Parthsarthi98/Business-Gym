# Logic Gym

A private daily reasoning trainer. Each morning it shows twenty questions in three
timed blocks (Pace, Load, Chains) plus one longer Day Problem to carry through the
day and answer at night. Multiple-choice and quantitative questions are marked
instantly; written answers are graded by Claude. It saves history and tracks which
reasoning moves are weakest so future days target them.

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
