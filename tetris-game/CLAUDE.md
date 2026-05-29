# PyTetris — 개발 가이드라인

## 프로젝트 구조

```
tetris-game/
├── main.py          # 진입점, 게임 루프 (pygame.init ~ pygame.quit)
├── game.py          # GameState 클래스 — 전체 상태 머신
├── board.py         # Board 클래스 — 10×20 그리드, 충돌 감지, 줄 제거
├── tetromino.py     # Tetromino 클래스 — 7종 정의, 회전, Wall Kick
├── renderer.py      # Renderer 클래스 — 모든 pygame 렌더링 담당
├── score.py         # ScoreManager 클래스 — 점수·레벨·콤보 계산
├── ranking.py       # RankingManager 클래스 — scores.json 읽기/쓰기
├── constants.py     # 수치·색상·키 상수 전부 여기에
├── scores.json      # 자동 생성, 직접 편집 금지
└── assets/fonts/    # TTF 폰트 파일 (선택)
```

**각 파일의 책임은 위 목록 그대로 유지한다.** 렌더링 코드가 `game.py`에 섞이거나, 상수가 여러 파일에 분산되면 안 된다.

---

## 기술 스택

| 항목 | 선택 | 비고 |
|------|------|------|
| 언어 | Python 3.10+ | `match` 문, 구조적 패턴 매칭 사용 가능 |
| 게임 엔진 | pygame 2.6.x | `requirements.txt`로 버전 고정 |
| 데이터 저장 | 표준 라이브러리 `json` | 서버·DB 없음 |
| 패키지 관리 | pip + `requirements.txt` | |
| 빌드 (선택) | PyInstaller | MVP 완료 후 적용 |

**tkinter는 사용하지 않는다.** 애니메이션·프레임 제어가 pygame 대비 불리하다.

---

## 주요 명령어

```bash
# 의존성 설치
pip install -r requirements.txt

# 게임 실행
python main.py

# 코드 스타일 검사
flake8 . --max-line-length=100

# 타입 체크 (선택)
mypy . --ignore-missing-imports
```

---

## 코드 스타일

### 기본 규칙
- **PEP 8** 준수, 최대 줄 길이 **100자**
- 모든 함수·메서드에 **타입 힌트** 필수
- 클래스는 단 하나의 책임만 가진다 (SRP)
- 매직 넘버 금지 — 모든 수치는 `constants.py`에 상수로 정의

### 상수 정의 방식 (`constants.py`)
```python
# 보드
BOARD_WIDTH = 10
BOARD_HEIGHT = 20
CELL_SIZE = 30          # px

# 화면
SCREEN_WIDTH = 480
SCREEN_HEIGHT = 640
PANEL_WIDTH = 160       # 우측 UI 패널

# 색상 (RGB)
COLOR_BG = (26, 26, 46)
COLOR_GRID = (40, 40, 60)
COLOR_TEXT = (255, 255, 255)
COLOR_ACCENT = (240, 192, 64)

TETROMINO_COLORS: dict[str, tuple[int, int, int]] = {
    "I": (0, 240, 240),
    "O": (240, 240, 0),
    "T": (160, 0, 240),
    "S": (0, 240, 0),
    "Z": (240, 0, 0),
    "J": (0, 0, 240),
    "L": (240, 160, 0),
}

# 게임플레이
LOCK_DELAY_MS = 500
DAS_DELAY_MS = 170
DAS_REPEAT_MS = 50
MAX_LEVEL = 15

# 점수 (레벨 곱하기 전 기본값)
SCORE_TABLE: dict[int, int] = {1: 100, 2: 300, 3: 500, 4: 800}
COMBO_BONUS = 50
SOFT_DROP_BONUS = 1
HARD_DROP_BONUS = 2
```

### 명명 규칙
| 대상 | 규칙 | 예시 |
|------|------|------|
| 클래스 | PascalCase | `GameState`, `Tetromino` |
| 함수/메서드 | snake_case | `check_collision`, `clear_lines` |
| 상수 | UPPER_SNAKE_CASE | `BOARD_WIDTH`, `LOCK_DELAY_MS` |
| 타입 별칭 | PascalCase | `Grid = list[list[int]]` |
| private 메서드 | 언더스코어 prefix | `_spawn_tetromino` |

### 금지 패턴
```python
# 나쁨 — 매직 넘버
if y >= 20:

# 좋음
if y >= BOARD_HEIGHT:

# 나쁨 — 렌더링 코드가 게임 로직에 섞임
def update(self):
    self.board.clear_lines()
    pygame.draw.rect(screen, ...)   # ❌

# 좋음 — 렌더링은 renderer.py에만
def update(self):
    cleared = self.board.clear_lines()
    self.score.add_lines(cleared)
```

---

## 아키텍처 원칙

### 상태 머신 (`game.py`)
게임은 항상 다음 상태 중 하나여야 한다:

```
MENU → PLAYING → PAUSED → PLAYING
                        → GAME_OVER → RANKING_INPUT → RANKING → MENU
```

- `GameState` 클래스가 현재 상태를 소유하고 전환을 관장한다
- `main.py`의 게임 루프는 `state.handle_event()` → `state.update()` → `renderer.draw(state)` 순서만 호출한다
- 상태 전환 로직을 `main.py`에 직접 쓰지 않는다

### 게임 루프 (`main.py`)
```python
clock = pygame.time.Clock()
while running:
    dt = clock.tick(60)   # 60 FPS 고정, dt는 ms 단위
    for event in pygame.event.get():
        state.handle_event(event)
    state.update(dt)
    renderer.draw(state)
    pygame.display.flip()
```

- **낙하 속도는 dt 기반으로 계산한다** — `clock.tick()` 반환값을 누적하여 낙하 타이머를 관리한다
- `time.sleep()` 사용 금지

### 충돌 감지 (`board.py`)
- 이동/회전 시 실제 적용 전에 항상 `is_valid_position()` 호출
- Wall Kick은 `tetromino.py`의 `get_wall_kick_offsets()` 반환값으로 처리, `board.py`에 하드코딩 금지

### 랭킹 저장 (`ranking.py`)
- 쓰기는 **atomic write** 방식 사용 (임시 파일 → rename)
- `scores.json` 파싱 실패 시 빈 랭킹으로 초기화, 예외를 상위로 전파하지 않는다
- 상위 10개만 유지, 동점은 `date` 오름차순(먼저 달성한 기록 우선)

```python
# atomic write 패턴
import tempfile, os, json

def save(self, data: list[dict]) -> None:
    tmp_path = self._path + ".tmp"
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump({"rankings": data}, f, ensure_ascii=False, indent=2)
    os.replace(tmp_path, self._path)
```

---

## 게임 로직 레퍼런스

### 낙하 속도 (레벨별 프레임 간격)
```python
def get_fall_interval_ms(level: int) -> float:
    # 레벨 1: 800ms, 레벨 10+: 50ms, 선형 보간
    clamped = min(level, MAX_LEVEL)
    return max(50.0, 800.0 - (clamped - 1) * (750.0 / (MAX_LEVEL - 1)))
```

### 점수 계산
```python
def calc_line_score(lines: int, level: int, combo: int) -> int:
    base = SCORE_TABLE.get(lines, 0)
    combo_bonus = combo * COMBO_BONUS * level if combo > 0 else 0
    return base * level + combo_bonus
```

### 레벨업 조건
- `total_lines_cleared >= level * 10` 이 되는 순간 레벨 +1
- 최대 레벨은 `MAX_LEVEL = 15`

### 테트로미노 회전 (SRS 기반)
- 회전 행렬: 시계 방향 90° → `(x, y) → (y, -x)` 후 정규화
- Wall Kick 시도 순서: `(0,0) → (-1,0) → (1,0) → (0,-1) → (-1,-1) → (1,-1)`
- I 블록은 별도 Wall Kick 테이블 사용

---

## 개발 원칙

1. **Phase 순서를 지킨다** — Hold·사운드는 Phase 1 MVP 완료 후에만 추가한다
2. **렌더링과 로직을 섞지 않는다** — `renderer.py` 외 파일에서 `pygame.draw.*` 호출 금지
3. **`constants.py` 우선** — 새 수치가 필요하면 먼저 상수로 추가한 뒤 참조한다
4. **커밋은 기능 단위** — "보드 충돌 감지 구현", "줄 제거 로직 추가"처럼 작게 자른다
5. **scores.json은 코드로만 수정** — 직접 편집하면 atomic write 보장이 깨질 수 있다
6. **Tetris 상표 주의** — 외부 공개 시 게임 이름은 "Tetris" 대신 "PyTetris" 또는 "블록 퍼즐"로 표기

---

## 수정 금지 파일

| 파일 | 이유 |
|------|------|
| `scores.json` | 코드(ranking.py)를 통해서만 관리 |
| `requirements.txt`의 pygame 버전 | 크로스 플랫폼 호환성 보장 |
