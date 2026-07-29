"""Shared pytest setup for deterministic, credential-free test runs."""

from __future__ import annotations

import os
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

TEST_ENVIRONMENT = {
    "GEMINI_API_KEY": "test-gemini-key",
    "JIRA_BASE_URL": "https://test.atlassian.net",
    "JIRA_EMAIL": "tester@example.com",
    "JIRA_API_TOKEN": "test-jira-token",
    "JIRA_PROJECT_KEY": "TEST",
    "SLACK_WEBHOOK_URL": "https://example.test/slack",
    "SLACK_ONCALL_WEBHOOK_URL": "https://example.test/slack-oncall",
    "SMTP_HOST": "localhost",
    "SMTP_PORT": "1025",
    "SMTP_USER": "tester",
    "SMTP_PASS": "test-smtp-password",
    "PAGERDUTY_KEY": "test-pagerduty-key",
    "CHROMA_DIR": str(PROJECT_ROOT / "data" / "test_chroma"),
}

for key, value in TEST_ENVIRONMENT.items():
    os.environ.setdefault(key, value)
