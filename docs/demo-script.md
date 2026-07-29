# Demo Script

Target length: 3 minutes. Use the pre-generated reports in `reports/` during the main demo so the walkthrough does not depend on live model latency.

## 00:00-00:20 - Problem And Fit

Show `README.md`.

Say:
"This is a one-day PoC for Usecase-06: a defect triaging agent that runs inside a code companion. It classifies and routes defects from repository context, without a separate LLM API key, hosted backend, vector database, or dashboard."

## 00:20-00:50 - Repository Knowledge

Show:

- `docs/ownership-map.md`
- `docs/severity-rules.md`
- `data/sample-defects.json`

Say:
"The repo stores the triage knowledge as plain files: component ownership, escalation paths, severity rules, sample incoming defects, and historical patterns. That makes the workflow portable and easy for teams to update."

## 00:50-01:20 - Reusable Workflow

Show `prompts/defect-triage-prompt.md` and `templates/triage-report-template.md`.

Say:
"The prompt tells the code companion to inspect the defect, ownership map, severity rules, historical examples, and available repo paths. The template keeps every output consistent and issue-comment-ready."

## 01:20-02:05 - Primary Sample Output

Show `reports/triage-report-PAY-1842.md`.

Say:
"For PAY-1842, the report identifies a production checkout payment failure, routes it to Payments Platform, marks it Critical/P0, cites evidence from logs and historical defects, lists missing information, and keeps final escalation human-reviewed."

## 02:05-02:35 - Repeatability

Show `reports/triage-report-AUTH-771.md` and `reports/triage-report-INV-409.md`.

Say:
"The same process repeats for different defects. AUTH-771 routes to Identity Services with Safari reset-token evidence, while INV-409 routes to Commerce Core with inventory reservation evidence. The format stays consistent across all three."

## 02:35-03:00 - Closing Summary

Say:
"This PoC reduces manual triage effort by turning ownership rules, severity policy, defect text, and historical examples into a repeatable code-companion workflow. It avoids new infrastructure, produces Markdown ready for an issue tracker, and leaves the final routing decision with a human reviewer."
