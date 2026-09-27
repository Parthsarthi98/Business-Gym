# Round 1: Head of Product, e-commerce enablement platform

1. Verdict: back with changes.

2. Biggest risk: fails the feature-vs-platform test. Claims resolution needs order data, delivery data, payment status and return logistics that the platform (Shiprocket/Clickpost/Pickrr-type players) or the enterprise's own OMS already holds. A standalone vendor still has to integrate with WMS, courier APIs, payment gateway and OMS to get evidence: the same integration surface an existing returns/post-purchase platform already occupies. Once it works, the platform it depends on for data has every incentive to clone the decisioning layer and bundle it free, because the marginal cost is near zero and the data gravity already sits there (judgement). The cross-merchant moat needs scale it won't have before an incumbent reacts.

3. Amendments:
a) Reposition as an infrastructure layer sold through/to existing returns and shipping platforms (API/module, not brand-facing white-label app), with a go-to-market of 2-3 logistics/OMS partnerships before direct enterprise sales, so the moat is partner lock-in rather than a race an incumbent can win by bundling.
b) Add a stated data-access assumption: name which systems (OMS, WMS, courier, PG) must grant API access and on what commercial terms, since adjudication is worthless without real-time delivery/COD/payment truth.

4. Score: 4/10. Real problem, thin defensibility as a standalone company at unicorn scale.

5. Blocking objection: no. Viable as a module sold via or into existing platforms, not as the stated standalone infra play.

6. Factual question: Do major Indian returns/post-purchase platforms already offer or plan AI claim adjudication, and has ClaimZero discussed API/data access with any enterprise's OMS or payment gateway?
