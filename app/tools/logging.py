"""Consistent structured logging for the API, graph, and integration adapters."""

from __future__ import annotations

import logging
import sys

import structlog


def configure_logging() -> None:
    """Configure JSON logs once; safe to call during application startup."""

    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso", utc=True),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
        logger_factory=structlog.PrintLoggerFactory(file=sys.stdout),
        cache_logger_on_first_use=True,
    )


configure_logging()
logger = structlog.get_logger("defect_triage_bot")
