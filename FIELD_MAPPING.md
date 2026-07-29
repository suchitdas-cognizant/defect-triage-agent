# Defect field mapping

| Incoming field | `TriageState` field | Usage |
|---|---|---|
| Source ticket ID | `defect_id` | Traceability and Jira link generation |
| Summary | `title` | Normalized input and semantic search |
| Description | `description` | LLM analysis and semantic search |
| Error logs | `stack_trace` | Keyword extraction and root-cause analysis |
| Screenshots / attachments | `image_attachments` | Multimodal Gemini analysis |
| Product area | `component` | Team routing and duplicate context |
| Reporter / channel | `reporter`, `source` | Notification and audit context |
| Similar ticket results | `similar_defects` | Duplicate or regression decision |
| Duplicate ticket reference | `duplicate_of` | Linked Jira duplicate workflow |
| LLM classification | `category`, `root_cause`, `keywords` | Reasoning and analytics |
| Impact assessment | `severity`, `priority`, `confidence`, `reasoning` | Escalation and human review |
| Team directory result | `assigned_team`, `assignee`, `auto_assign` | Assignment workflow |
| Reviewer response | `human_input` | LangGraph interrupt/resume input |
| Workflow record | `jira_key`, `integration_results` | Best-effort external outcomes |
| Graph audit | `triage_notes`, `warnings`, `latency_ms` | Explainability and analytics |

The API request DTOs and Jira field mapping are added when the FastAPI route is
implemented. This document is the source of truth for keeping legacy incoming
fields separate from the normalized agent state.
