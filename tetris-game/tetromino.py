from __future__ import annotations
import random
from constants import TETROMINO_COLORS, BOARD_WIDTH

# Base shapes: (col_offset, row_offset) from top-left of bounding box
_BASE_SHAPES: dict[str, list[tuple[int, int]]] = {
    "I": [(0, 1), (1, 1), (2, 1), (3, 1)],
    "O": [(0, 0), (1, 0), (0, 1), (1, 1)],
    "T": [(1, 0), (0, 1), (1, 1), (2, 1)],
    "S": [(1, 0), (2, 0), (0, 1), (1, 1)],
    "Z": [(0, 0), (1, 0), (1, 1), (2, 1)],
    "J": [(0, 0), (0, 1), (1, 1), (2, 1)],
    "L": [(2, 0), (0, 1), (1, 1), (2, 1)],
}

# Wall kick offsets: try each in order until a valid position is found
_WALL_KICKS_JLSTZ: list[tuple[int, int]] = [
    (0, 0), (-1, 0), (1, 0), (-2, 0), (2, 0), (0, -1), (0, 1),
]
_WALL_KICKS_I: list[tuple[int, int]] = [
    (0, 0), (-1, 0), (2, 0), (-1, -2), (2, 1), (0, -1), (0, 1),
]


def _rotate_cw(cells: list[tuple[int, int]]) -> list[tuple[int, int]]:
    rotated = [(y, -x) for x, y in cells]
    min_x = min(c[0] for c in rotated)
    min_y = min(c[1] for c in rotated)
    return [(x - min_x, y - min_y) for x, y in rotated]


def _build_rotations(base: list[tuple[int, int]]) -> list[list[tuple[int, int]]]:
    states = [sorted(base)]
    for _ in range(3):
        states.append(sorted(_rotate_cw(states[-1])))
    return states


SHAPE_ROTATIONS: dict[str, list[list[tuple[int, int]]]] = {
    name: _build_rotations(base) for name, base in _BASE_SHAPES.items()
}

# 7-bag randomizer state
_bag: list[str] = []


def _next_shape() -> str:
    global _bag
    if not _bag:
        _bag = list(_BASE_SHAPES.keys())
        random.shuffle(_bag)
    return _bag.pop()


class Tetromino:
    def __init__(self, shape: str) -> None:
        self.shape = shape
        self.color: tuple[int, int, int] = TETROMINO_COLORS[shape]
        self.rotation = 0
        self.x = BOARD_WIDTH // 2 - 2
        self.y = 0

    @property
    def cells(self) -> list[tuple[int, int]]:
        return SHAPE_ROTATIONS[self.shape][self.rotation]

    def board_cells(self) -> list[tuple[int, int]]:
        return [(self.x + dx, self.y + dy) for dx, dy in self.cells]

    def wall_kick_offsets(self) -> list[tuple[int, int]]:
        return _WALL_KICKS_I if self.shape == "I" else _WALL_KICKS_JLSTZ

    @staticmethod
    def from_bag() -> "Tetromino":
        return Tetromino(_next_shape())
