# Hospitality review log

Script: /home/claude/bank/scripts/review_hospitality.py (applied once to out/hospitality.json; it is not idempotent, so do not rerun it on the edited file). Validator: 0 errors, 0 warnings for hospitality.

Reviewed 39 items (12 cases, 7 flaw drills, 8 quick checks, 6 chain drills, plus the value chain). Changed 30 (counting the value chain as one), replaced 0.

## Facts checked against sources
- Hotel GST (as of Oct 2026). Since 22 Sep 2025, rooms up to ₹7,500 a night pay 5% with no ITC (previously 12% with ITC). Rooms above ₹7,500 pay 18% with ITC. The ₹1,000 exemption ended on 18 Jul 2022, so no room tariff is exempt now. Restaurants in "specified premises" (any room charged above ₹7,500 in the previous FY, rule in force from 1 Apr 2025) pay 18% with ITC; all other restaurants pay 5% with no ITC. In a 20 Jul 2026 Lok Sabha answer, the government said no proposal to review the 5% rate is pending. Sources: Bajaj Finserv, Petpooja, TheMunim, Jurishour (23 Jul 2026).
- Branded supply. Horwath HTL counts about 216k chain-affiliated rooms at end-2025 (+7.7%), with a pipeline of about 144k. The "~2 lakh" figure was roughly right, so I tightened it to about 2.2 lakh.
- RevPAR. The text gave about ₹5,000 for FY25 from 65% x ₹7,800. Horwath HTL puts calendar 2024 at about ₹5.0k and 2025 at ₹5,522 (64% occupancy, ₹8,624 ADR), and HVS Anarock puts 2025 at ₹5,400-5,600. I updated the benchmark to 2025.
- Management fees. HVS reports first-year base fees averaging about 2% on new Indian contracts, falling to 1.5-1.75% on strategic deals, and incentive fees falling or waived in early years. "Base 2-3%" was too high at the low end, so I widened it to 1.5-3% and set the incentive fee at about 5-10% of GOP or AGOP, labelled approximate.
- Listed Indian hotel owners trade at about 9-17x EV/EBITDA for owner-operators (SAMHI 9x, Ventive 13x, Juniper 15x, Chalet and EIH 16-17x). Only IHCL (31x), Leela (28x) and ITC Hotels (22x) trade above 20x (multiples.vc). A 20x entry is therefore rich for a stressed upscale portfolio. That price is the point of the case, and the case now says so explicitly.
- UK. From 6 Apr 2025, employer NIC rose from 13.8% to 15%, the secondary threshold fell from £9,100 to £5,000, and Employment Allowance rose to £10,500. HMRC Time to Pay is an instalment plan for PAYE, VAT and other business tax already due; it can be set up online up to £50k, and larger debts need a call to HMRC. The c11 references are accurate.
- Edinburgh. Short-term let licensing (Oct 2023) is correct. A 5% visitor levy applies to stays from 24 Jul 2026, capped at 5 nights, so I added it to c03.

## Changes by item
- valueChain. The `india` text now gives the exact GST structure (rooms and hotel restaurants), the 2.2 lakh rooms and the pipeline. I updated the s3 RevPAR benchmark and corrected the s2 fee benchmark. The rooms 70-78% and F&B 25-35% departmental margins are left unchanged and still labelled approximate; they match HVS and STR global norms, but I found no current India-specific source for them. Unit economics re-added in Python: GOP is ₹5,800, fees are ₹870 (3% x 13,500 + 8% x 5,800 = 405 + 464), and EBITDA is ₹3,980. All correct.
- c01. Hint 1 named the branches and hint 3 gave away the most revealing branch (ADR), so I rewrote both. Hint 2 now gives L1 only. I replaced the market-entry distractor with turnaround, which a weak candidate would actually pick.
- c02. Hints 1 and 3 changed (hint 3 now shows international leisure: 4.5L x 70% x 8 / 1.8 = 14 lakh, checked). I replaced the growth distractor with product-launch.
- c03. Hypothesis 2 claimed 95% occupancy at both prices, but £1.19m at £280 implies about 98%; it now says so. I added the visitor levy and the Oct 2023 date to the facts, rewrote hints 1 and 3 (hint 3 no longer gives away the WTP branch), and replaced growth with segmentation.
- c04. Hints 1 and 3 now show the service-time branch instead of the queue branch, which held the answer.
- c05. Hint 1 named the steps, so I rewrote it.
- c06. The root label was 13 words, so I shortened it. Hint 3 now shows leisure instead of weddings. I replaced market-entry with segmentation.
- c07. Hints 1 and 3 changed (hint 3 now shows capability instead of economics).
- c08. Hint 1 changed.
- c09. Hints 1 and 3 changed. I added a forward-multiple hypothesis: about 30x on ~₹11.7 crore of next-year EBITDA.
- c10 (doubt 1). The case facts now state that the listed peers behind the 33% benchmark own almost all their hotels, and that listed owners trade at 13-17x, so the fund models a 16x exit against a 20x entry. I added 50% debt and an 18% equity IRR. The new quantitative step: closing 3 points gets EBITDA to ~₹212 crore, and 5% a year growth takes it to ~₹258 crore. At 16x that is ₹4,130 crore of EV, or ₹2,230 crore of equity after debt, about a 3.5% IRR. An 18% IRR needs a bid of about ₹2,500 crore (~13x). The c2b label now names the multiple gap. Hint 3 shows the markets branch. I replaced market-entry with turnaround and swapped the third key metric for equity IRR.
- c11 (doubt 2). The facts are verified and unchanged. Hypothesis 1 ignored cash: with FCF of about £1m against the £3m safety programme, net debt rises to about £47m, so EBITDA must reach about £7.8m, not £7.5m. I fixed the hypothesis and the key metric. Hints 1 and 2 no longer give away the branches (hint 2 had parenthetical tips) and hint 3 shows EBITDA. I replaced pricing with ma.
- c12 (doubt 3). The prompt now opens with "Assume", and the facts say "treat these as case facts". I added 2.5 guests per room, 25% a year growth in branded demand and a 35% margin so the sizing can be solved. New hypotheses: ~36 lakh overnight room nights against ~3.3 lakh branded today, and year-four occupancy of ~40% with the full pipeline or ~63% with half of it. The ₹29 crore/8% yield is checked, and at 60% occupancy it is ₹23 crore/6.6%. Hints 1 and 3 changed.
- f03. The giveaway "Sunset cruise" node stays as the mixed-levels flaw. I added a decoy (c1). b2 now reads "Dining, bar and banquets for staying groups" so that it is clearly separate from c2.
- f04. The not-a-driver node "Guest review scores" was too obvious. It is now "Average room rate guests pay", a plausible-looking but non-causal node for cost per occupied room. I added a4 (fixed supervisors) to both trees and a decoy on a3.
- f05 (doubt 6). Both flaws are confirmed: the a2 gap is real, because banquets bill venue, décor and AV. b4 "Total cost per wedding" was an obvious overlap, so I rewrote it as "Outside vendors: florists, lighting and tent hire", which is the same spend as b3 in different wording. I checked the rest of the tree: a1 by event type and a2 by covers and price are MECE, and b1-b3 are complete for banquet departmental cost. Added a decoy on b2b.
- f06 (doubt 5). The root asks about a GOP margin gap, and margin = GOP / revenue, so with largely fixed costs the revenue base is part of the problem. The gap on r stands as unambiguous, and nodeId=r follows the convention. I shortened the root to 12 words. The b5 overlap was too visible ("Grid electricity charges" sat next to "Utilities: electricity"), so it is now "Energy: power purchase and generator fuel" over "Units bought from the distribution company", the same quantity under different wording. The not-a-driver on c (fees below GOP) is correct. Added a decoy on a3: guest laundry as a department versus rooms linen.
- f07. Root shortened to 12 words. Added a decoy on c5. Flaws checked: the b1 gap, the e mixed-levels and the c3 overlap all hold.
- f01, f02 (Beginner). Correct as written; no decoy is required at Beginner level.
- q01. The two "Rooms + F&B" options had obvious gaps, and the correct option was the longest. It is now short, and the wrong options are a resident/non-resident overlap, a missing in-room dining line and a missing rentals line.
- q02. The two-item gap option was silly, so I replaced it with "rack rate", which is the wrong driver. Transient/group/weekend replaces corporate/leisure/weekend.
- q03. Two silly options (a gap with two items, "Occupancy" listed as a cost) became a hidden gap (variable on rooms or covers only) and a mixed basis (controllable).
- q04. Labels were trimmed so that the correct option is not the longest.
- q05. The two-item gap option became "Complimentary and house use", which is not a driver of rooms sold.
- q06. The gap option is now subtler (only event services are missing), and the correct option is shorter.
- q07. The overlap is now hidden behind other wording: "fee on profit above the owner's priority return" is the incentive fee. The correct option is no longer the longest.
- q08. Unchanged; it was already subtle.
- v01. Rewritten so the symptom appears in the rooms department (s5) but the cause is distribution (s4).
- v03. Rewritten as a symptom: owner margin falls while GOP is flat after a fee renewal, so s2 captured the profit.
- v04. Replaced "construction at ₹1.4 crore per key" with an FF&E renovation, which looks like s5 but belongs to owner capital (s1).
- v02, v05, v06. Unchanged; v05 and v06 already sit in the stage where the symptom shows.

## Remaining doubts
- Indian departmental margins (rooms 70-78%, F&B 25-35%, non-room share 40-50%) and staff per room are plausible and labelled approximate, but no current India source confirmed them.
- The c10 peer margin of 33% is presented as a case fact. Real listed owners vary widely (owner-operators run roughly 30-45% EBITDA margins), so it is not presented as a real benchmark.
- The distractor swaps in c04, c05, c07, c08, c09 and c12 were reviewed and kept: they were already the frameworks a weak candidate would pick.
