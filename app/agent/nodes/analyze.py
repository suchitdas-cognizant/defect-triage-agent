"""Multimodal structured analysis node for an incoming defect report."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field

from app.agent.state import TriageState
from app.tools.llm import get_structured_llm
from app.tools.logging import logger


class AnalysisResult(BaseModel):
    """The only shape the analysis model is permitted to return."""

    category: str = Field(description="Defect category, for example functional or performance.")
    component: str = Field(description="Most likely affected product component.")
    root_cause: str = Field(description="Concise probable root cause.")
    affected_area: str = Field(description="User journey, API, service, or screen affected.")
    keywords: list[str] = Field(default_factory=list, description="Useful routing and search terms.")


SYSTEM_PROMPT = """You are the DefectTriageBot analysis stage for Quality Engineering.
Analyze the supplied bug report and any attached screenshots. Infer the most likely
category, owning component, root cause, affected area, and concise search keywords.
Use only evidence in the report or image. Do not invent stack traces, ticket IDs, or
customer details. Return the requested structured schema."""


def _attachment_to_image_block(attachment: Any) -> dict[str, str] | None:
    """Convert the normalized intake attachment into a LangChain image content block."""

    if not isinstance(attachment, dict):
        return None

    encoded = attachment.get("data") or attachment.get("base64") or attachment.get("content")
    if not isinstance(encoded, str) or not encoded.strip():
        return None

    encoded = encoded.strip()
    if encoded.startswith("data:image/"):
        image_url = encoded
    else:
        content_type = str(attachment.get("content_type") or attachment.get("mime_type") or "image/png")
        image_url = f"data:{content_type};base64,{encoded}"
    return {"type": "image_url", "image_url": image_url}


def build_analysis_messages(state: TriageState) -> list[dict[str, Any]]:
    """Build provider-neutral multimodal chat messages from the current state."""

    report_text = "\n".join(
        (
            "Defect report:",
            f"Title: {state.get('title', '')}",
            f"Description: {state.get('description', '')}",
            f"Stack trace: {state.get('stack_trace', '') or 'Not provided'}",
        )
    )
    content: list[dict[str, str]] = [{"type": "text", "text": report_text}]
    for attachment in state.get("image_attachments", []) or []:
        image_block = _attachment_to_image_block(attachment)
        if image_block:
            content.append(image_block)

    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": content},
    ]


def _invoke_structured_analysis(messages: list[dict[str, Any]]) -> AnalysisResult:
    result = get_structured_llm(AnalysisResult).invoke(messages)
    return AnalysisResult.model_validate(result)


def analyze(state: TriageState) -> dict[str, Any]:
    """Return a partial, schema-validated analysis update without mutating state.

    Gemini is called through its structured-output runnable. A single retry keeps a
    transient provider failure from stopping the complete triage graph; persistent
    failure returns conservative, reviewable defaults.
    """

    messages = build_analysis_messages(state)
    for attempt in (1, 2):
        try:
            result = _invoke_structured_analysis(messages)
            return {
                "category": result.category,
                "component": result.component,
                "root_cause": result.root_cause,
                "affected_area": result.affected_area,
                "keywords": result.keywords,
                "triage_notes": [
                    f"[analyze] Structured multimodal analysis completed on attempt {attempt}."
                ],
            }
        except Exception as error:  # External model calls are intentionally best-effort.
            logger.warning("structured_analysis_failed", attempt=attempt, error=str(error))

    return {
        "category": "Unclassified",
        "component": "general",
        "root_cause": "Structured analysis was unavailable; requires human review.",
        "affected_area": "Unknown",
        "keywords": [],
        "warnings": ["[analyze] Gemini structured analysis failed twice; used safe defaults."],
        "triage_notes": ["[analyze] Structured analysis failed twice; returned review-required defaults."],
    }
