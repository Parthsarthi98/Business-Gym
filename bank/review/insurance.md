# Insurance review log

Reviewer pass on /home/claude/bank/out/insurance.json. All edits live in /home/claude/bank/scripts/review_insurance.py, which can be rerun safely: pass 1 covers accuracy, pass 2 covers difficulty (REVIEW.md section 7). validate.py reports 0 errors and 0 warnings. Arithmetic was rechecked in Python: c01, c02, c03, c04, c06, c08, c10, c11 and c12, the unit economics and the worked example all add up.

Items reviewed: 33 (12 cases, 7 flaw drills, 8 quick checks, 6 chain drills) plus the value chain. Items changed: 29 plus the value chain. Items replaced outright: 3 (v01, v03 and f02's flawed branch get new scenarios; ids, difficulty and type are unchanged). All 8 quick checks were rewritten option by option within the same item.

## Author's flagged doubts: resolution

1. **c06, 100% foreign ownership.** The prompt said the government "is opening" insurers. That is out of date. The Sabka Bima Sabki Raksha (Amendment of Insurance Laws) Act was passed in December 2025. Most of it came into force on 5 February 2026, and DPIIT Press Note 1 (2026) allows 100% FDI under the automatic route. Conditions: IRDAI registration is still needed, at least one of the chair, MD or CEO must be a resident Indian citizen, and LIC stays capped at 20%. The prompt now reads "foreign investors may own up to 100% of an Indian insurer, a change in force since February 2026", and the route conditions were added to clarifying fact 4.
2. **GST exemption.** Confirmed. Individual life and individual health policies, including family floaters and reinsurance of them, went from 18% GST to nil on 22 September 2025. Group policies stay at 18%. The India note now gives the exact date and the group carve-out. Insurers lost input tax credit as a result, which life insurers say cost 1.75 to 3.5 points of VNB margin; this is now reflected in the s1 VNB benchmark.
3. **Benchmarks.**
   - India penetration: 3.7% in 2024-25 is confirmed (IRDAI Annual Report 2024-25). The world average was not "near 7%": the same report cites 7.3% for 2024 (Swiss Re). Corrected.
   - Active agent ratio: no reliable industry figure exists (the oft-quoted "24%" comes from a 2020 article with a muddled definition). Replaced with a qualitative, clearly labelled illustrative benchmark.
   - Straight-through processing rate: no published benchmark. Now labelled insurer-specific and illustrative.
   - Claims ratios by line: the original "95-110% group health" and "65-80% motor" were wrong or unsupported. FY25 figures are about 78% individual health, 92% group, 95% government, and motor about 85.5% overall (74.6% at private insurers, 107.9% at public sector ones). Updated in s5, and in c06 node a2x and hypothesis 1, where "group about 95-105%" and "retail 60-70%" were replaced. The s5 margin note ("60-80% of premium") was raised to about 80% (industry ICR 82.9% in FY25).
   - Other benchmarks: placement ratio and retail health renewal rate are now labelled illustrative. Expected loss ratio went to 60-70%. Solvency is now described as a "control level 1.5" with large private insurers at about 1.8-3.0. 13th-month persistency was updated to FY25 actuals (leading privates about 83-88%, LIC about 75%), and its formula now uses first-year premium as the denominator. Commission ratio is now about 15% overall (FY25 gross commission of ₹47,266 crore on about ₹3.08 lakh crore of premium).
4. **c12 "up to 80%" EBITDA.** Checked in Python: 80 - 64 = 16, so EBITDA falls 80%. That only holds if no cost goes away with the rewards revenue. The hypothesis now says this assumption outright, and adds a sensitivity: if a third of the lost revenue is offset by lower incentives, EBITDA still falls about 53%. Clarifying fact 1 now tells the candidate that rewards carry almost no incremental cost, so the assumption can be traced to the case facts.
5. **Ambiguity checks.**
   - f06: the persistency gap was defensible, but node c5 "Investment spread on guaranteed products" could be argued to cover economic assumptions in general and so blur the key. It now reads "Investment returns and discount rates (economic assumptions)", which leaves persistency as the only missing margin assumption. The explanation now frames persistency as an assumption that gets revised as lapse experience worsens.
   - v06: s2 vs s4 was ambiguous, because lapses could be read as a servicing failure. Added facts that renewal collection performs equally across channels and that lapsed customers say they were never told the premium recurs. That points clearly to s2.
   - q03: the five-channel option was not cleanly MECE. Online could sit across aggregators, brokers and direct sales, and "agents and brokers" mixed two intermediary types. It now counts each sale by who sells it (dealers; individual agents and POSPs; brokers and aggregators; banks and corporate agents; direct), and the question says so explicitly.

## Pass 1: other accuracy fixes

- **c02:** a standalone health insurer cannot write pet insurance in India. It is a general insurance product sold by general insurers. The client is now "a mid-sized Indian general insurer". Common mistake 2 no longer gives a specific UK penetration figure (now "mature markets such as the UK or Sweden").
- **c06:** health market growth changed from 10% to 9-10% (FY25 was 9.2% on ₹1.27 lakh crore). The 10% assumption behind the 1.6% share metric is now stated.
- **c07:** "which IRDAI now permits" changed to "has permitted since 2022" (the July 2022 circular on technology-based OD add-ons).
- **c10:** node a2x "Book unrealised equity gains" now carries a caveat about the solvency treatment of unrealised gains, which already sit partly in available solvency margin via the fair value change account.
- **c12:** "SMEs" spelled out in the prompt.
- **Value chain:** the unit economics are now labelled illustrative. The India note was rewritten (use-and-file, EoM includes commission, FDI in force).

## Pass 2: what was made harder (section 7)

**Quick checks, all 8 rewritten.** Every distractor now looks MECE and fails on one subtle, nameable point. The jokey options are gone ("New policies / Renewals / Online sales", "Number of policies sold / Average premium", "Hospitalisation / Claims under ₹50,000"). The correct option is no longer the longest one in any item.
- q01: GWP built as gross direct plus reinsurance accepted minus ceded (ceded is not part of gross); a crop gap; "commercial lines" as a mixed basis.
- q02: claims paid split with outstanding reserves added (incurred vs paid); claims intimated x average paid as a mixed basis.
- q03: "Online" as a medium rather than a seller; a missing banks and financiers channel; retail vs institutional with fleet owners mislabelled as a channel.
- q04: a gap for financial and occupational declines; "pending over 30 days" as a status rather than an outcome; non-disclosure as a hidden reason.
- q05: claims paid vs incurred; EoM double-counting commission; investment income giving the operating ratio rather than the combined ratio.
- q06: "port" vs "switch" (fresh purchases elsewhere are a gap); grace-period lapse overlapping the destination buckets; a plan change with the same insurer is not a driver.
- q07: the change in unexpired risk reserve already sits inside earned premium.
- q08: prior years' sales vs policies due (single-pay policies have no renewal premium); 13th-month persistency leaves a gap; ULIP top-ups count as single premium.

**Flaw drills.**
- f02 (Beginner): the giveaway "advertising spend" branch was replaced with a plausible not-a-driver branch, "claims paid on term policies".
- f04: the giveaway "Send WhatsApp reminders" L1 node was removed, leaving the subtle retention gap as the only flaw (Intermediate allows 1-2). Mixed-levels is still covered in f07.
- f05: added a hidden overlap ("Higher package rates for common surgeries", same as network tariff increases). The premium branch was relabelled "Premium adequacy per life" so it is less obvious.
- f07: "Blood sugar test retakes" became "Repeat HbA1c tests for borderline results". The giveaway "Commission rate paid to the selling agent" became "Free-look cancellation window", a subtler not-a-driver because the window starts after issuance.
- Decoys added to f03, f04, f05, f06 and f07 (Intermediate and above): two each, with a whyFine line.

**Framework picks.**
- c01: the "growth" distractor was replaced with "turnaround", which a weak candidate would pick on seeing a 109% combined ratio.
- c12: "market-entry", which nobody would pick for a PE stake, was replaced with "profitability". All other picks were checked and kept, as their distractors are realistic.

**Cases.**
- Red herrings added to every Intermediate prompt: c05, assessor vacancies (delays are actually queries and the evening peak); c06, the CEO's faith in a claims app (distribution is the scarce asset); c07, 60% of the book through dealers (changes the go-to-market structure); c08, the partner's push to target high spenders (triggers matter more); c09, the entrant's celebrity TV campaign (the threat is still online and narrow). Common mistakes in c06 and c08 now name the red herring.
- The Beginner cases already tailor beyond the textbook (TP vs OD and reserves in c01, street dogs in c02, the reinsurer constraint in c03, cannibalisation in c04). The Advanced cases already need a quantitative step (loss contribution by line in c10, implied P/E at 94% vs 98% in c11, money multiple at 20% growth in c12), so they were kept.

**Hints.** Hint 1 in all 12 cases now names only the split logic. Several used to list the branches (c06, c07, c09, c12) or give away the decomposition (c01, c02). Hint 3 now shows a less revealing branch: for example, commission rather than claims in c01, required margin rather than the underwriting fix in c10, synergies rather than sustainable earnings in c11, market rather than growth in c12, and the c04 cost-floor formula is no longer handed over.

**Chain drills.**
- v01 replaced: was "where does bank commission sit", which is trivial. It is now a cross-stage symptom: maternity claims spike, caused by a short waiting period chosen in product design (s1), with underwriting as the decoy.
- v03 replaced: it duplicated the value chain's worked example. It is now break-in motor policies after the pre-inspection check was removed: underwriting (s3), with broker and claims as decoys.
- v04: "failed auto-debit" was replaced with the trickier "renewal commission" (s4, not s2), and "surveyor fee" with "salvage recovered" (s5).
- v05 and v06 already put the symptom in one stage and the cause in another; v06 was sharpened as described above. v02 (order) is unchanged and its answer was checked against the stage flow.

## Remaining doubts

- No reliable public source for an active agent ratio or an STP benchmark, so both are qualitative and labelled illustrative.
- The segment ICRs (individual 77.9%, group 92.4%, government 95.3%, FY25) come from an aggregator (Ditto) citing IRDAI. I could not open the IRDAI tables directly, so they are presented as rounded approximations.
- c09: a 30-day pre-existing disease waiting period is legal (IRDAI caps the wait at three years and sets no minimum), but it would be unusually aggressive for a real product.
- f06 now has six margin assumptions; an expert could argue about including "cost of holding required capital", but it is a standard VNB deduction, so it is recorded as a decoy.
- The c11 UK facts (FCA pricing practices rules from January 2022, Ogden rate, 25% corporation tax) match my knowledge but were not re-searched in this session.

## Pass 3: coordinator checks

- **c11:** UK facts web-verified. The FCA pricing practices rules (PS21/5) took effect on 1 January 2022 and ban renewal quotes above the equivalent new-business price through the same channel, for home and motor. The Ogden discount rate for England and Wales moved to +0.5% in January 2025. UK corporation tax main rate is 25%. Clarifying fact 2 now gives the exact date and the same-channel and home-and-motor scope, and labels the "renewers paid about 15% more" figure as a case assumption. Node b3y now reads "Bodily injury reserves (Ogden discount rate, +0.5% since January 2025)". With this, the c11 doubt is resolved.
- **c09:** clarifying fact 3 now states that the 30-day pre-existing disease wait is the entrant's own design choice; Indian retail plans typically use one to three years, and IRDAI caps the wait at three years. With this, the c09 doubt is resolved.
