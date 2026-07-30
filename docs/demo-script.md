# Demo Script

Target length: 2 to 2.5 minutes. Use the local architecture image `C:\Users\2513929\Downloads\architecture 2.svg` for the video only; do not add it to the repository. Use the pre-generated reports in `reports/` so the walkthrough does not depend on live model latency.

## 00:00-00:15 - Problem And Fit

Show `README.md`.

Say:
"This is a one-day PoC for Usecase-06: a defect triaging agent that runs inside a code companion. It classifies and routes defects from repository context, without a separate LLM API key, hosted backend, vector database, or dashboard."

## 00:15-00:40 - Architecture

Show `C:\Users\2513929\Downloads\architecture 2.svg`.

Say:
"The architecture is intentionally lightweight. An incoming defect goes into the code companion prompt, the companion reads repository files as evidence, generates a Markdown triage report, and a human reviewer decides the final routing action."

## 00:40-01:05 - Repository Knowledge

Show `docs/ownership-map.md`, `docs/severity-rules.md`, and `data/sample-defects.json`.

Say:
"The repo stores the triage knowledge as plain files: component ownership, escalation paths, severity rules, sample defects, and historical patterns. Teams can update this knowledge without changing infrastructure."

## 01:05-01:25 - Reusable Workflow

Show `prompts/defect-triage-prompt.md` and `templates/triage-report-template.md`.

Say:
"The prompt defines the repeatable workflow, and the template keeps every output consistent: assessment, recommendation, evidence, risk, coverage, routing summary, and action checklist."

## 01:25-02:00 - Primary Sample Output

Show `reports/triage-report-PAY-1842.md`.

Say:
"For PAY-1842, the report identifies a production checkout payment failure, routes it to Payments Platform, marks it Critical/P0, cites log and historical evidence, lists missing information, and keeps escalation human-reviewed."

## 02:00-02:20 - Repeatability

Show `reports/triage-report-AUTH-771.md` and `reports/triage-report-INV-409.md`.

Say:
"The same process repeats across components: AUTH-771 routes to Identity Services, and INV-409 routes to Commerce Core. The evidence and output format stay consistent."

## 02:20-02:30 - Closing Summary

Say:
"This PoC reduces manual triage effort with a repository-native, repeatable, human-reviewed workflow. It avoids new infrastructure and produces Markdown ready for an issue tracker."
