# Education review log

Source: `review/education.orig.json` (author build, backed up before review). Fix script: `scripts/review_education.py` (reads the backup, writes `out/education.json`, safe to rerun). `validate.py`: 0 errors, no education warnings. All case and value-chain arithmetic re-run in Python.

Reviewed 34 items: value chain, 12 cases, 7 flaw drills, 8 quick checks, 6 chain drills. Changed 18 (value chain, 11 cases, 4 flaw drills, 2 quick checks). No item replaced wholesale. One flaw node was replaced (f06 b5).

## Facts verified (web, October 2026)
- NEET-UG registrations: 22.8 lakh in 2026 (22.76 lakh 2025, 24.06 lakh 2024). "About 23 lakh" in c02 stands.
- UGC online degrees: the 2020 ODL/Online Regulations (as amended) still use NAAC 3.26+ or top-100 NIRF in two of the last three years. NAAC began moving from CGPA grades to binary accreditation with maturity levels in 2025.
- Coaching guidelines (MoE, Jan 2024): registration, no enrolment under 16, pro-rata refund within 10 days. They are advisory to states. Rajasthan's 2025 Act requires registration and 10-day refunds but has no under-16 bar.
- Foreign campuses (UGC 2023): top-500 overall or subject rank, own fees (transparent, reasonable), repatriation under FEMA, no online or ODL, 10-year approval, two years from approval to set up the campus. No rule found that bars collecting fees before approval. The first campuses (Southampton, Gurugram, 2025) are now open.
- Indians abroad (MEA, 1 Jan 2025): 18.8 lakh in total, of whom about 12.5 lakh are at universities. The "13 lakh" figure was the 2024 total.
- Dubai KHDA: the ECI for 2025-26 was 2.35%. A school that keeps its rating may raise fees by up to the ECI, one that improves by up to 2x ECI, and one that declines gets no increase. All private school fees were frozen for 2026-27 (announced 22 May 2026). The 2027-28 mechanism is not yet announced.
- CBSE Class 12 pass rate was 85.2% in 2026. Also confirmed: CBSE section cap of 40, RTE primary PTR 30:1, RTE 25% reservation with reimbursement at the lower of the state per-child cost and the school fee, 18% GST on coaching, NEP target of 50% GER by 2035.

## Value chain
- s5 KPI "Pass rate": the benchmark "high-80s to low-90s" was out of date. It now reads "roughly 85-93% in recent years (85.2% in 2026)".
- s5 KPI "Accreditation grade" renamed "Accreditation status". The formula now notes NAAC's 2025 move to binary accreditation, and the benchmark restates the UGC online test exactly (3.26+ or top-100 NIRF in two of three years). The past-tense wording was misleading.
- India paragraph: added that states adopt the coaching guidelines unevenly (Rajasthan's 2025 law has no age bar), and that the guidelines also require pro-rata refunds.
- Worked example was internally inconsistent. Fees +8%, enrolment -3% and costs "barely moved" would raise the margin, not cut it by 4 points. Rebuilt on numbers checked in Python: 1,500 students a school, seniors paying 50% more, fees +8%, entry +20, Class 11 -53 (re-enrolment 85% to 55%), costs +9%. That gives fee income +4.1% and margin 22% to 18.3%; had the seniors stayed, the margin would have been 22.2%. The causal chain is unchanged (symptom in s6, cause in s4).
- Author doubt 4 (approximate benchmarks): every estimated benchmark (content cost, publisher EBITDA, capex per seat, agent commission, conversion, CAC, fill, staff cost, surpluses, re-enrolment) is plausible and stays labelled approximate. Benchmarks given as hard facts (section cap 40, RTE 30:1, CBSE pass rates, UGC test) were verified or corrected above. Unit economics add up: ₹16,000 surplus, 20.5% of ₹78,000.

## Cases
- c01: no change. All figures reconcile (fee income ₹174 to ₹186 crore, costs ₹133 to ₹157 crore, realised tuition per student +4.2%, about ₹6 crore of dilution, pay revision about 14%).
- c02: hint 1 named both L1 branches, so it now gives only the volume-times-price logic. Distractor growth replaced by market-entry (a PE fund "looking at test-prep" invites it). Harder.
- c03: hint 1 named all four L1 branches; rewritten. Distractor growth replaced by profitability (break-even tempts weak candidates). Harder.
- c04: hypothesis 1 was numerically wrong. Rework averages about 4 days per file (40% x 2 x 5), not 10, and the interview applies only to screened files. Rewritten so that queueing under a 35% peak load explains the rest. Hint 1 named L1; rewritten. The metric is relabelled first-year tuition. Harder.
- c05: "Services sold to the trusts" sat under "Existing 22 schools (~₹126 crore)", but the ₹126 crore covers fees and rent only, and the node overlapped in kind with adjacent offers. Moved to a renamed L1, "New services and adjacent offers". Hints 1 to 3 updated. Harder.
- c06: "13 lakh abroad" changed to 12.5 lakh at universities (MEA 2025). The invented "no fee collection before approval" rule is replaced with the real two-year set-up window, and the hypothesis and common mistake are updated to match. Hint 1 named L1. Distractor growth replaced by product-launch. Harder.
- c07: hint 1 named L1; rewritten. Distractor growth replaced by profitability. Harder.
- c08: the case named Rajasthan as enforcing the under-16 bar, which Rajasthan's 2025 Act does not contain. The states are now unnamed ("two north Indian states") and the bar is stated as an assumption. Hint 1 named L1. Harder.
- c09: hint 1 named L1 and L2; rewritten. Distractor market-entry replaced by operations (low conversion looks like a funnel process problem). Harder.
- c10: the EBITDA bridge did not reconcile. Fifty "typical" owned centres earn ₹3.3 crore, but the bridge and hypothesis need ₹5.6 crore. Owned centres are now stated as larger (about 100 children each, about ₹28 crore in fees), which also matches the hypothesis of about 55,000 children. The bridge now gives ₹35.96 + 5.6 + 10 - 25 = ₹26.6 crore, the transition cohort is about ₹4.1 crore, and about 3,020 centres are needed. "The state" changed to "several states" (a 900-centre network). The L1 "Network economics" is renamed "Growth engine to exit" and its L3 relabelled so it no longer repeats the royalty and kit nodes of a1. The hypothesis now says "at today's fees". Hint 1 named branches, and hint 3 showed a revealing branch; it now shows market headroom. Harder.
- c11 (author doubt 5): the 60% to 75% fill lift is now a stated case fact (collections rise in proportion, costs almost flat). All cash figures re-verified (₹14.5 crore burn, ₹204 crore left, 14 months, ₹4.5 crore). Hint 1 named L1. Distractor growth replaced by pricing. Harder.
- c12: fee facts updated. Fees are frozen for 2026-27, the ECI was 2.35% in 2025-26, an improved rating allows up to 2x ECI, and the case assumes ~2.4% from next year. The 800-seat expansion appeared both in standalone (b1y) and in client upside (c2x), an overlap; b1y now reads "no expansion in seller's plan". Hint 1 named branches. Harder.

## Flaw drills
- f01, f02, f05: no change. Each flaw is unambiguous and no unlisted flaw was found.
- f03: "Commissions on subscriptions sold" could be read as third-party affiliate commissions, which would not be an overlap. It now reads "Commission per subscription closed in-house", and b2y reads "Counsellor (sales team) pay". The decoy moved from b2y (no longer subtle) to a2y (discounts).
- f04: "A Dubai institute's NEET results" sat wholly inside "Local coaching institutes", so overlap was a defensible answer. It is now "Rivals' JEE and NEET selection results", an attribute that cuts across every competitor category, so the type is unambiguously mixed-levels. The corrected tree carries the attributes under b1 and b2.
- f06 (author doubts 1 and 2):
  - Doubt 1: b5 "Kota star-faculty bonuses" was a strict subset of b1x Faculty pay, so it could be graded as either overlap or mixed-levels. It is replaced by a4 "Advance fees collected for next year's batches", an unambiguous not-a-driver: deferred revenue cannot move this year's operating loss. Mixed-levels is still covered by f04.
  - Doubt 2: the refunds gap is now unambiguous. The root says operating loss, and the volume nodes say "admitted", so admissions x fee is clearly gross of pro-rata refunds.
  - b2x "Performance marketing" omitted brand advertising, an unlisted gap; it now reads "Advertising and lead generation". Head office is renumbered b5, and a second decoy was added (a2x). Harder.
- f07 (author doubt 3):
  - Waiting list vs applications per seat was arguable, since a waiting list can signal committed demand. b3 is now "Applicants turned away for lack of seats", which is applications minus seats and so a pure restatement.
  - The fee-income and willingness-to-pay overlap is fixed. b is now "Room to raise fees without losing students" and owns the attrition risk. d is now "Income at the proposed fee" with d1 "Students on the roll", which is pure arithmetic and makes the RTE gap bite (all students x fee overstates income).
  - A third decoy was added (b4). Harder.

## Quick checks
- q02: option 4 ("Number of students using transport") was an obvious misfit. It is replaced by a hidden overlap: "Road tax and fitness certification" sit inside "permits". Harder.
- q04: option 3 failed twice (an overlap plus a missing advertising line). The advertising line was added so it fails on one point only.
- Others unchanged. Correct positions are spread evenly (0, 1, 2, 3 twice each), and the correct option is never the longest by default.

## Chain drills
- No change. All four locate drills put the symptom in one stage and the cause in another, the order answer matches the stage order, and the assign items are on the right stages.

## Section 7 check
After the changes, every hint 1 gives split logic only, every hint 2 names L1 only, and every hint 3 shows a non-decisive branch. All Intermediate cases have a red herring, all Advanced cases combine frameworks with a quantitative step, and all Intermediate and Advanced flaw drills have decoys.

## Remaining doubts
- f07: an expert could call d1 "Students on the roll" a wrong node rather than a gap. Gap is kept because the fix adds a missing segment (RTE seats).
- f06: the corrected tree shows refunds as a deduction line next to the two segment lines (gross by segment, less refunds). This is standard P&L layout but mixes bases at L2.
- c12: the 2027-28 Dubai fee mechanism is unannounced, so ~2.4% a year is an explicit assumption.
- c10: exit maths uses today's fees and costs, so fee inflation would lower the number of centres needed. This is stated in the hypothesis.
- NAAC's transition timetable is not fully confirmed; the wording is generic.
- q01 and q06 option 4 are the easiest distractors left, but each is a real candidate error and was kept.
