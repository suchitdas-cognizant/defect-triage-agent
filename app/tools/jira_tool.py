"""Best-effort Jira adapter placeholder for the integration phase."""

from __future__ import annotations

from typing import Any

from app.tools.logging import logger


def create_and_close_duplicate(defect_id: str, duplicate_of: str, summary: str) -> dict[str, Any]:
    """Log the intended duplicate workflow without contacting Jira yet."""

    logger.info(
        "jira_duplicate_stub",
        defect_id=defect_id,
        duplicate_of=duplicate_of,
        summary=summary,
        action="would create+close duplicate Bug",
    )
    return {"ok": True, "stub": True, "action": "create_and_close_duplicate"}


def update_issue(defect_id: str, fields: dict[str, Any]) -> dict[str, Any]:
    """Log the intended Jira update without contacting Jira yet."""

    logger.info("jira_update_stub", defect_id=defect_id, fields=fields)
    return {"ok": True, "stub": True, "action": "update_issue"}
