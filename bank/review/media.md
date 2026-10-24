# Review log: media

Reviewer pass on /home/claude/bank/out/media.json, applied by /home/claude/bank/scripts/review_media.py (run against the author's original file; a backup of the original is at /tmp/claude-0/-home-claude/e22204a6-da4b-5354-8ef1-e7f0555e9582/scratchpad/media.orig.json). Validator: 0 errors, 0 warnings for media. Ids, counts, quotas and schema unchanged apart from the new `decoys` field on flaw drills, which section 7 asks for.

Items reviewed: 33 plus the value chain (12 cases, 7 flaw drills, 8 quick checks, 6 chain drills). Changed: 30 plus the value chain. Rewritten: f04 (new tree and flaws), q01 to q07 (all options rewritten), v01 and v03 (new scenarios). Unchanged: v04, v05, v06.

## Fact checks (author's flagged doubts)

1. **c05 Saudi box office.** Plausible, and still framed as client research. GEA-reported data via Argaam puts 2025 at SAR 920.8m, 18.8m tickets, average ticket SAR 49, 603 screens in 62 cinemas. The clarifying fact now adds about 19m tickets at about SAR 50 and says the screen count has barely grown in two years, which is accurate.
2. **f07 ad cap and sponsorship gap.** The 12-minute cap was Rule 7(11) of the Cable Television Networks Rules, 1994 (10 minutes of ads plus 2 of self-promotion). It sat in the Rules, not the "programme code" (Rule 6). MIB removed it by G.S.R. 751(E) on 21 August 2026, and TRAI repealed its 2012 ad-duration regulations on 10 September 2026. So a "12-minute cap" label is now wrong. f07 a1y is now "Ad minutes aired per hour", with a decoy note explaining that the cap was removed. The value-chain India note records the removal. For the gap, the root now says "total advertising revenue". The explanation states that sponsorships and integrations are priced per package, so no seconds x rate branch can hold them. The corrected tree is restructured to Spot (seconds x rate) plus Non-spot, so the levels stay consistent.
3. **Value chain benchmarks.** These were checked against PVR INOX broker notes (Sharekhan Q1FY26, ICICI Direct Q3FY26, PL 1QFY27) and Ormax.
   - ATP. Reported ATP is gross of GST, about ₹254 to ₹293 (FY25 ₹259). Net ATP is about ₹229. The old "₹250 net" mixed the two bases. The KPI now gives gross ₹260 to ₹290 and net about ₹230. Unit economics uses ₹230 net.
   - SPH. ₹130 was out of date. FY26 runs about ₹145 to ₹160, and ₹145 is used.
   - Film hire. About 40% of box office in FY25 (₹1,178 cr / ₹2,955 cr) and about 38.5% of ticket sales in Q1FY26. 46% was too high, so the line is now about 42%. f02 is now "roughly 40-50%", and profitPools now says "roughly 40-45%".
   - Occupancy. Now "roughly 22-27%" (22% Q1FY26, 25.3% Q1FY27). It was 25 to 30%.
   - Multiplex EBITDA. Pre-Ind AS 116 margins were 6.5 to 6.9% in FY25 and 13.1% in FY26, so "15-20%" was too high. It now reads "roughly 10-15% in a normal year". Unit economics was rebuilt to about ₹55 on ₹420 (13%), and the sum was checked in Python. The worked example was recomputed: margin goes from 13.1% to 9.5%, which is 3.6 points (film hire 42% to 47% is 2.8 points, ads minus ₹4 is 1.0 point).
   - Broadcaster EBITDA 20 to 30%. This holds as history but not as a current figure: Zee was 14.4% in FY25 and 4.3% in FY26 (Elara). The margin note now says "historically" and records the compression.
   - OTT ARPU ₹50 to 150. Not supported as a blended figure. Media Partners Asia puts blended Indian SVOD ARPU at about US$0.5 (about ₹40 to 45) a month. The KPI is restated and labelled approximate.
   - India screens. The MAI-EY data gives 9,927 screens and 6.8 per million in 2024. "Under 10 per million" is now "about 7 per million (around 9,900 screens)".
4. **c10 rights recovery.** The 60-70% to 35% figures are now explicitly "Interviewer data". The s1 pre-sales benchmark was softened to a qualitative statement, because I could not confirm 60 to 70% as an industry figure.
5. **c12 news FDI.** Confirmed: 49% under the government route for uplinking news and current affairs TV channels, 26% under the government route for uploading or streaming news on digital media, and 100% automatic for non-news channels. I found no change to these in 2026. The case says the target's OTT app streams the news channels live, so the 26% digital cap now matters and is added to the facts, the tree node d1x, hypothesis 2 and the common mistake.

## Changes by item

### Value chain
Benchmarks, profitPools, unitEconomics, india and workedExample were changed as listed in point 3 above. The ATP formula now states the gross/net basis. The order drill v02 "why" was rewritten because it wrongly put a film distributor booking screens at aggregation (s3) while s4 lists screen booking. It now says that for cinema releases the aggregation step is thin.

### Cases
- **c01.** Accuracy: the advertising branch was seconds x rate only, which left sponsorships out. It is now spot (seconds x rate) plus sponsorships, and the KM is renamed spot revenue. Difficulty: hint 1 named the branches and hint 2 named the L2 nodes; both were rewritten so hint 1 gives logic only and hint 2 gives L1 only.
- **c02.** Screen total updated to about 10,000 (3,500 multiplex, 6,500 single), single-screen occupancy 15%, ATP gross ₹260. Recomputed in Python: about ₹13,500 cr on about 89 cr admissions, multiplexes about 62% of value, against Ormax 2025 at ₹13,395 cr and 83.2 cr footfalls. The prompt now also asks for the multiplex share, which adds tailoring. Framework distractors were replaced with ones a weak candidate would actually pick (pe-dd, market-entry). Hints were made progressive, and hint 3 now shows the less revealing single-screen branch.
- **c03.** The profitability distractor was swapped for growth, a more tempting wrong pick. Hint 1 no longer names the branches. Hint 3 now shows the value branch rather than the net-impact branch, which gave the answer away.
- **c04.** Commonmistake arithmetic was wrong: doubling €2m is about 11% of the €18m gap, not 6% of revenue. The distractor market-entry was swapped for ma, since the prompt invites acquisitions. Hint 3 now shows the subscriptions branch instead of the advertising branch.
- **c05.** Difficulty: added a red herring (the client expects South Asian expatriates and Indian films to fill screens, but they are under 10% of box office). Hypothesis 1 now carries a quantified hurdle: about SAR 1.5m box office per screen against the roughly SAR 1.26m EBITDA per screen that an 18% return needs, so organic entry fails. Hypothesis 3 adds capital-light routes. Hint 3 now shows the competition branch. Mistakes were updated to match.
- **c06.** Red herring added (newsprint prices up 12%, which affects both papers). Hint 3 now shows the rival-move branch rather than the response options.
- **c07.** Red herring added (the broadcaster says rivals pay leads less), which tempts candidates to cut cast fees first. Hint 3 now shows the cost-per-shift branch, not the shifts branch.
- **c08.** Red herring added (a rival says half its sign-ups take the ad tier). Hint 3 now shows the capabilities branch rather than the revenue-per-user maths.
- **c09.** Red herring added (marketing wants to target students). Hint 3 now shows the evaluation branch rather than the segmentation branch.
- **c10.** Facts labelled as interviewer data. A ₹150 cr library offer was added to give the cash hypothesis a quantified route. The break-even now uses a blended 45% distributor share across the run rather than the week-one 50%: (₹250 - ₹87.5) / 0.45 x 1.18 ≈ ₹425 cr, checked in Python, with the formula shown in the KM. Hint 3 now shows the slate branch.
- **c11.** Internal inconsistency: "minutes roughly tripled" with "price down 30%" implies about 2.1x revenue, not 1.95x. Changed to "about 2.8 times", which gives 1.96x, matching ₹215 cr to ₹420 cr. Hint 3 now shows the competitive-position branch.
- **c12.** The 26% digital news cap was added (see point 5). Hint 3 now shows the synergies branch rather than the deal branch, which named the cap.

### Flaw drills
- **f01 (Beginner).** The overlap node was labelled "Digital platform payouts" with children worded like a1 and a2, which was a giveaway. It is now "Platform licensing income" with reworded children.
- **f02.** Film hire range corrected to 40 to 50%.
- **f03.** Decoy added on b1y (price rise at renewal).
- **f04.** Rewritten. The old "Pre-release rights income" was an obvious not-a-driver. The new tree hides "Distributor's share of net collections" (not-a-driver for gross box office) and "Advance bookings before release day" (an overlap with admissions). A decoy was added on screen mix under price. It now has 2 flaws, within the Intermediate 1 to 2 range.
- **f05.** The overlap was relabelled "Programming spend" with children "Episode budgets paid to production houses" and "Telecast rights for films", so the hiding is in the wording. Decoy added on d1 (programming teams).
- **f06.** Decoy added on c2 (interest on production finance).
- **f07.** Ad-cap label and gap wording fixed as in point 2. The overlap was reworded to "Complimentary airtime added to package deals". The sell-through children were reworded to spot volume, so they stay within the spot branch. Decoys added on b1x (ratings under price) and a1y. Corrected tree restructured.

### Quick checks
- **q01 to q07.** Section 7: the wrong options were obvious (missing whole streams, "Weekend revenue", "Satellite rights" in a cost split, "Subscription price" in an hours split), and the correct option was often the longest. Every wrong option now looks MECE and fails on one subtle point.
  - q01: online booking overlap, a mixed net-of-film-hire basis, and a missing ad stream.
  - q02: missing involuntary churn, win-backs double-counted, and an average-stock basis.
  - q03: song shoots overlap, P&A as not-a-driver, and a missing "Other" (insurance and finance).
  - q04: seconds available, rate card versus realised rate, and sponsorships outside FCT.
  - q05: language versus ownership, cash versus amortised basis, and a direct-to-digital overlap.
  - q06: song length missing, registered versus active users, and offline hours inside paid.
  - q07: gross box office basis, music in two buckets, and post-release rights missing.
  - Correct positions are now 2, 0, 3, 1, 2, 0, 3, 1.
- **q08.** Already subtle. I tightened the exchange-rate reason and moved the correct option to position 1.

### Chain drills
- **v01.** "F&B spend fell, which stage" was trivially s5. It is now a GEC ad-yield fall caused by late episode delivery: the symptom is in s3 and the cause is in s2.
- **v03.** "Library licence cost sits where" was trivially s3. It is now a GEC ad fall caused by homes moving to free DTH: the symptom is in s3 and the cause is in s4.
- **v02.** "Why" corrected (see value chain).
- **v04, v05, v06.** Unchanged. v05 and v06 already follow the symptom-here, cause-there pattern.

## Remaining doubts
- The 2026 FDI caps (49% news TV, 26% digital news) are confirmed from policy commentary, not from the latest consolidated FDI circular text.
- Saudi screen counts are reported as 603 (Argaam, 2025) and about 618 (another GEA-based report). Both fit "about 600".
- The 42% film hire is derived from PVR INOX cost lines, which the company does not disclose as a share of net box office. It is labelled approximate.
- Several figures are illustrative and labelled approximate rather than verified: the daily soap cost per episode of ₹10 to 25 lakh, the commissioned production margin of 10 to 15%, the greenlight rate, and VFX price trends. They are plausible, but I did not confirm them.
- c05's assumption of F&B plus ads at about 50% of box office in Saudi Arabia is an estimate. Hypothesis 1's conclusion holds even at 100%.
