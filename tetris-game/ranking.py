from __future__ import annotations
import json
import os
from datetime import datetime
from pathlib import Path

SCORES_PATH = Path(__file__).parent / "scores.json"
MAX_ENTRIES = 10


class RankingEntry:
    def __init__(self, name: str, score: int, level: int, lines: int, date: str) -> None:
        self.name = name
        self.score = score
        self.level = level
        self.lines = lines
        self.date = date

    def to_dict(self) -> dict:
        return {"name": self.name, "score": self.score,
                "level": self.level, "lines": self.lines, "date": self.date}

    @staticmethod
    def from_dict(d: dict) -> "RankingEntry":
        return RankingEntry(
            name=d.get("name", "???"), score=d.get("score", 0),
            level=d.get("level", 1), lines=d.get("lines", 0), date=d.get("date", ""),
        )


class RankingManager:
    def __init__(self) -> None:
        self._entries: list[RankingEntry] = []
        self._load()

    def _load(self) -> None:
        try:
            with open(SCORES_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
            self._entries = [RankingEntry.from_dict(d) for d in data.get("rankings", [])]
        except (FileNotFoundError, json.JSONDecodeError):
            self._entries = []

    def _save(self) -> None:
        tmp = str(SCORES_PATH) + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump({"rankings": [e.to_dict() for e in self._entries]},
                      f, ensure_ascii=False, indent=2)
        os.replace(tmp, str(SCORES_PATH))

    def is_top_10(self, score: int) -> bool:
        if score <= 0:
            return False
        if len(self._entries) < MAX_ENTRIES:
            return True
        return score > self._entries[-1].score

    def add_entry(self, name: str, score: int, level: int, lines: int) -> int:
        date = datetime.now().isoformat(timespec="seconds")
        entry = RankingEntry(name=name[:10], score=score, level=level, lines=lines, date=date)
        self._entries.append(entry)
        self._entries.sort(key=lambda e: (-e.score, e.date))
        self._entries = self._entries[:MAX_ENTRIES]
        self._save()
        return next((i + 1 for i, e in enumerate(self._entries) if e.date == date), -1)

    @property
    def entries(self) -> list[RankingEntry]:
        return self._entries
