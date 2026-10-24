# Logistics review log

Reviewer pass per REVIEW.md, including section 7 (difficulty). Every item was reviewed: the value chain, 12 cases, 7 flaw drills, 8 quick checks and 6 chain drills.

## Provenance
- `out/logistics.json` was byte-identical to a fresh run of `scripts/build_logistics.py` (md5 33e7410d…), so the interrupted reviewer had not edited it.
- That file was backed up to `review/logistics.orig.json`.
- `scripts/review_logistics.py` always reads the backup and writes `out/logistics.json`. It is rerun-safe (two runs give an identical md5) and asserts on the source text before each edit.
- `validate.py`: 0 errors. The output was copied to `final/logistics.json`.

## Facts checked (web, October 2026)
- **Logistics cost as a share of GDP.** The first official estimate (NCAER for DPIIT, released September 2025) is 7.97% of GDP for 2023-24, about ₹24 lakh crore. The file said "about 8-9%", which is stale (it comes from the 2023 NCAER range). Fixed.
- **Road share of freight.** The World Bank (Nov 2025, via KPMG) puts it at about 70%, and RMI at 71%. The file said "roughly two-thirds", now "roughly 65-70%".
- **Empty running.** There is no single official figure. Commercial briefs citing the NCAER work say about 40%, and other sources say 25-40%. The 25-40% range is kept, labelled as commonly cited with a note that estimates vary.
- **RTO.** Shipway's FY25 data shows about 26% on COD and under 2% on prepaid. The file's "20-30% on COD" is confirmed. Prepaid was changed from "a few percent" to "under 2-3%". ClickPost gives 10-20% overall, and that figure drove the c02 change.
- **COD remittance.** Carriers booked directly pay at roughly D+3 to D+7, aggregators at D+1 to D+7. The benchmark "D+2 to D+7 when booked directly; faster paid options exist" is kept.
- **Parcel unit economics.** Delhivery's FY26 numbers (about ₹10,500 crore of services revenue, about 1 billion express parcels) support a yield of ₹65-80 and ₹75 per parcel. The scale leader targets 16-18% express service EBITDA, so a 9% contribution is realistic only for a mid-sized carrier. The unit was relabelled "mid-sized carrier" and a note on the leader's density advantage was added. The lines sum to ₹7 (checked in Python), and last mile is 41% of network cost, consistent with the s5 note.
- **Germany (c09).** The market leader's network has more than 15,500 Packstations (July 2025) and has piloted semi-open compartments at stations. The claim "open only to its own parcels" was softened to "almost all of it reserved for its own parcels".

## Author's doubts: resolution
1. **India benchmarks and unit economics.** Resolved as above. The GDP share and road share were corrected, RTO and COD were confirmed with sharper wording, and the unit-economics lines were kept but relabelled.
2. **c09 German locker figures.** The cost per parcel (€0.60 against €1.80) is now framed as the client's own estimate, which makes it case data rather than a market claim. The €15k per locker figure and the 40% survey stay as case data. The leader claim was softened.
3. **f04 root gap.** The root is now "commit ₹250 crore to enter…", so a missing economics branch is plainly a root-level gap. The explanation now says why a2 (market margins) and c2 (gaps) do not cover it. A second, unlisted gap was found and fixed: b1 "global express integrators" left regional incumbents (Aramex-type carriers) with no home. It now reads "established express carriers".
4. **f06 network fuel line.** This is now unambiguous double counting. Stage labels show their energy explicitly (b1x riders, bikes, fuel; b1y staff, power, sorter upkeep; b2z diesel; b3y pay and fuel allowance). The overlap node was renamed "Energy cost per parcel (fuel and hub power)", which hides the overlap behind different wording as section 7 asks. The RTO gap is also made unambiguous: b2 was relabelled "Forward line haul", and the explanation states that every cost line is forward-only.
5. **q06 tonnes per truck-km.** The ambiguous and answer-revealing "(including empty km)" was replaced by "Average payload over all km run (tonne-km / truck-km)". Every option uses the same formula-in-brackets style, so the correct option does not stand out. The wrong options are payload per loaded km (gap: empty share drops out), cost per loaded km with payload over all km (mixed basis: empty running counted twice) and an added fill rate (overlap).

## Changes by item

### Value chain
- s4 empty-running benchmark: hedged wording, see facts above.
- s6 RTO and COD benchmarks: sharpened.
- india: road share corrected to 65-70%, and the GDP figure corrected to the official 7.97% for 2023-24.
- unitEconomics: unit relabelled "mid-sized carrier", and the result now notes the leader's density advantage.

### Cases
Hint pattern across all 12: hint 1 named the L1 branches in almost every case, and hint 3 often showed the most revealing branch. Every hint 1 now names only the split logic. Hint 3 was switched to a less revealing branch in c01, c02, c03, c04, c05, c06, c07, c09, c10, c11 and c12. c08 already used a non-decisive branch.

- **c01 (arithmetic error, made harder).** The facts made hypothesis 1 impossible: with revenue flat, total km flat and diesel flat, losing return loads cannot raise cost. Total km per truck now rises from 9,500 to 10,000 a month, because trucks reposition empty after the Gujarat client left, and forward rates rose slightly. Hypotheses were recomputed: ₹2.16 crore from the extra empty km plus ₹0.72 crore from ageing, about ₹2.8 crore in total. Loaded km fall 1.8%. Hint 2 was stripped of L2 detail. commonMistakes were rewritten to match. The Beginner now carries a twist (flat revenue hides more km run).
- **c02.** A blended return rate of 12% (customer returns plus RTO) was too low against 10-20% RTO overall. It is now 15%, giving returns of ₹3,600 crore, a pool of about ₹30,000 crore and a forward share of 88%. Hint 3 now shows the returns branch.
- **c03.** Hints only; the numbers check out (₹33.25 rider cost per parcel, 37 against 45 attempts).
- **c04.** Hints only; £6m of contribution against £4m of fixed costs checks out.
- **c05.** Hints only; ₹3,172 crore and a 14.9% CAGR check out.
- **c06.** Hints only.
- **c07 (made harder).** Added D2C COD collections of about ₹20 crore a day. Hypothesis 2 now sizes moving to D+2 at about ₹10 crore a year against ₹200 crore for a full price match.
- **c08.** Hint 1 only; 14.4x, about 10x and €14-20m check out.
- **c09 (made harder).** Locker costs are framed as client estimates. Own volume was added (about 9 parcels per locker per day), so the break-even step (15 a day; own parcels give about €3,900 against €5,500; 5-6 third-party parcels needed) shows that third-party uptake decides the case. This is the Intermediate structure-changing fact. Hypotheses were rewritten.
- **c10.** Hints only; all figures check out (non-anchor growth 15.6%, take rate 6.0%, 20.8x, working capital ₹187 crore, exit ₹5,400 crore, 50% CAGR).
- **c11 (Advanced quantitative step added).** The prompt now states the company was at breakeven before the loss and that the loss is ₹13 crore a month. The cost base is quantified: variable at 60% of revenue, semi-fixed at ₹37 crore a month. Hypotheses now carry the break-even step (a third of semi-fixed cost must go, or ₹33 crore a month of new revenue is needed) and the runway step (a sale and leaseback roughly doubles nine months to about 18). The root and a2 labels were updated.
- **c12 (unrealistic numbers, Advanced quantitative step added).** The original implied a -39% margin on high-RTO sellers, which is not achievable with real rates. The segment was recalibrated with explicit per-parcel data: 2.5 crore parcels, 40% RTO, ₹62 forward, ₹43 per RTO, ₹58 per delivered parcel, ₹130 per RTO parcel. The results are a high-RTO loss of ₹19 crore, others +₹5 crore and a segment loss of ₹15 crore. Hypotheses now carry the quantitative steps: billing RTO at the forward rate gives ₹19 crore (a 9.6% price rise), billing at full cost would mean a 44% rise, and cutting RTO by 10 points gives ₹7.25 crore. "Weight under-declaration" was moved from cost-to-serve to revenue drivers, since it is a yield leak, not a cost. The key metric formula was rewritten.

### Flaw drills
- **f01, f02.** Fine; unchanged.
- **f03 (made harder).** The overlap node was renamed "Repositioning legs to the next load" (with "Repositioning km" and "Cost per repositioning km"), so the overlap hides behind different wording. Decoy added: c2 trip allowances.
- **f04.** See doubt 3. Decoy added: b3 marketplace in-house fleets.
- **f05 (made harder).** The giveaway "Lower labour cost per unit handled" became "Labour productivity in handling". The explanation now covers per-unit and cost-plus billing. Decoy added: a2 new sites for the same clients.
- **f06.** See doubt 4. Decoy added: b2y air against surface mix.
- **f07 (giveaway replaced).** The mixed-levels node "Repaint trucks in group colours" was a giveaway and is removed. It is replaced by b1z "Growth of the 3PL's existing warehouse contracts", a not-a-driver flaw because it is standalone growth rather than a synergy. Decoy added: a3x truck loans outstanding. The corrected tree is unchanged.
- **Flaw-type coverage is still complete.** Gap: f01, f04, f06. Not-a-driver: f02, f05, f07. Overlap: f03, f06, f07. Mixed-levels: f04.

### Quick checks (all 8 rewritten for section 7)
The originals had obviously silly wrong options (rider salaries in revenue, diesel in revenue, storage fees in cost, costs in a gross-profit bridge). Correct positions are now 2, 0, 1, 3, 2, 1, 3, 0, and no correct option is the longest.
- **q01.** Wrong options: reverse pickups not covering RTO (gap); customer types mixed with COD fees (overlap); undelivered COD charges duplicating RTO (overlap).
- **q02.** Wrong options: return-leg trips (overlap with contract and spot); loaded km times freight per km run (mixed basis); freight per tonne without tonnes per trip (gap).
- **q03.** Wrong options: fixed and variable plus labour (overlap); activity split plus rent (overlap); no catch-all (gap).
- **q04 (the original "correct" option was wrong).** It omitted RTO, COD and claims costs, which the value chain itself lists. The parent is now network operating cost before corporate overheads, and the correct option includes "Returns, COD handling and claims". Wrong options: energy line (overlap); forward-only stages (gap); resource split plus returns (overlap).
- **q05.** Wrong options: waiting, driving and loading with no rest or breakdown halts (gap); e-way bill time (overlap); empty repositioning outside the parent's scope (not-a-driver).
- **q06.** See doubt 5.
- **q07 (the original "correct" option was wrong).** "Last-mile cost" includes delivery-centre overheads, which the correct option omitted. The parent is now "Rider cost per successful delivery". Wrong options: successful deliveries plus success rate (overlap); parcels out times first-attempt success, which misses reattempts (gap); attempts per rider-hour (mixed basis).
- **q08.** Wrong options: mix effect (overlap); both effects on last year's base, which drops the interaction term (gap); both on this year's base, which double counts it (overlap). The decomposition was verified in Python.

### Chain drills
- **v05 (replaced).** The original was internally inconsistent: special-zone parcels cannot leave cost per parcel flat. It also repeated the worked example's lesson (rate card ignores delivery cost). It is now an address-validation failure in the booking API: the symptom appears in s6 and s5, and the cause sits in s1.
- **v06.** Added "no shipper contract terms have changed" to rule out s1 as an answer. The "why" was updated.
- **v01-v04.** Fine; unchanged.

## Remaining doubts
- **Empty running.** No authoritative single figure exists; the 25-40% range is a widely repeated estimate.
- **c01 cost base.** Built bottom-up (about ₹30 per km variable cost at about 4 km/l and about ₹88 diesel; ₹55 per loaded km). It is plausible for a mixed fleet but at the low end of multi-axle FTL rates.
- **c06.** "Temperature-controlled space costs 3-4x ambient per pallet" is case data and was not verified. Actual multiples vary (roughly 2-4x).
- **c05.** Acquisition (allowed up to ₹500 crore) appears only under warehousing. There is no inorganic route for core PTL, so a sceptical interviewer may expect a PTL roll-up option. It was left as is, because adding it would mix means into a who/what split.
