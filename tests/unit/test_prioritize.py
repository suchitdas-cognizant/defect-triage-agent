"""Tests for deterministic overrides around structured prioritization."""

from __future__ import annotations

from app.agent.nodes import prioritize


class _StructuredRunnable:
    def __init__(self, result: object) -> None:
        self.result = result
        self.calls = 0

    def invoke(self, _messages: object) -> object:
        self.calls += 1
        return self.result


def test_critical_keyword_override_forces_critical_and_lowers_confidence(monkeypatch) -> None:
    runnable = _StructuredRunnable(
        prioritize.PriorityResult(
            severity="HIGH",
            priority=2,
            confidence=0.91,
            reasoning="The issue affects a subset of checkout sessions.",
        )
    )
    monkeypatch.setattr(prioritize, "get_structured_llm", lambda _schema: runnable)

    update = prioritize.prioritize(
        {
            "title": "Checkout crash causes data loss",
            "description": "Customers lose the entire submitted cart.",
            "category": "Functional",
            "component": "checkout",
        }
    )

    assert runnable.calls == 1
    assert update["severity"] == "CRITICAL"
    assert update["priority"] == 1
    assert update["confidence"] == 0.50
    assert "override" in update["reasoning"].lower()
    assert "forced CRITICAL" in update["triage_notes"][-1]


def test_prioritize_retries_once_then_uses_rule_based_fallback(monkeypatch) -> None:
    class _FailingRunnable:
        calls = 0

        def invoke(self, _messages: object) -> object:
            self.calls += 1
            raise RuntimeError("Gemini is unavailable")

    runnable = _FailingRunnable()
    monkeypatch.setattr(prioritize, "get_structured_llm", lambda _schema: runnable)

    update = prioritize.prioritize(
        {"title": "Service outage blocks login", "description": "All users are affected."}
    )

    assert runnable.calls == 2
    assert update["severity"] == "CRITICAL"
    assert update["priority"] == 1
    assert update["confidence"] == 0.50
    assert update["warnings"]
