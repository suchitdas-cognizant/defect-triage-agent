# Submission Checklist

## Required Artifacts

- [ ] `README.md` explains the PoC in five minutes or less.
- [ ] `ARCHITECTURE.md` shows a code-companion workflow with no hosted backend.
- [ ] `PLAN.md` explains the phase-wise team execution plan.
- [ ] `PROMPTS.md` records the prompt strategy.
- [ ] `prompts/defect-triage-prompt.md` contains the reusable master prompt.
- [ ] `templates/triage-report-template.md` defines the final report format.
- [ ] `docs/ownership-map.md` maps components to teams and labels.
- [ ] `docs/severity-rules.md` defines P0/P1/P2/P3 logic.
- [ ] `data/sample-defects.json` contains incoming and historical defects.
- [ ] `reports/` contains at least three completed sample reports.
- [ ] `docs/demo-script.md` supports a three-minute walkthrough.
- [ ] `docs/demo-runbook.md` contains exact demo steps.

## Use Case Alignment

- [ ] No separate LLM API key is required.
- [ ] No hosted backend is required.
- [ ] No runtime inference infrastructure is required.
- [ ] Output is Markdown and can be pasted into an issue tracker.
- [ ] Human review remains part of the final routing step.

## Quality Checks

- [ ] Every report cites evidence.
- [ ] Every severity decision maps to `docs/severity-rules.md`.
- [ ] Every owner decision maps to `docs/ownership-map.md`.
- [ ] Missing information is clearly listed.
- [ ] No report invents ticket IDs, owners, code paths, or business impact.
