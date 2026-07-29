# Defect Triaging Agent

This repository contains a one-day PoC for **Usecase-06: Defect Triaging Agent**.

The solution runs inside a code companion tool such as Codex, Claude Code, or GitHub Copilot. It does not require a separate LLM API key, hosted backend, vector database, or runtime inference service.

## Goal

Reduce manual defect triage effort by using the code companion's repository access and reasoning to:

- read incoming defect reports
- inspect repository/module context
- compare against ownership and severity rules
- identify likely component and owner
- classify severity and priority
- produce a repository-native Markdown triage report

## What This Repo Contains

```text
docs/
  usecase-summary.md
  ownership-map.md
  severity-rules.md
  demo-script.md

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

## How To Use

1. Open this repository in your code companion tool.
2. Open `prompts/defect-triage-prompt.md`.
3. Provide one defect from `data/sample-defects.json` or paste a new defect report.
4. Ask the tool to inspect `docs/ownership-map.md`, `docs/severity-rules.md`, and repository context.
5. Save the final output using `templates/triage-report-template.md` under `reports/`.

## Expected Outputs

Each triage report must include:

- Assessment Report
- Recommendations
- Risk Analysis
- Coverage Summary
- Triage and Routing Summary
- Action Checklist

## Team Execution

The folder `team/` contains ready-to-use prompts for five members working in parallel. Each member can run their prompt in a separate Codex/code companion session, then merge the outputs into this repository.

## Submission Story

This PoC proves that defect triage can be accelerated without standing up a custom AI service. The code companion uses local repo knowledge, saved prompts, historical defect examples, and rule-based validation to produce consistent, reviewable triage recommendations.
