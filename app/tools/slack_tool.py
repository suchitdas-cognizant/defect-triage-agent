"""Best-effort Slack adapter placeholder for the integration phase."""

from __future__ import annotations

from typing import Any

from app.tools.logging import logger


def send_notification(channel: str, message: str) -> dict[str, Any]:
    """Log the intended Slack notification without sending a webhook."""

    logger.info("slack_notification_stub", channel=channel, message=message)
    return {"ok": True, "stub": True, "action": "send_notification"}
