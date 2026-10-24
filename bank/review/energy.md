# Energy review log

Reviewer pass on /home/claude/bank/out/energy.json. I rebuilt the file from /home/claude/bank/scripts/build_energy.py into a scratch file and it came out byte-identical, so the interrupted reviewer had not edited it. The file as found is backed up at /home/claude/bank/review/energy.orig.json. Every edit is made by /home/claude/bank/scripts/review_energy.py, which always reads that backup and writes out/energy.json. Two consecutive runs produce identical output. validate.py reports 0 errors and no energy warnings. The file has been copied to /home/claude/bank/final/energy.json.

I checked all arithmetic in Python: the unit economics (sum -0.46; 4.80/0.86 = 5.58), the worked example, c01, c02, c03, c05, c06 (new IRRs), c07, c08, c09, c10, c11 and c12.

Items reviewed: 34 (1 value chain, 12 cases, 7 flaw drills, 8 quick checks, 6 chain drills). Items changed: 33, which is every item except f02. Items replaced: case c06, which is now a new scenario, and the option sets of all 8 quick checks (same ids and difficulty).

## Facts verified on the web (October 2026)
- PM Surya Ghar pays ₹30,000/kW for the first 2 kW and ₹18,000 for the third kW, with a cap of ₹78,000. Special category states get ₹33,000 and ₹19,800. Subsidised systems must use modules made in India with Indian cells (MNRE guidelines, reported September 2026). The target is one crore homes by FY2026-27. Installations reached about 24 lakh in December 2025 and about 51 lakh (17.9 GW, so roughly 3.5 kW each) in early October 2026.
- GB battery revenues (Modo): about £36k/MW/yr in January 2024 (an all-time low in February 2024), £76-84k in December 2024, £88k in January 2025, and £55-77k in mid to late 2025. I could not retrieve an exact 2022 annual figure.
- Indian standalone BESS auctions in 2025: the lowest 2-hour tariff was ₹1.48 lakh/MW/month and the indicative benchmark ₹2.3 lakh. IEEFA-JMK (May 2026) puts about 75% of 2-hour capacity "at risk".
- Discoms: official AT&C losses were 15.04% in FY2024-25 (IMPRI cites 16.16%), the ACS-ARR gap was ₹0.06/kWh, and discoms made an aggregate profit of ₹2,701 crore. RDSS has been extended to 31 March 2028 (IMPRI, September 2026).
- Ofgem extended its ban on acquisition-only tariffs to 31 March 2027.
- Green Energy Open Access Rules: the eligibility threshold is 100 kW, including aggregated connections.
- APM gas: in April 2025 the government cut allocations to city gas distributors by up to 20%. APM now meets about 34% of city gas needs, and the shortfall is filled with costlier new-well gas.
- NEP (Transmission) plans about ₹9.15 lakh crore of investment to 2032.
- Coal produced nearly three-quarters of generation in Q4 FY2025-26.
- AER's DMO 2026-27 final determination exists (May 2026).

## Author doubts resolved
1. v02 order. A trading stage between generation and transmission is commercial, not physical, so its position was arguable. I merged it into s2 "Generation and wholesale sale" (exchanges and traders are now players there, and the DAM price KPI moved with them), leaving five physical stages: fuel, generation and wholesale sale, transmission, distribution network, retail supply. The order now has one answer. All drills, the worked example and the value chain text were remapped (old s4/s5/s6 became s3/s4/s5).
2. f06. LRET/SRES are real cost lines (the RET runs to 2030 and the DMO cost stack includes environmental costs), but a candidate would rarely spot them from India. I replaced the gap with a logic gap: usage price has the default/market mix and the market price, but not the regulated default offer price itself (DMO/VDO, reset each July). Green scheme costs now sit in the tree as a decoy. The overlap is now hidden ("Loyalty credits for customers threatening to switch" against net price after discounts).
3. c11. Published benchmarks support the shape of the revenue history (collapse to an early-2024 low, partial recovery in 2025), but I could not verify the 2022 level. The prompt now labels the history as "the fund's adviser's index (case data)" and brings it up to 2025-26 (£55-90k). Revenue today is set at £70k/MW, including £10k of Capacity Market. Recomputed: the value is £140m (it was £115m at £60k), the break-even is £86.4k, and that is 23% above today.
4. c12. The open-access cost stack is now explicitly "case data; charges vary widely by state". Its arithmetic checks: 4.3+0.9+1.4+0.3 = 6.9; margin lost 8.5-3.0-1.4 = 4.1; 3 BU x ₹4.1 = ₹1,230 crore.
5. c02. The ₹78,000 cap is verified. The author's market estimate was wrong by about 3x: 10.8 lakh systems a year against an actual run-rate of about 32 lakh a year. It is recalibrated to 12 crore usable roofs x 50% with high enough bills x 5% a year = 30 lakh systems; at 3.2 kW and ₹57,000/kW that is about ₹55,000 crore, with the module slice at about ₹22,000-25,000 crore. The DCR rule, the subsidy slabs and a portal sanity check are now clarifying facts.
6. q01. The fourth option failed on overlap and also on mixed basis, and the parent allowed merchant sales. The parent now says all output is sold under the PPA. The option set was rewritten so that each wrong option fails on exactly one point: fuel recovery overlap, ROE inside the capacity charge (mixed levels), and a gap (incentives and ash sales).
7. c06 and c11 were both battery storage cases. I replaced c06 with "Should a solar developer bid for transmission?" (Intermediate, India, market-entry). It has a ₹1,500 crore package, a ₹160 crore winning charge, a 35-year TSA and a 10% hurdle. Python results: IRR 9.2%, 8.4% with a one-year delay, 7.8% with a 15% overrun, break-even charge ₹170 crore, and 10.4% if capex is ₹1,350 crore. The red herring is management's belief that owning lines gives its parks priority access, when connectivity is non-discriminatory. c10's reference to battery tariffs was updated to ₹1.5-2.5 lakh.

## Changes by item
- Value chain: restructured to five stages (doubt 1). The AT&C, ACS-ARR, T&D and margin benchmarks were updated to FY2024-25 data. The coal share is now "roughly 70-75%" and RDSS is described as extended to March 2028. The worked example was replaced, because the old one (a T&D-loss-driven widening of loss per unit) duplicated f04. The new one is an energy charge rise caused upstream by rail freight and coal grade slippage: ₹0.30 x 70% = ₹0.21 per unit bought. Unit economics re-verified and unchanged.
- c01 (made harder): tree rebuilt by income stream, with fuel netted against the stream that pays for it (capacity charges, fuel margin on PPA units, merchant margin, non-fuel costs, other income). This makes the pass-through insight structural. Hints made progressive. The market-entry distractor, which no candidate would choose, was replaced by turnaround.
- c02 (made harder): see doubt 5. The tree now has a bill-size filter (it was missing even though hypothesis 1 used one). Hint 1 wrongly called a households x adoption build "supply-side".
- c03: hint 1 named the branches and hint 3 revealed hypothesis 1. Both reworked. Hypothesis 3 is now anchored on marginal cost.
- c04: "exclusive licence" changed to infrastructure exclusivity under the PNGRB authorisation. The gas allocation fact was updated for the 2025 APM cut. Hints reworked (hint 3 now shows commercial, not the industrial branch behind hypothesis 1).
- c05 (made harder): added the red-herring fact that assessed farm sales overstate use by 15%. True billing efficiency is about 78% and true AT&C about 29%. The old hypotheses only reached about 18.7%. The new ones reach 15%: billing efficiency 88% x collection efficiency 97% = 85.4%. The RDSS framing no longer ties the target to the scheme's end date. Hints reworked.
- c06: replaced (doubt 7).
- c07 (made harder): standalone value now reflects PPA expiry. EBITDA is €41.5m for 8 years and €34.7m after, giving €390m at 7% over 18 years (it was €420m), so the gap is €160m. Added a red herring: the seller's teaser values merchant output at a €62 baseload price. Hints reworked.
- c08 (made harder): the author annualised churn although the rival offer closes in three months. The exposure over the window is about 24,000 leavers, or about £4m (£16m is now the full-year upper bound). Ofgem's acquisition-only tariff ban (verified) means a "targeted" tariff can be taken up by loyal customers too, so b2x was relabelled. Hints reworked.
- c09 (made harder): added the fact that 60% of outlets are on highways or rural, where e-rickshaws are not. Break-even including cabinet capex is about 75 swaps a day. Facts merged to stay at 4. Hints reworked.
- c10: battery comparison updated. Hints reworked (hint 3 shows stabilise cash).
- c11 (made harder): see doubt 3. Hints reworked.
- c12: see doubt 4. Hints reworked (hint 1 named all three branches).
- f01 (made harder): the giveaway "O&M contractor costs" in a revenue tree was replaced by "Tariffs discovered in this year's solar auctions" (not a driver: the PPA is fixed). a2 now includes outages, closing a small unlisted gap.
- f03 (made harder): the overlap was a near-duplicate of b1/b2. It is now "Auxiliary bottlenecks: pulverisers, ID and FD fans", the same as partial deratings in plant vocabulary. a1 "overhaul taking longer than scheduled" was ambiguous between planned and forced and was relabelled. Decoys d1 and a2.
- f04 (made harder): the offending node is relabelled "Share of energy lost in the wires". Decoys a3 (state subsidy) and b4 (depreciation and interest).
- f05 (made harder): the giveaway "Bus fare per passenger-km" was replaced by "Battery size per bus (kWh)". Decoys a3 and c.
- f06 (made harder): see doubt 2. Decoys b3 and a4.
- f07 (made harder): the overlap is hidden ("Hydrogen feedstock for urea plants"). Fixed an accidental overlap between c1 "Middle East exporters" and a4y: c1 is now firm-level Indian rivals. Decoys b2x and a4y.
- Quick checks q01 to q08 (all made harder, all option sets rewritten): there are no silly options left (removed "Peak demand met", "Smart meters installed", "Tender tariff"). Each wrong option now fails on one subtle, nameable point: fuel recovery, ROE inside the fixed charge, missing incentives; small hydro gap or double count, captive ownership; plant downtime, backing down, inverter downtime; theft-only commercial losses, hooking, rural feeders; round-trip losses, double-counted RTE, missing cost of capital; tariff moves, net switching, supplier-of-last-resort transfers; renewables share, fixed charges over fewer units, collection efficiency; part load, import share, turbine versus station heat rate. q03 no longer uses the circular MW x 8,760 x CUF identity. q08's parent is now "per kWh generated (gross)", so auxiliary consumption is not an unlisted gap. Correct positions are 2, 0, 3, 1, 2, 3, 0, 1. Python check: in no item is the correct option the longest.
- v01, v03, v05, v06: options remapped. v03 is reframed so the symptom (wheeling up, realisation down) is in one place and the margin loss in another. v04 now has 6 items with 4 tricky ones (DAM fee in s2, ISTS charges, wheeling paid by an open-access factory, rail freight). v02: see doubt 1.

## Checked and left unchanged
f02 (Beginner gap at the root, clean). Framework picks for all cases except c01 and c06. The tree structures of c03, c04, c09, c10 and c12, apart from the nodes named above.

## Remaining doubts
- The c11 2022 peak (£150-200k/MW/yr) is labelled case data and was not verified against a primary source. The £70k "today" figure and the £10k Capacity Market figure are case assumptions.
- c06: I believe the 35-year TSA term for TBCB inter-state lines is right but did not find a primary source this session. The ₹1,500 crore package and ₹160 crore charge are case data, a plausible charge-to-capex ratio but not taken from a specific bid.
- AT&C for FY2024-25 is 15.04% from the Ministry of Power and 16.16% from IMPRI. The benchmark says "15-16%".
- RDSS extension to March 2028 comes from one secondary source (IMPRI, September 2026).
- c01: whether imported-coal blending costs pass through depends on the PPA and on current Section 11 or regulator directions. The case states it as this regulator's position, which is fine as case data but not a national rule.
- The DAM average (₹4-5/kWh) and the coal stocking norm (20+ days) are approximate and were not individually re-sourced.
