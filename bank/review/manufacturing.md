# Manufacturing review log

Reviewer pass over /home/claude/bank/out/manufacturing.json. Fixes applied by /home/claude/bank/scripts/review_manufacturing.py (run against the author's original file; the pre-review copy is kept in the session scratchpad). `validate.py` and `validate_manufacturing.py` both pass with no errors or warnings for manufacturing. Ids, counts, difficulty quotas and schema unchanged.

Items reviewed: 34 (12 cases, 7 flaw drills, 8 quick checks, 6 chain drills, plus the value chain). Items changed: 14 (c01, c02, c03, c05, c06, c07, c10, c11, c12, f04, f07, q02, q08, v01) plus the value chain. Items replaced: 0.

## Facts checked against sources

| Claim | Finding | Action |
|---|---|---|
| OBICUS utilisation 74-76% | RBI OBICUS: 74.1, 74.3, 75.6, 77.4, 74.6% for Q1 2025-26 to Q1 2026-27 (seasonally adjusted 74.8-76.3%) | Benchmark widened to approx. 74-77% |
| Manufacturing share of GDP 13-15% | World Bank 13% (2024); old GVA series about 17%; new 2022-23 base series 14.5-16.3% | Reworded to "roughly 13-17% depending on the series used" |
| MSMEs "roughly a third" of manufacturing output | Ministry of MSME (PIB): 35.4% | Changed to "about 35%" |
| Machine-tool consumption ~₹30,000 crore, "more than half" imported (c05) | IMTMA via IBEF: FY26 consumption above ₹35,000 crore, imports about 60-65%; Gardner 2024: consumption $3.6bn, imports $2.1bn (58%) | Changed to roughly ₹35,000 crore, about 60% imported |
| Irrigation pump installed base 3 crore, life 7-8 years, ~50 lakh sales (c02) | MNRE PM-KUSUM material: about 2.2 crore grid-connected and 70 lakh diesel pumps. Shakti Foundation study: about 12 lakh agricultural pumps sold a year in organised data (2011). PM-KUSUM component B: about 8.3 lakh standalone solar pumps installed over the scheme | Base cut to 2.2 crore, life stated as an assumption (~10 years), new grid ~3 lakh and solar ~2 lakh a year given as case facts. Gives ~27 lakh units, ~₹6,200 crore. Still above the organised-sector figure, see doubts |
| Container-glass furnace rebuild €20-40 million (c11) | Stoelzle Częstochowa flint furnace rebuild €45 million; O-I Nové Sedlo €40 million (including two line upgrades) | Raised to "about €25-45 million" and framed as an assumption |
| Captive limestone lease to 2030, then auction (c12) | MMDR Amendment 2015: pre-2015 captive leases extended to 31 March 2030 (or later per other limbs), then auctioned. Confirmed | Kept; date made "March 2030" |
| Auctioned limestone adds ₹150-250 per tonne (c12) | Rajasthan auctions in 2022 drew premiums of about 185-192%; IBM cement-grade limestone ASP about ₹531/t; at 1.3-1.5 t limestone per t of cement this is in a plausible range, but no source states the per-tonne-of-cement figure | Recast as an estimate from the client's mining team given in clarifying facts, not a market fact |
| PLI paid on incremental sales (c10) | Confirmed, PLI for large-scale electronics pays a percentage of incremental sales over a base year for a fixed tenure | Wording tightened |
| Farm holdings ~14 crore (c02 mistake) | Agriculture Census 2015-16: 14.6 crore; 2021-22 figures reported higher | Changed to "roughly 14-15 crore" |

## Changes by item

- **Value chain.** s3 OBICUS benchmark updated (above). `india` paragraph: GDP share and MSME share corrected. Unit economics re-added in Python: lines sum to ₹10,000 EBIT; contribution after variable costs (materials, labour, power, freight, warranty) is ₹27,000. Correct, unchanged.
- **v01** (order). Flow s1 to s6 is defensible, but design-first is a modelling choice rather than a physical flow. I added a sentence to the explanation tying it to the standard primary-activity sequence, so the answer does not look arbitrary.
- **c01** (doubt 5, doubt 6). The root label was 14 words; it is now 12. `pricing` was a distractor even though the case is a pass-through failure, so a coach could reasonably argue for it. I replaced it with `competitive-response`, which is plainly wrong because no rival move is described. The `why` field now says that weak pass-through shows up inside the profitability tree. b1 said "paper used per box" while the tree is per tonne, which is a unit mismatch, so I changed it to "per tonne of boxes" in both the label and hint 3. In the common mistake, "about 5% price" became "price and mix", because the mix shift sits inside realisation.
- **c02** (doubt 1). The installed base and lifecycle were rebuilt as above. I removed the 7-8 year life, which double-counted against the high base. The hypotheses were recomputed: replacement is about 22 of 27 lakh units (81%), and solar is 7% of units and 16% of a ₹6,200 crore value. Hints and tree labels a1x, a1y, a2x and a2y now carry the new figures. The solar price is now stated as excluding panels.
- **c03.** Root label tightened. OEE maths checked: 0.75 x 0.85 x 0.86 = 54.8%, and lifting it to about 66% gives +20%. Correct.
- **c05** (doubt 1). The market facts were corrected. "Avoiding import duty" was risky because India-Japan CEPA has phased duties down on many lines, so the landed-cost saving is now an assumption that covers freight, any duty on finished machines and local parts. Label b1x was updated to match, and the year-four IRR volume is now presented as conditional.
- **c06** (doubt 6). The root label went from 16 words to 12. Arithmetic checked: market growth gives ₹2,308-2,416 crore, a gap of about ₹600-700 crore, and the required CAGR is 14.9%. Correct.
- **c07.** Root label shortened to 12 words. The ₹60 crore price-match cost (405 x 15%) checks out.
- **c10** (doubt 2, doubt 6). The deal assumptions are now explicit case facts: no net debt, so equity equals EV, and a base-case exit multiple of 20x set by the investment committee. I replaced the 30x exit, which a coach would challenge given 31x entry on clean EBITDA. Python check: 60% of ₹8,400 crore is ₹5,040 crore invested, 2.5x is ₹12,600 crore to the fund, and the exit EV is ₹21,000 crore. At 20x that needs ₹1,050 crore of EBITDA, 3.9 times the ₹270 crore excluding PLI. Hypothesis 1, key metric 3, label d2y and the common mistake were all rewritten on that basis. The root label went from 15 words to 12.
- **c11** (doubt 1, doubt 6). The root label went from 15 words to 11. The rebuild cost was revised as above. There was an MECE overlap: a2y "Freeze hiring and discretionary overheads" duplicated b5y "Cut plant and central overheads and staffing" across two L1 branches. a2 is now capex-only (defer growth and non-critical capex, keep critical furnace maintenance), and the overhead cuts sit only under b5y. Arithmetic checked: leverage is 450/40 = 11.25x, the EBITDA needed for 4x is €112.5 million (the tree says "~€115 million", which is acceptable), and four furnaces at 93.75% hold current volume.
- **c12** (doubt 1). The root label was shortened. The limestone cost is now a case fact supplied by the client's mining team. Multiples checked: 10.8x reported, 13.2x normalised, 15.8-18.3x after the limestone cost (the text says 16-18x, which is acceptable). The greenfield premium is ₹2,000 crore.
- **c04, c08, c09.** Checked and left unchanged. c04: the saving is 360,000 kWh x €0.15 x 30% = €16,200, and the 5-point edge over rivals is worth €2,700. c08: 400k points x €180 plus 80k x €400 is about €104 million, and the installed-base share is about 27%, so "about a quarter" holds. c09 is clean.
- **f06** (doubt 3). Kept. EBITDA excludes depreciation by definition, so "depreciation cannot explain an EBITDA fall" is unambiguous. It is fair at Advanced level as the "subtle" flaw because it looks plausible, since a new line is a real event. The b1z overlap (currency cutting across components) is also sound. I checked the rest of the tree for accidental flaws and found none.
- **f07** (doubt 4). The gap is genuine. The parent is "Revenue mix and pricing", its children are new equipment and modernisation, and service is the largest profit pool for elevator makers, so the gap is both MECE-relevant and industry-specific, as the Advanced spec asks. The corrected node did not cover billable repairs, so it is now "Service: maintenance contracts and repairs". The mixed-levels explanation now notes the double count.
- **f04.** The corrected tree had silently dropped "renewables" from a1y. It is restored, so the corrected tree only removes the flagged nodes.
- **f01, f02, f03, f05.** Each flaw is real, correctly typed and correctly placed (gap on the parent, overlap on the redundant node). I found no unlisted flaws.
- **q02.** The correct option had a gap: one-off repairs fell outside both "service contracts" and "Other". The service bucket is now "Service: maintenance contracts and repairs".
- **q08.** The correct option missed unbilled revenue (contract assets), which is material for engineer-to-order firms. Receivables is now "billed, unbilled and retention money" across all options, and the retention distractor is retyped from mixed-levels to overlap. That distractor is a double count, and the distractor reasons are not shown as flaw types elsewhere.
- **q01, q03-q07, v02-v06.** Checked and unchanged. In q01, packing bags are a production-to-dispatch cost, which is acceptable.

## Remaining doubts

1. **c02 market size.** About 27 lakh units a year is still well above the roughly 12 lakh organised-sector sales in the 2011 study. Unorganised supply and rewinds may explain part of the difference, but I could not verify current national unit sales. The numbers are internally consistent and labelled as assumptions, so they work as a sizing exercise. They should not be quoted as market fact.
2. **c12 limestone cost.** The ₹150-250 per tonne of cement is now an assumption inside the case. It is plausible, but I found no source for it.
3. **c05 duty.** I did not confirm the exact current India-Japan CEPA duty on CNC machining centres, so the item no longer depends on it.
4. **c11.** Rebuild costs vary with furnace size, and the €25-45 million range rests on two European rebuilds (one of which included line upgrades).
5. **Value chain margin benchmarks** (aftermarket 35-50% gross margin, EMS 3-8% EBITDA, R&D intensity) are common industry rules of thumb and are labelled as approximate. I did not verify each one individually.

## Pass 2: difficulty (REVIEW.md section 7)

These changes are added in a "PASS 2" block at the end of /home/claude/bank/scripts/review_manufacturing.py, which runs after the accuracy fixes on the author's original file, so none of the accuracy changes are undone. `validate.py` reports 0 errors and 0 warnings. Ids, quotas, flaw-type coverage and quick-check answer positions (0, 2, 1, 3, 2, 0, 3, 1) are unchanged. Flaw items from Intermediate up now carry the new `decoys` field.

### Cases
- **All 12 cases, hints.** All hints were rewritten to the progressive pattern. Hint 1 now gives only the split logic. Hint 2 names only the L1 branches. Hint 3 now opens a less revealing branch: fixed costs in c01, value per unit in c02, yield in c03, our economics in c04, market attractiveness in c05, acquisitions in c06, redeployment in c07, economics in c08, segment definitions in c09, defensibility in c10, funding in c11 and region in c12. Hint 3 previously gave away the decisive branch (c02's replacement maths, c10's PLI split, c11's EBITDA levers).
- **c01, Beginner.** Hint 1 now makes the candidate choose a per-tonne unit, which is the tailoring point. The framework distractors are now turnaround, operations and segmentation, the choices a weak candidate makes after "40% fall", "cost per tonne" and "e-commerce mix shift".
- **c02, Beginner.** Hint 1 now stresses flow versus stock. In the framework pick, growth is replaced by operations, the tempting choice given the capacity decision.
- **c03, Beginner.** In the framework pick, turnaround is replaced by pricing, since rationing excess demand through price is a plausible wrong turn.
- **c05, Intermediate.** Added a structure-changing fact: the distributor contract expires next year, and a direct sales and service company without a plant would cost about ₹40 crore. The candidate must now separate the plant decision from the sales decision. A new node c2z, a third hypothesis and a revised common mistake were added.
- **c06, Intermediate.** Added a red herring: a director's claim of a "₹10,000 crore" EV-charging opportunity, which is a total market, not winnable revenue. The common mistake and the product-launch distractor reason now refer to it.
- **c07, Intermediate.** Added a fact that changes the obvious diagnosis: the client raised distributor prices 6% this year, so part of the 15-18% gap is self-inflicted. A new node a1z and a third hypothesis were added. In the framework pick, market-entry is replaced by operations, the "just cut cost" instinct.
- **c08, Intermediate.** Added that 70% of gearboxes reach plants through machine builders, so their operators are unknown, which changes the addressable-base logic. A new node a1z was added, and hypothesis 1 and the common mistake were updated.
- **c09, Intermediate.** Added a red herring: the sales head's proposal to segment by end industry. The common mistake now explains why that split fails, since oil and gas mixes tender and replacement buyers.
- **c10, c11, c12, Advanced.** These already combined frameworks and required a quantitative step: the PLI-normalised multiple and required exit EBITDA in c10, leverage and covenant EBITDA plus four-furnace utilisation in c11, and the normalised multiple and greenfield premium in c12. The distractors were replaced with tempting wrong choices.
  - c10 now offers ma, the trap of treating a stake purchase as strategic M&A.
  - c11 now offers profitability and operations.
  - c12 now offers pe-dd and growth.

### Flaw drills
- **f03.** Added a hidden overlap: a3 "Orders accepted beyond available machine hours" duplicates a1 "Delivery dates promised without checking capacity". b5 is relabelled "Cutting-tool breakages". Decoys are a2 (an unstable plan is a different failure from an overloaded one) and c2 (OTIF is measured at the customer).
- **f04.** The giveaway "share price reaction" node is gone. The not-a-driver flaw is now b1z "Indian GST on the transformers", which looks like a cost but does not apply because exports are zero-rated. The overlap is now hidden as a1z "Units bought through utility distribution tenders", the same utility demand split by purchase route instead of purpose. Decoys are a2y and b2y.
- **f05.** The giveaway "6205 bearing at one Delhi retailer" is gone. The mixed-levels flaw is now b3 "Discounts offered by premium brands' distributors", which is the step from list to net price inside the premium-brand group. The overlap is reworded as a4 "Value of output forgone while the machine is stopped" against a2 "downtime and repair". Decoys are c2 (channel margins in the price floor) and a3 (genuine-part assurance). In the corrected tree, b1 now reads "net of dealer discounts".
- **f06.** No new flaws. Decoys added: a2y (technology mix drives price) and b3 (warranty provisions behave as a variable cost).
- **f07.** Added a third, hidden flaw: b3z "Cost of idle crews waiting for site readiness" under overheads repeats the "site delays" already counted in installer hours under field labour. Decoys are a2 (modernisation is distinct from maintenance) and b2y (rate versus hours).
- **f01, f02, Beginner.** Left unchanged. Both flaws are plausibly worded (oil and gas pipeline projects, throughput growth with no replacement branch), not giveaways.

### Quick checks
Every wrong option now looks MECE and fails on one subtle point. The correct option is no longer the longest by default.
- **q01.** The parent is now explicitly ex-works. The distractors are a captive power plant (hidden overlap with power and fuel), kiln fuel without electricity (a gap you only see if you know cement uses a lot of power) and outbound freight (outside ex-works). The obvious "variable versus fixed" and "cement price" options are gone.
- **q02.** The distractors are AMCs listed beside aftermarket (mixed levels), domestic, export and aftermarket (a mixed-basis overlap) and order book (not this year's revenue).
- **q03.** The distractors are a gap on rework, start-up rejects (mixed levels) and unscheduled shifts.
- **q04.** The distractors are goods in transit (hidden overlap), a missing stores and spares bucket and slow-moving stock. The silly "inventory days" option is gone.
- **q05.** The "diesel price" option is replaced by inbound freight on coal and limestone, a not-a-driver that looks like freight.
- **q06.** The distractors are a dealer-only replacement channel, which misses direct rate-contract users such as Indian Railways and steel plants, and sales to OEMs' spare-parts divisions (hidden overlap). The silly "average price" option is gone.
- **q07.** The "steel and copper prices" overlap is replaced by "discounts and rebates", which sit inside realised price.
- **q08.** The "capex" option is replaced by bank guarantees, a contingent liability. The correct option is shortened.

### Value-chain drills
- **v02.** The trivial cost-line lookup (technician salaries go to service) is replaced by a cross-stage symptom: dealers lose orders while the plant holds stock, so the cause is warehouse replenishment in s4, not sales.
- **v03, v05, v06.** These already put the symptom in one stage and the cause in another, so they are unchanged. v01 (order) and v04 (assign) are unchanged.

### Doubts from pass 2
- **f04, b1z.** The GST point relies on exports being zero-rated, which is correct. A candidate might argue that input GST credits affect cost, but those are refundable, so the flaw holds.
- **q06.** The gap depends on knowing that large industrial users buy replacement bearings direct. That is fair at Intermediate level but makes the item knowledge-dependent.
