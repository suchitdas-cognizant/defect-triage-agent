"""Best-effort on-call adapter placeholder for the integration phase."""

from __future__ import annotations

from typing import Any

from app.tools.logging import logger


def page_on_call(defect_id: str, title: str, severity: str) -> dict[str, Any]:
    """Log the intended PagerDuty page without calling the service."""

    logger.info("oncall_page_stub", defect_id=defect_id, title=title, severity=severity)
    return {"ok": True, "stub": True, "action": "page_on_call"}
