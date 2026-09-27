# Round 1: Partner, technology and consumer law; ex-head of fraud risk

1. Verdict: back with changes.

2. Biggest risk: the "privacy-preserving cross-merchant behaviour data" moat is the biggest legal and business exposure. Under the DPDP Act 2023, processing a customer's claim history and photos for one merchant's fraud decisioning is defensible under purpose limitation if disclosed at collection; pooling signals across unrelated merchants to build a shared claimant risk score is a materially different purpose requiring fresh, specific consent, and consent for "processing your return" will not stretch to cover it (judgement, pending final DPDP Rules and Data Protection Board enforcement posture). Cross-merchant blacklisting without consent also risks being read as an unfair trade practice under the Consumer Protection Act if a customer is auto-rejected at Merchant B because of conduct flagged at Merchant A, with no visibility into why. This undermines the "auditable decision" promise.

3. Amendments:
(a) Rewrite the moat line: cross-merchant fraud signals are opt-in per data principal, disclosed in each merchant's privacy notice, and shared only as a derived risk score (not raw claim history), with the claimant able to see and contest their flag status.
(b) Add to product flow step 3: every AI rejection carries a plain-language reason and a mandatory one-click appeal path to a human, logged for the merchant's grievance officer.

4. Score: 6/10. Sound wedge on manpower cost and speed; the cross-merchant data moat as worded is the weakest and riskiest part.

5. Blocking objection: no, provided cross-merchant profiling is rebuilt on explicit consent and the appeal path is contractually mandatory before any client goes live.

6. Factual question: Does the design pool raw claimant identifiers (phone/email/order history) across merchants, or only hashed risk scores, and is merchant-level consent language drafted?
