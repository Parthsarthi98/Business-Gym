# Idea v3 (final): ClaimZero

**Mode:** improve. **Goal:** unicorn, starting from India. **Success test:** credible path to roughly US$80-100M ARR in 7 to 8 years with a defensible position.

## The proposal

ClaimZero is AI decisioning infrastructure that resolves routine consumer claims (not delivered, wrong item, damaged item, refund and return requests) for high-volume consumer businesses in India. It reads the evidence, applies each enterprise's own policy and issues a decision, with people handling edge cases and every rejection open to appeal.

**Distribution.** Sold as an API or module through order-management, shipping or returns platforms, and directly to brands that want their own contract, service levels and liability terms. Partner deals are on ClaimZero's commercial terms (per-claim and volume pricing set by ClaimZero), not a pass-through revenue share set by the partner.

**Data access.** Decisions need real-time order, delivery, cash-on-delivery and payment status. The first commercial milestone is signed access terms with the named systems (order management, warehouse, courier APIs, payment gateway). No partner integration starts until one platform agrees to hold and process the data under a proper data processing agreement.

**Product flow.**
1. Customer files a claim in the brand's app or site, or through the partner's returns flow.
2. ClaimZero gathers photos, receipts, order and delivery data and applies the enterprise's codified policy.
3. Decision: refund, credit, replace or reject. Every rejection has a plain-language reason and a one-click appeal to a human, with grievance logging and response times that meet the Consumer Protection (E-Commerce) Rules.
4. Staged rollout per merchant: for 90 days a person confirms every rejection. Auto-rejection switches on only once the merchant's measured false-rejection rate is below 1%.
5. Dashboard shows auto-resolution rate, false-rejection rate, savings and escalations.

**Liability.** ClaimZero indemnifies the merchant for demonstrable wrongful auto-rejections above a fixed error-rate ceiling written into the contract (starting point: 1%). The per-merchant false-rejection rate is published to the merchant.

**Fraud signals and data.** Per-merchant learning uses that merchant's own claim history under its privacy notice. Cross-merchant signals are shared only as hashed or derived risk scores, never raw identifiers. Sharing is a distinct, disclosed, opt-in purpose. A cross-merchant flag is a signal for the reviewer and never triggers an automatic rejection. Consumers can see and contest their flag. Before any pilot: counsel-reviewed consent clause, and a test that derived scores cannot be re-identified. The consented score network is treated as a long-term advantage, not an early moat.

**Pricing.** Tiered subscription by claim volume plus a flat per-claim fee that merchants can budget against.

## Changelog from v2

| Change | Proposed by | Backing |
|---|---|---|
| Indemnity ceiling set as a fixed contractual number (starting point 1%) | D2C buyer | Buyer, legal |
| Pre-pilot legal conditions: counsel-reviewed consent clause, re-identification test, E-Commerce Rules appeal timelines | Legal and fraud expert | No objection from any member |
| Partner deals on ClaimZero's own terms, not partner-set revenue share | Sceptical VC | VC, buyer (prefers flat fee) |
| Revenue-share pricing dropped; flat per-claim fee kept | D2C buyer, VC (reversed own proposal) | Buyer, VC |
| No partner integration before a platform signs to hold and process the data | Platform product head | Platform, legal |
| Consented network reframed as long-term, not early moat | Legal and fraud expert (adverse selection of opt-in) | Legal, platform |

## Still contested after 3 rounds
- **Direct versus partner-led sales as the default.** Platform head wants partners as default and direct as a side door. Buyer and VC want direct contracts as a real channel so ClaimZero keeps the merchant relationship and pricing power.
- **Path from India to US$80-100M ARR.** VC's bottom-up estimate (judgement): 300-500 buyers at US$50-150K ACV gives US$15-75M domestically. Needs a higher-value vertical (travel, ticketing, payment disputes) or international expansion. Not yet in the plan. VC holds a blocking objection on this.
- **Will partners partner?** The platform head, asked directly, would build this in one to two quarters rather than partner at seed stage, and would only license or acquire once a multi-platform consented network exists. This undercuts the partner-led plan.
