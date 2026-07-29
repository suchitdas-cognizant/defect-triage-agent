"""Best-effort ChromaDB knowledge base for duplicate and regression detection."""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import chromadb
import google.generativeai as genai

from app.tools.logging import logger

COLLECTION_NAME = "defect_backlog"
EMBEDDING_MODEL = "models/gemini-embedding-001"

_client: chromadb.PersistentClient | None = None
_collection: Any | None = None


def _chroma_dir() -> str:
    """Resolve the local, persistent ChromaDB directory from the environment."""

    return os.getenv("CHROMA_DIR", "./data/chroma")


def _safe_metadata(metadata: dict[str, Any] | None) -> dict[str, str | int | float | bool]:
    """Convert metadata to Chroma-supported scalar values only."""

    safe: dict[str, str | int | float | bool] = {}
    for key, value in (metadata or {}).items():
        if value is None:
            continue
        if isinstance(value, (str, int, float, bool)):
            safe[key] = value
        else:
            safe[key] = str(value)
    return safe


def get_collection() -> Any:
    """Return the persistent cosine-distance Chroma collection."""

    global _client, _collection
    if _collection is not None:
        return _collection

    chroma_path = Path(_chroma_dir())
    chroma_path.mkdir(parents=True, exist_ok=True)
    _client = chromadb.PersistentClient(path=str(chroma_path))
    _collection = _client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )
    return _collection


def reset_collection_cache() -> None:
    """Clear process-local client references; useful for isolated tests."""

    global _client, _collection
    _client = None
    _collection = None


def embed(text: str) -> list[float]:
    """Create a Gemini 3072-dimensional embedding for defect text."""

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is required to create embeddings")

    genai.configure(api_key=api_key)
    response = genai.embed_content(
        model=EMBEDDING_MODEL,
        content=text,
        task_type="retrieval_document",
    )
    values = response.get("embedding") if isinstance(response, dict) else None
    if not isinstance(values, list) or not values:
        raise RuntimeError("Gemini returned an empty embedding")
    return [float(value) for value in values]


def add_defect(
    defect_id: str,
    title: str,
    description: str,
    metadata: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Upsert a defect and its Gemini embedding into the local knowledge base."""

    try:
        document = f"{title.strip()}\n\n{description.strip()}".strip()
        collection = get_collection()
        record_metadata = _safe_metadata(metadata)
        record_metadata["source_id"] = defect_id
        record_metadata["title"] = title
        collection.upsert(
            ids=[defect_id],
            embeddings=[embed(document)],
            documents=[document],
            metadatas=[record_metadata],
        )
        logger.info("vector_store_upserted", defect_id=defect_id)
        return {"ok": True, "id": defect_id}
    except Exception as exc:  # External model and local storage must not break triage.
        logger.warning("vector_store_upsert_failed", defect_id=defect_id, error=str(exc))
        return {"ok": False, "id": defect_id, "error": str(exc)}


def _cosine_similarity(distance: float) -> float:
    """Convert Chroma cosine distance (0 = equal) into cosine similarity."""

    return max(-1.0, min(1.0, 1.0 - float(distance)))


def similarity_search_with_score(query_text: str, k: int = 5) -> list[tuple[dict[str, Any], float]]:
    """Return the nearest backlog defects with higher-is-better cosine scores."""

    try:
        collection = get_collection()
        if collection.count() == 0:
            return []

        result = collection.query(
            query_embeddings=[embed(query_text)],
            n_results=max(1, k),
            include=["metadatas", "documents", "distances"],
        )
        ids = (result.get("ids") or [[]])[0]
        metadatas = (result.get("metadatas") or [[]])[0]
        documents = (result.get("documents") or [[]])[0]
        distances = (result.get("distances") or [[]])[0]

        matches: list[tuple[dict[str, Any], float]] = []
        for defect_id, metadata, document, distance in zip(ids, metadatas, documents, distances):
            defect = dict(metadata or {})
            defect["id"] = defect.pop("source_id", defect_id)
            defect["title"] = defect.get("title", "")
            defect["description"] = document or ""
            matches.append((defect, _cosine_similarity(float(distance))))
        return matches
    except Exception as exc:  # A knowledge-base outage should result in triage, not failure.
        logger.warning("vector_store_search_failed", error=str(exc))
        return []


def upsert_defect(state: dict[str, Any]) -> dict[str, Any]:
    """Store a freshly triaged defect for future duplicate and feedback searches."""

    defect_id = str(state.get("defect_id", ""))
    if not defect_id:
        return {"ok": False, "error": "defect_id is required"}

    metadata = {
        "status": state.get("status", "OPEN"),
        "component": state.get("component", ""),
        "severity": state.get("severity", ""),
        "category": state.get("category", ""),
        "jira_key": state.get("jira_key", ""),
    }
    return add_defect(
        defect_id=defect_id,
        title=str(state.get("title", "")),
        description=str(state.get("description", "")),
        metadata=metadata,
    )


def health_check() -> dict[str, Any]:
    """Report local knowledge-base readiness without raising on storage errors."""

    try:
        count = int(get_collection().count())
        return {"status": "ready" if count else "empty", "count": count}
    except Exception as exc:
        logger.warning("vector_store_health_check_failed", error=str(exc))
        return {"status": "error", "count": 0, "error": str(exc)}
