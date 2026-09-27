---
name: boardroom-lite
description: Low-cost boardroom. Casts 3 specialised personas for an idea, decision or draft, runs independent positions and one sparring round, merges amendments into a sharper version, and writes a short brief. Use when the user runs /boardroom-lite.
argument-hint: "<idea text or file path> [--board 4|5] [--go] [--research] [--resume <session>] [--preset <name>] [--save-board <name>] [--outcome <session> \"<what happened>\"]"
---

# Boardroom lite (v3)

A cheap version of the full boardroom. Expected cost: 7 subagent calls for a 3-seat board that stops after round 2 (3 + 3 + 1 pre-mortem). Each extra seat adds 2 calls, and a round 3 adds one call per persona still blocking or scoring below 7. A 4-seat board that needs round 3 costs up to 13.

Kept: independent first positions, one real rebuttal round, a fresh-eyes pre-mortem.
Dropped: separate research phase, multi-round loop by default, casting subagent, HTML or PDF output.

## Arguments

- The input, as text or a file path. If a file path, read it (see "Reading files").
- `--board 4` or `--board 5` raises the board size. Default is 3.
- `--go` skips every pause (casting approval and questions for the user).
- `--research` lets each persona run up to 2 web searches in round 1. Off by default.
- `--resume <session-folder>` re-runs on a revised version of an earlier idea with the same board. See "Iterating".
- `--preset <name>` uses a saved board from `boardroom/boards/<name>.md` and skips casting.
- `--save-board <name>` saves this run's board as a preset after casting.
- `--outcome <session-folder> "<text>"` records what actually happened. See "Run log". No board runs.

The user may change settings at any pause (add or swap a seat, turn research on or off). Record every change under "Run settings" in `casting.md`, and apply it from the next round.

## Cost rules (apply throughout)

- The main session does intake, casting, merging and the brief itself. No subagent for these.
- Every persona and the pre-mortem are spawned with the Agent tool using `model: sonnet`. Use `haiku` for the pre-mortem if the input is very simple.
- Personas receive only what they need: the input, the context summary, their own persona card, and from round 2 the other positions. Never the full transcript.
- Pass round material by file path, not by pasting it. List the exact files each persona may read and tell it to read nothing else. Give the persona card, mode, goal and the prompt inline.
- Tell every subagent: do not create or edit files, and return only the answer text.
- Word limits are hard limits: round 1 at most 250 words, rounds 2 and 3 at most 200 words, pre-mortem at most 150 words.
- Rounds run in parallel: spawn all personas for a round in a single message.
- If a subagent overruns its word limit or skips a field, use what it gave. Do not re-run it.

## Reading files

- `.md` and `.txt`: read directly.
- `.docx`: if `pandoc` or `python-docx` is missing, unzip the file and pull the text from the `<w:t>` elements in `word/document.xml`, one line per `<w:p>` paragraph.
- `.pdf`: use `pdftotext` or the PDF skill.

## Step 0: intake (main session)

1. Read the input. If `boardroom/context/` exists, skim file names and read only files clearly relevant. Write a context summary of at most 150 words. Include what is known and unknown about stage, team, customers and evidence.
2. Long input guard: if the input is over 800 words, write a digest of at most 300 words that keeps every claim, number and decision point. Personas get the digest. A persona may quote a specific passage from the original only when it is critiquing that passage. Save the digest in the session folder.
3. Pick the mode. State it in one line; the user can override.
   - `improve`: an idea or plan to sharpen. Default.
   - `decide`: a choice between named options (A or B, go or no-go, which price). The board argues for an option, not amendments to one idea.
   - `review`: a finished draft to be judged by a known audience (case competition answer, pitch, CV, essay). Seat 1 becomes the evaluator (judge, interviewer, investor) and scoring uses their criteria.
4. Neutralise the framing. Rewrite the input in the third person without ownership or enthusiasm cues ("my idea", "I think this is great", "obviously"). Personas never learn whose idea it is.
5. Set the goal and success test. If the goal is a numeric target (ARR, valuation, grade, market share), write the success test as a number and a time frame. If the goal or success test is missing and cannot be inferred, ask the user one question (skip if `--go`, and state the assumption instead).
6. Create `boardroom/sessions/<YYYY-MM-DD>-<short-slug>/` and save `idea-v1.md`: the neutral input, mode, goal, success test and stated assumptions.

## Step 1: casting (main session, no subagent)

Skip this step if `--preset` or `--resume` was passed; load that board instead.

1. List 5 to 6 decision dimensions where the input could succeed or fail. Mark the single highest-risk dimension.
2. Fill the seats in this order:
   - Seat 1: the customer, user or evaluator who must adopt, pay for or judge this. In `review` mode, the named evaluator.
   - Seat 2: the adversary, whoever has the strongest reason to see it fail (sceptical investor, competitor, regulator, rival team, examining judge). This seat must name the best alternative, including doing nothing. If the success test is numeric, this seat must also give a rough bottom-up estimate against it.
   - Seat 3: the domain expert for the highest-risk dimension. If this seat could compete with the idea (a platform that could build it, an incumbent), say so on the card.
   - Seats 4 and 5 (only with `--board`): experts for the next uncovered high-risk dimensions. Prefer a persona whose incentives clash with an existing seat. Legal, regulatory and fraud risk are common gaps for anything that handles personal data or money.
3. Use composite role personas, not named real people. Make them specific: role, seniority, sector, geography where it matters. Refer to personas by role, and use "they" for them in cards and prompts.
4. Write a persona card for each (at most 80 words): who they are, what they optimise for, what would make them reject it, two or three frameworks they would actually use.
5. Save `casting.md` with the dimensions, the cards, one runner-up persona, the main blind spot this board leaves, and a "Run settings" section (board size, research on or off).
6. If `--save-board <name>` was passed, save the cards to `boardroom/boards/<name>.md`.
7. Unless `--go`, show the board in 5 to 8 lines and ask "Run with this board, or swap someone?". If the idea depends on current facts (competitors, prices, rules), also ask whether to turn on `--research`, with a recommendation. Wait.

## Step 2: round 1, independent positions (parallel subagents)

Spawn one subagent per persona in a single message. Prompt:

```
You are <persona card>.
Context: <context summary>
Mode: <mode>. Goal: <goal>. Success test: <success test>.
Input (v1): <idea-v1 or digest, inline, or "read <path> only">

Give your independent position in at most 250 words, in this order:
1. Verdict. improve: back it / back with changes / reject. decide: which option you back. review: the score you would give as <evaluator>, with the rubric line it is based on.
2. The biggest risk or weakness from your vantage point, with the reasoning.
3. Up to 2 concrete amendments, each written as a specific change to the text or plan.
4. Score 1 to 10 on your own criteria.
5. Blocking objection: yes or no. If yes, one line.
6. One factual question for the author whose answer would most change your view.
<seat 2 only: 7. The best alternative to this, including doing nothing, and why it might win. If the success test is numeric, a rough bottom-up estimate against it, marked "judgement".>
Label any factual claim you cannot support as "judgement".
Stay in role. Do not be agreeable for its own sake. Plain British English, no em dashes.
```

If `--research` is on, add:

```
Before writing your answer, you must run 1 or 2 web searches on the claim that most affects your verdict (competitors, prices, rules). If the WebSearch tool is not loaded, load it with ToolSearch first. Cite the source next to each fact you use. Never put names, figures or confidential details from the context into a search query. If you could not search, say so in one line at the top.
```

After the round, check each response for citations. If research was on and a persona cited nothing, record that in `casting.md` and in the brief's process notes. Do not re-run it.

Save each response to `round-1/<persona-slug>.md`.

## Step 2b: questions for the user (main session, no subagent)

Collect the factual questions from round 1, drop duplicates, keep at most 3. Unless `--go`, show them and ask the user to answer any they can, or reply "skip". Save answers to `answers.md` and pass them to every persona in round 2 as "Author's answers".

- If an answer is unclear (for example the user repeats the question), record it as unanswered, write the assumption you made in `answers.md`, and tell the user the assumption in the next message. Do not ask again.
- If `--go`, list the questions in the brief as open questions.

## Step 3: round 2, sparring (parallel subagents)

Spawn one subagent per persona in a single message. Prompt:

```
You are <persona card>.
Mode: <mode>. Goal: <goal>.
Read only these files: idea-v1.md (or the digest), answers.md, round-1/<own-slug>.md (YOUR round 1 position), and the other round-1 files (the other board members).
<optional: Question from the chair: <one targeted question on the main contested point, aimed at this persona>>

Respond in at most 200 words, in this order:
1. The strongest point made against your view. Name who made it and answer it directly.
2. Which amendments from others you accept, reject or modify, by name, one line each. In decide mode, say whether any argument moved you to another option.
3. Updated score 1 to 10. If it changed, cite the specific argument or answer that changed it.
4. Blocking objection: yes or no, one line if yes.
5. The single piece of evidence that would change your mind.
<if the chair asked a question: 6. Your answer to the chair's question.>
```

The chair's question is optional and limited to one per persona. Use it when round 1 shows a sharp disagreement that one persona is best placed to settle, for example asking a potential competitor "would you partner or build this yourself, and why?".

Save each response to `round-2/<persona-slug>.md`.

## Step 4: merge and stop check (main session)

1. Tally amendments.
   - improve and review modes: an amendment is accepted if a majority accepts it (explicitly, or by saying they reject nothing) and no member marks it a blocker. A modified acceptance counts as acceptance of the modified version. Contested amendments become open questions. Write `idea-v2.md` (the revised text or plan) with a changelog table: change, who proposed it, who backed it.
   - decide mode: tally final backing per option, with the strongest argument for each. Write `decision.md` with the recommended option, the conditions under which the other option would be better, and any amendments to the chosen option.
2. Note in the changelog any score change caused by an author's answer rather than an argument. These are often the most important findings.
3. Stop check:
   - All scores 7 or above and no blocker: stop.
   - Otherwise run round 3 (below), only for personas with a blocker or a score below 7. Merge again into v3.
   - Never more than 3 rounds. If disagreement remains, report it. Do not force agreement.

## Step 4b: round 3, judging the revision (parallel subagents)

Round 3 judges the revised version, so it uses its own prompt:

```
You are <persona card>.
Mode: <mode>. Goal: <goal>.
Read only these files: idea-v2.md (the REVISED input you are now judging), answers.md, round-2/<own-slug>.md (YOUR round 2 position), and the other round-2 files.
Judge v2 as a plan. Evidence that cannot exist yet at this stage (pilot results, signed deals) should not lower your score; list what must be proven first instead.
<optional: Question from the chair: <one targeted question>>

Respond in at most 200 words, in this order:
1. The strongest point made against your view. Name who made it and answer it directly.
2. Which changes in v2 and which open items you accept, reject or modify, one line each.
3. Updated score 1 to 10. If it changed, cite the specific change that changed it.
4. Blocking objection: yes or no, one line if yes. If no but conditional, state the conditions.
5. The single piece of evidence that would change your mind.
```

Save each response to `round-3/<persona-slug>.md`.

## Step 5: pre-mortem (one fresh subagent)

The pre-mortem must not see the debate. Write `final-for-premortem.md` containing only the final proposal: no changelog, no open questions, no scores, no persona names. Point the subagent at that file only, or paste it inline.

```
It is 18 months from now and this failed (in review mode: it scored poorly with <evaluator>). In at most 150 words, give the two most likely reasons, and for each the cheapest way to test that risk in the next two weeks.
Final version: <final-for-premortem.md>
Context: <context summary>
```

If the answer still quotes something from the debate, note in the brief that the pre-mortem was not fully independent.

## Step 6: brief (main session)

Write `brief.md`, at most one page:

1. One-line summary and verdict, usable as-is in a message or slide.
2. The final version in short (or the decision and its conditions), pointing to the full file.
3. What changed from v1 and why.
4. Scores by persona for every round, with blockers and any dissent stated plainly.
5. Open questions and evidence to gather (unanswered author questions, contested amendments, "what would change my mind" items).
6. Pre-mortem risks and the tests to run.
7. Board used, and the blind spot it left.
8. Process notes: anything that did not run as designed (research not run, pre-mortem leak, assumed answers, settings changed mid-run). Write "none" if nothing.

Then append one line to `boardroom/log.md` (create it with a header row if missing):
`<date> | <session folder> | <mode> | <verdict> | <final average score> | <top pre-mortem risk> | outcome: pending`

If the working directory is a git repository, commit the session folder and log and push to the current branch, so the run survives the session ending. In a repository, also commit after casting and after each round.

Tell the user in 3 to 5 lines: the verdict, the biggest change, the main open risk, any process notes, and the path to `brief.md`.

## Iterating (`--resume`)

Use when the user has revised an idea after an earlier run.
1. Load `casting.md` and the latest brief from the named session. Do not recast.
2. Create a new session folder `<date>-<slug>-r<n>` and save the new input as v1 with a short note of what the author changed since the last brief.
3. Run rounds 1 to 6 as normal, but add to every round 1 prompt: "Last time the board's main concerns were: <open questions and pre-mortem risks from the previous brief>. Say whether this version resolves them."

## Run log and outcomes (`--outcome`)

`--outcome <session> "<what happened>"` updates that session's line in `boardroom/log.md`, replacing `pending` with the outcome, and adds one line on whether the board's top risk turned out to matter. No board runs.
When the log has 5 or more resolved outcomes, a normal run may read it and add one line to the brief: which seat types have been most often right for this kind of input. Treat that as a hint, not a rule.

## Writing style for all outputs

Plain British English. No em dashes. No hype or filler. Be direct about weaknesses.
