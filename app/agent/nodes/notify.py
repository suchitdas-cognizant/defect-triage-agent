"""Notification side-effect node for the completed triage decision."""

from __future__ import annotations

from typing import Any

from app.agent.state import TriageState
from app.tools import email_tool, jira_tool, slack_tool
from app.tools.assignees import TEAM_EMAILS


def notify(state: TriageState) -> dict[str, Any]:
    """Log intended Jira, Slack, and email updates through stub adapters."""

    defect_id = str(state.get("defect_id", ""))
    team = str(state.get("assigned_team", "platform-engineering"))
    summary = f"{defect_id}: {state.get('title', '')}".strip()
    jira_tool.update_issue(defect_id, {"team": team, "assignee": state.get("assignee")})
    slack_tool.send_notification(f"#{team}", f"Defect triage complete — {summary}")
    email_tool.send_email([TEAM_EMAILS.get(team, TEAM_EMAILS["platform-engineering"])], "Defect triage complete", summary)
    return {"triage_notes": ["[notify] Would update Jira + Slack + email with the triage decision."]}
