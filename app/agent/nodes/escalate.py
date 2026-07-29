"""Critical-defect escalation side-effect node."""

from __future__ import annotations

from typing import Any

from app.agent.state import TriageState
from app.tools import oncall_tool


def escalate(state: TriageState) -> dict[str, Any]:
    """Page on-call through the safe stub adapter for a critical defect."""

    oncall_tool.page_on_call(
        str(state.get("defect_id", "")),
        str(state.get("title", "")),
        str(state.get("severity", "CRITICAL")),
    )
    return {"triage_notes": ["[escalate] Requested an on-call page for the critical defect."]}
