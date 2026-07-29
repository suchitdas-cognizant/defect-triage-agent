"""Structured severity and priority decision node with deterministic safety overrides."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field

from app.agent.state import TriageState
from app.tools.llm import get_structured_llm
from app.tools.logging import logger


class PriorityResult(BaseModel):
    """Constrained severity decision produced by the Gemini structured-output call."""

    severity: Literal["CRITICAL", "HIGH", "MEDIUM", "LOW"]
    priority: Literal[1, 2, 3, 4]
    reasoning: str
    confidence: float = Field(ge=0, le=1)


CRITICAL_KEYWORDS = ("crash", "data loss", "data-loss", "security", "outage")

# === REPLACE WITH REAL SME-CORRECTED EXAMPLES WHEN AVAILABLE ===
SME_FEW_SHOT_EXAMPLES = """
Organisation severity anchors:
- Bug: "Checkout crashes and loses the submitted cart" -> CRITICAL, priority 1.
- Bug: "Authentication outage prevents all customer logins" -> CRITICAL, priority 1.
- Bug: "Invoice export returns a 500 error for finance users" -> HIGH, priority 2.
- Bug: "Search results sort incorrectly for a small group of users" -> MEDIUM, priority 3.
- Bug: "Button border is two pixels misaligned in the settings screen" -> LOW, priority 4.
""".strip()

SYSTEM_PROMPT = f"""You are the DefectTriageBot prioritization stage for Quality Engineering.
Return only the requested structured schema. Apply the organisation-specific examples
below rather than a generic internet severity scale. Base your decision on user impact,
data integrity, security exposure, scope, and reproducibility. Do not claim certainty
without evidence.

{SME_FEW_SHOT_EXAMPLES}
"""


def _has_critical_keyword(state: TriageState) -> bool:
    report = f"{state.get('title', '')}\n{state.get('description', '')}".lower()
    return any(keyword in report for keyword in CRITICAL_KEYWORDS)


def build_priority_messages(state: TriageState) -> list[dict[str, str]]:
    """Build a text-only message for schema-constrained prioritization."""

    report = "\n".join(
        (
            f"Title: {state.get('title', '')}",
            f"Description: {state.get('description', '')}",
            f"Category: {state.get('category', '') or 'Not yet classified'}",
            f"Component: {state.get('component', '') or 'Unknown'}",
            f"Root cause: {state.get('root_cause', '') or 'Unknown'}",
            f"Regression: {bool(state.get('is_regression', False))}",
        )
    )
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": report},
    ]


def _invoke_structured_priority(messages: list[dict[str, str]]) -> PriorityResult:
    result = get_structured_llm(PriorityResult).invoke(messages)
    return PriorityResult.model_validate(result)


def _rule_based_fallback(state: TriageState) -> dict[str, Any]:
    """Provide a conservative, auditable decision after two provider failures."""

    critical = _has_critical_keyword(state)
    severity = "CRITICAL" if critical else "MEDIUM"
    priority = 1 if critical else 3
    confidence = 0.50 if critical else 0.25
    return {
        "severity": severity,
        "priority": priority,
        "confidence": confidence,
        "reasoning": "Structured prioritization was unavailable; conservative rule-based severity applied.",
        "warnings": ["[prioritize] Gemini structured prioritization failed twice; used rule-based fallback."],
        "triage_notes": [
            f"[prioritize] Structured prioritization failed twice; applied {severity} rule-based fallback."
        ],
    }


def prioritize(state: TriageState) -> dict[str, Any]:
    """Return severity, priority, confidence, and reasoning as a partial state update."""

    messages = build_priority_messages(state)
    for attempt in (1, 2):
        try:
            result = _invoke_structured_priority(messages)
            if _has_critical_keyword(state) and result.severity != "CRITICAL":
                return {
                    "severity": "CRITICAL",
                    "priority": 1,
                    "confidence": 0.50,
                    "reasoning": (
                        f"{result.reasoning} Deterministic critical-keyword override applied."
                    ),
                    "triage_notes": [
                        "[prioritize] Structured result disagreed with a critical keyword; forced CRITICAL/P1 at 0.50 confidence."
                    ],
                }
            return {
                "severity": result.severity,
                "priority": result.priority,
                "confidence": result.confidence,
                "reasoning": result.reasoning,
                "triage_notes": [
                    f"[prioritize] Structured severity {result.severity}/P{result.priority} completed on attempt {attempt}."
                ],
            }
        except Exception as error:  # External provider calls must not stop triage.
            logger.warning("structured_prioritization_failed", attempt=attempt, error=str(error))

    return _rule_based_fallback(state)
