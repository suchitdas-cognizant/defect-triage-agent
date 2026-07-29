"""Unit tests for ChromaDB-backed duplicate detection utilities."""

from __future__ import annotations

from typing import Any

import pytest

from app.agent.constants import SIMILARITY_THRESHOLD
from app.tools import vector_store


class InMemoryCollection:
    """Small Chroma-shaped fake so tests never require a local database."""

    def __init__(self, *, count: int = 0, query_result: dict[str, Any] | None = None) -> None:
        self._count = count
        self.query_result = query_result or {
            "ids": [[]],
            "metadatas": [[]],
            "documents": [[]],
            "distances": [[]],
        }
        self.upsert_calls: list[dict[str, Any]] = []
        self.query_calls: list[dict[str, Any]] = []

    def upsert(self, **kwargs: Any) -> None:
        self.upsert_calls.append(kwargs)
        self._count = len(kwargs["ids"])

    def count(self) -> int:
        return self._count

    def query(self, **kwargs: Any) -> dict[str, Any]:
        self.query_calls.append(kwargs)
        return self.query_result


class FailingQueryCollection(InMemoryCollection):
    def query(self, **kwargs: Any) -> dict[str, Any]:
        raise RuntimeError("Chroma unavailable")


def test_add_defect_upserts_mocked_embedding(monkeypatch: pytest.MonkeyPatch) -> None:
    collection = InMemoryCollection()
    monkeypatch.setattr(vector_store, "get_collection", lambda: collection)
    monkeypatch.setattr(vector_store, "embed", lambda text: [0.11, 0.22, 0.33])

    result = vector_store.add_defect(
        defect_id="DEF-999",
        title="Checkout has an error",
        description="The checkout flow fails after payment confirmation.",
        metadata={"status": "OPEN", "component": "Payments"},
    )

    assert result == {"ok": True, "id": "DEF-999"}
    assert len(collection.upsert_calls) == 1
    request = collection.upsert_calls[0]
    assert request["ids"] == ["DEF-999"]
    assert request["embeddings"] == [[0.11, 0.22, 0.33]]
    assert request["documents"] == [
        "Checkout has an error\n\nThe checkout flow fails after payment confirmation."
    ]
    assert request["metadatas"][0]["source_id"] == "DEF-999"
    assert request["metadatas"][0]["status"] == "OPEN"


def test_similarity_search_converts_chroma_cosine_distance(monkeypatch: pytest.MonkeyPatch) -> None:
    collection = InMemoryCollection(
        count=2,
        query_result={
            "ids": [["DEF-101", "DEF-155"]],
            "metadatas": [[
                {"source_id": "DEF-101", "title": "Mobile Safari login", "status": "OPEN"},
                {"source_id": "DEF-155", "title": "Search filters", "status": "CLOSED"},
            ]],
            "documents": [["Login does not submit on Safari", "Filters are reset on browser back"]],
            # Chroma cosine distance: similarity is calculated as 1 - distance.
            "distances": [[0.05, 0.28]],
        },
    )
    monkeypatch.setattr(vector_store, "get_collection", lambda: collection)
    monkeypatch.setattr(vector_store, "embed", lambda text: [0.9, 0.1])

    matches = vector_store.similarity_search_with_score("Safari login does not respond", k=2)

    assert collection.query_calls[0]["query_embeddings"] == [[0.9, 0.1]]
    assert matches[0][0]["id"] == "DEF-101"
    assert matches[0][1] == pytest.approx(0.95)
    assert matches[0][1] >= SIMILARITY_THRESHOLD
    assert matches[1][0]["id"] == "DEF-155"
    assert matches[1][1] == pytest.approx(0.72)
    assert matches[1][1] < SIMILARITY_THRESHOLD


@pytest.mark.parametrize(
    ("count", "expected_status"),
    [(3, "ready"), (0, "empty")],
)
def test_health_check_reports_ready_or_empty(
    monkeypatch: pytest.MonkeyPatch,
    count: int,
    expected_status: str,
) -> None:
    monkeypatch.setattr(vector_store, "get_collection", lambda: InMemoryCollection(count=count))

    assert vector_store.health_check() == {"status": expected_status, "count": count}


def test_similarity_search_returns_safe_default_on_chroma_error(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(vector_store, "get_collection", lambda: FailingQueryCollection(count=1))
    monkeypatch.setattr(vector_store, "embed", lambda text: [0.1, 0.2])

    assert vector_store.similarity_search_with_score("any defect") == []
