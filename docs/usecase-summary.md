# Use Case Summary

## Use Case

Defect Triaging Agent for quality engineering teams.

## Problem

Manual defect triage is slow and inconsistent. Reviewers must read defect reports, search for similar issues, understand module ownership, estimate severity, and decide who should receive the issue. This process depends heavily on SME memory.

## PoC Goal

Use a code companion tool to automate the first triage pass directly inside the developer workspace.

The solution should classify and route defects using:

- incoming defect report
- repository/module structure
- ownership map
- severity rules
- historical defect examples
- saved reusable prompts

## Constraints

- No separate LLM API key.
- No hosted backend service.
- No runtime inference infrastructure.
- No dashboard required.
- Output should be a Markdown report or issue comment.

## Business Impact

Expected impact:

- reduce manual triage effort by 50 to 80 percent
- speed up routing decisions
- improve triage consistency
- preserve SME knowledge in repository-native files
- reduce operational overhead compared with custom AI services

## Success Criteria

The PoC succeeds when a user can:

1. paste or select a defect report
2. run the saved prompt in a code companion
3. get a structured assessment report
4. see severity, priority, owner, rationale, risks, and next actions
5. reuse the same workflow for another defect
