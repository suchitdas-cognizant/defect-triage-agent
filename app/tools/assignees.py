"""Static routing directory for deterministic component-to-team assignment."""

from __future__ import annotations

COMPONENT_TEAMS = {
    "authentication": "identity-engineering",
    "identity": "identity-engineering",
    "login": "identity-engineering",
    "payments": "payments-engineering",
    "checkout": "payments-engineering",
    "billing": "payments-engineering",
    "mobile": "mobile-experience",
    "ios": "mobile-experience",
    "android": "mobile-experience",
    "search": "discovery-engineering",
    "catalog": "discovery-engineering",
    "data": "data-platform",
    "analytics": "data-platform",
    "api": "platform-engineering",
    "platform": "platform-engineering",
}

TEAM_ASSIGNEES = {
    "identity-engineering": ["aisha.khan", "rohan.shah"],
    "payments-engineering": ["meera.iyer", "daniel.cho"],
    "mobile-experience": ["priya.nair", "lucas.fern"],
    "discovery-engineering": ["olivia.park", "arjun.mehta"],
    "data-platform": ["nina.patel", "sam.wilson"],
    "platform-engineering": ["devon.lee", "fatima.ali"],
}

TEAM_EMAILS = {
    "identity-engineering": "identity-engineering@example.com",
    "payments-engineering": "payments-engineering@example.com",
    "mobile-experience": "mobile-experience@example.com",
    "discovery-engineering": "discovery-engineering@example.com",
    "data-platform": "data-platform@example.com",
    "platform-engineering": "platform-engineering@example.com",
}


def get_team_for_component(component: str) -> str:
    """Resolve a component to its team, with platform as the safe default."""

    normalized = (component or "").strip().lower()
    return COMPONENT_TEAMS.get(normalized, "platform-engineering")
