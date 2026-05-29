from __future__ import annotations
import sys
import pygame
from constants import (
    SCREEN_WIDTH, SCREEN_HEIGHT,
    BOARD_LEFT, BOARD_TOP, BOARD_PIXEL_W, BOARD_PIXEL_H,
    BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE,
    PANEL_LEFT, PANEL_WIDTH,
    COLOR_BG, COLOR_BOARD_BG, COLOR_GRID, COLOR_TEXT, COLOR_TEXT_DIM,
    COLOR_ACCENT, COLOR_GHOST, COLOR_PANEL_BG, COLOR_HIGHLIGHT,
    COLOR_RED, COLOR_GREEN,
)
from game import GameState, State, MENU_OPTIONS
from tetromino import Tetromino, SHAPE_ROTATIONS


def _korean_font(size: int) -> pygame.font.Font:
    if sys.platform == "win32":
        names = ["malgun gothic", "malgungothic", "gulim", "batang"]
    elif sys.platform == "darwin":
        names = ["apple sd gothic neo", "applegothic", "hiragino sans"]
    else:
        names = ["noto sans cjk kr", "notosanscjkkr", "unifont"]
    for name in names:
        f = pygame.font.SysFont(name, size)
        if f:
            return f
    return pygame.font.SysFont(None, size)


class Renderer:
    def __init__(self, surface: pygame.Surface) -> None:
        self.surf = surface
        self.font_lg = _korean_font(36)
        self.font_md = _korean_font(22)
        self.font_sm = _korean_font(17)
        self.font_xs = _korean_font(14)
        self._tick = 0  # for blinking cursor

    def draw(self, gs: GameState) -> None:
        self._tick += 1
        self.surf.fill(COLOR_BG)

        match gs.state:
            case State.MENU:
                self._draw_menu(gs)
            case State.PLAYING | State.PAUSED:
                self._draw_board(gs)
                self._draw_panel(gs)
                if gs.state == State.PAUSED:
                    self._draw_overlay_paused()
            case State.GAME_OVER:
                self._draw_board(gs)
                self._draw_panel(gs)
                self._draw_overlay_game_over(gs)
            case State.RANKING_INPUT:
                self._draw_board(gs)
                self._draw_panel(gs)
                self._draw_overlay_ranking_input(gs)
            case State.RANKING:
                self._draw_ranking(gs)

    # ── board ─────────────────────────────────────────────────────────────

    def _draw_board(self, gs: GameState) -> None:
        # Background
        pygame.draw.rect(
            self.surf, COLOR_BOARD_BG,
            (BOARD_LEFT, BOARD_TOP, BOARD_PIXEL_W, BOARD_PIXEL_H),
        )

        # Placed cells
        for row in range(BOARD_HEIGHT):
            for col in range(BOARD_WIDTH):
                color = gs.board.grid[row][col]
                if color:
                    self._draw_cell(col, row, color)

        # Ghost piece
        if gs.current:
            gy = gs.board.ghost_y(gs.current)
            for dx, dy in gs.current.cells:
                bx, by = gs.current.x + dx, gy + dy
                if 0 <= bx < BOARD_WIDTH and 0 <= by < BOARD_HEIGHT:
                    self._draw_cell(bx, by, COLOR_GHOST, ghost=True)

        # Current piece
        if gs.current:
            for bx, by in gs.current.board_cells():
                if 0 <= bx < BOARD_WIDTH and by >= 0:
                    self._draw_cell(bx, by, gs.current.color)

        # Grid lines
        for x in range(BOARD_WIDTH + 1):
            px = BOARD_LEFT + x * CELL_SIZE
            pygame.draw.line(self.surf, COLOR_GRID,
                             (px, BOARD_TOP), (px, BOARD_TOP + BOARD_PIXEL_H))
        for y in range(BOARD_HEIGHT + 1):
            py = BOARD_TOP + y * CELL_SIZE
            pygame.draw.line(self.surf, COLOR_GRID,
                             (BOARD_LEFT, py), (BOARD_LEFT + BOARD_PIXEL_W, py))

        # Board border
        pygame.draw.rect(
            self.surf, COLOR_ACCENT,
            (BOARD_LEFT - 1, BOARD_TOP - 1, BOARD_PIXEL_W + 2, BOARD_PIXEL_H + 2),
            1,
        )

        # Level-up flash
        if gs.levelup_active:
            self._draw_text_centered("LEVEL UP!", self.font_lg, COLOR_ACCENT,
                                     BOARD_LEFT + BOARD_PIXEL_W // 2,
                                     BOARD_TOP + BOARD_PIXEL_H // 2 - 20)

    def _draw_cell(self, col: int, row: int, color: tuple, ghost: bool = False) -> None:
        x = BOARD_LEFT + col * CELL_SIZE
        y = BOARD_TOP + row * CELL_SIZE
        if ghost:
            s = pygame.Surface((CELL_SIZE - 1, CELL_SIZE - 1), pygame.SRCALPHA)
            s.fill((*color, 60))
            self.surf.blit(s, (x, y))
            pygame.draw.rect(self.surf, color, (x, y, CELL_SIZE - 1, CELL_SIZE - 1), 1)
        else:
            pygame.draw.rect(self.surf, color, (x, y, CELL_SIZE - 1, CELL_SIZE - 1))
            # Highlight edge
            light = tuple(min(255, c + 60) for c in color)
            pygame.draw.line(self.surf, light, (x, y), (x + CELL_SIZE - 2, y))
            pygame.draw.line(self.surf, light, (x, y), (x, y + CELL_SIZE - 2))

    # ── side panel ────────────────────────────────────────────────────────

    def _draw_panel(self, gs: GameState) -> None:
        px = PANEL_LEFT

        # Score
        self._panel_label("SCORE", px, 55)
        self._panel_value(f"{gs.score_mgr.score:,}", px, 75)

        # Level
        self._panel_label("LEVEL", px, 115)
        self._panel_value(str(gs.score_mgr.level), px, 135)

        # Lines
        self._panel_label("LINES", px, 175)
        self._panel_value(str(gs.score_mgr.total_lines), px, 195)

        # Combo
        if gs.score_mgr.combo > 1:
            self._panel_label("COMBO", px, 235)
            self._panel_value(f"x{gs.score_mgr.combo}", px, 255, color=COLOR_ACCENT)

        # Next piece
        self._panel_label("NEXT", px, 310)
        if gs.next_piece:
            self._draw_mini_piece(gs.next_piece.shape, gs.next_piece.color, px, 330)

        # Hold piece
        self._panel_label("HOLD", px, 430)
        if gs.hold_piece:
            color = COLOR_TEXT_DIM if gs.hold_used else gs.hold_piece.color
            self._draw_mini_piece(gs.hold_piece.shape, color, px, 450)

        # Controls hint
        self._draw_controls(px, 555)

    def _panel_label(self, text: str, x: int, y: int) -> None:
        surf = self.font_xs.render(text, True, COLOR_TEXT_DIM)
        self.surf.blit(surf, (x, y))

    def _panel_value(self, text: str, x: int, y: int,
                     color: tuple = COLOR_TEXT) -> None:
        surf = self.font_md.render(text, True, color)
        self.surf.blit(surf, (x, y))

    def _draw_mini_piece(self, shape: str, color: tuple, px: int, py: int) -> None:
        cells = SHAPE_ROTATIONS[shape][0]
        cs = 16
        for cx, cy in cells:
            rx = px + cx * (cs + 1)
            ry = py + cy * (cs + 1)
            pygame.draw.rect(self.surf, color, (rx, ry, cs, cs))
            light = tuple(min(255, c + 50) for c in color)
            pygame.draw.line(self.surf, light, (rx, ry), (rx + cs - 1, ry))
            pygame.draw.line(self.surf, light, (rx, ry), (rx, ry + cs - 1))

    def _draw_controls(self, x: int, y: int) -> None:
        hints = ["←→  이동", "↑/Z  회전", "↓   소프트드롭",
                 "SPC 하드드롭", "C   홀드", "P   일시정지"]
        for i, hint in enumerate(hints):
            s = self.font_xs.render(hint, True, COLOR_TEXT_DIM)
            self.surf.blit(s, (x, y + i * 14))

    # ── menu ─────────────────────────────────────────────────────────────

    def _draw_menu(self, gs: GameState) -> None:
        cx = SCREEN_WIDTH // 2

        # Title
        title = self.font_lg.render("PyTetris", True, COLOR_ACCENT)
        self.surf.blit(title, (cx - title.get_width() // 2, 130))
        sub = self.font_sm.render("블록 퍼즐 게임", True, COLOR_TEXT_DIM)
        self.surf.blit(sub, (cx - sub.get_width() // 2, 175))

        # Menu options
        for i, opt in enumerate(MENU_OPTIONS):
            selected = i == gs.menu_cursor
            color = COLOR_ACCENT if selected else COLOR_TEXT
            prefix = "▶ " if selected else "  "
            text = self.font_md.render(prefix + opt, True, color)
            y = 270 + i * 50
            if selected:
                pygame.draw.rect(self.surf, COLOR_PANEL_BG,
                                 (cx - 100, y - 5, 200, 34), border_radius=6)
            self.surf.blit(text, (cx - text.get_width() // 2, y))

        # Controls hint
        hint = self.font_xs.render("↑↓ 선택  ENTER 확인", True, COLOR_TEXT_DIM)
        self.surf.blit(hint, (cx - hint.get_width() // 2, SCREEN_HEIGHT - 60))

    # ── overlays ─────────────────────────────────────────────────────────

    def _draw_overlay_paused(self) -> None:
        overlay = pygame.Surface((BOARD_PIXEL_W, BOARD_PIXEL_H), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 160))
        self.surf.blit(overlay, (BOARD_LEFT, BOARD_TOP))

        cx = BOARD_LEFT + BOARD_PIXEL_W // 2
        cy = BOARD_TOP + BOARD_PIXEL_H // 2
        self._draw_text_centered("PAUSED", self.font_lg, COLOR_ACCENT, cx, cy - 40)
        self._draw_text_centered("P / ESC — 재개", self.font_sm, COLOR_TEXT, cx, cy + 10)
        self._draw_text_centered("R — 재시작  M — 메뉴", self.font_sm, COLOR_TEXT_DIM, cx, cy + 38)

    def _draw_overlay_game_over(self, gs: GameState) -> None:
        overlay = pygame.Surface((BOARD_PIXEL_W, BOARD_PIXEL_H), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 180))
        self.surf.blit(overlay, (BOARD_LEFT, BOARD_TOP))

        cx = BOARD_LEFT + BOARD_PIXEL_W // 2
        cy = BOARD_TOP + BOARD_PIXEL_H // 2

        self._draw_text_centered("GAME OVER", self.font_lg, COLOR_RED, cx, cy - 80)
        self._draw_text_centered(f"점수: {gs.go_score:,}", self.font_md, COLOR_ACCENT, cx, cy - 30)
        self._draw_text_centered(f"레벨: {gs.go_level}   라인: {gs.go_lines}",
                                 self.font_sm, COLOR_TEXT, cx, cy + 5)

        if gs.ranking.is_top_10(gs.go_score):
            self._draw_text_centered("🎉 TOP 10 진입!", self.font_md, COLOR_GREEN, cx, cy + 45)
            self._draw_text_centered("ENTER — 이름 입력", self.font_sm, COLOR_TEXT_DIM, cx, cy + 80)
        else:
            self._draw_text_centered("ENTER — 랭킹 보기", self.font_sm, COLOR_TEXT_DIM, cx, cy + 50)

        self._draw_text_centered("R — 재시작  ESC — 메뉴", self.font_sm, COLOR_TEXT_DIM, cx, cy + 108)

    def _draw_overlay_ranking_input(self, gs: GameState) -> None:
        overlay = pygame.Surface((BOARD_PIXEL_W, BOARD_PIXEL_H), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 200))
        self.surf.blit(overlay, (BOARD_LEFT, BOARD_TOP))

        cx = BOARD_LEFT + BOARD_PIXEL_W // 2
        cy = BOARD_TOP + BOARD_PIXEL_H // 2

        self._draw_text_centered("이름을 입력하세요", self.font_md, COLOR_ACCENT, cx, cy - 60)
        self._draw_text_centered("(최대 10자)", self.font_xs, COLOR_TEXT_DIM, cx, cy - 30)

        # Input box
        bw, bh = 200, 36
        bx, by = cx - bw // 2, cy - bh // 2 + 10
        pygame.draw.rect(self.surf, COLOR_PANEL_BG, (bx, by, bw, bh), border_radius=4)
        pygame.draw.rect(self.surf, COLOR_ACCENT, (bx, by, bw, bh), 2, border_radius=4)

        cursor = "|" if (self._tick // 30) % 2 == 0 else ""
        name_surf = self.font_md.render(gs.input_name + cursor, True, COLOR_TEXT)
        self.surf.blit(name_surf, (bx + 8, by + 7))

        self._draw_text_centered("ENTER 확인  ESC 건너뛰기", self.font_xs, COLOR_TEXT_DIM,
                                 cx, cy + 50)

    # ── ranking screen ────────────────────────────────────────────────────

    def _draw_ranking(self, gs: GameState) -> None:
        cx = SCREEN_WIDTH // 2

        title = self.font_lg.render("🏆 랭킹", True, COLOR_ACCENT)
        self.surf.blit(title, (cx - title.get_width() // 2, 40))

        # Header
        hx, hy = 30, 100
        cols = [(hx, "순위"), (hx + 55, "이름"), (hx + 190, "점수"),
                (hx + 310, "레벨"), (hx + 370, "라인")]
        for x, label in cols:
            s = self.font_xs.render(label, True, COLOR_TEXT_DIM)
            self.surf.blit(s, (x, hy))
        pygame.draw.line(self.surf, COLOR_TEXT_DIM, (hx, hy + 18), (SCREEN_WIDTH - 30, hy + 18))

        # Entries
        entries = gs.ranking.entries
        if not entries:
            empty = self.font_md.render("기록 없음", True, COLOR_TEXT_DIM)
            self.surf.blit(empty, (cx - empty.get_width() // 2, 250))
        else:
            for i, e in enumerate(entries):
                y = 128 + i * 40
                is_new = (gs.new_rank is not None and i + 1 == gs.new_rank)
                row_color = COLOR_ACCENT if is_new else COLOR_TEXT
                rank_str = ["🥇", "🥈", "🥉"][i] if i < 3 else f"{i+1}."
                if is_new:
                    pygame.draw.rect(self.surf, COLOR_PANEL_BG,
                                     (25, y - 4, SCREEN_WIDTH - 50, 34), border_radius=4)
                data = [(hx, rank_str), (hx + 55, e.name),
                        (hx + 190, f"{e.score:,}"), (hx + 310, str(e.level)),
                        (hx + 370, str(e.lines))]
                for x, text in data:
                    s = self.font_sm.render(text, True, row_color)
                    self.surf.blit(s, (x, y))

        hint = self.font_xs.render("ENTER / ESC — 메뉴  R — 새 게임", True, COLOR_TEXT_DIM)
        self.surf.blit(hint, (cx - hint.get_width() // 2, SCREEN_HEIGHT - 40))

    # ── helpers ───────────────────────────────────────────────────────────

    def _draw_text_centered(self, text: str, font: pygame.font.Font,
                            color: tuple, cx: int, y: int) -> None:
        s = font.render(text, True, color)
        self.surf.blit(s, (cx - s.get_width() // 2, y))
