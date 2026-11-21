# Practice Room

A phone-first web app for rehearsing spoken sales conversations. An AI buyer talks to you in
a live voice call. When you hang up, a separate AI coach reviews the transcript, scores the
call against the method you chose, and rewrites your weakest moment. You can then replay that
moment.

This is a practice room only: no outbound calling, no real prospects, no telephony.

## How it works

```
 phone browser                           your server (Vercel)              services
 ─────────────                           ────────────────────              ────────
 mic ─► 16-bit PCM ─────────────── WebSocket (short-lived token) ──────►  Deepgram (speech-to-text)
 transcript ─► /api/buyer ───────────► builds buyer prompt ─── stream ─►  Claude Sonnet 5.5 (buyer)
 text split into sentences ─► /api/tts ─► one sentence at a time ──────►  ElevenLabs (text-to-speech)
 audio queue ─► speaker
 hang up ─► /api/coach ──────────────► builds coach prompt ────────────►  Claude Opus 5.5 (coach)
 history, scores, progress: IndexedDB on the phone (never leaves the device)
```

- **Latency:** the buyer's reply streams from Claude. Each sentence is sent to text-to-speech
  as soon as it is complete, so the buyer starts talking before the full reply is written.
- **You can interrupt the buyer.** When you start talking (at least two words) while the
  buyer is speaking, playback stops at once. The transcript keeps only the words the buyer
  actually got out, marked as cut off. An echo filter ignores the buyer's own voice coming
  back through your microphone.
- **The buyer can interrupt you.** If you talk past a buyer's patience (`patienceSeconds` in
  their file: 75 s for Priya, 20 s for Alicia), the buyer cuts in.
- **Ending:** say "end call" (or "hang up"), or tap the red button. The buyer can also hang up
  on you, and can decline a next step.
- **Two separate personas.** The buyer prompt never sees the method or the rubric. The coach
  prompt reviews the finished transcript cold and is told the buyer's reactions are evidence,
  not verdicts.
- **Buyer memory.** After each call the coach writes a neutral, facts-only summary. The next
  call with the same buyer includes the last three summaries, so the buyer remembers you.
- **Gets harder.** Each buyer has a level (1 to 3). It rises when your last three calls with
  that buyer average 7 or more, and drops below 4. The next recommended drill targets your
  weakest skill and the lowest buyer on the ladder you have not yet beaten.
- **No silent fallback.** The screen always shows **Live voice**, **Text-only demo** or
  **Voice lost**. If a voice key is missing or voice fails to start, the call does not start;
  you can choose a clearly labelled text-only demo instead. If the voice connection drops
  mid-call, the app says so and switches to typing.

## Paid services and costs

| Service | Used for | Approximate cost |
|---|---|---|
| Anthropic Claude API | Buyer (Sonnet 5.5) and coach (Opus 5.5) | Sonnet 5.5: $2 / $10 per million input / output tokens. Opus 5.5: $4 / $20. |
| Deepgram Nova-3 | Streaming speech-to-text | About $0.0077 per minute |
| ElevenLabs Flash v2.5 | Buyer voices | About $0.04–0.05 per 1,000 characters |

Rough total: **$0.30–0.90 per 10-minute practice call** including the coach's review. Check
each vendor's pricing page; these figures come from public summaries in November 2026.

## Set up

You need four values. Never commit them.

| Name | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API keys |
| `DEEPGRAM_API_KEY` | console.deepgram.com → API keys. Give it the **Member** role or higher, so it can mint short-lived browser tokens. |
| `ELEVENLABS_API_KEY` | elevenlabs.io → Settings → API keys |
| `APP_ACCESS_CODE` | A passphrase you choose. The app asks for it once per device. It stops anyone who finds your URL from spending your credit. |

### Deploy to Vercel (phone use)

1. In Vercel, **Add New → Project**, import this GitHub repository.
2. Set **Root Directory** to `practice-room`. The framework preset is Vite.
3. Under **Environment Variables**, add the four values above.
4. Deploy, open the URL on your phone, enter your access code.
5. Add it to your home screen: Safari → Share → Add to Home Screen, or Chrome → menu →
   Install app.

### Run locally (laptop)

```bash
cd practice-room
cp .env.example .env.local   # then fill in the values
npm install
npm run dev                  # http://localhost:5173
```

The `/api` functions run inside the Vite dev server, so local behaves like Vercel. The
microphone needs HTTPS on a phone; on a laptop, `localhost` is allowed.

## Editing the content

Everything the buyer, coach and progress logic uses is plain JSON in `data/`. Run
`npm run typecheck` after editing to catch a missing field.

| Folder / file | What it controls |
|---|---|
| `data/methods/*.json` | The six methods: origin, evidence type, where each fits and strains, core moves, coach criteria per phase, ethics guardrails |
| `data/buyers/*.json` | The five buyers: budget, targets, competing vendors, personality, starting mood, what they secretly want, what they hold back, what makes them hang up, what earns a next step, patience, voice |
| `data/scenarios/*.json` | The seven scenarios: briefs for you and the buyer, default methods, win condition |
| `data/products/*.json` | Product briefs. The shipped one, Shiftwise, is fictional |
| `data/rubric.json` | Phases, score anchors, ethics rules and the ethics score cap |
| `data/settings.json` | Models, effort, speech settings, call limits, difficulty rules |

To practise with a real product, paste its brief in **Settings → Your product**. Include
pricing, proof points and limitations: the coach treats any claim outside the brief as
invented.

**Buyer voices:** each buyer file has an ElevenLabs voice ID from the standard voice library.
If a voice is not available on your ElevenLabs account, the app shows "The buyer's voice
failed" and switches captions on. Replace the ID with any voice from your ElevenLabs library.

## Code map

| Path | Purpose |
|---|---|
| `api/buyer.ts` | Streams the buyer's reply from Claude (thinking off, prompt cached) |
| `api/coach.ts` | Coach review and replay review, as structured JSON from Claude |
| `api/stt-token.ts` | Mints a 60-second Deepgram token so the real key never reaches the browser |
| `api/tts.ts` | Sends one sentence to ElevenLabs and streams the audio back |
| `api/status.ts` | Reports which keys are configured (never their values) |
| `shared/prompts.ts` | The buyer and coach prompts |
| `src/call/engine.ts` | Turn-taking, barge-in, buyer cut-in, end-call detection |
| `src/voice/` | Microphone capture, Deepgram socket, sentence splitting, audio queue |
| `src/lib/progress.ts` | Scores over time, buyer levels, buyer memory, next drill |

## Tested so far, and not yet

Tested in a headless phone browser, with the external services simulated: the text call,
debrief, replay and replay review, history, progress and buyer memory, plus the voice engine
with a fake microphone and a simulated Deepgram socket. The simulated voice tests covered
audio streaming, barge-in, the echo filter, the cut-off transcript, the buyer cutting in at
30 seconds, "end call", and the failure path when voice cannot start.

Not yet tested with the real services: actual speech recognition quality, real
text-to-speech, true end-to-end delay, echo on a phone speaker, and the first Vercel deploy.
Wearing earphones avoids most echo problems.
