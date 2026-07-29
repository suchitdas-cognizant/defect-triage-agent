"""Seed the local ChromaDB collection with the deterministic test backlog."""

from __future__ import annotations

import json
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.tools.vector_store import add_defect  # noqa: E402


def main() -> int:
    fixture_path = PROJECT_ROOT / "tests" / "fixtures" / "seed_backlog.json"
    defects = json.loads(fixture_path.read_text(encoding="utf-8"))

    seeded_count = 0
    for defect in defects:
        result = add_defect(
            defect_id=defect["id"],
            title=defect["title"],
            description=defect["description"],
            metadata={
                "status": defect["status"],
                "component": defect["component"],
                "severity": defect["severity"],
            },
        )
        if result.get("ok", False):
            seeded_count += 1

    print(f"Seeded {seeded_count}/{len(defects)} defects into the vector store.")
    return 0 if seeded_count == len(defects) else 1


if __name__ == "__main__":
    raise SystemExit(main())
