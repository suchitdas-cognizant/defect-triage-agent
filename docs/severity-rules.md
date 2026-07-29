# Severity Rules

Use these rules to validate and adjust the triage recommendation.

## Priority Scale

| Priority | Severity | Meaning | Expected Action |
|---|---|---|---|
| P0 | Critical | Production outage, data loss, security exposure, payment block, or broad customer impact | Immediate escalation and owner assignment |
| P1 | High | Production issue with limited impact, major regression, blocked workflow, or high-value user group impact | Route to owner and request fix plan |
| P2 | Medium | Non-production defect, partial feature break, workaround exists, or limited customer impact | Add to sprint triage or backlog |
| P3 | Low | Cosmetic issue, minor inconsistency, unclear impact, or low-risk enhancement-like defect | Backlog with missing info request |

## Critical Triggers

Classify as P0 or review as P0 candidate if any of these are present:

- production checkout blocked
- payment authorization failure affecting multiple customers
- data loss or duplicate financial adjustment
- authentication outage
- security exposure
- order creation failure after successful payment
- no workaround for a critical customer journey

## High Triggers

Classify as P1 if any of these are present:

- production issue with contained impact
- major regression after release
- repeated 500 or timeout in core workflow
- finance, settlement, or reporting mismatch
- UAT issue blocking release signoff

## Medium Triggers

Classify as P2 if:

- issue is in UAT or staging
- workaround exists
- impact is limited to a browser, role, or secondary workflow
- defect is reproducible but not release blocking

## Low Triggers

Classify as P3 if:

- cosmetic defect
- unclear reproduction
- low usage path
- no customer or release impact identified

## Validation Checklist

Before finalizing a report, verify:

- severity matches the documented trigger
- priority matches severity
- owner maps to the ownership map
- missing information is listed
- recommendation includes a human-review step
- report does not invent facts
