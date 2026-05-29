from constants import SCORE_TABLE, COMBO_BONUS, SOFT_DROP_BONUS, HARD_DROP_BONUS, MAX_LEVEL


class ScoreManager:
    def __init__(self) -> None:
        self.score = 0
        self.level = 1
        self.total_lines = 0
        self.combo = 0

    def add_lines(self, lines: int) -> None:
        if lines == 0:
            self.combo = 0
            return
        base = SCORE_TABLE.get(lines, 0)
        combo_bonus = self.combo * COMBO_BONUS * self.level if self.combo > 0 else 0
        self.score += base * self.level + combo_bonus
        self.combo += 1
        self.total_lines += lines
        self._check_levelup()

    def add_drop_bonus(self, cells: int, hard: bool) -> None:
        self.score += cells * (HARD_DROP_BONUS if hard else SOFT_DROP_BONUS)

    def _check_levelup(self) -> None:
        while self.level < MAX_LEVEL and self.total_lines >= self.level * 10:
            self.level += 1

    def reset(self) -> None:
        self.score = 0
        self.level = 1
        self.total_lines = 0
        self.combo = 0
