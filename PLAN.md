# DefectTriageBot delivery plan

## Phase 0 — foundation

- [x] Project layout and dependency manifests
- [x] Environment variable template and generated-file exclusions
- [x] Shared `TriageState` with append reducers and safe defaults
- [x] Gemini structured-output and structured logging foundations
- [x] Test bootstrap, sample fixtures, and React 18/Vite 5 starter

Done means a teammate can clone the repository, configure local secrets, and
begin work without changing contracts.

## Phase 1 — tools and deterministic nodes

- ChromaDB persistence and Gemini embedding adapter
- Best-effort Jira, Slack, SMTP, and PagerDuty adapters
- `intake`, `check_duplicate`, `assign`, `escalate`, `flag_duplicate`, and `notify`
- Unit tests with service mocks

Done means a defect can follow deterministic duplicate and routing paths with
an audit trail and no live integration required for tests.

## Phase 2 — LLM and graph

- Pydantic schemas for analysis and priority structured output
- Multimodal `analyze` and `prioritize` nodes
- `StateGraph`, conditional duplicate/regression/critical routes, and human interrupt
- Graph-level tests including error and regression paths

Done means a valid defect can traverse the complete decision workflow.

## Phase 3 — API, UI, and persistence

- FastAPI routes with typed DTOs and OpenAPI examples
- SQLite feedback and analytics tables
- React dashboard for submission, recommendation, approval, and audit evidence
- Recharts analytics and user feedback loop

Done means the full demo runs locally from a browser.

## Phase 4 — submission proof

- 70%+ unit test coverage report
- Postman collection with at least three request cases
- Twenty-record sample dataset and field-mapping document
- README verification, clean ZIP under 200 MB, and walkthrough video

Done means the deliverable contains source and required documentation only—no
`node_modules`, `.venv`, generated Chroma data, or nested ZIP files.
