"""Duplicate-flagging side-effect node."""

from __future__ import annotations

from typing import Any

from app.agent.state import TriageState
from app.tools import jira_tool


def flag_duplicate(state: TriageState) -> dict[str, Any]:
    """Request the safe stub Jira duplicate workflow and write an audit breadcrumb."""

    jira_tool.create_and_close_duplicate(
        str(state.get("defect_id", "")),
        str(state.get("duplicate_of", "")),
        str(state.get("title", "")),
    )
    return {
        "triage_notes": [
            f"[flag_duplicate] Would create+close duplicate Bug linked to {state.get('duplicate_of', 'unknown')}."
        ]
    }
