# Submission Checklist

## Use Case Alignment

- [ ] The solution is described as a code companion workflow.
- [ ] No separate LLM API key is required.
- [ ] No hosted backend is required.
- [ ] No vector database is required.
- [ ] No dashboard is required for the core PoC.
- [ ] Final output is Markdown and can be pasted into an issue tracker.
- [ ] Human review remains part of the final routing step.

## Required Artifacts

- [ ] `README.md` explains the PoC clearly for a judge.
- [ ] `ARCHITECTURE.md` shows the lightweight workflow.
- [ ] `PLAN.md` explains phase-wise team execution.
- [ ] `PROMPTS.md` records the prompt strategy.
- [ ] `prompts/defect-triage-prompt.md` contains the reusable master prompt.
- [ ] `templates/triage-report-template.md` defines the final output format.
- [ ] `docs/usecase-summary.md` summarizes the problem, solution, constraints, and impact.
- [ ] `docs/ownership-map.md` maps components to owners, labels, and escalation paths.
- [ ] `docs/severity-rules.md` defines P0/P1/P2/P3 classification.
- [ ] `data/sample-defects.json` contains incoming and historical defect examples.
- [ ] `reports/` contains at least three completed sample triage reports.
- [ ] `docs/demo-script.md` supports a three-minute walkthrough.
- [ ] `docs/demo-runbook.md` gives exact demo steps.

## Expected Output Coverage

- [ ] Assessment Report is present in every sample report.
- [ ] Recommendations are present in every sample report.
- [ ] Risk Analysis is present in every sample report.
- [ ] Coverage Summary is present in every sample report.
- [ ] Triage and Routing Summary is present in every sample report.
- [ ] Action Checklist is present in every sample report.

## Quality Checks

- [ ] Every report cites evidence from the defect, rules, ownership map, or historical examples.
- [ ] Every severity decision maps to `docs/severity-rules.md`.
- [ ] Every owner decision maps to `docs/ownership-map.md`.
- [ ] Missing information is clearly listed.
- [ ] Confidence is stated as a recommendation confidence, not as a guarantee.
- [ ] No report invents ticket IDs, owners, code paths, logs, or business impact.

## Final Review

- [ ] README and demo script tell the same story.
- [ ] Sample reports follow the same template.
- [ ] The demo can be completed in three minutes.
- [ ] The repository does not depend on removed app/backend/frontend scaffolding.
