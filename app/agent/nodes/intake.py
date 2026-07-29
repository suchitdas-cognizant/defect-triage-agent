"""Normalize raw defect input before the triage workflow evaluates it."""

from __future__ import annotations

import base64
from typing import Any

from app.agent.state import TriageState


def _clean_text(value: Any) -> str:
    return " ".join(str(value or "").split())


def _image_attachment(value: Any) -> dict[str, Any] | None:
    """Normalize raw/base64 image input into a multimodal attachment record."""

    if isinstance(value, dict):
        encoded = value.get("data") or value.get("base64") or value.get("content")
        content_type = value.get("content_type") or value.get("mime_type") or "image/png"
    elif isinstance(value, str):
        encoded = value
        content_type = "image/png"
    else:
        return None

    if not isinstance(encoded, str) or not encoded.strip():
        return None
    encoded = encoded.strip()
    if encoded.startswith("data:image/") and "," in encoded:
        header, encoded = encoded.split(",", 1)
        content_type = header.split(";", 1)[0].replace("data:", "")
    try:
        base64.b64decode(encoded, validate=True)
    except (ValueError, TypeError):
        return None
    return {"content_type": content_type, "data": encoded}


def intake(state: TriageState) -> dict[str, Any]:
    """Return normalized report fields and new base64 image attachments only."""

    raw = state.get("raw_input", {}) or {}
    title = _clean_text(raw.get("title", state.get("title", "")))
    description = _clean_text(raw.get("description", state.get("description", "")))
    stack_trace = str(raw.get("stack_trace", raw.get("logs", state.get("stack_trace", ""))) or "").strip()

    incoming = raw.get("image_attachments", raw.get("attachments", []))
    if not isinstance(incoming, list):
        incoming = [incoming]
    attachments = [attachment for item in incoming if (attachment := _image_attachment(item))]

    return {
        "title": title,
        "description": description,
        "stack_trace": stack_trace,
        "image_attachments": attachments,
        "triage_notes": [
            f"[intake] Normalized title, description, and stack trace; extracted {len(attachments)} image attachment(s)."
        ],
    }
