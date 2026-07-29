"""Semantic duplicate and regression detection against the defect backlog."""

from __future__ import annotations

from typing import Any

from app.agent.constants import RESOLVED_STATUSES, SIMILARITY_THRESHOLD
from app.agent.state import TriageState
from app.tools import vector_store


def check_duplicate(state: TriageState) -> dict[str, Any]:
    """Classify the closest semantic match as a duplicate, regression, or new bug."""

    query = f"{state.get('title', '')}\n\n{state.get('description', '')}".strip()
    matches = vector_store.similarity_search_with_score(query)
    similar_defects = [{**defect, "cosine_score": score} for defect, score in matches]

    if not matches:
        return {
            "is_duplicate": False,
            "is_regression": False,
            "duplicate_of": None,
            "similar_defects": similar_defects,
            "triage_notes": ["[check_duplicate] No similar backlog defects were found."],
        }

    closest, score = matches[0]
    match_id = str(closest.get("id", ""))
    match_status = str(closest.get("status", "OPEN")).upper()
    if score < SIMILARITY_THRESHOLD:
        return {
            "is_duplicate": False,
            "is_regression": False,
            "duplicate_of": None,
            "similar_defects": similar_defects,
            "triage_notes": [
                f"[check_duplicate] Closest match {match_id or 'unknown'} scored {score:.2f}, below the {SIMILARITY_THRESHOLD:.2f} threshold."
            ],
        }

    if match_status in RESOLVED_STATUSES:
        return {
            "is_duplicate": False,
            "is_regression": True,
            "duplicate_of": None,
            "similar_defects": similar_defects,
            "triage_notes": [
                f"[check_duplicate] Match {match_id} scored {score:.2f} and is {match_status}; marked as regression."
            ],
        }

    return {
        "is_duplicate": True,
        "is_regression": False,
        "duplicate_of": match_id,
        "similar_defects": similar_defects,
        "triage_notes": [
            f"[check_duplicate] Match {match_id} scored {score:.2f}; marked as duplicate."
        ],
    }
