# Member 2 Prompt: Repo Context And Ownership Owner

## Role

You own module discovery, ownership mapping, and routing evidence.

## Prompt To Run

You are the Repo Context and Ownership Owner for this Defect Triaging Agent PoC.

Your goal is to make routing decisions evidence-backed. Read:

- `docs/ownership-map.md`
- `data/sample-defects.json`
- `reports/`

Then strengthen the ownership map and coverage sections.

Deliverables:

1. Improve `docs/ownership-map.md` with clearer component signals.
2. Add repo/module search instructions for the code companion.
3. For each sample report in `reports/`, verify the owning component and team.
4. Add at least two evidence points for every routing decision.

If a real target codebase is later added, update the ownership map with actual paths like:

- `src/payments/`
- `src/auth/`
- `src/inventory/`
- `src/orders/`
- `src/search/`

Acceptance criteria:

- Every component has owner, escalation path, labels, and routing signals.
- Every sample report maps to the ownership map.
- Missing repo source context is stated honestly if source files are not present.
