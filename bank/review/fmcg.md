# FMCG review log

This review follows REVIEW.md, including section 7 (difficulty). Every item was reviewed: the value chain, 12 cases, 7 flaw drills, 8 quick checks and 6 chain drills.

## Provenance
- There was no `scripts/review_fmcg.py`, no `review/fmcg.orig.json` and no other fmcg backup anywhere on disk. A fresh run of `scripts/build_fmcg.py`, redirected to the scratchpad, was byte-identical to `out/fmcg.json` (md5 4152b094…), so the interrupted reviewer had applied no edits.
- That file was backed up to `review/fmcg.orig.json`.
- `scripts/review_fmcg.py` always reads the backup and writes `out/fmcg.json`. It is rerun-safe (two runs give the same md5) and asserts on the source text before each edit.
- `validate.py` gives 0 errors and 0 warnings. A stricter scratch check also passes: label lengths, depth and L3 quotas, flaw counts per level, decoys on Intermediate and Advanced drills, 3-4 clarifying facts, no dashes, no hype words and no US spellings. The output was copied to `final/fmcg.json`.

## Facts checked (web, October 2026)
- **GST after September 2025.** Shampoo, toothpaste, toilet soap, hair oil, toothbrushes and talc went from 18% to 5% on 22 September 2025. Biscuits, cornflakes and cereal flakes, processed tea and edible oils are at 5%. **Detergents and washing preparations stayed at 18%** (ClearTax rate list; Wikipedia GST 2.0). That made c07 wrong: the dishwash liquid used 5%. c07 is rebuilt at 18% (see below). The `india` text now names what moved to 5% and says detergents and dishwash stayed at 18%. The value-chain unit economics (a personal care product at 5%) is correct as written. c03 muesli at 5% is a case fact and consistent with cereal flakes at 5%.
- **Kirana count and general-trade share.** Redseer (March 2026) gives 13-14 million kiranas, with traditional trade at about 85-90% of mass grocery. HSIE/Nielsen (via HDFC Sky, September 2026) puts e-commerce at 8-15% of listed companies' domestic revenue and 7% of urban grocery. So "about 1.2 crore" was the low end and "roughly 70% general trade" was too low. The text now reads "roughly 1.2-1.4 crore" and "about 75-85% by most estimates (approx.)". Rural at 35-40% is confirmed (KPMG: 38% in FY25).
- **UK HFSS (c08).** England's placement rules (checkouts, entrances, aisle ends, online equivalents; stores with 50+ staff and at least 2,000 sq ft) have applied since October 2022. England's multibuy restrictions have applied since October 2025, and the TV and paid-online advertising restrictions since 5 January 2026. Wales's placement rules started on 26 March 2026 and Scotland's promotion and placement rules on 1 October 2026. HFSS status still uses the 2004/05 nutrient profiling model. In January 2026 DHSC said it intends to move to the stricter 2018 model, with no date. Savoury snacks are an in-scope category. The c08 fact now says the client's protein recipe passes the current model, and the stricter model is used as a risk.
- **CIB&RC.** The full name is now given (Central Insecticides Board and Registration Committee). The 2-3 years is kept as an interviewer-supplied fact ("typically").
- **Toothpaste market (c02).** Published estimates range widely (IMARC gives about USD 740m at manufacturer level). The ₹10,800 crore retail estimate is a plausible top-down result and is kept as an estimate, not a market fact.

## Author's doubts: resolution
1. **GST, kirana, HFSS.** Resolved as above. The GST doubt turned up a real error in c07 (dishwash is at 18%).
2. **c01 hypothesis 1 rounding.** It was not exact. "Removed about 5 points of margin" mixed ₹ per ₹100 of old sales with margin points, and it ignored the operating leverage of 4% volume growth. Once fixed costs are spread over more volume, tea and price explain only 11.0% to 9.7%. The case is rebuilt with stated facts (cost lines per ₹100, fixed costs unchanged, a pack-mix shift). Python gives 11.0% to 9.68% (tea, price and volume) to 8.01% (pack mix). The hypotheses state exactly that.
3. **Deal maths in Python.**
   - c12: EV ₹2,016 crore = 750 debt + 1,266 equity. Base case: revenue ₹1,032 crore, EBITDA at 14%, 12x exit, so (1,734 - 500) / 1,266 = 0.97x. Upside: 18% margin and 16x, 1.95x. Management's plan implies 25.3% a year for vaporisers and sprays. All match the text. "Net debt about ₹500 crore at exit" is now stated as holding in any realistic case, since every return relies on it.
   - c10: The valuation inputs (plan, downside, 25x, 13%) appeared only in the hypothesis, so a candidate could not reach it. They are now a clarifying fact. Plan: ₹180 crore x 25 / 1.13^5 = ₹2,442 crore. Downside: ₹814 crore. The plan implies a 27% CAGR. The hypothesis notes that the value is before funding interim losses.
   - f07: it had no seasonality figures to verify. I added none, because I could not confirm Indian ice-cream seasonality shares. Seasonality now sits inside "Litres sold per outlet per year".
   - Also verified in Python: c03 (floor ₹221.7, 55.5% margin at ₹299), c04 (₹841.5 crore, gap ₹358 crore, 14.9% CAGR), c05 (₹13,300 crore, 3.76%; implied dog growth 12.5%), c06 (square-root pooling gives 34.5%), c08 (£2.18m a year, 5.5-year payback), c09 (₹1,222 a month, 30.6 and 20.4 cases) and c11 (₹90.4 + 76.8 + 51.2 = ₹218.3 crore; COGS ₹1,868 crore). The unit economics lines sum to ₹16.2 EBITDA on ₹78.2 net sales (20.7%).
4. **f07 and f06 overlaps.**
   - f07: the capabilities overlap was ambiguous, because an expert could flag d, d1 or d2. It was also not hidden, since the wording was nearly the same as b2. It is replaced. The new overlap is "Share it can win in its states" listed beside outlets x litres per outlet: the same volume estimated top-down and bottom-up, which is one node and unambiguous. The original tree had this double count in a weaker form (share and outlets as children of volume) as an unlisted flaw.
   - f06: the overlap was clear but given away by "spend paid to retailers". It is now unambiguous because a2y defines trade spend as "schemes, listing and display payments", and it is hidden because the overlap node is "Gondola-end and shelf-strip rentals". The packaging gap could have been flagged at b1 ("Raw materials" can include packing material), so b1 is now "Chemical inputs" and the gap sits clearly at b.
5. **Beginner flaw drills.**
   - f01's overlap ("Number of units sold" next to "Volume sold") was a giveaway. It is now "Distribution and throughput" (outlets x litres per outlet), the same volume in different words. This is fair for a Beginner who knows that revenue = volume x price.
   - f02's root now states its scope ("excluding trade margins"), so trade margins cannot be argued as a second gap. "Plant labour and power" is now "Plant conversion (labour, power, upkeep)", which closes an unlisted depreciation gap.

## Changes by item

### Value chain
- s3: conversion cost formula bracketed. The benchmark is restated as "equivalent to about 4-8% of net sales", because the KPI is per unit.
- s4: C&F commission softened to "a few per cent" (unverified figure). Network inventory days are now on cost of goods sold, which matches inventory held at cost.
- profitPools: leading HPC EBITDA restated as 20-30% (one leader is above 30%).
- india: kirana count, general-trade share and GST corrected as above.

### Cases
Hint pattern across all 12: hint 1 named the L1 branches in every case, and hint 3 usually showed the most revealing branch. Every hint 1 now gives only the split logic, every hint 2 only L1, and every hint 3 a non-decisive branch.

- **c01 (made harder).** Facts rebuilt so the arithmetic is exact. The twist is that the obvious cause (tea) explains less than half the fall and pack mix explains the rest. Hypotheses and commonMistakes were rewritten, the a3y label was made specific, and the pricing distractor reason updated.
- **c02.** Hints only, plus L3 under urban price per gram (premium share, pack size).
- **c03.** Hints only; the numbers check out.
- **c04.** The "new states" branch held exports, so it was relabelled "new markets". Hints updated.
- **c05 (made harder).** Added the segment facts that hypothesis 2 needed (cat food is 20% of value and growing 25%), plus a red herring (dog food is 70% of the client's global sales). Facts merged to keep four. Hypothesis 2 and commonMistake 2 rewritten.
- **c06 (error, made harder).** The €135m cash prize valued inventory at sales; at cost it is about €75m (COGS €2.5bn). The inventory-days KPI is now on COGS. Added a red herring (full warehouses, a proposed fifteenth) and a hypothesis that rejects it. Excess-stock L2 labels separated, because the old "discontinued" overlapped "above target cover".
- **c07 (factual error).** GST is 18%, not 5%. New facts: net realisation about ₹78, variable cost ₹48, contribution about ₹30. Matching at ₹85 leaves about ₹12.5, so the cut gives away about ₹18 a pack and needs about 2.4x volume (+142%) to break even. The hypothesis, key metric, commonMistake and c1x/c1y were updated.
- **c08 (updated facts, made harder).** HFSS fact updated. Facts merged to four. Hypothesis 2 now hedges against reclassification. A "Regulatory position" branch was added under "can win", and b2y was relabelled so it does not overlap it. commonMistake 2 rewritten.
- **c09 (MECE error, made harder).** "Cooler filled with rival brands" sat under cost but is a loss of benefit, so it moved to uplift (a2z). The cost branch is now damage, loss and repairs. Added a red herring (regional heads want an equal split). Facts merged to four.
- **c10 (missing facts).** Valuation inputs added as a clarifying fact, the founder fact merged, and hypothesis 2 rewritten with the CAGR and the interim-loss caveat.
- **c11.** Payables days now say they are on cost of goods. Hypothesis 3 now quantifies the six-month cash burn (about ₹11 crore).
- **c12.** Format facts merged to keep four. The net-debt assumption is made explicit and CIB&RC is named in full.

### Flaw drills
- **f01 (Beginner, rebuilt, made harder).** The overlap is now hidden as outlets x throughput. Price per litre gained a pack-mix node, which closes an unlisted mix gap in the original, and a decoy was added.
- **f02 (Beginner).** Root scope stated, an unlisted plant-depreciation gap closed, and the explanation sharpened.
- **f03 (rebuilt, made harder).** The giveaway L1 "Rival brand's new TV campaign" became an L2 sibling of the sales-per-outlet components ("Rival's March launch of a ₹10 cup noodle"). The unclear "New outlets not yet covered" was fixed, as "New outlets added", which is now the decoy. Spend per shopper gained L3.
- **f04 (replaced, made harder).** "Is the client's logo modern enough?" was the giveaway REVIEW.md bans. It is replaced by a plausible not-a-driver, "Share of India's coffee grown in Karnataka". The decoy is cooler coverage. A canning-capacity node was added so "can win" has no gap.
- **f05 (unlisted flaws fixed, made harder).** Primary freight per case was missing trip distance, an unlisted gap, so cost per trip now includes it. "Rent and handling per case" next to "Number of depots" double counted, an unlisted overlap, so the depot branch is now fixed depot cost (depots x cost each), cases handled and variable handling. Cases handled is the decoy. The listed gap (depot-to-distributor freight) is unchanged.
- **f06 (rebuilt, made harder).** Overlap hidden and unambiguous, gap parent unambiguous (see doubt 4). Gross price is now defined at MRP excluding GST, so GST cannot be argued as a gap. "Overheads" containing advertising was relabelled. Two decoys added: capacity use and pack mix.
- **f07 (rebuilt).** New hidden overlap (see doubt 4). The cold-chain gap is kept, and d1y now includes plant cost so that gap is the only one. A joint-venture entry mode and ongoing advertising were added to avoid unlisted gaps. The decoy is vegetable-oil frozen desserts.

### Quick checks
All eight option sets were rebuilt. Every option set had at least one giveaway, such as "Volume sold, Advertising spend", "Shelf position in stores" as a cost, "Men, Women, Students", ages with an obvious hole, "Outlets, Distributor margin" or "Taxes, Margins in kirana". Every wrong option now looks MECE and fails on one named point. The correct option is not the longest; in several items another option ties it in length. Correct positions are 2,0,3,1,2,0,3,1.
- q01: penetration double count, MRP instead of net price, and a pack split mixed with a channel split.
- q02: freight gap, materials inside "variable costs", and packaging inside plant materials. The correct option is now a value-chain cost split.
- q03: the parent is now "this year's buyers". Wrong options: sachet and bottle buyers overlap, a frequency-band gap, and lapsed buyers who are not buyers. The correct option is sole versus repertoire buyers.
- q04: weighted distribution double count, weighted distribution x outlet count on a mixed basis, and a gap from outlets supplied only by wholesalers.
- q05: the obvious two-margin gap was replaced by a subtle one, with distributor schemes missing.
- q06: penetration without the household base (gap), churn missing (gap), and share gain double counted.
- q07: the obvious "Taxes, Margins in kirana" was replaced by GST only on the brand's invoice, missing GST on the trade margins. "Trade spend" became "Total trade spend" so the overlap is unambiguous.
- q08: the parent "shelf stock" was relabelled "stock". Wrong options: an in-transit overlap, a transit gap, and mixed units (tonnes against days). The correct option is the short ownership split.

### Chain drills
- v01 (made harder): the symptom shows up in the plant's cost per tonne (s3) but is caused in sourcing (s2).
- v05: the explanation now covers the distributor margin saved on direct supply.
- v06 (made harder): the easy plant power bill and C&F commission were replaced by a co-packer conversion fee (s3, not sourcing) and C&F-to-distributor freight (s4, not secondary).
- v02, v03 and v04 are unchanged: they are correct, and v03 and v04 already have the symptom in one stage and the cause in another.

## Items made harder (section 7)
All 12 cases (hints). Red herrings or twists in c01, c05, c06, c08 and c09. All 7 flaw drills, with decoys on f01 and f03-f07. All 8 quick checks. Chain drills v01 and v06.

## Remaining doubts
- The general-trade share (75-85%) is a range across sources with different bases (mass grocery against all FMCG); it is labelled approximate.
- The c08 HFSS position is correct as of October 2026, but the switch to the 2018 nutrient model has no date. Wording that relies on "the current model" will need a check once it is adopted.
- f03: a strict reader could call b3 an overlap with b1 rather than mixed-levels. The explanation states both facts, but the type key is mixed-levels.
- The C&F commission and s5 stock-turn benchmarks are left as approximate ranges I could not verify precisely.
- The c02 retail estimate (₹10,800 crore) is probably on the low side against the leader's reported sales, but it is presented as an estimate built from the given assumptions.
