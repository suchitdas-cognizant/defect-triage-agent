# Prompt Log

This file records the prompt strategy used for the PoC.

## Master Prompt

The reusable master prompt lives at:

`prompts/defect-triage-prompt.md`

It instructs the code companion to:

1. read the incoming defect
2. inspect ownership and severity rules
3. search repository context where relevant
4. identify likely component and owner
5. classify severity and priority
6. validate the decision against rules
7. produce a Markdown report

## Prompt Design Rules

- Use only evidence from the defect, repository, ownership map, rules, and historical examples.
- If evidence is missing, say what is missing.
- Do not invent ticket IDs, owners, code paths, logs, or business impact.
- Always produce a human-reviewable recommendation.
- Keep the output repository-native Markdown.

## Refinement Notes

The original implementation direction included hosted services and external model calls. The current prompt strategy removes those dependencies and matches the use case requirement: a code companion workflow with no separate LLM API key or backend.
