# Demo Runbook

## Before Recording

1. Open the repository root.
2. Keep these files ready:
   - `README.md`
   - `docs/usecase-summary.md`
   - `docs/ownership-map.md`
   - `docs/severity-rules.md`
   - `prompts/defect-triage-prompt.md`
   - `data/sample-defects.json`
   - `reports/triage-report-PAY-1842.md`
3. Pick `PAY-1842` as the primary demo defect.

## Demo Steps

1. Show `README.md` and state the goal.
2. Show `docs/usecase-summary.md` and highlight no API key, no backend, no hosted dashboard.
3. Show `docs/ownership-map.md` and `docs/severity-rules.md`.
4. Open `data/sample-defects.json` and point to `PAY-1842`.
5. Open `prompts/defect-triage-prompt.md` and explain that this is the reusable workflow.
6. Show `reports/triage-report-PAY-1842.md` as the generated issue-comment-ready result.
7. Briefly show the AUTH and INV reports to prove repeatability.
8. Close with business impact.

## Closing Line

"This PoC reduces manual triage by turning repository knowledge, ownership rules, severity policy, and historical defects into a repeatable code-companion workflow, without building or hosting a separate AI service."
