"""Tests for structured, multimodal defect analysis."""

from __future__ import annotations

from app.agent.nodes import analyze


class _StructuredRunnable:
    def __init__(self, result: object) -> None:
        self.result = result
        self.calls: list[object] = []

    def invoke(self, messages: object) -> object:
        self.calls.append(messages)
        return self.result


def test_analyze_uses_structured_output_and_passes_base64_image(monkeypatch) -> None:
    runnable = _StructuredRunnable(
        analyze.AnalysisResult(
            category="Functional",
            component="authentication",
            root_cause="Safari click handler is not bound.",
            affected_area="Mobile login",
            keywords=["Safari", "login", "click-handler"],
        )
    )
    requested_schema: list[object] = []

    def fake_structured_llm(schema: object) -> _StructuredRunnable:
        requested_schema.append(schema)
        return runnable

    monkeypatch.setattr(analyze, "get_structured_llm", fake_structured_llm)

    update = analyze.analyze(
        {
            "title": "Login button does not respond",
            "description": "Tapping login in mobile Safari has no effect.",
            "stack_trace": "TypeError: click handler is undefined",
            "image_attachments": [{"content_type": "image/png", "data": "aGVsbG8="}],
        }
    )

    assert requested_schema == [analyze.AnalysisResult]
    assert update["component"] == "authentication"
    assert update["affected_area"] == "Mobile login"
    assert update["keywords"] == ["Safari", "login", "click-handler"]
    assert update["triage_notes"][-1].startswith("[analyze]")
    sent_messages = runnable.calls[0]
    image_block = sent_messages[1]["content"][1]
    assert image_block == {"type": "image_url", "image_url": "data:image/png;base64,aGVsbG8="}


def test_analyze_retries_once_after_a_structured_failure(monkeypatch) -> None:
    success = analyze.AnalysisResult(
        category="Performance",
        component="checkout",
        root_cause="Slow downstream response.",
        affected_area="Payment submission",
        keywords=["timeout"],
    )

    class _FlakyRunnable:
        calls = 0

        def invoke(self, _messages: object) -> object:
            self.calls += 1
            if self.calls == 1:
                raise RuntimeError("temporary Gemini failure")
            return success

    runnable = _FlakyRunnable()
    monkeypatch.setattr(analyze, "get_structured_llm", lambda _schema: runnable)

    update = analyze.analyze({"title": "Checkout is slow", "description": "Times out."})

    assert runnable.calls == 2
    assert update["component"] == "checkout"
    assert "attempt 2" in update["triage_notes"][-1]
