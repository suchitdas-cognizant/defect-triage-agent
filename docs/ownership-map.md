# Ownership Map

This file gives the code companion a simple routing map. Update it with real teams and real source paths before final submission if available.

| Component | Defect Signals | Candidate Source Paths | Owning Team | Escalation Path | Common Labels |
|---|---|---|---|---|---|
| Payments | payment, checkout, refund, settlement, gateway, OTP authorization, provider reference, card authorization, payment timeout | `src/payments/`, `src/checkout/`, `services/payment/`, `modules/payments/` | Payments Platform | Payment Engineering Lead | `payments`, `checkout`, `refund`, `gateway-timeout`, `p0-candidate` |
| Identity | login, SSO, auth, password reset, session, token, cookie, browser auth behavior, reset-token verification | `src/auth/`, `src/identity/`, `services/identity/`, `modules/auth/` | Identity Services | Identity Engineering Lead | `identity`, `auth`, `session`, `password-reset`, `security-review` |
| Inventory | stock, warehouse, reservation, quantity, catalog availability, inventory mismatch, reservation conflict, stock lock | `src/inventory/`, `src/catalog/`, `services/inventory/`, `modules/inventory/` | Commerce Core | Inventory Service Owner | `inventory`, `stock`, `stock-reservation`, `commerce-core` |
| Orders | order creation, order summary, confirmation email, invoice, revenue report, order event, payment-to-order handoff | `src/orders/`, `src/order-management/`, `services/orders/`, `modules/orders/` | Order Management | Orders Engineering Lead | `orders`, `order-management`, `invoice`, `reporting` |
| Search | search, filter, pagination, ranking, query state, cursor, relevance, result count | `src/search/`, `src/experience/search/`, `services/search/`, `modules/search/` | Experience Platform | Search Platform Owner | `search`, `experience`, `pagination`, `ranking` |

## Repo/Module Search Instructions

Before assigning an owner, the code companion should search for supporting repository context:

1. Search for candidate source paths listed above.
2. Search for defect terms from the title, description, logs, and area fields.
3. Search for endpoint, function, error, label, and component terms such as `payment/authorize`, `provider_ref`, `reset-token`, `stock_reservation`, or `cursor`.
4. If matching source folders are found, cite the path and why it supports the routing decision.
5. If this PoC folder has no application source code, state exactly: "Repo source context was not available in this PoC folder."
6. Do not invent source paths or modules that are not present in the repository.

## Routing Rules

- If the defect contains payment failure, refund failure, checkout block, settlement issue, provider timeout, missing provider reference, or card/OTP authorization behavior, route to Payments Platform.
- If the defect contains login, password reset, SSO, session, token, cookie, reset-token verification, or browser auth behavior, route to Identity Services.
- If the defect contains inventory mismatch, reservation conflict, warehouse sync, final stock reservation, or stock quantity behavior, route to Commerce Core.
- If the defect contains order creation, order events, confirmation email, invoice, refund reporting, revenue reporting, or payment-to-order handoff, route to Order Management.
- If the defect contains search result, filter, pagination, ranking, relevance, result count, or query state behavior, route to Experience Platform.

## Evidence Requirements

Every routing decision should cite at least two of:

- defect title
- defect description
- error logs
- repo/module signal
- ownership map entry
- historical defect similarity

If repo/module signal is unavailable, cite the search result honestly and rely on defect text, logs, ownership map, and historical examples.
