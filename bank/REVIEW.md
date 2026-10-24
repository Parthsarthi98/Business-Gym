# Reviewer brief

You are a senior MBB case interviewer and case-prep coach reviewing practice content written by someone else. Your job is to find and fix problems, not to approve. Assume there are errors.

Read /home/claude/bank/SPEC.md first (the authoring spec), then the industry file you are given. Review EVERY item. For each, check:

1. Framework accuracy. Is the primary framework the right one for the question actually asked? Are standard framework components correct (e.g. profitability = revenue (price x volume) and cost (fixed + variable); market entry covers attractiveness, competition, ability to win, economics/entry mode)? Are formulas and KPI definitions correct (combined ratio, RevPAR, ARPU, NRR, CAC/LTV, contribution margin, ATC losses, load factor, CASK/RASK, etc.)? Is frameworkPick.correct right, and is each distractor genuinely wrong for the reason given?
2. MECE correctness. At every level of every model tree and corrected tree: no overlaps, no gaps that matter, consistent level of abstraction, every branch a real driver of its parent. For flaw drills: each listed flaw is a real flaw of the stated type that an expert would agree on, the nodeId follows the convention (gap -> parent; overlap -> redundant node), and there is NO unlisted flaw anywhere else in the tree. For quick checks: exactly one option is MECE and relevant, and each wrong option fails for the reason stated.
3. Practicality. Could a strong candidate draw this tree in 2 to 3 minutes in an interview? Are labels short and concrete? Are numbers realistic for the industry and internally consistent? Are regulatory and market facts (especially India: RBI, IRDAI, TRAI, SEBI, DGCA, UGC, CERC, PLI, GST, FAME) correct? Remove or fix anything you are not confident is true; prefer generic but correct over specific but wrong.
4. Relevance for case interviews. Is this the kind of case MBB, Tier-2 firms and Indian B-school placements actually give? Are hints progressive (split type, then L1 branches, then one full branch) and consistent with the model tree? Are hypotheses specific and testable? Are clarifying facts the ones an interviewer would give?
5. Answers complete. Every item has a full, correct answer: model tree, hints, hypotheses, flaw keys plus corrected tree, quick-check reasons, chain-drill answers. Unit economics lines must add up: verify arithmetic with Python, never by eye. Value chain stages must be in true flow order and the order drill answer must match.
6. Style: British spelling, no em dashes, no hype words, INR in India cases.

Fix problems directly in the JSON file (load, edit, write back with a Python script stored in /home/claude/bank/scripts/review_<industry>.py). Rewrite or replace any item that cannot be fixed cleanly. Keep ids, counts, difficulty quotas and schema unchanged. Then run `python3 /home/claude/bank/scripts/validate.py` and make sure your industry has no errors.

Write a log to /home/claude/bank/review/<industry>.md listing every change (item id, what was wrong, what you changed) and anything you remain unsure about. Reply with: number of items reviewed, number changed, number replaced, and remaining doubts.

## 7. Difficulty: make it challenging (user requirement, applies to every item)
The user finds easy items useless. Raise the challenge without making anything ambiguous:
- Quick checks: every wrong option must look MECE at first glance and fail on one subtle, nameable point (a hidden overlap in different wording, a gap only visible with industry knowledge, a mixed basis). No joke or obviously silly options anywhere. The correct option should not be the longest or most detailed one by default.
- Flaw drills: no giveaway nodes (nothing like "brand colour" or "customers are unhappy" unless the drill is Beginner and even then phrased plausibly). From Intermediate up, include at least one decoy node that looks suspicious but is correct, recorded in a new field on the flaw item: "decoys": [{"nodeId": "...", "whyFine": "one sentence"}]. Hide overlaps behind different wording for the same economic quantity.
- Framework picks: distractors must be the frameworks a weak candidate would actually choose for this prompt, each wrong for a reason grounded in the question asked.
- Cases: even Beginner prompts need tailoring beyond the textbook tree. Intermediate prompts should contain a red herring or a fact that changes the obvious structure. Advanced prompts must require combining frameworks plus at least one quantitative step (a break-even, a sizing, a payback) to reach the hypothesis.
- Hints: hint 1 names only the split logic, never the branches; hint 2 names L1 only; hint 3 shows one branch, not the most revealing one.
- Value chain drills: prefer symptoms that appear in one stage but are caused in another.
Log every item you made harder.
