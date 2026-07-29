# DefectTriageBot architecture

## Before and after

| Legacy triage | DefectTriageBot |
|---|---|
| QA reviewer reads each defect manually | FastAPI accepts a normalized defect payload |
| SME searches previous tickets | ChromaDB checks semantic similarity against the backlog |
| Reviewer decides impact and owner | Gemini structured output provides category, root cause, severity, priority, and confidence |
| Reviewer updates several systems | Best-effort Jira, Slack, email, and PagerDuty adapters handle workflow actions |
| Knowledge stays in individuals | Audit trail, feedback, and analytics become a reusable knowledge base |

## Graph

```text
START → intake → check_duplicate
                   ├─ DUPLICATE  → flag_duplicate → END
                   ├─ REGRESSION → analyze ─┐
                   └─ NEW BUG    → analyze ─┤
                                           ↓
                            prioritize → CRITICAL → escalate → assign → notify → END
                                      └→ HIGH/MEDIUM/LOW → assign → notify → END
```

The graph uses one `TriageState` `TypedDict`. Each node returns only its
changed fields and appends a `[node_name] what happened` string to the
`triage_notes` reducer. External calls are isolated under `app/tools/` so nodes
can be tested with mocks.

## Decision constants

- `SIMILARITY_THRESHOLD = 0.80`: cosine similarity at or above this value is a match.
- `RESOLVED_STATUSES = {"RESOLVED", "CLOSED", "DONE"}`: a match in one of
  these statuses is a regression, not a duplicate.

## Node responsibilities

| Node | LLM | Responsibility |
|---|---:|---|
| intake | No | Normalize input and extract image attachments |
| check_duplicate | No | Compare the vector embedding with the backlog |
| analyze | Yes | Produce multimodal category, component, and root cause |
| prioritize | Yes | Produce severity, priority, confidence, and reasoning |
| assign | No | Map component to a team, then pause for human assignee confirmation |
| escalate | No | Page on-call for critical defects |
| flag_duplicate | No | Create and close a linked duplicate Jira bug |
| notify | No | Update Jira and send Slack and email notifications |

## Service boundaries

```text
React 18/Vite 5 → FastAPI → LangGraph StateGraph
                           ├→ Gemini 2.5 Flash (structured output)
                           ├→ ChromaDB (Gemini 3072-dim embeddings)
                           ├→ SQLite (feedback and analytics)
                           └→ tools/{jira,slack,email,pagerduty}
```

Every integration returns a result or an error dictionary and logs failures;
no workflow integration can crash a triage run.
