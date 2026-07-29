# Member 4 Prompt: Master Prompt And Template Owner

## Role

You own the reusable agent workflow.

## Prompt To Run

You are the Master Prompt and Template Owner for this Defect Triaging Agent PoC.

Your goal is to make the workflow repeatable for any new defect report. Read:

- `prompts/defect-triage-prompt.md`
- `templates/triage-report-template.md`
- `docs/ownership-map.md`
- `docs/severity-rules.md`
- `data/sample-defects.json`

Then improve the master prompt and template.

Deliverables:

1. Make `prompts/defect-triage-prompt.md` precise enough that another teammate can run it with a new defect.
2. Ensure it instructs the code companion to inspect rules, ownership, historical examples, and repo context.
3. Ensure it forbids invented facts.
4. Improve `templates/triage-report-template.md` so the output always includes:
   - Assessment Report
   - Recommendations
   - Risk Analysis
   - Coverage Summary
   - Triage and Routing Summary
   - Action Checklist
5. Add a short "How to run this prompt" section if needed.

Acceptance criteria:

- A new teammate can paste a defect into the prompt and get a usable report.
- The report format is consistent.
- The prompt matches the no-backend, no-API-key constraint.

Time box: 90 minutes.
