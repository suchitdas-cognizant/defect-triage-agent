# Defect Triaging Agent

One-day PoC for **Usecase-06: Defect Triaging Agent**.

This solution uses a code companion tool, such as Codex, Claude Code, or GitHub Copilot, to classify and route defects directly inside the developer workspace. It does **not** require a separate LLM API key, hosted backend, vector database, dashboard, or runtime inference service.

## The Problem

Defect triage is often manual and SME-dependent. A reviewer reads the report, searches for similar issues, remembers which team owns the component, estimates severity, and writes a routing comment. That slows down release work and creates inconsistent triage decisions.

## The PoC Solution

The repository stores the triage knowledge as plain files:

- ownership map
- severity and priority rules
- sample incoming defects
- historical defect patterns
- reusable code companion prompt
- Markdown report template

The code companion reads those files, uses repository context where available, and produces a structured Markdown triage report that can be pasted into an issue tracker.

## How The Workflow Runs

```text
Incoming defect report
  -> Code companion prompt
  -> Ownership map lookup
  -> Severity rule validation
  -> Historical defect comparison
  -> Markdown triage report
  -> Human review
  -> Issue tracker comment or routing action
```

## What The Output Includes

Each triage report includes the expected Usecase-06 outputs:

- Assessment Report
- Recommendations
- Risk Analysis
- Coverage Summary
- Triage and Routing Summary
- Action Checklist

Sample reports are available in `reports/`.

## Repository Structure

```text
docs/
  usecase-summary.md
  ownership-map.md
  severity-rules.md
  submission-checklist.md
  demo-script.md
  demo-runbook.md

prompts/
  defect-triage-prompt.md

templates/
  triage-report-template.md

reports/
  triage-report-PAY-1842.md
  triage-report-AUTH-771.md
  triage-report-INV-409.md

data/
  sample-defects.json

team/
  member-1-usecase-and-submission.md
  member-2-repo-and-ownership.md
  member-3-rules-and-risk.md
  member-4-prompt-and-template.md
  member-5-demo-and-reports.md
```

## How To Try It

1. Open this folder in a code companion tool.
2. Open `prompts/defect-triage-prompt.md`.
3. Paste a defect report, or use one from `data/sample-defects.json`.
4. Ask the companion to follow the prompt and produce a report using `templates/triage-report-template.md`.
5. Review the report, then save it under `reports/` or paste it into an issue tracker comment.

## Why This Fits The Use Case

Usecase-06 asks for a defect triage workflow that runs inside a code companion tool and avoids the overhead of building a custom AI service. This PoC does that by keeping the workflow repository-native, reusable, and human-reviewed.

## Human Review

The code companion provides a recommendation, not an automatic production action. A QA lead or developer reviews the Markdown report before assigning the issue, escalating it, or adding the comment to an issue tracker.
