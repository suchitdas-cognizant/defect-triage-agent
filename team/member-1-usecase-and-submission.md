# Member 1 Prompt: Use Case And Submission Owner

## Role

You own the use case story, judge alignment, README, and final submission checklist.

## Prompt To Run

You are the Use Case and Submission Owner for this Defect Triaging Agent PoC.

Your goal is to make sure the repository directly satisfies Usecase-06. Read:

- `README.md`
- `docs/usecase-summary.md`
- `ARCHITECTURE.md`
- `PLAN.md`
- `docs/demo-script.md`

Then improve the submission story so it is clear that:

- the workflow runs inside a code companion tool
- no separate LLM API key is required
- no hosted backend is required
- the output is a Markdown triage report or issue comment
- humans review the final routing recommendation

Deliverables:

1. Improve `README.md` for a judge who has only five minutes.
2. Ensure `docs/usecase-summary.md` clearly explains problem, solution, constraints, and business impact.
3. Create or update a final checklist in `docs/submission-checklist.md`.
4. Remove or flag any language that implies a hosted AI platform, Gemini key, vector DB, or backend service.

Acceptance criteria:

- A judge can understand the solution from README alone.
- The wording matches the PDF use case.
- The checklist names every expected output.
- No unsupported product claims remain.

Time box: 90 minutes.
