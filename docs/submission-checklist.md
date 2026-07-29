# Submission Checklist

## Use Case Alignment

- [x] The solution is described as a code companion workflow.
- [x] No separate LLM API key is required.
- [x] No hosted backend is required.
- [x] No vector database is required.
- [x] No dashboard is required for the core PoC.
- [x] Final output is Markdown and can be pasted into an issue tracker.
- [x] Human review remains part of the final routing step.

## Required Artifacts

- [x] `README.md` explains the PoC clearly for a judge.
- [x] `ARCHITECTURE.md` shows the lightweight workflow.
- [x] `PLAN.md` explains phase-wise team execution and completion status.
- [x] `PROMPTS.md` records the prompt strategy.
- [x] `prompts/defect-triage-prompt.md` contains the reusable master prompt.
- [x] `templates/triage-report-template.md` defines the final output format.
- [x] `docs/usecase-summary.md` summarizes the problem, solution, constraints, and impact.
- [x] `docs/ownership-map.md` maps components to owners, labels, and escalation paths.
- [x] `docs/severity-rules.md` defines P0/P1/P2/P3 classification.
- [x] `data/sample-defects.json` contains incoming and historical defect examples.
- [x] `reports/` contains at least three completed sample triage reports.
- [x] `docs/demo-script.md` supports a three-minute walkthrough.
- [x] `docs/demo-runbook.md` gives exact demo steps.

## Expected Output Coverage

- [x] Assessment Report is present in every sample report.
- [x] Recommendations are present in every sample report.
- [x] Risk Analysis is present in every sample report.
- [x] Coverage Summary is present in every sample report.
- [x] Triage and Routing Summary is present in every sample report.
- [x] Action Checklist is present in every sample report.

## Quality Checks

- [x] Every report cites evidence from the defect, rules, ownership map, or historical examples.
- [x] Every severity decision maps to `docs/severity-rules.md`.
- [x] Every owner decision maps to `docs/ownership-map.md`.
- [x] Missing information is clearly listed.
- [x] Confidence is stated as a recommendation confidence, not as a guarantee.
- [x] No report invents ticket IDs, owners, code paths, logs, or business impact.

## Final Review

- [x] README and demo script tell the same story.
- [x] Sample reports follow the same template.
- [x] The demo can be completed in three minutes.
- [x] The repository does not depend on removed app/backend/frontend scaffolding.
