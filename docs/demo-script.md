# Demo Script

Target length: 3 minutes.

## 00:00-00:20 - Problem

Show the repository and `docs/usecase-summary.md`.

Say:
"Manual defect triage depends on SME memory. This PoC uses a code companion to classify and route defects directly inside the repository, without a separate LLM API key or hosted backend."

## 00:20-00:50 - Knowledge Setup

Show:

- `docs/ownership-map.md`
- `docs/severity-rules.md`
- `data/sample-defects.json`

Say:
"The repository stores the local knowledge: ownership, severity rules, and historical examples. The code companion uses this context while triaging."

## 00:50-01:40 - Run The Workflow

Show `prompts/defect-triage-prompt.md`.

Paste or select defect `PAY-1842`.

Say:
"The prompt asks the companion to inspect the defect, local rules, ownership map, and related repo context before producing a recommendation."

## 01:40-02:20 - Review Output

Show `reports/triage-report-PAY-1842.md`.

Say:
"The output includes assessment, recommendation, risk analysis, coverage summary, routing summary, and action checklist."

## 02:20-02:45 - Repeatability

Show `reports/triage-report-AUTH-771.md` and `reports/triage-report-INV-409.md`.

Say:
"The same workflow can be re-run for different defects, producing consistent routing decisions with documented evidence."

## 02:45-03:00 - Close

Say:
"This proves a faster, lower-overhead triage workflow: repository-native, repeatable, human-reviewed, and ready to paste into an issue tracker."
