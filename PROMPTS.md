# Prompt and refinement log

This record captures the significant build prompts and decisions for judging.
No customer data, tokens, passwords, or API keys are stored here.

## 2026-07-29 — product brief

**Input:** Build `DefectTriageBot` for Quality Engineering: reduce manual,
SME-dependent defect triage from roughly 45 minutes to under 10 seconds.

**Decision:** Use a LangGraph `StateGraph` with one typed shared state, Gemini
structured output for reasoning, a local Chroma knowledge base, and explicit
human control before final assignment.

## 2026-07-29 — reliability constraints

**Input:** Nodes must return partial state only, append audit notes, and never
place external I/O directly in graph nodes.

**Decision:** Define reducer-backed lists in `TriageState` and reserve
`app/tools/` for all LLM, vector-store, and integration calls. Adapters must
return error dictionaries rather than raising workflow-breaking exceptions.

## 2026-07-29 — duplicate behavior

**Input:** Treat semantic similarity of 0.80 or greater as a match. A match in
`RESOLVED`, `CLOSED`, or `DONE` must be treated as a regression.

**Decision:** The graph conditionally routes active matches to
`flag_duplicate`; resolved matches continue to LLM analysis as regressions.

## Refinement policy

Prompt changes are versioned here together with the reason, expected output
schema, and validation result. Production prompts will request JSON matching
Pydantic schemas only; free-form LLM text is not used for routing decisions.
