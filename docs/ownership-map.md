# Ownership Map

This file gives the code companion a simple routing map. Update it with real teams before final submission if available.

| Component | Repo Signals | Owning Team | Escalation Path | Common Labels |
|---|---|---|---|---|
| Payments | payment, checkout, refund, settlement, gateway, OTP authorization | Payments Platform | Payment Engineering Lead | `payments`, `checkout`, `refund`, `p0-candidate` |
| Identity | login, SSO, auth, password reset, session, token, cookie | Identity Services | Identity Engineering Lead | `identity`, `auth`, `session`, `security-review` |
| Inventory | stock, warehouse, reservation, quantity, catalog availability | Commerce Core | Inventory Service Owner | `inventory`, `stock`, `commerce-core` |
| Orders | order creation, order summary, confirmation email, invoice, revenue report | Order Management | Orders Engineering Lead | `orders`, `order-management`, `reporting` |
| Search | search, filter, pagination, ranking, query state, cursor | Experience Platform | Search Platform Owner | `search`, `experience`, `pagination` |

## Routing Rules

- If the defect contains payment failure, refund failure, checkout block, settlement issue, or provider timeout, route to Payments Platform.
- If the defect contains login, password reset, SSO, session, token, cookie, or browser auth behavior, route to Identity Services.
- If the defect contains inventory mismatch, reservation conflict, warehouse sync, or stock quantity behavior, route to Commerce Core.
- If the defect contains order creation, order events, confirmation email, invoice, refund reporting, or revenue reporting, route to Order Management.
- If the defect contains search result, filter, pagination, ranking, or query state behavior, route to Experience Platform.

## Evidence Requirements

Every routing decision should cite at least two of:

- defect title
- defect description
- error logs
- repo/module signal
- ownership map entry
- historical defect similarity
