"""Gemini client factories used by structured LangGraph nodes."""

from __future__ import annotations

from typing import Any, TypeVar

from langchain_google_genai import ChatGoogleGenerativeAI

SchemaT = TypeVar("SchemaT")


def get_llm() -> ChatGoogleGenerativeAI:
    """Return the deterministic Gemini Flash model used for triage reasoning.

    ``ChatGoogleGenerativeAI`` reads ``GEMINI_API_KEY`` from the environment;
    keys are deliberately never passed or stored in source code.
    """

    return ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)


def get_structured_llm(schema: type[SchemaT] | dict[str, Any]) -> Any:
    """Return a Gemini runnable constrained to the supplied output schema."""

    return get_llm().with_structured_output(schema)
