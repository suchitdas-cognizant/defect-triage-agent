"""Shared, immutable-by-convention state passed through the triage graph."""

from __future__ import annotations

import operator
from typing import Annotated, Any, TypedDict


class TriageState(TypedDict, total=False):
    """The complete state contract for a single defect triage run.

    Nodes must return only the fields they change. Reducer fields are appended
    by LangGraph, preserving a readable audit trail without in-place mutation.
    """

    defect_id: str
    title: str
    description: str
    stack_trace: str
    source: str
    reporter: str
    image_attachments: Annotated[list[dict[str, Any]], operator.add]

    category: str
    component: str
    root_cause: str
    keywords: list[str]

    is_duplicate: bool
    is_regression: bool
    duplicate_of: str | None
    similar_defects: Annotated[list[dict[str, Any]], operator.add]

    severity: str
    priority: int
    confidence: float
    reasoning: str

    assigned_team: str
    assignee: str | None
    auto_assign: bool
    human_input: dict[str, Any]

    triage_notes: Annotated[list[str], operator.add]
    warnings: Annotated[list[str], operator.add]
    integration_results: dict[str, Any]
    latency_ms: int
    jira_key: str | None


def default_triage_state(defect_id: str, title: str, description: str) -> TriageState:
    """Create a complete, safe starting state for one graph invocation."""

    return {
        "defect_id": defect_id,
        "title": title,
        "description": description,
        "stack_trace": "",
        "source": "api",
        "reporter": "",
        "image_attachments": [],
        "category": "",
        "component": "",
        "root_cause": "",
        "keywords": [],
        "is_duplicate": False,
        "is_regression": False,
        "duplicate_of": None,
        "similar_defects": [],
        "severity": "LOW",
        "priority": 4,
        "confidence": 0.0,
        "reasoning": "",
        "assigned_team": "",
        "assignee": None,
        "auto_assign": False,
        "human_input": {},
        "triage_notes": [],
        "warnings": [],
        "integration_results": {},
        "latency_ms": 0,
        "jira_key": None,
    }
