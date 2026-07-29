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
   - `reports/triage-report-AUTH-771.md`
   - `reports/triage-report-INV-409.md`
3. Pick `PAY-1842` as the primary demo defect.
4. Use the pre-generated reports for the recorded demo. Do not depend on a live model run unless extra time is available.
5. Zoom the editor enough that report headings, recommendation fields, and evidence rows are readable.

## Demo Steps

1. Show `README.md` and state the goal: Usecase-06 defect triage inside a code companion.
2. Show `docs/ownership-map.md` and point to owner, escalation path, labels, and routing signals.
3. Show `docs/severity-rules.md` and point to P0/P1/P2/P3 triggers.
4. Open `data/sample-defects.json` and point to `PAY-1842` as the incoming defect.
5. Open `prompts/defect-triage-prompt.md` and explain that this is the reusable workflow.
6. Open `templates/triage-report-template.md` and show the expected output sections.
7. Show `reports/triage-report-PAY-1842.md` as the generated issue-comment-ready result.
8. Briefly show `reports/triage-report-AUTH-771.md` and `reports/triage-report-INV-409.md` to prove repeatability across components.
9. Close with the spoken summary below.

## Presenter Checklist

- [ ] Demo stays under three minutes.
- [ ] No live debugging is required.
- [ ] At least three reports are visible in `reports/`.
- [ ] The primary report shows owner, priority, evidence, risks, missing information, and action checklist.
- [ ] Repeatability is shown with Payments, Identity, and Inventory examples.
- [ ] Closing mentions business impact and no-infrastructure advantage.

## Final Spoken Summary

"This PoC reduces manual triage by turning repository knowledge, ownership rules, severity policy, and historical defects into a repeatable code-companion workflow, without building or hosting a separate AI service."

## Closing Slide Bullets

- Repository-native defect triage
- No separate LLM API key, backend, vector database, or dashboard
- Markdown output ready for issue tracker comments
- Evidence-backed owner, severity, risk, and next-action recommendations
- Human-reviewed routing with less SME dependency
