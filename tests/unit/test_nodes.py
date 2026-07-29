"""Deterministic tests for the non-LLM triage graph nodes.

All I/O boundaries are monkeypatched so these tests can run without Gemini,
ChromaDB, Jira, Slack, email, or PagerDuty credentials.
"""

from __future__ import annotations

import sys
import types

import pytest

# The duplicate node imports the vector-store module at collection time.  The
# behaviour under test is monkeypatched below, so a small local stand-in keeps
# this node suite independent of the optional legacy Gemini SDK installation.
try:
    import google.generativeai  # type: ignore[import-not-found]  # noqa: F401
except ModuleNotFoundError:
    google_module = types.ModuleType("google")
    generativeai_module = types.ModuleType("google.generativeai")
    generativeai_module.configure = lambda **_kwargs: None
    generativeai_module.embed_content = lambda **_kwargs: {"embedding": [0.0]}
    google_module.generativeai = generativeai_module
    sys.modules.setdefault("google", google_module)
    sys.modules["google.generativeai"] = generativeai_module

try:
    import structlog  # type: ignore[import-not-found]  # noqa: F401
except ModuleNotFoundError:
    class _NoopLogger:
        def info(self, *_args: object, **_kwargs: object) -> None:
            return None

        def warning(self, *_args: object, **_kwargs: object) -> None:
            return None

    structlog_module = types.ModuleType("structlog")
    structlog_module.configure = lambda **_kwargs: None
    structlog_module.get_logger = lambda _name: _NoopLogger()
    structlog_module.make_filtering_bound_logger = lambda _level: _NoopLogger
    structlog_module.PrintLoggerFactory = lambda **_kwargs: _NoopLogger()
    structlog_module.contextvars = types.SimpleNamespace(merge_contextvars=lambda *_args, **_kwargs: None)
    structlog_module.processors = types.SimpleNamespace(
        add_log_level=lambda *_args, **_kwargs: None,
        TimeStamper=lambda **_kwargs: None,
        StackInfoRenderer=lambda: None,
        format_exc_info=lambda *_args, **_kwargs: None,
        JSONRenderer=lambda: None,
    )
    sys.modules["structlog"] = structlog_module

from app.agent.nodes import assign, duplicate, escalate, flag_dup, intake, notify


def test_intake_normalizes_raw_input_and_extracts_base64_image() -> None:
    state = {
        "raw_input": {
            "title": "  Login button does not respond  ",
            "description": "  Tapping Login in Safari has no effect.  ",
            "stack_trace": "  TypeError: handler is undefined  ",
            "attachments": [
                {
                    "name": "mobile-error.png",
                    "content": "data:image/png;base64,aGVsbG8=",
                },
                {"name": "notes.txt", "content": "plain text"},
            ],
        },
        "triage_notes": [],
    }

    update = intake.intake(state)

    assert update["title"] == "Login button does not respond"
    assert update["description"] == "Tapping Login in Safari has no effect."
    assert update["stack_trace"] == "TypeError: handler is undefined"
    assert update["image_attachments"] == [
        {
            "content_type": "image/png",
            "data": "aGVsbG8=",
        }
    ]
    assert update["triage_notes"][-1].startswith("[intake]")


def test_duplicate_node_flags_open_similarity_match(monkeypatch: pytest.MonkeyPatch) -> None:
    match = {
        "id": "DEF-101",
        "title": "Login button unresponsive on mobile Safari",
        "description": "Tapping Login does nothing in mobile Safari.",
        "status": "OPEN",
    }
    monkeypatch.setattr(
        duplicate.vector_store,
        "similarity_search_with_score",
        lambda _query, k=5: [(match, 0.88)],
    )

    update = duplicate.check_duplicate(
        {
            "title": "Login does not respond in Safari",
            "description": "Button is inert on iPhone.",
            "similar_defects": [],
            "triage_notes": [],
        }
    )

    assert update["is_duplicate"] is True
    assert update["is_regression"] is False
    assert update["duplicate_of"] == "DEF-101"
    assert update["similar_defects"] == [{**match, "cosine_score": 0.88}]
    assert "duplicate" in update["triage_notes"][-1].lower()


def test_duplicate_node_flags_resolved_match_as_regression(monkeypatch: pytest.MonkeyPatch) -> None:
    match = {
        "id": "DEF-050",
        "title": "Checkout crashes when cart total exceeds $10,000",
        "description": "Resolved prior checkout crash.",
        "status": "RESOLVED",
    }
    monkeypatch.setattr(
        duplicate.vector_store,
        "similarity_search_with_score",
        lambda _query, k=5: [(match, 0.80)],
    )

    update = duplicate.check_duplicate(
        {
            "title": "Checkout crash for orders above $10k",
            "description": "Cart crashes again.",
            "similar_defects": [],
            "triage_notes": [],
        }
    )

    assert update["is_duplicate"] is False
    assert update["is_regression"] is True
    assert update["duplicate_of"] is None
    assert update["similar_defects"][0]["id"] == "DEF-050"
    assert "regression" in update["triage_notes"][-1].lower()


def test_assign_auto_assigns_first_team_member() -> None:
    update = assign.assign(
        {
            "component": "payments",
            "auto_assign": True,
            "triage_notes": [],
        }
    )

    assert update["assigned_team"] == "payments-engineering"
    assert update["assignee"] == "meera.iyer"
    assert update["triage_notes"][-1].startswith("[assign]")


def test_assign_uses_human_resume_value_without_interrupt(monkeypatch: pytest.MonkeyPatch) -> None:
    def unexpected_interrupt(_payload: dict[str, object]) -> object:
        raise AssertionError("interrupt must not run after a human choice is present")

    monkeypatch.setattr(assign, "interrupt", unexpected_interrupt)

    update = assign.assign(
        {
            "component": "payments",
            "auto_assign": False,
            "human_input": {"assignee": "daniel.cho"},
            "triage_notes": [],
        }
    )

    assert update["assigned_team"] == "payments-engineering"
    assert update["assignee"] == "daniel.cho"
    assert "human" in update["triage_notes"][-1].lower()


def test_assign_interrupts_for_human_pick(monkeypatch: pytest.MonkeyPatch) -> None:
    captured: dict[str, object] = {}

    def fake_interrupt(payload: dict[str, object]) -> None:
        captured.update(payload)
        raise RuntimeError("waiting for human assignee")

    monkeypatch.setattr(assign, "interrupt", fake_interrupt)

    with pytest.raises(RuntimeError, match="waiting for human assignee"):
        assign.assign(
            {
                "component": "payments",
                "auto_assign": False,
                "human_input": {},
                "triage_notes": [],
            }
        )

    assert captured == {
        "type": "assignee_pick",
        "team": "payments-engineering",
        "candidates": ["meera.iyer", "daniel.cho"],
    }


def test_side_effect_nodes_call_stub_tools_and_record_breadcrumbs(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    calls: list[tuple[str, dict[str, object]]] = []

    def stub(name: str):
        def _call(*args: object, **kwargs: object) -> dict[str, object]:
            calls.append((name, {"args": args, **kwargs}))
            return {"ok": True, "stub": True}

        return _call

    monkeypatch.setattr(escalate.oncall_tool, "page_on_call", stub("oncall"))
    monkeypatch.setattr(flag_dup.jira_tool, "create_and_close_duplicate", stub("duplicate"))
    monkeypatch.setattr(notify.jira_tool, "update_issue", stub("jira"))
    monkeypatch.setattr(notify.slack_tool, "send_notification", stub("slack"))
    monkeypatch.setattr(notify.email_tool, "send_email", stub("email"))

    state = {
        "defect_id": "DEF-999",
        "jira_key": "DTB-999",
        "title": "Checkout data loss",
        "description": "Cart disappears after payment.",
        "severity": "CRITICAL",
        "assigned_team": "payments-engineering",
        "assignee": "meera.iyer",
        "duplicate_of": "DEF-101",
        "triage_notes": [],
    }

    escalation = escalate.escalate(state)
    flagged = flag_dup.flag_duplicate(state)
    notification = notify.notify(state)

    assert {name for name, _kwargs in calls} == {
        "oncall",
        "duplicate",
        "jira",
        "slack",
        "email",
    }
    assert escalation["triage_notes"][-1].startswith("[escalate]")
    assert flagged["triage_notes"][-1].startswith("[flag_duplicate]")
    assert notification["triage_notes"][-1].startswith("[notify]")
