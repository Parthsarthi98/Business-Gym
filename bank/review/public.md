# Review log: public (public sector / social impact)

Source check: rebuilt `scripts/build_public.py` into the scratchpad. The output was byte-identical to `out/public.json` (md5 3475244...), so the interrupted reviewer had not edited the file. Backed up to `review/public.orig.json`. All edits are in `scripts/review_public.py`, which always reads the backup and writes `out/public.json` (rerun twice, same result). Arithmetic is asserted inside the script. validate.py shows 0 errors and no public warnings.

Items reviewed: 34 (12 cases, 7 flaw drills, 8 quick checks, 6 chain drills, plus the value chain). Changed: 29 (12 cases, 6 flaw drills, 8 quick checks, value chain). Replaced: 0 whole items; all 8 quick-check option sets were rewritten. Chain drills unchanged.

## Facts checked (web, October 2026)
- PM POSHAN material (cooking) cost: ₹6.78 per meal for Bal Vatika and primary, ₹10.17 for upper primary, from 1 May 2025 (up from ₹6.19 and ₹9.29). I found no later revision. The author's ₹6.20 was the pre-May 2025 rate. The centre pays 100% of foodgrain and transport cost.
- FCI economic cost of rice: ₹4,035.9 per quintal (2025-26 RE), ₹4,391.1 per quintal (2026-27 BE). Unit economics now uses about ₹44/kg. The author's ₹39 was stale.
- Cook-cum-helper honorarium: ₹1,000 a month minimum (states may top up). Engagement norm is 1 CCH for up to 25 students and 2 for 26-100, so ~40 children per cook is a better average than the author's 25. MME is 2% of grain, transport and cooking cost. "Transport and management ~3%" is labelled approximate.
- Out-of-school definition (MoE/Samagra Shiksha, as quoted in Delhi DoE circular 2022): age 6-14 and never enrolled, or enrolled and absent 45+ days without intimation. Used in q02.
- Other benchmarks (fund utilisation, release lag, EPC margins, vacancy rates, cost recovery, coverage and exclusion errors, grievance times) were already labelled approximate. I kept them as approximate.

## Value chain
- unitEconomics: cooking cost ₹6.20 -> ₹6.78 (verified), grain ₹39/kg -> ~₹44/kg (verified), cook ratio 25 -> ~40 children, overhead ~5% -> ~3%. The new total of ₹1,356 + ₹880 + ₹250 + ₹75 = ₹2,561 is checked in Python, which gives ≈₹12.80 per meal.
- profitPools: dropped the unverifiable claim that DBT "has cut cost per beneficiary more than procurement savings". It now says targeting and DBT are usually the larger savings levers.

## Cases
- c01: a1 (own tax revenue) had a property-tax-only decomposition under a node that also held advertisement tax. Now a1 is property tax and a2 is other own revenue, which is MECE. Hint 2 no longer names L2. In frameworkPick, market-sizing (not a plausible pick) became pricing (the weak candidate's "raise taxes" reflex).
- c02: arithmetic verified (15.5 lakh girls, 16.75 crore pads, ₹46 crore, 2.42x overstatement). Hint 1 no longer names branches. Hint 3 moved off the main eligibility chain.
- c03: a1 relabelled "Avoidable patient volume" (its children were only the avoidable part). Hint 1 is now the queue logic, hint 2 is L1 only, and hint 3 moved off the doctor bottleneck. In frameworkPick, growth and market-sizing became segmentation and turnaround (plausible weak picks).
- c04: hint 1 named all four branches. It now gives only the logic. Funded cost of ₹1,250 per child verified.
- c05 (doubt 2): arithmetic verified (average fare ₹31.80, fare revenue ₹580 crore, segment revenues ₹361/164/55 crore). Tree rebuilt: "fare headroom" and "riders retained / price sensitivity / share shifting" were the same quantity counted twice. Each segment is now extra revenue per retained trip plus trips lost by destination. The new branch "moved to off-peak (revenue stays on metro)" adds a real cross-segment effect. L3 now sits on 3 of 6 L2 nodes. Hypotheses were redone on an equal-revenue basis (constant-elasticity assumption stated in the key metric):
  - a peak-only rise of 34% (₹36 to ₹48) raises ₹90 crore and loses 6.8% of peak trips (~18,700 a day, 3.7% of all trips);
  - a uniform rise needs 27.4% and loses ~35,600 trips a day (7.1%);
  - a 20% concession rise yields at most ₹10.9 crore.
  The author's comparison of a 35% peak rise with a 30% flat rise mixed revenue levels. A red herring was added (non-fare income grows only ₹3-4 crore). Hint 3 moved to the off-peak branch.
- c06: 11 vs 30 admissions per 1,000 families was unrealistically low (national PM-JAY use is roughly 100 per 1,000 families a year, approximate). It is now 35 vs ~100, with a target of 70. a1 ("awareness of eligibility") and b2 ("knowledge that care is free") overlapped, so they were merged into a1 and b2 removed. Hint 3 moved to the admission branch, and hint 1 no longer names stages.
- c07 (doubt 1): reads as a genuine public-sector product launch, with no EU facts involved. The treasury cap arithmetic is verified ($108m at a $3 average match; $180m if everyone maxed). Branch c mixed channels with a retention lever (mixed levels), so it is now split into enrolment channels and keeping workers contributing. Hypothesis 1 now says 5 to 7.5 million accounts (it said "6 million or more"). Hints 1 and 3 fixed.
- c08: ₹1.71 lakh per sustained job verified. b2 "earnings gain" overlapped b1 "employment gain" and is now "wage uplift for those employed versus outside option". Hints fixed. In frameworkPick, market-sizing became profitability (cost-per-job reflex).
- c09 (doubt 1): this is a genuine public-sector case (state-owned incumbent after EU open access). One EU fact was wrong: predatory pricing is a competition-law (abuse of dominance) matter, not something the rail regulator reviews. Constraints are reworded to competition law plus fully allocated peak paths, and the entrant is stated to run in off-peak paths (consistent with b3). Under EU rules regional services are compensated through public service contracts, so the objective now reads "fund regional services beyond what the PSO contract compensates". Arithmetic verified (€357.5m leisure, €54-72m at risk, €195m for a blanket cut). Hints 1 and 3 fixed and common mistake 2 corrected.
- c10: billed ₹108.4 crore and collected ₹80.2 crore verified. Collection +₹15.2 crore, arrears third ₹46.7 crore (stated as ~₹47, was ~₹45), tariff +20% gives ₹19.1 crore. Hint 3 moved from the revealing billing branch to the cost branch, and hint 1 no longer spells out terms.
- c11 (doubt 2): figures verified in Python. EBITDA ₹57.6 crore and EV ₹806 crore. Receivables at 230 days are ₹201.6 crore against ₹105.2 crore at 120 days, so the release is ₹96.4 crore. Sessions 16 lakh/yr (2.2 per machine per day). Assumptions are now stated (EV for a debt-free business, no debt financing, no interim cash). The new valuation hypothesis says a 25% IRR needs a 3.05x exit value (₹2,461 crore), so EBITDA ~₹176 crore at a 14x exit (25% CAGR, about 48 lakh sessions). Margin hypothesis made precise: 12-15% lower rates on the re-tendered 40% gives 13.9-12.8% margin, before cost inflation. Revenue per machine is replaced by required exit EBITDA as a key metric. Hints 1 and 3 fixed.
- c12: added the client's field payroll (₹45 crore) so the Advanced case has a quantitative step. Levelling to the target's pay costs ₹15 crore against a ₹2.9 crore admin saving. Funding at risk split into ₹27.3 crore total, ₹18.9 crore from the two foundations and ₹8.4 crore other foreign. FCRA 2020 bar on transfer is correct. Hint 1 fixed.

## Flaw drills
- f01: unchanged (Beginner, single clear gap).
- f02: d1 lacked general operating grants, an unlisted gap, so it now reads "State payments (concession reimbursement, operating grants)". d3 broadened to property and other income.
- f03: added decoys b2 (workshop labour vs crew) and d1 (depreciation and interest).
- f04: added decoy b1.
- f05: "medical oxygen" under utilities overlapped drugs and consumables (oxygen is a drug), an accidental second overlap, so it moved to a2 as medical gases. a5 "minor repairs" was ambiguous against equipment maintenance and now reads in-house repairs. "Total cost" now reads inpatient cost with allocated shared costs, to match the per-inpatient-day root. Decoys added for b2 (ALOS) and a1y.
- f06: root shortened to 12 words. Decoys added for c1z and d1.
- f07 (doubt 4): the bitumen gap is kept and made unambiguous. The root now says "bituminous rural roads" (12 words), and the explanation says why diesel and machinery hire do not cover bitumen. c3 relabelled. Decoys added for a3 (bundled maintenance) and b5 (GST).

## Quick checks (all 8 option sets rewritten for section 7; correct positions unchanged)
- q01: wrong options are now a smart-card top-up overlap, a gap on passes and a mixed basis on new routes. The diesel distractor is gone. The correct option now includes state operating grants, since it previously had a gap.
- q02: rebuilt on the official 45-day definition. The old correct option ("never enrolled / dropped out") misses children still on the roll but absent 45+ days. That is now a distractor.
- q03: wrong options are now an untied-funds source/use overlap, a gap on NHM contractual staff and a fixed/variable mixed basis.
- q04: wrong options are now an eKYC overlap, a gap on pending applications and a gap on payments never sent (PFMS/treasury).
- q05: PTR mixed levels kept. Added a Samagra Shiksha source/use overlap and a contract-teacher gap.
- q06: wrong options are now a gap on central transfers and assigned taxes, an overlap on arrears recovered and a non-revenue item (bond proceeds as a capital receipt).
- q07 (doubt 5): the old correct option was arguably incomplete. It ignored revenue effects on other paying riders, and "fares" omitted pass and concession reimbursement. The new parent is "compensation for actual loss". The correct option is revenue lost on women's pre-launch trips + net fare change from other riders + extra running cost of induced trips + net administration. Each wrong option fails on one point: induced trips counted at fare value and at cost (overlap), single tickets only (gap), and the full rather than incremental route cost (mixed basis). Exactly one option is MECE.
- q08: wrong options are now a hidden overlap (cost per patient started x patients started), a gap on Nikshay Poshan nutrition support and a mixed basis (notified volume with a success rate on patients started).

## Made harder (section 7)
All cases (hints de-revealed; c05 red herring; c11 and c12 quantitative steps; c09 constraint reframed), f03-f07 (decoys), q01-q08 (subtle distractors).

## Remaining doubts
- c06 benchmark (about 100 admissions per 1,000 families a year in strong districts) is my estimate from cumulative PM-JAY admissions and is not separately verified. It is presented only as case data.
- q03 and q05 gap distractors rely on NHM contractual staff and contract/guest teachers being material in many states. Both are true broadly but vary by state.
- c09 comparable-route share (15-20% of leisure) is given as case data, not as a claim about a named route.
