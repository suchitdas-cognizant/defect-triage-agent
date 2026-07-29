"""Best-effort email adapter placeholder for the integration phase."""

from __future__ import annotations

from typing import Any

from app.tools.logging import logger


def send_email(recipients: list[str], subject: str, body: str) -> dict[str, Any]:
    """Log the intended email without connecting to SMTP."""

    logger.info("email_notification_stub", recipients=recipients, subject=subject, body=body)
    return {"ok": True, "stub": True, "action": "send_email"}
