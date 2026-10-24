# Tech review log

Reviewer pass on /home/claude/bank/out/tech.json. Every change is applied by /home/claude/bank/scripts/review_tech.py. The script must run once on the author's original file (a backup is at /tmp/claude-0/-home-claude/e22204a6-da4b-5354-8ef1-e7f0555e9582/scratchpad/tech.orig.json), and its asserts stop it from being applied twice. `validate.py` reports 0 errors and 0 warnings. All arithmetic was rechecked in Python: value chain unit economics, c01 CAC and payback, c02 sizing, c03 breakeven, c04, c05, c06, c07, c09, c10 NRR, market and exit maths, c11 margin and runway, c12 combined margin.

Pass 1 is accuracy, facts and MECE. Pass 2 is difficulty (REVIEW.md section 7). Ids, counts, quotas and schema are unchanged. The only new field is `decoys` on flaw items, which section 7 requires.

## The author's six doubts

1. **tech-c10 secondary framework and the ₹432 crore market.** Keeping market-sizing as the secondary framework is correct. The deal only works if exit ARR (₹270-360 crore) is a majority of the core market, so the sizing step decides the answer. Quality of growth is a branch inside PE due diligence, not a separate framework. Profitability is wrong because no profit decline is being diagnosed. The ₹432 crore figure was not supported by the case facts: the 40% willingness-to-pay share appeared only in the tree, never in the facts. I added "assume about 45% would pay" as an explicit case fact and labelled 9 lakh as a working estimate. The core market is now ₹486 crore (shown as ~₹490 crore), implying a 55-75% share against about 12% today. I added a "Core market size" key metric, folded underlying NRR into the NRR metric's formula, and rewrote the `why` text. Note that ₹432 crore was also the equity cheque (60% of ₹720 crore). The coincidence invited confusion, and the new number removes it.
2. **tech-f03 type.** Renamed the node "Win rate on qualified opportunities" (the word "enterprise" had added a second reading, a segment cut). The explanation now says outright that the other L1 branches are ARR amounts that add up to net new ARR, while win rate is a percentage two levels down (deals won = qualified opportunities x win rate). That makes it mixed-levels and nothing else.
3. **tech-f06 D&A.** Replaced. D&A is arguable, because its tax shield works through cash taxes. The new node is "Interest paid on the acquisition loan" in an unlevered FCF tree, which any finance expert will accept as not-a-driver without argument. I relabelled c2 to "Cash taxes on operating profit" so the unlevered convention is consistent.
4. **tech-f07 RBI rule.** Verified against reporting on RBI's e-mandate framework (April 2026): additional factor authentication to register, AFA-free recurring debits up to ₹15,000, a pre-debit notice at least 24 hours ahead, and coverage of cards and UPI. The author's description was broadly right, but I removed the unsourced claim that failed renewals are "a large share of SMB churn" and explained the mechanism instead. At Advanced difficulty the gap is fair: involuntary churn is a standard SaaS concept, and q08 tests the same idea. The same corrections went into the value chain's India note and tech-q08.
5. **tech-v06.** The prompt now says the token price is unchanged *and* the committed-volume rate is already optimal, and asks "which stage's decision caused the margin fall, and so owns the fix?". Those two facts rule out s1, so s2 is the only answer.
6. **Market facts.**
   - GST: official data shows about 1.52 crore active registrations (May 2025) and about 1.67 crore (June 2026), including TDS/TCS/ISD registrants. I kept 1.44 crore but labelled it in c02 as a working assumption for regular and composition taxpayers, below and short of the official count.
   - The turnover split is unverifiable (no official split is published at these bands), so c02 now presents it as "assume".
   - E-invoicing above ₹5 crore is confirmed and now specified as applying to B2B invoices.
   - Pharmacies: AIOCD figures range from 8.5 lakh (2017) to over 12.4 lakh (2026 strike participation), so 9 lakh is now framed as a working estimate where industry figures vary.
   - Partner margins: 20-30% matches published bands for partners who carry the sales cycle, but I found no India-specific source, so the line is generalised and labelled approximate.
   - Vendor benchmarks: every benchmark without a label now says "approximate" (pipeline coverage, freemium conversion, CAC payback, win rate, services margin, NRR, GRR). R&D at scale is widened to 15-25%. The feature-adoption "under 10%" rule is removed. The hyperscaler margin is widened to 20-40%.
   - GST on SaaS stays at 18% after the September 2025 rate changes (confirmed).

## Other pass-1 fixes

- **tech-c02:** hint 1 said "supply-side" for what is actually a demand-side build. Corrected. Hypothesis 1 said "three-quarters" when the figure is 78%; changed to "nearly 80%".
- **tech-c04:** "UPI carries zero MDR" is no longer reliably true. Reports say a 0.4% MDR on merchant UPI payments above ₹2,000 started on 15 October 2026. I reworded it to "UPI payments earn the client nothing under this partner deal", which is a case fact.
- **tech-c12:** c1 "Value vs price" had children "Standalone value" and "PV of net synergies". Those overlapped L1 branches a and b, a real MECE flaw. c1 is now "Price and structure", covering 10x ARR against comparable multiples and all cash against an earn-out.
- **tech-c11:** wording tweak only ("led by" instead of "mostly").
- **tech-q07:** see pass 2. The old correct answer was fine, but the item was too easy.

## Pass 2: what I made harder

**Hints (all 12 cases):** hint 1 now names only the split logic and never the branches. Hint 3 now shows a less revealing branch: c01 revenue (not costs), c03 new customers, c04 outlets, c05 competition, c06 handling cost, c07 execution, c08 comparison, c09 ability to win, c10 competition, c11 opex, c12 integration. c02's hint 3 is unchanged.

**Red herrings in Intermediate prompts:**
- c05: a 300-person Bengaluru R&D centre, with a common mistake explaining why it does not justify entry.
- c06: the CFO notes a rival moved support offshore.
- c07, c08, c09: these already carry a fact that changes the structure (the deteriorating do-nothing baseline, light versus heavy seats, enterprise using 30% of engineering), so the hints now point at it.

**Advanced cases:** each already combines two frameworks and requires a quantitative step (c10 exit ARR against market share, c11 margin and burn gap, c12 dis-synergy and combined margin). c10's sizing step is now explicit.

**Framework picks:** I swapped in distractors a weak candidate would actually choose:
- c01: turnaround (negative EBITDA)
- c02: product-launch (the team decision)
- c03: segmentation (light versus heavy users)
- c06: pricing (paid support)
- c07: competitive-response (cloud rivals)

**Flaw drills:**
- f02: the giveaway "IT firms" overlap became "Start-ups (founded in the last five years)", an overlap hidden behind a different basis (age against size).
- f03: added decoy c3 "Price discounts granted at renewal".
- f04: the obvious not-a-driver ("subscription price charged to customers") is replaced by a hidden overlap. "Over-provisioned and idle capacity" is already inside the resources counted. Added decoy b3, the rupee-dollar exchange rate.
- f05: the overlap is now "Expected rise in annual HR software spend by 2030" against "Market growth", the same quantity in different wording. Decoy d1, revenue ramp.
- f06: decoys c1x (capitalised development) and b3 (accrued bonuses).
- f07: the mixed-levels activation node moved from an obvious L1 position to an L2 sibling of closures and deliberate exits. Decoy b3 (dropped add-ons against new add-ons). Fixed an id clash in the corrected tree (the failed-payments node is now a4).

**Quick checks (all 8 rewritten):** every wrong option now looks MECE and fails on one subtle point. There are no more "India and US only" style options. The correct option is no longer the longest in any item, and correct positions are spread 1, 3, 1, 3, 0, 2, 2, 0.
- q01: seat-based subscriptions only (gap), annual upfront billing (mixed basis and overlap), new-customer revenue (overlap).
- q02: freemium bridge with a downgrade-to-free overlap, a conversion-only gap and upgrades as not-a-driver.
- q03: network and data transfer gap, storage overlap, feature engineers as not-a-driver.
- q04: missing win-backs, renewal MRR as not-a-driver.
- q05: missing technical evaluation stage, security review overlap.
- q06: missing plan downgrades, billing frequency as not-a-driver, upsell netting as mixed basis.
- q07: missing input tokens, retries overlap, context window as not-a-driver.
- q08: missing involuntary churn, usage as mixed-levels.

**Value chain drills:**
- v01: now a symptom in s6 caused in s2 (a redesigned screen shipped without guidance).
- v03: adds the red herring of low ticket volume.
- v05 and v06: already of the symptom-here, cause-there kind.
- v02 (order) and v04 (assign) are unchanged.

## Remaining doubts

- The UPI MDR change (0.4% above ₹2,000 from 15 October 2026) is reported by fintech and media sites citing an NPCI FAQ. I did not read the primary document, so the bank avoids relying on it either way.
- The ₹15,000 AFA-free limit and the 24-hour notice come from press summaries of the RBI 2026 framework, not the circular itself. I am confident both describe the long-standing rules accurately.
- Retail pharmacy counts vary between sources (8.5 to 12.4 lakh). The case now treats 9 lakh as an assumption.
- I did not re-verify vendor benchmarks (NRR, GRR, CAC payback and the rest) against a single authoritative dataset. They are labelled approximate and match common industry references.
- tech-f01 (Beginner gap, missing R&D) is the easiest remaining item and still somewhat guessable. It is acceptable for Beginner level and left as is.
