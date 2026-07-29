# Use Case Summary

## Use Case

**Usecase-06: Defect Triaging Agent**

Classify and route defects automatically using a code companion tool already available in the developer's IDE or terminal.

## Problem Statement

Current defect triage is manual, slow, and dependent on SME knowledge. Reviewers must understand the defect, identify the likely component, remember team ownership, compare against previous incidents, judge severity, and write the routing recommendation. This creates delays and inconsistent outcomes.

Building a separate LLM-backed service can solve part of the problem, but it introduces API key management, hosting effort, integration overhead, and runtime cost. The use case asks for a lighter PoC.

## Proposed Solution

Use the code companion as the triage agent.

The companion reads repository-native context:

- incoming defect report
- repository/module signals, when available
- ownership map
- severity and priority rules
- historical defect examples
- reusable prompt instructions
- report template

It then produces a structured Markdown triage report that a human can review and paste into an issue tracker.

## Explicit Constraints

- No separate LLM API key.
- No hosted backend.
- No vector database.
- No dashboard dependency.
- No runtime inference infrastructure.
- Final output is Markdown, suitable for an issue comment or repository report.
- Final routing remains human-reviewed.

## Expected Outputs

The workflow produces:

- Assessment Report
- Recommendations
- Risk Analysis
- Coverage Summary
- Triage and Routing Summary
- Action Checklist

## Business Impact

Expected impact:

- reduce manual triage effort by 50 to 80 percent
- accelerate routing decisions
- improve consistency across defects
- preserve SME knowledge in reusable repository files
- avoid the cost and maintenance overhead of a custom triage service

## Success Criteria

The PoC succeeds when a user can:

1. open the repository in a code companion
2. select or paste an incoming defect
3. run the reusable triage prompt
4. receive severity, priority, owner, evidence, risk, missing information, and next actions
5. review the recommendation before routing
6. repeat the same process for another defect
