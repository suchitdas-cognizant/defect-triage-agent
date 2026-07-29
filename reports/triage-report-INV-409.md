# Triage Report: INV-409

## Assessment Report

**Title:** Inventory quantity differs between cart and order summary

**Environment:** Staging

**Reporter:** Meera QA

**Summary:** When two users add the final item at the same time, the cart still shows stock available while the order summary blocks checkout. Logs show a stock reservation conflict and suspected race condition.

## Recommendation

**Severity:** High

**Priority:** P1

**Owning Component:** Inventory

**Owning Team:** Commerce Core

**Confidence:** 80 percent

**Recommended Routing:** Route to Commerce Core as P1 because this is a checkout-adjacent inventory consistency issue that can block release if reproduced.

## Evidence

| Evidence Type | Finding |
|---|---|
| Title | Inventory quantity differs across cart and order summary. |
| Description | Concurrent users adding the last item trigger inconsistent availability. |
| Logs | `stock_reservation conflict`, `retry_count=0`, race condition suspected. |
| Ownership Map | Stock, reservation, quantity, and inventory behavior map to Commerce Core. |
| Repo Source Context | Repo source context was not available in this PoC folder. |
| Historical Match | ORD-917 has similar concurrent checkout and reservation conflict signals. |

## Risk Analysis

| Risk Area | Assessment |
|---|---|
| Customer Impact | Medium currently because the issue is in staging. |
| Business Impact | High if released because checkout can be blocked. |
| Data/Security Risk | Low security risk, medium data consistency risk. |
| Release Risk | High because final inventory reservation is checkout-critical. |
| Operational Risk | Medium due to potential oversell or false availability. |

## Coverage Summary

**Checked Context:**

- `docs/ownership-map.md`
- `docs/severity-rules.md`
- `data/sample-defects.json`
- Repo source context was not available in this PoC folder.
- Ownership verified through inventory quantity mismatch, stock reservation conflict, final-item concurrency, and checkout blocking signals.

**Likely Similar Defects:**

- ORD-917: race condition during final stock reservation.

**Missing Information:**

- Exact reproduction rate.
- Whether retry behavior is expected.
- Whether this appears in production telemetry.

## Triage And Routing Summary

INV-409 should be routed to Commerce Core as High/P1. Although it is in staging, the defect affects a checkout-adjacent inventory reservation path and matches a known race-condition pattern. Add inventory, stock-reservation, race-condition, and release-risk labels.

## Action Checklist

- [ ] Confirm reproduction rate with two concurrent sessions.
- [ ] Capture trace IDs for reservation conflict.
- [ ] Assign to Commerce Core.
- [ ] Add `inventory`, `stock-reservation`, `race-condition`, and `release-risk` labels.
- [ ] Ask owner to verify retry handling.
- [ ] Add this triage report as an issue comment.
