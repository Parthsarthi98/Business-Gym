import type { DailySet } from "../types";

// A complete, calibrated day in the exact JSON shape the generator will produce.
// Block A (1-7) is multiple choice / quantitative, marked instantly on the device.
// Blocks B and C (8-20) and the Day Problem are free text, graded by Claude in step two.
// Transcribed faithfully from the uploaded "Daily Gym 01".

export const sampleSet: DailySet = {
  date: "17 Jun 2026",
  questions: [
    {
      id: 1,
      block: "A",
      format: "mcq",
      reasoning_move: "B6",
      difficulty: "Tough",
      stem: "A subscription firm removed its cheapest tier; the next month average revenue per user rose 18%. The team concludes “users are willing to pay more than we thought.” Best read?",
      options: [
        "The lift shows remaining users value the product more highly than cheap-tier users did, so demand is less price-sensitive than the old pricing assumed.",
        "Removing the entry tier raises ARPU now but will lower it within a few quarters as the narrower funnel starves the upgrade path to paid.",
        "The rise is mechanical: dropping the lowest-paying users lifts the average while no individual pays more, so it says nothing about willingness to pay.",
        "The effect nets out, since the revenue lost from the cheap tier offsets the higher average, leaving total revenue and willingness to pay unchanged.",
      ],
      correct_option: "C",
      model_answer:
        "Composition, not behaviour: dropping the bottom of the distribution raises the mean while no one's price changed, so ARPU says nothing about willingness to pay. Test it by comparing what retained users pay before and after. A reads the composition shift as a behaviour change; B invents a funnel story that does not bear on the willingness claim; D asserts a revenue neutrality that does not hold, you removed the lowest payers.",
    },
    {
      id: 2,
      block: "A",
      format: "quant",
      reasoning_move: "E2",
      difficulty: "Tough",
      stem: "“Scale Channel X, it brings four times the customers for the same spend.” Read the figures and pick the call.",
      data: "Channel X — spend £20k · 400 customers · £150 margin each\nChannel Y — spend £20k · 100 customers · £900 margin each",
      options: [
        "Scale Y: it returns £70k of contribution against X's £40k on the same £20k spend, and contribution, not customer count, is what compounds into profit.",
        "Scale X: at roughly £50 to acquire a customer against Y's £200, its spend is far more efficient, so it scales more profitably as the budget grows.",
        "Scale X: four times the customers per pound builds a larger base that compounds through referrals and retention, outweighing the per-customer margin gap.",
        "Hold both at current spend until cohort retention is known, since lifetime value, not first-order contribution, should drive the allocation.",
      ],
      correct_option: "A",
      model_answer:
        "Net contribution = customers × margin − spend. X: 400×150 − 20k = £40k. Y: 100×900 − 20k = £70k. Y wins. B is the trap: a lower cost per acquisition looks efficient but ignores margin per customer, and Y's margin more than covers its higher CAC. C counts heads and bolts on a compounding story the figures do not support. D defers a call the numbers already settle.",
    },
    {
      id: 3,
      block: "A",
      format: "mcq",
      reasoning_move: "B4",
      difficulty: "Tough",
      stem: "“We grew revenue 30% last year, well above the market's 8%, so our strategy is working.” Strongest objection?",
      options: [
        "The strategy is working but the headline overstates it; net of the 8% market growth, true outperformance is nearer 22 points, still strong.",
        "The comparison is invalid because the firm's 30% and the market's 8% are measured over different windows, so they cannot be set against each other.",
        "Revenue growth is the wrong lens; only margin growth reveals whether a strategy creates value, so the claim cannot be judged from this at all.",
        "Growth shows little here: a category-wide tailwind lifts every player, so the 30% may be mostly that plus share bought below cost, not the strategy.",
      ],
      correct_option: "D",
      model_answer:
        "The inference ignores the confound: if the category surged, everyone grew, so 30% could be mostly tailwind (beta, not skill) plus volume bought below cost. A concedes the claim and does a tidy subtraction that still credits the strategy with the residual. B invents a timing mismatch. C is the real-but-overstated point that margin matters; “cannot be judged” is too strong.",
    },
    {
      id: 4,
      block: "A",
      format: "mcq",
      reasoning_move: "A1",
      difficulty: "Tough",
      stem: "“Our NPS is higher than the market leader's, so we will take share from them.” Best objection?",
      options: [
        "NPS predicts share with a lag, so the firm will gain share but not at once; the effect lands over the following year as sentiment converts.",
        "A higher NPS is necessary at best, not sufficient: price, distribution and switching costs decide share, and NPS captures none of them.",
        "The lead may be illusory, since NPS is measured differently across firms, so the firm's score and the leader's are not strictly comparable.",
        "The higher NPS converts to share only if the firm also outspends on distribution; with equal distribution, sentiment alone moves the switchers.",
      ],
      correct_option: "B",
      model_answer:
        "Higher NPS is at most necessary, never sufficient: what moves share is price, distribution and switching costs, which NPS does not measure, so nothing about share follows. A bolts on a lag with no basis. C raises a measurement quibble that does not rescue the logic. D is close but wrong, it treats distribution parity as the single unlock when several drivers sit between sentiment and switching.",
    },
    {
      id: 5,
      block: "A",
      format: "mcq",
      reasoning_move: "E3",
      difficulty: "Tough",
      stem: "“Our headcount is at a record high, so the business is growing strongly.” Flaw?",
      options: [
        "Record headcount confirms growth only if revenue per head held; if it slipped, the firm added bodies faster than output, so growth is softer than it looks.",
        "Headcount is an input cost rather than an output, so a record high signals rising expense and likely margin pressure rather than growth.",
        "A record level says nothing about the rate: in almost any growing series the total is at a peak, while the hiring rate itself could be slowing sharply.",
        "The claim holds only if attrition is low; with high churn, gross hiring can be high while net headcount growth is actually weak.",
      ],
      correct_option: "C",
      model_answer:
        "The error reads a stock as a flow. In any growing series the level is almost always at a record, so “record headcount” says nothing about the rate of growth, which could be decelerating. A is a reasonable adjacent point but not the core flaw. B reframes headcount as cost. D's gross-versus-net point is real but secondary; even at zero attrition the level-versus-rate confusion stands.",
    },
    {
      id: 6,
      block: "A",
      format: "mcq",
      reasoning_move: "C3",
      difficulty: "Tough",
      stem: "“The government will subsidise producers £5 a unit, so consumer prices will fall £5.” Best read?",
      options: [
        "Prices fall the full £5 in any competitive market, because competition forces producers to pass the saving straight through to consumers.",
        "How far prices fall turns on demand and supply elasticity: pass-through splits the £5 between lower prices and higher producer margin, rarely the whole amount.",
        "The £5 lowers price by more than £5 where demand is elastic, since rising volume drives unit costs down and amplifies the cut further.",
        "Producers keep the subsidy in full, because a payment to producers raises their margin without changing the price they choose to set.",
      ],
      correct_option: "B",
      model_answer:
        "Incidence is set by relative elasticity; the consumer's share of the £5 lies between zero and £5 and is rarely the whole amount. A states the common misbelief that competition guarantees full pass-through, it does not. C smuggles in scale economies the subsidy does not imply. D is the opposite extreme, true only if demand is perfectly inelastic.",
    },
    {
      id: 7,
      block: "A",
      format: "mcq",
      reasoning_move: "A4",
      difficulty: "Tough",
      stem: "“Nine of our ten top salespeople use the new CRM workflow, so it drives performance.” Best objection?",
      options: [
        "With only ten people the sample is far too small to support any causal claim about the workflow, so the conclusion is unfounded.",
        "The workflow likely helps but the effect is overstated, since the one top performer who skips it shows it is not essential to high performance.",
        "Top reps are usually handed new tools first, so their high adoption reflects who got early access, which on its own does not prove the workflow lifts performance.",
        "The claim is base-rate and selection blind: you would need the share of weak performers who also use it, and whether strong reps adopt first.",
      ],
      correct_option: "D",
      model_answer:
        "Two gaps: the missing denominator (how many of the worst reps also use it?) and likely selection (strong reps adopt tools first). Naming both is the careful move. A gives only sample size. B over-reads the single non-user. C spots the selection angle but pins it on early access and stops short of the base-rate gap that D adds.",
    },
    {
      id: 8,
      block: "B",
      format: "integration",
      reasoning_move: "F1",
      difficulty: "Advanced",
      stem: "A board weighs entering a new national market. Hold all of this, then decide go or no-go and name the decisive constraint.",
      data: "· Market £600m, growing 4% a year\n· Three incumbents hold 80% between them\n· Your delivered cost is 8% above the cheapest incumbent (import duty)\n· One retailer controls 45% of the channel, already stocks two incumbents\n· A packaging regulation in 18 months raises every player's cost similarly\n· You have £30m to commit\n· The value segment (half the market) is highly price-sensitive",
      marking_guide:
        "Holds every fact and finds the binding one, not an answer that follows from market size and growth alone. States go or no-go, names the decisive constraint, and treats the packaging regulation as the red herring it is.",
      model_answer:
        "No-go as a broad entry. You are 8% costlier than the cheapest incumbent in a market where half the volume is price-sensitive, so you lose the value segment on economics. The retailer controlling 45% of the channel already backs two incumbents, so the premium segment has no route to shelf. The packaging regulation is a red herring, it moves all costs together and leaves relative position unchanged. £30m will not dislodge three incumbents at 80%. The only viable version is a narrow premium niche reached through channels the dominant retailer does not control; otherwise hold. Decisive constraint: a cost disadvantage in the price-sensitive half combined with a channel pre-committed to incumbents.",
      common_shortfall:
        "Answering go on market size and growth while missing that the channel is closed and the value half is lost on cost; or treating the packaging regulation as decisive when it moves all players together.",
    },
    {
      id: 9,
      block: "B",
      format: "track-state",
      reasoning_move: "E3",
      difficulty: "Tough",
      stem: "A product line begins at £2.0m monthly revenue and 60% gross margin. Apply in order, then give monthly gross profit at the end and whether the line is healthier on a run-rate basis.",
      data: "(1) Price rise → revenue £2.2m, gross margin rises to 64%\n(2) Input inflation → gross margin cut by 6 points\n(3) Volume falls → revenue down 8% from £2.2m\n(4) New £50k/month fixed marketing begins, below gross profit",
      marking_guide:
        "Carries the running figures through each step and lands on gross profit of about £1.17m, concluding slightly worse than the £1.20m start on a run-rate basis and clearly worse after the new fixed cost.",
      model_answer:
        "Start: £2.0m × 60% = £1.20m gross profit. After (1): revenue £2.2m, margin 64%. After (2): margin 58%. After (3): revenue £2.2m × 0.92 = £2.024m, margin 58%, gross profit £2.024m × 58% ≈ £1.17m. The £50k marketing sits below gross profit. So gross profit ≈ £1.17m, slightly below the £1.20m start on a run-rate basis, and clearly worse once the new £50k fixed cost is counted. The price rise was outweighed by margin compression and volume loss.",
      common_shortfall:
        "Dropping a step or treating the 6-point margin cut as applying to the 60% start rather than the 64% running figure, or forgetting the new fixed cost when judging health.",
    },
    {
      id: 10,
      block: "B",
      format: "filter",
      reasoning_move: "B6",
      difficulty: "Tough",
      stem: "A founder reports: daily active users grew 22% last quarter; a major redesign shipped in week 3; the largest competitor raised prices in week 5; a paid acquisition campaign ran weeks 6-9; investor NPS improved; the office moved to a larger space. Which facts bear on the user growth, and what would separate them?",
      marking_guide:
        "Discards the irrelevant facts (investor NPS, the office move) and proposes attribution among the real candidates (redesign, competitor price rise, paid campaign), not just a list.",
      model_answer:
        "The live candidates are the redesign (week 3), the competitor price rise (week 5), and the paid campaign (weeks 6-9). Investor NPS and the office move are irrelevant to user growth, filter them out. To separate the three, map the weekly DAU series against the timing, split organic from paid (isolates the campaign), and read retention by cohort acquired before versus after the redesign (isolates the redesign), and identify competitor-switchers if you can.",
      common_shortfall:
        "Listing all six facts as relevant, or naming the three candidates without any way to attribute growth among them.",
    },
    {
      id: 11,
      block: "B",
      format: "integration",
      reasoning_move: "E4",
      difficulty: "Advanced",
      stem: "Set the price of a new product. Hold the constraints, then give the single best price and say what the MFN clause costs you.",
      data: "· Variable cost £18 (price must clear it)\n· Nearest competitor sells a comparable product at £40\n· Premium segment: 40% of demand, pays up to £55, low sensitivity\n· Value segment: 60% of demand, pays up to £34, high sensitivity\n· Biggest customer has an MFN clause: your list price is the most they pay; no segment price discrimination with one SKU\n· Volume: ~200k units at a value price, ~70k at a premium price",
      marking_guide:
        "Holds all constraints, picks one price with the contribution comparison (value ~£34 beats premium ~£55), and prices the MFN clause as the forgone premium surplus of roughly £1.5m.",
      model_answer:
        "One SKU plus an MFN clause means you cannot serve both segments at different prices, so you choose. Premium (~£55): 70k × £37 = £2.59m contribution, abandons the value segment. Value (~£34): 200k × £16 = £3.2m contribution (premium buyers come too, at a surplus to them). The value price wins on total contribution (£3.2m vs £2.59m) and clears break-even, so ~£34 is the better single price. The MFN clause is what forces the choice; its cost is the foregone premium surplus you would have captured with a second SKU or segmented pricing, roughly £21 × 70k ≈ £1.5m.",
      common_shortfall:
        "Picking the premium price on its higher margin per unit while missing that value volume wins on total contribution, or ignoring the MFN clause that forbids serving both.",
    },
    {
      id: 12,
      block: "B",
      format: "track-state",
      reasoning_move: "E3",
      difficulty: "Tough",
      stem: "A founder owns 100% at the start. Apply each round (every new issuance dilutes all prior holders proportionally), then give the founder's approximate stake after Round C.",
      data: "Round A: sells 25% (post-money)\nRound B: sells a further 20%, and creates a 10% option pool in the same round (both post-money, diluting existing holders pro rata)\nRound C: an investor buys 15% (post-money)",
      marking_guide:
        "Multiplies the surviving fraction round by round rather than subtracting, landing the founder at about 45%.",
      model_answer:
        "Start 100%. After A: 75%. Round B issues 30% new (20% + 10% pool), so existing keep 70%: 75% × 0.70 = 52.5%. Round C sells 15%, existing keep 85%: 52.5% × 0.85 ≈ 44.6%. Founder ends ≈ 45%. The trap is subtracting (100 − 25 − 30 − 15 = 30%), which is wrong because each round dilutes the already-diluted stake.",
      common_shortfall:
        "Subtracting the percentages to reach about 30% instead of multiplying the surviving fraction each round.",
    },
    {
      id: 13,
      block: "B",
      format: "integration",
      reasoning_move: "E2",
      difficulty: "Advanced",
      stem: "A factory faces make-versus-buy for a component. Hold the numbers, then decide at expected volume and say how the demand uncertainty changes the answer.",
      data: "· In-house: £4m machine, 5-year straight-line life (£800k/yr); £6 variable per unit\n· Buy: £11 per unit, price fixed for three years\n· Expected volume 150k/yr; could be 80k or 220k\n· In-house use displaces a product earning £200k/yr contribution",
      marking_guide:
        "Finds the 200k break-even, decides buy at the expected 150k, and frames the uncertainty as irreversible commitment versus flexible supply.",
      model_answer:
        "In-house annual cost = £800k depreciation + £6V + £200k opportunity = £1.0m + £6V. Buy = £11V. Indifference: £1.0m + 6V = 11V → V = 200k. Below 200k, buy is cheaper; above, make. At expected 150k: buy £1.65m vs make £1.9m, so buy. Uncertainty matters because the break-even (200k) sits above the expected volume and the range is 80k-220k: the machine is an irreversible fixed commitment while the supplier price is fixed and flexible. With a break-even above expectation, buy is the robust choice; make only if confident of sustained volume above 200k.",
      common_shortfall:
        "Omitting the £200k displaced contribution from the in-house cost, or deciding make on the low per-unit variable cost while ignoring that the break-even sits above expected volume.",
    },
    {
      id: 14,
      block: "B",
      format: "filter",
      reasoning_move: "E4",
      difficulty: "Tough",
      stem: "An analyst weighs keeping a product: it has the highest satisfaction in the range; the lowest unit volume; it shares a production line with the best-seller; it earns a 12% gross margin against a 40% range average; it appears in brand advertising; its customers buy three other products on average. Which facts bear on keep-or-cut, and what is the likely right call?",
      marking_guide:
        "Filters the soft facts (satisfaction, advertising, low volume) and lands on incremental contribution, not standalone margin: the shared line and the basket halo argue to keep against the 12% margin.",
      model_answer:
        "Decision-relevant: the low margin (12% vs 40%), the shared line with the best-seller (cutting it may raise the best-seller's unit cost by removing shared volume), and the basket halo (its customers buy three other products, so it may anchor profitable baskets). High satisfaction, advertising presence, and low volume on their own are not reasons to cut. The right call is not a simple cut: the 12% margin argues to cut, but the shared line and the halo argue to keep, so you need the incremental contribution including the effect on the best-seller's cost and on the baskets it anchors, not its standalone margin.",
      common_shortfall:
        "Cutting on the 12% standalone margin while missing that the shared line and basket halo make incremental contribution the right number.",
    },
    {
      id: 15,
      block: "C",
      format: "multi-chain",
      reasoning_move: "C2",
      difficulty: "Advanced",
      stem: "A mid-market hotel chain cuts room rates 15% to lift occupancy. Trace the demand chain, the competitor-response chain, and the margin/operating-leverage chain, and state the condition under which the cut is accretive to profit.",
      marking_guide:
        "Traces all three chains and integrates them into a condition, including the margin given away on guests who would have paid full price.",
      model_answer:
        "Demand: a lower rate lifts occupancy if demand is elastic; occupancy must rise roughly more than 15% just to hold room revenue, and perishable rooms make filling them valuable. Competitor response: nearby hotels match to defend occupancy, so the gain partly reverses and the market settles at lower rates with similar relative occupancy, a worse resting point; durable only if rivals cannot or will not match. Margin/operating-leverage: high fixed costs mean incremental guests at a lower rate still carry high contribution, which favours the cut, but the cut applies to all guests, so the margin surrendered on those who would have paid full price can swamp the contribution from new ones. Condition: accretive only if demand is elastic enough to lift occupancy substantially, rivals do not match, and the new contribution exceeds the margin given up on existing guests. Because of that last point, broad cuts usually disappoint; fenced, targeted discounting captures the upside without surrendering the full-price base.",
      common_shortfall:
        "Tracing demand alone and concluding the cut works, while missing the competitor match and the margin surrendered on full-price guests.",
    },
    {
      id: 16,
      block: "C",
      format: "cross-impact",
      reasoning_move: "C5",
      difficulty: "Advanced",
      stem: "A consumer brand simultaneously raises price 8% and cuts marketing spend 40% to protect margin. Trace both chains and their interaction, and name the risk that the two moves combine worse than either alone.",
      marking_guide:
        "Traces both chains and the reinforcing interaction (marketing underpins the demand the price rise leans on), not the two effects added independently.",
      model_answer:
        "Price chain: +8% lifts unit margin and much sticks on the loyal base, but loses price-sensitive marginal buyers. Marketing chain: the 40% cut saves cost now but reduces demand generation and salience, softening volume with a lag and weakening pricing power over time. Interaction, the danger: they reinforce on the downside. A price rise makes the brand more dependent on perceived value and loyalty to hold volume, which is exactly what marketing sustains; cutting marketing at the same moment removes the support for the higher price, so volume falls by more than the two effects taken separately. You raise the price and stop telling people why it is worth it. Compounding: lower volume on a high-fixed-cost base raises unit cost. Net: unit margin rises but total contribution can fall, and long-run pricing power weakens. Safer to sequence one, measure, then the other.",
      common_shortfall:
        "Adding the two effects independently and missing that marketing underpins the demand the higher price now leans on, so the volume loss is larger than additive.",
    },
    {
      id: 17,
      block: "C",
      format: "multi-chain",
      reasoning_move: "C2",
      difficulty: "Advanced",
      stem: "A two-sided marketplace cuts its take rate (seller commission) from 20% to 12% to attract sellers. Trace the seller-supply chain, the buyer-value chain, and the unit-economics chain, and state the condition under which the cut grows profit, not just volume.",
      marking_guide:
        "Traces all three chains and ties the condition to supply being the bottleneck, real network effects, and GMV elasticity high enough to clear the ~two-thirds revenue gap.",
      model_answer:
        "Seller-supply: a lower take rate raises sellers' net margin, drawing more sellers and listings, and may lower buyer prices if passed through. Buyer-value: more listings mean more selection and (if passed through) lower prices, which via network effects pull in buyers, which pull in more sellers, a reinforcing loop, but only if network effects are real and supply was the binding constraint. Unit-economics: the marketplace earns less per transaction, so GMV must rise about two-thirds (20/12 ≈ 1.67) just to hold revenue, and profit grows only if added volume more than offsets the lower rate without costs rising proportionally. Condition: profit, not just volume, grows only if supply was genuinely the bottleneck, network effects are strong enough that supply pulls demand, and GMV elasticity to the take rate is high enough that volume rises more than two-thirds. If demand was the constraint, or sellers pocket the cut without lowering prices, the marketplace simply earns less on similar volume.",
      common_shortfall:
        "Showing volume grows without checking that GMV must rise about two-thirds to hold revenue, or assuming supply was the bottleneck without arguing it.",
    },
    {
      id: 18,
      block: "C",
      format: "branching",
      reasoning_move: "C1",
      difficulty: "Advanced",
      stem: "A dominant software firm considers giving away a basic version of its paid product for free to widen the funnel. The outcome depends on the main rival's response. Carry both branches to third order and say which dominates.",
      marking_guide:
        "Carries both branches to third order and lands on the decisive variable: the rival's asymmetric ability and willingness to match (counter-positioning).",
      model_answer:
        "Branch 1, rival does not match: first order, the free tier widens the funnel and grows users; second order, some paid users downgrade (cannibalisation) while new free users partly convert up, so net paid revenue depends on conversion-up minus downgrade; third order, free becomes the category default, raising switching costs and starving the rival of new users, so the firm strengthens and monetises the enlarged base later. Here free is a moat. Branch 2, rival matches with its own free tier: first order, both go free at the basic level; second order, basic is commoditised to zero for everyone, so neither gains relative users but both lose basic-tier revenue; third order, competition shifts to the paid premium tier, basic margin is gone permanently, and the firm has turned a paying segment into a free one for no relative gain, a worse resting point. Which dominates: it hinges on whether the rival can and will match. If the rival leans on basic-tier revenue or lacks scale to subsidise free, Branch 1 holds; if it can match cheaply, Branch 2 dominates. So the move is attractive only with an asymmetry (scale, a different revenue base) that makes matching hurt the rival more, which is counter-positioning.",
      common_shortfall:
        "Carrying only the favourable branch, or stopping at second-order cannibalisation without reaching the resting point each branch settles into.",
    },
    {
      id: 19,
      block: "C",
      format: "multi-chain",
      reasoning_move: "D5",
      difficulty: "Advanced",
      stem: "A retailer considers acquiring its main logistics supplier to cut delivery cost and control service. Trace the cost chain, the strategic-control chain, and the focus/complexity chain, and name the decisive variable.",
      marking_guide:
        "Traces all three chains and lands the decisive variable on whether the retailer's volume supports competitive in-house scale and whether logistics differentiates.",
      model_answer:
        "Cost: owning logistics removes the supplier's margin, a saving, but only if the retailer runs it at least as efficiently at its own volume; below the supplier's scale, in-house unit costs may be higher, since the supplier's other clients gave it scale the retailer alone lacks. Strategic-control: ownership guarantees capacity and service, blocks the supplier from favouring a rival, and captures delivery data, valuable if logistics differentiates or is a bottleneck. Focus/complexity: logistics is a different, capital-intensive business with its own labour and management demands; running it dilutes attention from retail, adds fixed assets and risk, and forfeits the option to switch providers or ride the supplier's future innovation. Decisive variable: whether the retailer's volume supports competitive in-house scale, and whether logistics is a real differentiator or a commodity better bought. If volume supports efficient scale and service differentiates, integrate; if sub-scale or commoditised, the supplier's margin is the price of flexibility and focus, so buy.",
      common_shortfall:
        "Counting the supplier's margin as a guaranteed saving without checking that in-house volume supports competitive scale.",
    },
    {
      id: 20,
      block: "C",
      format: "multi-chain",
      reasoning_move: "C2",
      difficulty: "Advanced",
      stem: "A software company sells two products separately and considers bundling them at a single price below the sum. Trace the revenue chain, the cannibalisation chain, the competitive-response chain, and the cost chain, and give the condition under which bundling creates value. (This is the heaviest, done last.)",
      marking_guide:
        "Traces all four chains and integrates the valuation-correlation, marginal-cost, and competitive points into one condition.",
      model_answer:
        "Revenue: bundling captures more total willingness-to-pay when customer valuations for the two products are dispersed or negatively correlated (those who value A less value B more), so one bundle price extracts surplus that separate prices leave on the table. Cannibalisation: customers who would have bought both at full price now pay the lower bundle price, so you lose margin on the both-buyers; bundling helps only if it brings in single-product buyers by making the second product nearly free to them. Competitive response: if a rival sells one of the two standalone, your bundle can foreclose them, but they may bundle back or cut their standalone price, and regulators may object if you are dominant. Cost: software has near-zero marginal cost, so giving the second product in a bundle costs almost nothing, which strongly favours bundling. Condition: bundling creates value when valuations across the two products are dispersed or negatively correlated, the second product's marginal cost is low, and the competitive effect is foreclosure rather than retaliation. It destroys value if most customers already wanted both (a pure margin give-away) or marginal cost is high.",
      common_shortfall:
        "Tracing revenue and cost while missing that bundling is a give-away when most customers already wanted both, or ignoring the rival's bundle-back response.",
    },
  ],
  day_problem: {
    title: "Harvest Lane and the discounter",
    subtitle: "Four chains interact. Trace all of them before you commit.",
    case: "Harvest Lane is a branded ambient soups and sauces business in the UK, £400m revenue, around 22% operating margin on its core range. Over three years a discounter's own private label and a cheap value brand have grown from 8% to 19% of category share, undercutting Harvest Lane by about 35% on shelf price. Harvest Lane's volume is flat and its share has slipped from 31% to 26%.\n\nThe board is split three ways. One camp wants to launch “Lane Basics”, a fighter brand priced 30% below the core range, to win back value shoppers. A second wants to cut the core brand's price 12% to close the gap. A third wants to hold price and pour £25m into product and marketing to deepen differentiation.\n\nWhat you know: the core brand runs a 55% gross margin; a fighter brand would run about 35%. The largest retailer takes 40% of Harvest Lane's volume and is also the one pushing its own private label hardest, and it controls shelf allocation. Roughly 60% of Harvest Lane's volume comes from loyal, less price-sensitive buyers and 40% from switchers. Manufacturing carries high fixed costs, so lost volume hurts margin through operating leverage. A price cut is hard to reverse. A fighter brand would take 12 to 18 months and about £15m to establish.",
    prompt:
      "Which path should Harvest Lane take? Trace every causal chain each option sets off, identify the decisive variables, state what evidence would change your answer, and give a recommendation under uncertainty with its single biggest risk.",
    how_to_work_it:
      "Read it now and note the chains you can see. Come back at two or three points today to add or correct a chain rather than starting over. Write the structured answer tonight, then submit to mark yourself.",
    marking_guide:
      "A strong answer traces all four chains. Cannibalisation chain (fighter brand): at 35% versus 55% margin, every cannibalised core unit destroys 20 points of margin, so it works only if it draws genuinely new value volume rather than converting the loyal base; the decisive variable is the cannibalisation rate against the margin gap. Retailer/competitive chain: the dominant retailer controls shelf and wants its own label to win, so a fighter may get little space or be delisted and the discounter can re-cut; the decisive variable is whether the retailer will stock and support a fighter. Price-cut chain: with 60% loyal and inelastic, a 12% cut mostly surrenders margin on buyers who would have paid full price, is hard to reverse, and may trigger a re-cut to a lower-margin equilibrium; the decisive variable is the segment elasticity split and the competitor's response. Operating-leverage/differentiation chain: high fixed costs make lost volume expensive, but defending volume at destroyed margin is worse than ceding low-value switchers; holding and investing £25m protects the profitable loyal base but cedes share near-term. Then: name the decisive variables, specify measurable evidence that would move the call, commit to a recommendation under uncertainty, and name the single biggest risk. Mark down for tracing only one or two chains, listing chains without integrating them, stopping at “it depends”, or naming a decisive variable without saying how to measure it.",
    model_answer:
      "Cannibalisation chain (fighter brand). Lane Basics pulls some switchers back but also cannibalises core buyers who trade down; at 35% versus 55% margin, every cannibalised unit destroys 20 points of margin. Decisive variable: the cannibalisation rate against the margin gap. It only works if it draws genuinely new value-segment volume rather than converting your own loyal base.\n\nRetailer/competitive chain. The dominant retailer wants its own label to win and controls shelf, so a fighter may get little space or be delisted, and the discounter can re-cut. Decisive variable: whether the retailer will stock and support a fighter against its own private label.\n\nPrice-cut chain. A 12% core cut closes the gap but, with 60% loyal and inelastic, mostly surrenders margin on buyers who would have paid full price (incidence and elasticity), is hard to reverse, and may trigger a discounter re-cut that resets the category to a lower-margin equilibrium. Decisive variable: the elasticity split between loyal and switcher segments, and the competitor's response.\n\nOperating-leverage / differentiation chain. High fixed costs make lost volume expensive, so defending volume has value, but defending it at destroyed margin is worse than ceding low-value switchers. Holding and investing £25m protects the profitable 60% loyal base and brand equity and avoids a margin war, but cedes share near-term, and continued share loss has its own second-order risk of retailer delisting.\n\nDecisive variables overall: the fighter's cannibalisation rate, the segment elasticity split, the retailer's willingness to support a fighter, and whether the discounter re-cuts. Evidence that would move the call: measured elasticity by segment from past price moves, the retailer's shelf intentions, a contained test-market of a fighter to measure real cannibalisation, and the true fixed/variable cost split. Recommendation under uncertainty: lean to holding and differentiating, protect the profitable loyal base, do not start a price war that resets category margins, and treat part of the value segment as unprofitable to defend (counter-positioning). Run a fighter only as a contained test where cannibalisation can be measured low and the retailer will support it. Biggest risk: ceding too much share triggers retailer delisting and a share spiral the loyal base cannot sustain.",
  },
};
