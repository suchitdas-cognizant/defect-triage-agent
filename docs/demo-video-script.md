# DefectTriageBot Demo Video Script

Target length: 3 minutes.

## Opening

Time: 00:00-00:20

Show the DefectTriageBot hero, metrics, and incoming defect queue.

Say:
"Quality teams lose time manually reading defects, finding duplicates, deciding severity, and routing work to the right squad. DefectTriageBot automates that first triage pass while keeping humans in control."

## Agent Recommendation

Time: 00:20-00:55

Show PAY-1842 in the defect queue. Point to priority, component, owner, confidence, explanation, and duplicate matches.

Say:
"The agent converts an unstructured defect report into structured triage output: priority, severity, component, owner, confidence, and recommended action. It also explains why it made the decision."

## Knowledge Base

Time: 00:55-01:25

Search the Knowledge Base for "payment" or "refund".

Say:
"Historical defects act as SME memory. DefectTriageBot uses prior incidents, known fix patterns, tags, and detected signals to identify similar issues and route work consistently."

## Workflow Automation

Time: 01:25-02:00

Run the agent from New Defect Intake, show the generated API payload, then approve routing.

Say:
"Once a human approves, DefectTriageBot prepares the Jira update: assignment group, labels, duplicate links, and the AI triage comment."

## Bulk Triage

Time: 02:00-02:30

Use Bulk Defect Import and click Triage batch.

Say:
"For release cycles or backlog cleanup, teams can triage many defects at once. The batch view separates auto-route candidates from items that need human review."

## Governance Close

Time: 02:30-03:00

Show the Audit Trail, then scroll back to Architecture Blueprint.

Say:
"Every agent run, batch run, and approval is traceable. The architecture keeps the agent, knowledge base, workflow integrations, and human governance separated so the solution can scale into enterprise quality engineering."

## Final Line

"DefectTriageBot reduces manual triage time, improves consistency, captures SME knowledge, and turns defect reports into actionable engineering work."
