# Idea v2: ClaimZero

**Mode:** improve. **Goal:** unicorn, starting from India. **Success test:** credible path to roughly US$80-100M ARR in 7 to 8 years with a defensible position.

## The proposal (revised)

ClaimZero is AI decisioning infrastructure that resolves routine consumer claims (not delivered, wrong item, damaged item, refund and return requests) for high-volume consumer businesses in India. It reads the evidence, applies each enterprise's own policy and issues a decision, with people handling edge cases and every rejection open to appeal.

**Problem and data.** Unchanged from v1 (high routine claim volumes, manual resolution, headcount-driven scaling, fragmented customer experience; data points as cited in v1).

**Distribution.** ClaimZero is sold primarily as an API or module through 2 to 3 order-management, shipping or returns platforms, which already hold the order, delivery and payment data. Brands that want it can still sign a direct contract with ClaimZero carrying its own service levels and liability terms.

**Data access (stated dependency).** Decisions need real-time order, delivery, cash-on-delivery and payment status. The plan names the systems required (order management, warehouse, courier APIs, payment gateway) and treats access terms with each as the first commercial milestone, not a solved problem.

**Product flow.**
1. Customer files a claim inside the brand's app or site, or through the partner platform's returns flow.
2. ClaimZero gathers photos, receipts, order and delivery data and applies the enterprise's codified policy.
3. Decision: refund, credit, replace or reject. Every rejection carries a plain-language reason and a one-click appeal to a human, logged for the merchant's grievance officer.
4. Staged rollout per merchant: for the first 90 days the AI recommends and a person confirms every rejection. Auto-rejection is switched on only once the merchant's measured false-rejection rate is below an agreed threshold (for example 1%).
5. Dashboard shows auto-resolution rate, false-rejection rate, savings and escalations.

**Liability.** ClaimZero indemnifies the merchant for demonstrable wrongful auto-rejections above an agreed error-rate ceiling. The per-merchant false-rejection rate is published to the merchant, not held as an internal statistic.

**Fraud signals and data (rebuilt).** Per-merchant learning uses that merchant's own claim history under its privacy notice. Cross-merchant fraud signals are shared only as hashed or derived risk scores, never raw identifiers (phone, email, order history). Sharing is opt-in per consumer as a distinct, disclosed purpose. A cross-merchant flag is shown to the merchant's reviewer as a signal they can see and overturn; it never triggers an automatic rejection on its own. Consumers can see and contest their flag status. The consented score network, built on top of partner distribution, is the intended network effect.

**Business model.** Tiered subscription by claim volume plus a per-claim fee (unchanged pending the pricing question below).

## Changelog from v1

| Change | Proposed by | Backing |
|---|---|---|
| Raw cross-merchant identifier pooling replaced by consented, hashed or derived risk scores that are visible and contestable | Legal and fraud expert (VC's consortium graph merged in, modified) | All four |
| Every rejection has a plain reason and one-click human appeal | Legal and fraud expert | All four |
| 90-day human-confirm ramp for rejections, auto-reject only below agreed error rate | D2C buyer | All four |
| Indemnity above an error-rate ceiling, published false-rejection rate | D2C buyer | Buyer, legal, VC (as cost of doing business) |
| Cross-merchant flag is a reviewer signal, never an automatic reject | D2C buyer (round 2) | Buyer, legal, platform head |
| Named data-access dependency as first milestone | Platform product head | Platform, VC, buyer (modified) |
| Partner-led distribution through order, shipping or returns platforms, direct contract still available | Platform product head | Platform, VC, legal. Buyer dissents: wants a direct enforceable contract, hence the direct option |

## Open (contested or unaddressed)
- Pricing: VC proposes a share of support cost saved (15-20%), routed through partner terms. Only the VC backed it.
- Vertical focus: VC's alternative of starting in travel and ticketing, where claim values are higher. Not debated by others.
