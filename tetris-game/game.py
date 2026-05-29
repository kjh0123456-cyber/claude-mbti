from __future__ import annotations
from enum import Enum, auto
import pygame
from constants import (
    BOARD_WIDTH, LOCK_DELAY_MS, DAS_DELAY_MS, DAS_REPEAT_MS,
    MAX_LEVEL, LEVELUP_MSG_MS,
)
from board import Board
from tetromino import Tetromino
from score import ScoreManager
from ranking import RankingManager

MENU_OPTIONS = ["게임 시작", "랭킹 보기", "종료"]


class State(Enum):
    MENU = auto()
    PLAYING = auto()
    PAUSED = auto()
    GAME_OVER = auto()
    RANKING_INPUT = auto()
    RANKING = auto()


class GameState:
    def __init__(self) -> None:
        self.board = Board()
        self.score_mgr = ScoreManager()
        self.ranking = RankingManager()

        self.state = State.MENU
        self.menu_cursor = 0

        # active game objects
        self.current: Tetromino | None = None
        self.next_piece: Tetromino = Tetromino.from_bag()
        self.hold_piece: Tetromino | None = None
        self.hold_used = False

        # timers (ms accumulators)
        self.fall_timer = 0.0
        self.lock_timer: float | None = None
        self.soft_drop = False

        # DAS
        self.das_dir = 0        # -1 / 0 / 1
        self.das_charge = 0.0
        self.das_active = False

        # level-up flash
        self.levelup_timer = 0.0
        self.levelup_active = False
        self._prev_level = 1

        # game-over snapshot
        self.go_score = 0
        self.go_level = 0
        self.go_lines = 0
        self.new_rank: int | None = None
        self.input_name = ""

    # ── public API ────────────────────────────────────────────────────────

    def handle_event(self, event: pygame.event.Event) -> None:
        match self.state:
            case State.MENU:           self._ev_menu(event)
            case State.PLAYING:        self._ev_playing(event)
            case State.PAUSED:         self._ev_paused(event)
            case State.GAME_OVER:      self._ev_game_over(event)
            case State.RANKING_INPUT:  self._ev_ranking_input(event)
            case State.RANKING:        self._ev_ranking(event)

    def update(self, dt: int) -> None:
        if self.state == State.PLAYING:
            self._update_playing(dt)

    # ── menu ──────────────────────────────────────────────────────────────

    def _ev_menu(self, event: pygame.event.Event) -> None:
        if event.type != pygame.KEYDOWN:
            return
        match event.key:
            case pygame.K_UP:
                self.menu_cursor = (self.menu_cursor - 1) % len(MENU_OPTIONS)
            case pygame.K_DOWN:
                self.menu_cursor = (self.menu_cursor + 1) % len(MENU_OPTIONS)
            case pygame.K_RETURN | pygame.K_KP_ENTER:
                self._menu_confirm()

    def _menu_confirm(self) -> None:
        match self.menu_cursor:
            case 0: self._start_game()
            case 1: self.state = State.RANKING
            case 2: pygame.event.post(pygame.event.Event(pygame.QUIT))

    # ── game init ─────────────────────────────────────────────────────────

    def _start_game(self) -> None:
        self.board.reset()
        self.score_mgr.reset()
        self.hold_piece = None
        self.hold_used = False
        self.fall_timer = 0.0
        self.lock_timer = None
        self.soft_drop = False
        self.das_dir = 0
        self.das_charge = 0.0
        self.das_active = False
        self.levelup_active = False
        self._prev_level = 1
        self.next_piece = Tetromino.from_bag()
        self._spawn()
        self.state = State.PLAYING

    def _spawn(self) -> None:
        self.current = self.next_piece
        self.next_piece = Tetromino.from_bag()
        self.hold_used = False
        self.fall_timer = 0.0
        self.lock_timer = None
        if self.current and self.board.is_topped_out(self.current):
            self._game_over()

    # ── playing input ─────────────────────────────────────────────────────

    def _ev_playing(self, event: pygame.event.Event) -> None:
        if event.type == pygame.KEYDOWN:
            match event.key:
                case pygame.K_LEFT:
                    self._try_move(-1, 0)
                    self.das_dir = -1; self.das_charge = 0.0; self.das_active = False
                case pygame.K_RIGHT:
                    self._try_move(1, 0)
                    self.das_dir = 1; self.das_charge = 0.0; self.das_active = False
                case pygame.K_UP:
                    self._rotate()
                case pygame.K_z:
                    self._rotate()
                case pygame.K_DOWN:
                    self.soft_drop = True
                case pygame.K_SPACE:
                    self._hard_drop()
                case pygame.K_c:
                    self._hold()
                case pygame.K_LSHIFT | pygame.K_RSHIFT:
                    self._hold()
                case pygame.K_p | pygame.K_ESCAPE:
                    self.state = State.PAUSED

        elif event.type == pygame.KEYUP:
            if event.key == pygame.K_LEFT and self.das_dir == -1:
                self.das_dir = 0
            elif event.key == pygame.K_RIGHT and self.das_dir == 1:
                self.das_dir = 0
            elif event.key == pygame.K_DOWN:
                self.soft_drop = False

    # ── playing update ────────────────────────────────────────────────────

    def _update_playing(self, dt: int) -> None:
        if self.current is None:
            return

        # DAS
        if self.das_dir != 0:
            self.das_charge += dt
            threshold = DAS_REPEAT_MS if self.das_active else DAS_DELAY_MS
            if self.das_charge >= threshold:
                self.das_charge = 0.0
                self.das_active = True
                self._try_move(self.das_dir, 0)

        # Gravity
        interval = self._fall_interval()
        if self.soft_drop:
            interval = max(interval / 10.0, 50.0)
        self.fall_timer += dt
        if self.fall_timer >= interval:
            self.fall_timer = 0.0
            moved = self._try_move(0, 1)
            if self.soft_drop and moved:
                self.score_mgr.add_drop_bonus(1, hard=False)

        # Lock delay
        if self.lock_timer is not None:
            self.lock_timer += dt
            if self.lock_timer >= LOCK_DELAY_MS:
                self._lock()

        # Level-up message
        if self.levelup_active:
            self.levelup_timer += dt
            if self.levelup_timer >= LEVELUP_MSG_MS:
                self.levelup_active = False

    def _fall_interval(self) -> float:
        clamped = min(self.score_mgr.level, MAX_LEVEL)
        return max(50.0, 800.0 - (clamped - 1) * (750.0 / (MAX_LEVEL - 1)))

    def _try_move(self, dx: int, dy: int) -> bool:
        if self.current is None:
            return False
        nx, ny = self.current.x + dx, self.current.y + dy
        if self.board.is_valid_position(self.current, nx, ny, self.current.rotation):
            self.current.x, self.current.y = nx, ny
            if dx != 0:
                self.lock_timer = None  # lateral move resets lock
            self._refresh_lock()
            return True
        elif dy > 0:
            self._refresh_lock(force=True)
        return False

    def _refresh_lock(self, force: bool = False) -> None:
        if self.current is None:
            return
        on_ground = not self.board.is_valid_position(
            self.current, self.current.x, self.current.y + 1, self.current.rotation
        )
        if on_ground:
            if self.lock_timer is None:
                self.lock_timer = 0.0
        else:
            self.lock_timer = None

    def _rotate(self) -> None:
        if self.current is None:
            return
        new_rot = (self.current.rotation + 1) % 4
        for dx, dy in self.current.wall_kick_offsets():
            nx, ny = self.current.x + dx, self.current.y + dy
            if self.board.is_valid_position(self.current, nx, ny, new_rot):
                self.current.x, self.current.y = nx, ny
                self.current.rotation = new_rot
                self.lock_timer = None
                self._refresh_lock()
                return

    def _hard_drop(self) -> None:
        if self.current is None:
            return
        gy = self.board.ghost_y(self.current)
        cells_dropped = gy - self.current.y
        self.current.y = gy
        self.score_mgr.add_drop_bonus(cells_dropped, hard=True)
        self._lock()

    def _lock(self) -> None:
        if self.current is None:
            return
        self.board.place(self.current)
        cleared = self.board.clear_lines()
        self.score_mgr.add_lines(cleared)
        if self.score_mgr.level > self._prev_level:
            self.levelup_active = True
            self.levelup_timer = 0.0
            self._prev_level = self.score_mgr.level
        self._spawn()

    def _hold(self) -> None:
        if self.current is None or self.hold_used:
            return
        if self.hold_piece is None:
            self.hold_piece = Tetromino(self.current.shape)
            self._spawn()
        else:
            held_shape = self.hold_piece.shape
            self.hold_piece = Tetromino(self.current.shape)
            self.current = Tetromino(held_shape)
            self.current.x = BOARD_WIDTH // 2 - 2
            self.current.y = 0
            if self.board.is_topped_out(self.current):
                self._game_over()
                return
        self.hold_used = True
        self.fall_timer = 0.0
        self.lock_timer = None

    # ── game over ─────────────────────────────────────────────────────────

    def _game_over(self) -> None:
        self.current = None
        self.go_score = self.score_mgr.score
        self.go_level = self.score_mgr.level
        self.go_lines = self.score_mgr.total_lines
        self.state = State.GAME_OVER

    def _ev_game_over(self, event: pygame.event.Event) -> None:
        if event.type != pygame.KEYDOWN:
            return
        match event.key:
            case pygame.K_RETURN | pygame.K_KP_ENTER:
                if self.ranking.is_top_10(self.go_score):
                    self.input_name = ""
                    self.state = State.RANKING_INPUT
                else:
                    self.state = State.RANKING
            case pygame.K_r:
                self._start_game()
            case pygame.K_ESCAPE:
                self.state = State.MENU

    # ── ranking input ─────────────────────────────────────────────────────

    def _ev_ranking_input(self, event: pygame.event.Event) -> None:
        if event.type != pygame.KEYDOWN:
            return
        if event.key == pygame.K_RETURN and self.input_name.strip():
            self.new_rank = self.ranking.add_entry(
                self.input_name.strip(), self.go_score, self.go_level, self.go_lines,
            )
            self.state = State.RANKING
        elif event.key == pygame.K_BACKSPACE:
            self.input_name = self.input_name[:-1]
        elif event.key == pygame.K_ESCAPE:
            self.state = State.RANKING
        elif len(self.input_name) < 10 and event.unicode and event.unicode.isprintable():
            self.input_name += event.unicode

    # ── ranking view ─────────────────────────────────────────────────────

    def _ev_ranking(self, event: pygame.event.Event) -> None:
        if event.type != pygame.KEYDOWN:
            return
        match event.key:
            case pygame.K_ESCAPE | pygame.K_RETURN:
                self.new_rank = None
                self.state = State.MENU
            case pygame.K_r:
                self.new_rank = None
                self._start_game()

    # ── paused ────────────────────────────────────────────────────────────

    def _ev_paused(self, event: pygame.event.Event) -> None:
        if event.type != pygame.KEYDOWN:
            return
        match event.key:
            case pygame.K_p | pygame.K_ESCAPE:
                self.state = State.PLAYING
            case pygame.K_r:
                self._start_game()
            case pygame.K_m:
                self.state = State.MENU
