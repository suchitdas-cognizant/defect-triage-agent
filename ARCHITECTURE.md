# Architecture

## Design Principle

The architecture is intentionally lightweight. The code companion is the reasoning layer, and the repository is the knowledge base.

There is no hosted backend, no model API key, no vector database, and no runtime service to maintain.

## Flow

```text
Incoming Defect
  -> Code Companion Prompt
  -> Repository Search
  -> Ownership Map
  -> Severity Rules
  -> Historical Defect Examples
  -> Markdown Triage Report
  -> Human Review
  -> Issue Tracker Comment or Routing Action
```

## Components

| Component | Purpose |
|---|---|
| `data/sample-defects.json` | Incoming and historical sample defect records |
| `docs/ownership-map.md` | Component, path, team, and escalation ownership |
| `docs/severity-rules.md` | Priority, severity, SLA, and validation rules |
| `prompts/defect-triage-prompt.md` | Reusable code companion triage workflow |
| `templates/triage-report-template.md` | Standard report output format |
| `reports/` | Completed sample triage reports |
| `team/` | Parallel execution prompts for five members |

## Why This Fits The Use Case

The use case asks for a defect triage workflow that runs inside a code companion tool. This architecture uses the companion's existing abilities:

- file search
- repository inspection
- reasoning over local context
- Markdown generation
- repeatable prompt execution

The result is practical for a short PoC because the team can prove the workflow without building infrastructure.

## Human Control

The tool produces recommendations only. A QA lead or developer reviews the report before assigning work, escalating, or adding the report to an issue tracker.
