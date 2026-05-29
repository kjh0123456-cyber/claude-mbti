from __future__ import annotations
from typing import Optional
from constants import BOARD_WIDTH, BOARD_HEIGHT
from tetromino import Tetromino, SHAPE_ROTATIONS

Color = tuple[int, int, int]
Grid = list[list[Optional[Color]]]


class Board:
    def __init__(self) -> None:
        self.grid: Grid = self._empty_grid()

    def _empty_grid(self) -> Grid:
        return [[None] * BOARD_WIDTH for _ in range(BOARD_HEIGHT)]

    def is_valid_position(self, piece: Tetromino, ox: int, oy: int, rotation: int) -> bool:
        for dx, dy in SHAPE_ROTATIONS[piece.shape][rotation % 4]:
            x, y = ox + dx, oy + dy
            if x < 0 or x >= BOARD_WIDTH or y >= BOARD_HEIGHT:
                return False
            if y >= 0 and self.grid[y][x] is not None:
                return False
        return True

    def place(self, piece: Tetromino) -> None:
        for bx, by in piece.board_cells():
            if 0 <= by < BOARD_HEIGHT and 0 <= bx < BOARD_WIDTH:
                self.grid[by][bx] = piece.color

    def clear_lines(self) -> int:
        full = [y for y in range(BOARD_HEIGHT) if all(c is not None for c in self.grid[y])]
        for y in full:
            del self.grid[y]
            self.grid.insert(0, [None] * BOARD_WIDTH)
        return len(full)

    def ghost_y(self, piece: Tetromino) -> int:
        gy = piece.y
        while self.is_valid_position(piece, piece.x, gy + 1, piece.rotation):
            gy += 1
        return gy

    def is_topped_out(self, piece: Tetromino) -> bool:
        return not self.is_valid_position(piece, piece.x, piece.y, piece.rotation)

    def reset(self) -> None:
        self.grid = self._empty_grid()
