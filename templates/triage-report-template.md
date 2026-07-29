# Triage Report: <DEFECT_ID>

## Assessment Report

**Title:** <title or "Not provided">

**Environment:** <Production | UAT | Staging | Development | Not provided>

**Reporter:** <reporter or "Not provided">

**Defect Summary:** <one concise paragraph restating only confirmed defect details>

**Human Review Required:** <Yes | No>

## Recommendations

| Field | Recommendation |
|---|---|
| Severity | <Critical | High | Medium | Low> |
| Priority | <P0 | P1 | P2 | P3> |
| Owning Component | <component> |
| Owning Team | <team from ownership map> |
| Escalation Path | <escalation path from ownership map> |
| Suggested Labels | `<label-1>`, `<label-2>` |
| Confidence | <percentage> |
| Recommended Routing | <specific routing recommendation with human-review wording> |

## Evidence

| Evidence Type | Finding |
|---|---|
| Title | <finding or "Not provided"> |
| Description | <finding or "Not provided"> |
| Logs | <finding or "Not provided"> |
| Repository Context | <exact path evidence, or "Repo source context was not available in this PoC folder."> |
| Ownership Map | <component/team mapping evidence> |
| Historical Match | <similar defect and reason, or "No strong historical match found."> |
| Severity Rule | <documented trigger that supports severity/priority> |

## Risk Analysis

| Risk Area | Assessment |
|---|---|
| Customer Impact | <confirmed impact or what must be confirmed> |
| Business Impact | <confirmed business workflow impact or conditional impact> |
| Data/Security Risk | <confirmed risk, "No direct evidence", or required confirmation> |
| Release Risk | <confirmed release risk or required confirmation> |
| Operational Risk | <support/escalation/monitoring risk or required confirmation> |

## Coverage Summary

**Checked Context:**

- `docs/ownership-map.md`
- `docs/severity-rules.md`
- `data/sample-defects.json`
- <repo paths searched, or "Repo source context was not available in this PoC folder.">

**Likely Similar Defects:**

- <historical defect ID, similarity reason, and useful resolution pattern>

**Missing Information:**

- <missing item, or "None identified.">

**Validation Notes:**

- Severity and priority match: <documented trigger>.
- Owner maps to: <ownership map entry>.
- Confidence rationale: <why this confidence is appropriate>.
- Human review: <why review is or is not required before routing>.

## Triage And Routing Summary

<short issue-comment-ready summary that includes defect ID, priority, owner, evidence, and next action>

## Action Checklist

- [ ] Confirm reproduction steps.
- [ ] Confirm logs, timestamp, or trace ID.
- [ ] Confirm impacted user count or scope.
- [ ] Confirm workaround availability.
- [ ] Assign to owning team.
- [ ] Add recommended labels.
- [ ] Escalate if severity is P0 or P1.
- [ ] Add this triage report as an issue comment.
