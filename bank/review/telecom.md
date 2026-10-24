# Telecom review log

Reviewer pass on /home/claude/bank/out/telecom.json. Edits are made by /home/claude/bank/scripts/review_telecom.py, which can be rerun safely. validate.py reports 0 errors and 0 warnings for telecom. All arithmetic was rechecked in Python, including unit economics, the worked example and every case figure.

Items reviewed: 34 (12 cases, 7 flaw drills, 8 quick checks, 6 chain drills, 1 value chain). Items changed: 17 (value chain; c03, c05, c06, c07, c10, c12; f05, f06, f07; q01, q03, q04, q05, q06, q07, q08). Items replaced: 0.

## Facts verified on the web (October 2026)
- Satcom spectrum is assigned administratively, not auctioned. TRAI recommended 4% of AGR, plus a minimum per MHz and a ₹500 urban subscriber levy. On 3 September 2026 the DoT's Digital Communications Commission approved 5% of AGR, with 4% in notified remote areas, and dropped both the urban levy and the terminal subsidy. TRAI has since restated 4%, and the Cabinet decision is still pending. Operators also pay the 8% licence fee, so about 13% in all. Starlink has its GMPCS licence (2025) but has not launched commercially because security clearance is pending. Sources: broadcastandcablesat.co.in (16 Oct 2026), medianama.com (Sep 2026), techshotsapp.com.
- Starlink capacity: in July 2025 the MoS Communications said Starlink can serve about 20 lakh users in India, a capacity limit and not a policy cap, at "around ₹3,000" a month. In December 2025 a listing appeared with a ₹34,000 kit and an ₹8,600 plan; Starlink said it was test data. A ₹33,000 kit cost is therefore plausible, but it is still presented as a case assumption.
- The licence fee is 8% of AGR (3% licence plus 5% Digital Bharat Nidhi). There is no SUC on spectrum auctioned since 2022. Industry SUC was about ₹1,000 crore on ₹79,226 crore AGR in Q4 FY25, roughly 1.3%.
- Tenancy: Indus Towers' sharing factor was 1.62 in FY26, with EBITDA margin around 55%.
- Fiberisation: about 36% (DIPA, 2023) to 38% (KPMG, late 2023) of Indian towers, with about 30-36% cited in 2026, against 70-80% in advanced markets.
- ARPU and data use, Q1 FY27: Airtel ₹264 and 34.4 GB, Jio ₹215.6 and 43.7 GB, Vi ₹177 and 21.7 GB. Jio Platforms' EBITDA margin was 53.3%.
- Wireless subscribers in June 2026 were about 130 crore, which includes about 13.5 crore M2M and about 1.8 crore FWA connections.

## Author doubts resolved
1. c10 satcom. The administrative-assignment framing is current and correct, so it stays. The "4%" charge is outdated as the operative figure, because the government is finalising 5% (4% in remote areas). The case now assumes 5%, notes that 4-5% is being finalised, and puts total levies at about 13%, against 12% before. Payback was recomputed in Python as 75.9 months (shown as about 76) at ₹500 and 15.2 months (about 15) at ₹2,500. The kit cost and the 20 lakh capacity are both labelled "Assume", and both are consistent with public figures. Clearance is now "a year or more". Hypotheses, the c1x/c1z labels and the key-metric formula were updated to match.
2. Value chain benchmarks. The licence fee and SUC benchmark said "SUC nil on spectrum bought from 2022", which implied total SUC is zero. It now reads 8% licence fee (3% + 5% DBN) and SUC about 1-1.5% of AGR on legacy spectrum. The "1.6-1.9x" tenancy was overstated because the leader is about 1.6x; it is now "about 1.6x for India's largest tower company; above 2x is strong globally". Fiberisation of "around 40% vs 70%+ in China, South Korea, US" named countries I could not confirm; it is now "roughly 35-40% vs 70-80% in advanced markets". The tower EBITDA range moved from 45-55% to 50-55%. Operator EBITDA moved from 40-55% to 40-60%, because Airtel is above 55%; the profit-pools text was changed to match. Data usage moved from 25-30 GB (outdated) to 30-45 GB (2026). ARPU moved from ₹180-250 to ₹175-265 (mid-2026). In unit economics, depreciation and amortisation fell from ₹65 to ₹50 and interest from ₹25 to ₹17, because ₹90 of D&A plus interest on ₹220 of ARPU implied pre-tax margins near 10%, below current leader profitability. Pre-tax profit is now ₹45, EBITDA stays at ₹112 (51%), and the lines sum correctly. The unit is now labelled "simplified". The India paragraph now says 115 crore mobile subscribers excluding M2M.
3. q05. Option 2 (index 1) previously split revenue by anchor and additional tenants with no energy line and also listed loading charges separately, so it failed both for gap and for overlap. Its labels now explicitly include rent, loading and energy, and its cost line explicitly covers site, energy and overheads, which leaves only the loading-charge overlap. Option 1 (index 0) previously used "Rental revenue" with loading charges absent, which created a second gap; it is now "Rental and loading revenue", so its single reason is the missing energy cost. The correct option and option 4 were relabelled "Rental and loading" for consistency, so option 4 fails only because capex is not an EBITDA driver.
4. f07. Experts could file regulatory remedies as a reduction in revenue or cost synergies rather than as a dis-synergy. The fix is to change the root to "net synergy value" and relabel c as "Value given up to clear and integrate the deal". With a complete L1 (cost gains, revenue gains, value given up), remedies sit unambiguously under c, so the gap on c is unambiguous. The explanation now says this and spells out how the remedies reduce network savings and the pricing gain. The overlap (a3z) and mixed-levels (a4) flaws were checked and are clean.
5. c07 and c12. The prompts now carry "(All figures ... are illustrative case facts)" and the clarifying facts use "Assume". In c12 the wholesale deal changed from €120m to €90m a year: at €120m the entrant would pay about €6.25 per line per month out of a €10 price for only part of its traffic, which does not add up. The tree label c1 and hypothesis 2 were updated to match.

## Other changes
- c03, b1. "Their alternative: a separate €25 plan or €7 low-cost SIM" repeated the €7 SIM already in c2 (competitor prices), which is an overlap. It is now "Value of one bill and family controls to the payer".
- c05, b3. "Lower diesel cost per litre used" is now "per kWh generated". Generator right-sizing improves kWh per litre, not price per litre, so the old label did not fit its own child.
- c06. Mobile usage was 25 GB, which is outdated; it is now 35 GB. The load multiple is now 10x and the hypothesis, key metric and common mistake were updated. The 3% churn threshold in the hypothesis was checked against an annuity calculation (2.9%) and still holds.
- f05. "How we would enter" listed only buying an operator's portfolio or building new towers, and missed buying or partnering with an existing tower company. That was an unlisted gap in a drill whose only listed flaw is elsewhere. e3 has been added to both trees.
- f06. The gap explanation said "roughly 9-10% of revenue"; it now says roughly 9%, in line with current SUC levels.
- q01, option 0. "Mobile, Prepaid, Home broadband, Enterprise" failed for overlap and also for a wholesale gap. "Wholesale and other" has been added so it fails only for overlap.
- q03, options 1 and 3. Both also lacked backhaul, a second (gap) failure. Backhaul has been added, so option 1 fails only for overlap and option 3 only as not-a-driver.
- q04, correct-option why. "over ten times" is now "roughly ten times", in line with c06.
- q06, option 1. "Data revenue/Voice revenue/Pack price/Add-on" failed for overlap and also for a missing pack-mix gap. It is replaced by the correct three plus "Data top-up spend per user", a clean overlap.
- q07, options 1 and 2. Both also lacked other costs, a second gap. Option 1 now duplicates the licence fee inside revenue-linked costs (overlap only). Option 2 is now the complete split plus "Competitors' tariff decisions" (mixed levels only).
- q08, option 0. The reason now names the gap it actually has (monthly costs missing, so LTV is overstated) rather than "uses revenue instead of contribution".

## Checked and left unchanged
c01, c02, c04, c08, c09 and c11 (all figures recomputed and correct). f01 to f04 and the overlap and mixed-levels flaws in f06 and f07. q02. All chain drills v01 to v06, including order and stage assignments. The worked example arithmetic (network opex 22 to 26.6, up 21%).

## Remaining doubts
- The satcom charge is not final. If the Cabinet approves something other than 5% (4% in remote areas), c10's 13% total should be updated, though the conclusions do not change.
- The ₹33,000 kit is close to Starlink's apparent ₹34,000 listing, which Starlink called test data. It is fine as an assumption, but the case does not name the company.
- The fiberisation range (35-40%) rests on 2023 industry figures plus 2026 commentary citing 30-36%. A newer official number could not be found.
- Unit economics are a simplified composite; real D&A and interest vary widely between Airtel, Jio and Vi.
- In c04, the hypothesis treating 1% monthly churn on a constant 2.4 crore base gives about 0.86 crore lost over three years, against the 1.3 crore stated, which uses churn on a growing base. 1.3 crore is defensible only if the base grows towards 4.8 crore (the average base of 3.6 crore x 1% x 36 = 1.3 crore). That is consistent, but a candidate may question it.

## Second pass: difficulty (REVIEW.md section 7)
All accuracy fixes from the first pass are kept. The coordinator's edit to c04 hypothesis 2 (the growing-base churn assumption) is kept untouched, and the related doubt above is now resolved. Edits are appended to /home/claude/bank/scripts/review_telecom.py as "PASS 2" and "pass 2b". validate.py reports 0 errors and 0 warnings.

Cases
- Hints, all 12 cases: rewritten so hint 1 names only the split logic and hint 2 names only the L1 branches. Hint 3 now shows a branch that does not give away the answer. c01 shows costs, not the ARPU branch that holds the answer. c02 shows villages, not metros. c03 shows competitors. c04 shows port-ins, not churn. c05 shows the load branch, not the diesel mix. c06 shows demand, not economics. c07 shows standalone value, not synergies. c09 shows funding, not the cost lines. c10 shows rules and rivals, not segments. c11 shows demand, not the reset. c08 and c12 are unchanged, because the branch shown is not decisive.
- c07: added a red herring to the prompt ("the seller stresses three years of 25% subscriber growth"). Growth has already slowed to 8%, which the clarifying facts reveal.
- The other intermediate cases already carried a structure-changing fact or red herring. c05 has the fixed-rate tenant energy charge, with grid tariffs as the herring. c06 has local cable at ₹400-500 as the real competitor. c08 has 99% micro firms, with the binding constraint being the sales force. c09 has a profit-versus-cash framing. These are unchanged.
- The advanced cases already require a quantitative step: c10 kit payback against the capacity ceiling, c11 the post-reset multiple of about 18x, and c12 a base-wide cut costing €288m against €173m at risk. These are unchanged.
- Framework picks: market-entry was a distractor no weak candidate would choose. It is replaced by product-launch in c04, segmentation in c12 and market-sizing in c11, each with a reason grounded in the question.

Flaw drills
- f02 (Beginner): "Tower and land rent per site (excluding energy)" read as a hint pointing to the missing energy branch. It is now "Rent per site (space and land only)".
- f03: the giveaway "Waive installation fees during Diwali" is now "Festive-season installation-fee waivers". Added decoys c2 (annual prepaid lock-in) and b2 (installation speed).
- f04: the overlap is now hidden behind different wording ("Partner carriers' last-mile and off-net circuit fees" against "Access and termination paid to other operators"). Added decoys c4 (allocated costs) and b4 (licence fee as a direct cost).
- f05: added decoys b2 (operator self-build as competition) and a2 (sale-and-leaseback under demand).
- f06: the overlap is now hidden as "IP-1 provider charges per site" (IP-1 is the DoT category for passive infrastructure providers, that is, tower companies) against "Tower rentals". Added decoys a3y (roaming income against payouts) and b2z (OTT content fees).
- f07: added decoys a1y (avoided new sites against decommissioning) and c2y (dual-SIM consolidation against integration churn).
- f01 (Beginner, recharge revenue overlap) was already plausible and is unchanged.

Quick checks (all 8 rebuilt)
- Every wrong option now looks MECE at first glance and fails on one subtle, nameable point.
  - q01: an "interconnect income" gap, a product/customer basis mix, and an IoT overlap.
  - q02: a port-out-only gap that misses deactivations, a port-in overlap, and a stock/flow mix.
  - q03 (parent narrowed to operating cost): a generator overlap, a grid-only energy gap, and radio capex as not-a-driver.
  - q04: a short-video overlap between video and social, a missing fixed wireless gap, and revenue per GB as not-a-driver.
  - q05: depreciation replaces capex as the not-a-driver option.
  - q06: a data-booster overlap, headline versus monthly-equivalent price as a mixed basis, and levies as not-a-driver.
  - q07: a Digital Bharat Nidhi overlap and a rivals mixed-levels option.
  - q08: a backhaul overlap and payback as not-a-driver.
- The correct option is not the longest in any item (checked by character count). Correct positions are 2, 3, 0, 1, 2, 0, 3, 1.

Value chain drills
- v01 is replaced: care call spike (s6) caused by confusing pack design (s4).
- v02 is replaced: rural churn (s6) that looks like a network fault (s3) but is caused by site power backup (s2).
- v03: added a red herring (finance blaming retention discounts).
- v05: the prompt no longer gives away "8% of AGR". The candidate must infer the licence fee from ₹80 crore being 8% of ₹1,000 crore, with retailer payouts ruled out.
- v04 (order) and v06 (assign, which already has tricky diesel and interest items) are unchanged.
