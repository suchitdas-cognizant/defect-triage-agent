# Severity Rules

Use these rules to validate and adjust every triage recommendation. A report should cite the
specific trigger used for the final severity and priority decision.

## Priority Scale

| Priority | Severity | Meaning | Expected Action |
|---|---|---|---|
| P0 | Critical | Production outage, data loss, security exposure, payment block, or broad customer impact | Immediate escalation and owner assignment |
| P1 | High | Production issue with limited impact, major regression, blocked workflow, or high-value user group impact | Route to owner and request fix plan |
| P2 | Medium | Non-production defect, partial feature break, workaround exists, or limited customer impact | Add to sprint triage or backlog |
| P3 | Low | Cosmetic issue, minor inconsistency, unclear impact, or low-risk enhancement-like defect | Backlog with missing info request |

## Escalation Logic

Apply the highest matching trigger that is supported by evidence in the defect report, logs,
repository context, ownership map, or historical examples.

- P0 overrides lower priorities when a critical production path is blocked, financial state may be wrong, security exposure is indicated, or multiple customers are affected with no workaround.
- P1 is the default escalation level for high-risk non-production defects that can block release signoff, or for production defects with contained impact.
- P2 is appropriate for reproducible non-production defects when release impact is not proven and a workaround or limited scope exists.
- P3 is appropriate only when impact is cosmetic, unclear, low-usage, or missing enough evidence to justify higher priority.
- If evidence is incomplete, keep the recommendation human-reviewed and list the missing information. Do not raise severity based on assumed impact.

## Critical Triggers

Classify as P0 or review as P0 candidate if any of these are present:

- production checkout blocked
- payment authorization failure affecting multiple customers
- data loss or duplicate financial adjustment
- authentication outage
- security exposure
- order creation failure after successful payment
- no workaround for a critical customer journey

P0 examples:

- Production checkout fails after payment OTP confirmation, logs show authorization timeout, and multiple users are affected.
- A production order is not created after successful payment, creating possible payment/order state divergence.
- A live authentication outage prevents a broad group of users from logging in and no workaround is available.

## High Triggers

Classify as P1 if any of these are present:

- production issue with contained impact
- major regression after release
- repeated 500 or timeout in core workflow
- finance, settlement, or reporting mismatch
- UAT issue blocking release signoff

P1 examples:

- UAT password reset is blocked on a supported browser and may block release signoff.
- Staging checkout-adjacent inventory reservation fails in a reproducible race condition that could cause release risk.
- Production reporting totals are mismatched for a contained finance workflow.

## Medium Triggers

Classify as P2 if:

- issue is in UAT or staging
- workaround exists
- impact is limited to a browser, role, or secondary workflow
- defect is reproducible but not release blocking

P2 examples:

- A staging defect affects a secondary workflow and a workaround exists.
- A UAT browser-specific issue is reproducible but not part of release signoff.
- A role-specific feature partially fails without production customer impact.

## Low Triggers

Classify as P3 if:

- cosmetic defect
- unclear reproduction
- low usage path
- no customer or release impact identified

P3 examples:

- A cosmetic alignment issue appears on a low-traffic page.
- A defect report has unclear reproduction steps and no logs, customer impact, or release impact.
- A minor label inconsistency has no workflow, data, security, or operational impact.

## Confidence And Missing Information

Use confidence to communicate evidence strength, not urgency.

- 85 to 95 percent: title, description, logs, ownership map, severity rule, and historical pattern all align.
- 70 to 84 percent: most evidence aligns, but one or more operational details are missing.
- Below 70 percent: component or severity is plausible but important evidence is missing; require human review before routing.

Limit confidence when these details are missing:

- exact impacted user count or customer segment
- production versus non-production parity
- reproduction rate
- trace IDs, timestamps, or provider incident status
- workaround availability
- release-blocking status for UAT or staging issues

## Risk Analysis Rules

Risk analysis must separate confirmed evidence from conditional impact.

- Customer Impact: cite environment, affected users, browser/role scope, or say impact is not yet proven.
- Business Impact: cite checkout, payment, order creation, release signoff, reporting, or other business workflow evidence.
- Data/Security Risk: cite actual data loss, financial divergence, auth/security behavior, or explicitly state when no direct security evidence exists.
- Release Risk: cite production status, release-blocking UAT/staging status, or say release impact needs confirmation.
- Operational Risk: cite likely support load, escalation need, monitoring gaps, or missing telemetry.

## Validation Checklist

Before finalizing a report, verify:

- severity matches the documented trigger
- priority matches severity
- the report cites the documented trigger by name or wording
- owner maps to the ownership map
- missing information is listed
- confidence is limited when important evidence is missing
- recommendation includes a human-review step
- report does not invent facts
