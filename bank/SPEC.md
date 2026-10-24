# Structure Gym exercise bank: authoring spec

Audience: an MBA student (ISB, India) and complete beginner preparing for MBB case interviews in one month. Exercises must be of the quality an ex-McKinsey/BCG/Bain case coach would sign off on.

## Output
One JSON file per industry at /home/claude/bank/out/<industry_id>.json with this shape:

```json
{ "industry": "<industry_id>", "valueChain": {...}, "cases": [...], "flaws": [...], "quick": [...], "chainDrills": [...] }
```

## Allowed IDs
Industries: retail, fmcg, banking, insurance, telecom, airlines, healthcare, tech, ecommerce, energy, auto, manufacturing, media, hospitality, education, logistics, public
Frameworks: profitability, market-entry, ma, pricing, growth, product-launch, market-sizing, operations, competitive-response, pe-dd, turnaround, segmentation
Difficulty: "Beginner" | "Intermediate" | "Advanced"
Region: "India" | "Global"

## 1. Cases (12 per industry: 4 Beginner, 5 Intermediate, 3 Advanced)
Used for three modes: Build an issue tree, Timed drill, Pick the framework.
- Cover at least 7 different primary frameworks within the industry. At least 6 of the 12 India-set.
- Advanced cases combine frameworks (set `secondary`) and carry a real twist: regulation, declining market, cash crunch, conflicting stakeholder goals, data that contradicts the obvious hypothesis.
- Clients are anonymised ("a large Indian private bank", "a European budget airline"). Never invent facts about real named companies. Real regulators, schemes and market features are fine (RBI, IRDAI, TRAI, SEBI, PLI scheme, UGC, DGCA, FAME, GST).
- Numbers must be realistic for the industry and internally consistent.

Fields:
```json
{
  "id": "<industry>-c01",
  "title": "short title, max 7 words",
  "industry": "<industry_id>",
  "framework": "<primary framework id>",
  "secondary": ["<framework id>", ...],
  "difficulty": "Beginner",
  "region": "India",
  "prompt": "2-4 sentences as an interviewer would say it. Includes the client, the situation, a number or two, and the question.",
  "clarifyingFacts": ["Q: ... A: ...", "..."],
  "modelTree": { "id": "r", "label": "Root question restated precisely", "children": [ ... ] },
  "hypotheses": ["...", "..."],
  "hints": ["hint 1: what kind of first-level split to use", "hint 2: names the first-level branches", "hint 3: shows one full branch with its children"],
  "keyMetrics": [{ "name": "Contribution margin per order", "formula": "AOV x take rate + delivery fee - rider cost - packaging - payment fees" }],
  "commonMistakes": ["...", "..."],
  "frameworkPick": {
    "options": ["<4 framework ids incl. the correct one(s)>"],
    "correct": ["<framework id>", ...],
    "why": "1-2 sentences on why this framework fits, in terms of the question asked",
    "distractorWhyNot": { "<wrong id>": "one sentence", "...": "..." }
  }
}
```
- clarifyingFacts: 3 to 4 Q&A pairs the interviewer would answer if asked (objective, geography, timeline, key data).
- modelTree: exactly 3 levels below the root for Intermediate/Advanced (root -> L1 -> L2 -> L3 where it adds value; every L1 must have L2 children; L3 on at least half the L2 nodes). Beginners: root -> L1 -> L2 minimum. 2 to 5 L1 branches. Node ids unique within the tree ("r", "a", "a1", "a1x" style). Labels are short (max ~12 words) and specific to the case, not textbook generic. The tree must be genuinely MECE at every level.
- hypotheses: 2 to 3, specific and testable ("Aggregator commission at 25% of delivery orders has pushed variable cost per order up ~8 points").
- keyMetrics: 1 to 3 with formulas.
- commonMistakes: 2, specific to this case.
- frameworkPick.options: 4 distinct ids; correct is a subset (2 entries for hybrid advanced cases).

## 2. Flaw drills (7 per industry: 2 Beginner, 3 Intermediate, 2 Advanced)
A pre-written issue tree with deliberate flaws. The user clicks the flawed node and picks the flaw type.
```json
{
  "id": "<industry>-f01",
  "title": "short title",
  "industry": "<industry_id>",
  "framework": "<framework id>",
  "difficulty": "Intermediate",
  "tree": { "id": "r", "label": "...", "children": [ ... ] },
  "flaws": [{ "nodeId": "c", "type": "overlap", "explanation": "...", "fix": "..." }],
  "correctedTree": { "id": "r", "label": "...", "children": [ ... ] }
}
```
- Flaw types: overlap | gap | mixed-levels | not-a-driver.
- Convention: for a gap, nodeId is the PARENT node whose children miss a branch. For overlap, nodeId is the redundant node (the one to remove or merge). For mixed-levels and not-a-driver, the offending node.
- Beginner: 1 obvious flaw, tree of 2 levels. Intermediate: 1 to 2 subtler flaws, 2 to 3 levels. Advanced: 2 to 3 flaws, 3 levels, including at least one subtle one (e.g. overlap hidden under different wording, gap only visible if you know the industry's economics).
- Across the 7, use every flaw type at least once.
- Each flaw must be unambiguous: an expert would agree it is a flaw and agree on its type. Everything not listed as a flaw must actually be fine; no accidental second flaw.
- correctedTree fixes every flaw.

## 3. Quick MECE checks (8 per industry: 3 Beginner, 3 Intermediate, 2 Advanced)
Fast multiple choice. A parent node and four candidate splits; exactly one is MECE and relevant.
```json
{
  "id": "<industry>-q01",
  "industry": "<industry_id>",
  "difficulty": "Beginner",
  "question": "Which split of '<parent>' is MECE?",
  "parent": "Revenue of a multiplex chain",
  "options": [
    { "split": ["Ticket revenue", "Food & beverage", "Advertising", "Other (convenience fees, events)"], "correct": true, "why": "..." },
    { "split": ["...", "..."], "correct": false, "why": "names the overlap or gap" }
  ]
}
```
- Exactly 4 options, exactly 1 correct. Wrong options each fail for a clear, nameable reason (overlap, gap, mixed levels, not a driver). Shuffle position of the correct option across items.

## 4. Industry value chain (1 per industry, rendered as a visual chain diagram)
```json
"valueChain": {
  "summary": "2 sentences on how money is made in this industry",
  "stages": [
    {
      "id": "s1",
      "name": "Sourcing",
      "activities": ["..."],
      "players": ["types of firms at this stage, e.g. 'FMCG brands', 'distributors'"],
      "revenueDrivers": ["..."],
      "costDrivers": ["..."],
      "kpis": [{ "name": "Fill rate", "formula": "units shipped / units ordered", "benchmark": "95%+ for leading FMCG distributors" }],
      "marginNote": "where this stage sits on profitability, e.g. 'thin, 2-4% EBITDA'"
    }
  ],
  "profitPools": "Which stages capture most of the profit and why",
  "unitEconomics": { "unit": "per order / per passenger / per policy ...", "lines": [{ "item": "Average order value", "value": "₹450" }, { "item": "...", "value": "..." }], "result": "Contribution per order ≈ ₹-15" },
  "india": "2-3 sentences on what is distinctive about this industry in India (structure, regulation, channels)",
  "workedExample": { "problem": "a symptom, e.g. 'margins fell 3 points'", "trace": ["step-by-step walk through the chain to the root cause, 3-5 steps"], "lesson": "one sentence" }
}
```
- 4 to 7 stages, in flow order, covering the full chain from inputs to end customer. Figures and benchmarks must be realistic and labelled as approximate where relevant.
- unitEconomics: 5 to 9 lines that add up correctly.

## 5. Value chain drills (6 per industry: 2 Beginner, 2 Intermediate, 2 Advanced)
```json
{ "id": "<industry>-v01", "industry": "<industry_id>", "difficulty": "Beginner", "type": "locate",
  "prompt": "Symptom or question", "options": ["s2", "s3", "s4", "s5"], "answer": ["s3"], "why": "..." }
```
- type "locate" (4 of 6): given a symptom or a cost/revenue item, which stage (by stage id from this industry's valueChain) is it in or caused by. options are 4 stage ids; answer has 1.
- type "order" (1 of 6): prompt asks to put the stages in order; options are all stage ids shuffled; answer is the correct order.
- type "assign" (1 of 6): prompt lists 5 to 6 items; use "items": [{ "item": "Diesel for line haul", "stage": "s3" }, ...] instead of options/answer; why explains the tricky ones.

## Style
- British spelling. Plain English. No em dashes (use commas, colons or brackets). No hype words.
- Use INR (₹, crore, lakh) for India cases and the local currency for global ones.
- Vary the question types: diagnostic "why", solution "how", decision "should", estimation "how big".
- Do not reuse the same scenario twice in an industry. Avoid these scenarios already in the app: generic QSR profit fall, Jio-style free data entry, diagnostics lab PE deal (you may still do a different PE deal in healthcare).

Validate your own JSON (python3 -c "import json;json.load(open(path))") before finishing.
