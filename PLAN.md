# Phase Plan

## Phase 1: Scope Lock

Duration: 30 to 45 minutes

Goal: align the team around the actual use case.

Decisions:

- Main solution is a code companion workflow.
- No separate LLM API key.
- No hosted backend.
- No dashboard dependency.
- Output is Markdown triage evidence.

Outputs:

- final problem statement
- success criteria
- agreed folder structure
- five member workstreams

## Phase 2: Knowledge Assets

Duration: 1 to 2 hours

Goal: create the local knowledge the code companion will reason over.

Parallel work:

- Member 1: use case summary and submission criteria
- Member 2: ownership map and module context
- Member 3: severity and risk rules
- Member 4: defect samples and historical patterns
- Member 5: demo script and judge-facing storyline

Outputs:

- `docs/usecase-summary.md`
- `docs/ownership-map.md`
- `docs/severity-rules.md`
- `data/sample-defects.json`
- `docs/demo-script.md`

## Phase 3: Prompt Workflow

Duration: 2 to 3 hours

Goal: make the reusable triage workflow repeatable.

Parallel work:

- Member 1 validates expected report sections.
- Member 2 adds repo search instructions.
- Member 3 adds rule-based validation checks.
- Member 4 owns the master prompt and report template.
- Member 5 generates sample reports.

Outputs:

- `prompts/defect-triage-prompt.md`
- `templates/triage-report-template.md`
- at least three sample reports in `reports/`

## Phase 4: Integration And Polish

Duration: 1 to 2 hours

Goal: make all artifacts tell the same story.

Checks:

- README matches the PDF use case.
- Architecture has no hosted-service dependency.
- Reports contain evidence, not unsupported claims.
- Severity decisions map to documented rules.
- Ownership decisions map to documented teams.

## Phase 5: Demo And Submission

Duration: 1 hour

Goal: prepare a clean walkthrough.

Demo order:

1. Open the repo.
2. Show the use case summary.
3. Open one defect.
4. Run the master prompt.
5. Show module/context lookup.
6. Show the generated triage report.
7. Explain how the same prompt can be re-run for new defects.

Final deliverables:

- source folder
- prompt workflow
- sample defect data
- sample reports
- architecture and phase plan
- demo script
