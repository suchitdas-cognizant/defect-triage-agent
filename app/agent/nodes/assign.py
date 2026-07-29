"""Deterministic team routing with an explicit human assignee choice."""

from __future__ import annotations

from typing import Any

from langgraph.types import interrupt

from app.agent.state import TriageState
from app.tools.assignees import TEAM_ASSIGNEES, get_team_for_component


def assign(state: TriageState) -> dict[str, Any]:
    """Route to a team and either auto-assign or request a human selection."""

    team = get_team_for_component(str(state.get("component", "")))
    candidates = TEAM_ASSIGNEES[team]
    if state.get("auto_assign", False):
        assignee = candidates[0]
        decision = "auto-assigned"
    else:
        assignee = (state.get("human_input", {}) or {}).get("assignee")
        if assignee not in candidates:
            resumed_input = interrupt(
                {"type": "assignee_pick", "team": team, "candidates": candidates}
            )
            if isinstance(resumed_input, dict):
                assignee = resumed_input.get("assignee")
        if assignee not in candidates:
            return {
                "assigned_team": team,
                "triage_notes": [f"[assign] Waiting for a valid assignee selection from {team}."],
            }
        decision = "human-selected"

    return {
        "assigned_team": team,
        "assignee": assignee,
        "triage_notes": [f"[assign] {decision.capitalize()} {assignee} for {team}."],
    }
