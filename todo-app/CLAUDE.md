# CLAUDE.md — Todo App

## 프로젝트 개요
React + TypeScript 기반 투두리스트 웹 앱.

---

## 기술 스택

| 패키지 | 버전 | 용도 |
|--------|------|------|
| `react` | **19.2.6** | UI 라이브러리 |
| `react-dom` | **19.2.6** | DOM 렌더링 |
| `typescript` | **5.9.3** | 타입 시스템 |
| `vite` | **6.4.2** | 빌드 도구 / 개발 서버 |
| `@vitejs/plugin-react` | **4.7.0** | Vite용 React 플러그인 (Babel 기반) |
| `@types/react` | **19.2.15** | React 타입 정의 |
| `@types/react-dom` | **19.2.3** | ReactDOM 타입 정의 |

- **패키지 매니저**: `npm`
- **Node.js**: 18 이상 권장

---

## 명령어

### 개발
```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 시작 → http://localhost:5173
```

### 빌드
```bash
npm run build        # 프로덕션 빌드 (tsc -b → vite build)
npm run preview      # 빌드 결과물 로컬 프리뷰 → http://localhost:4173
```

### 검사
```bash
npm run typecheck    # TypeScript 타입 검사만 (tsc --noEmit)
```

> `npm run build`는 타입 오류가 있으면 실패한다. 배포 전 반드시 실행할 것.

---

## 커밋 규칙
Conventional Commits + 한글 메시지.

| 타입 | 용도 |
|------|------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `refactor` | 동작 변경 없는 코드 개선 |
| `style` | 포맷·스타일만 변경 |
| `test` | 테스트 추가·수정 |
| `chore` | 빌드·설정·의존성 변경 |
| `docs` | 문서 변경 |

```
feat: 할 일 완료 기능 추가
fix: 빈 항목 추가 시 오류 수정
refactor: TodoItem 컴포넌트 분리
```

---

## 문제 해결 우선순위
1. 실제 동작하는 해결책 찾기
2. 기존 코드 패턴 분석 및 일관성 유지
3. 타입 안전성 보장하기
4. 재사용 가능한 구조로 설계하기

---

## 코드 스타일

### 네이밍 컨벤션

| 대상 | 형식 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `TodoItem.tsx` |
| 훅 파일 | camelCase | `useTodos.ts` |
| 타입·인터페이스 파일 | camelCase | `index.ts` |
| 컴포넌트 함수 | PascalCase | `function TodoItem()` |
| 일반 함수·변수 | camelCase | `addTodo`, `isLoading` |
| 상수 | SCREAMING_SNAKE_CASE | `STORAGE_KEY` |
| CSS 클래스 | kebab-case | `.todo-item`, `.is-completed` |

### 컴포넌트

- `React.FC` 사용 금지 — 일반 함수 시그니처 사용
- props 타입은 파일 내 `interface Props`로 선언 (외부 export 불필요)
- 컴포넌트는 `default export`, 훅·유틸리티는 `named export`
- `forwardRef` 사용 금지 (React 19 — ref를 일반 prop으로 전달)
- `propTypes` 사용 금지 — TypeScript 타입으로 대체
- `defaultProps` 사용 금지 — ES6 기본 매개변수 사용

```tsx
// 올바른 컴포넌트 작성 방식
interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
}

export default function TodoItem({ todo, onToggle }: Props) {
  return <li>...</li>;
}
```

### TypeScript

- `strict: true` + `noUncheckedIndexedAccess: true` 활성화 (tsconfig.app.json)
- `any` 사용 금지 — `unknown` 또는 구체적 타입으로 대체
- 타입 선언 기준:
  - `interface` — 확장 가능한 객체 구조
  - `type` — 유니언, 교차, 유틸리티 타입
- 비동기 로직은 `useEffect` 내부에 async 함수를 선언 후 즉시 호출

```typescript
// useEffect 비동기 처리 — effect callback에 async 직접 금지
useEffect(() => {
  async function load() {
    const data = await fetchTodos();
    setTodos(data);
  }
  load();
}, []);
```

### CSS

- 외부 CSS 프레임워크 사용 금지 (Tailwind, MUI 등) — 순수 CSS만 사용
- CSS 변수(`--var-name`)로 색상·폰트·간격 관리
- 상태 클래스는 `is-` 접두사 사용 (`.is-completed`, `.is-active`)
- 인라인 스타일은 동적 값(width %, transform 등)에만 허용
- 미디어 쿼리는 파일 하단에 모아서 작성

### 파일 구조
```
src/
  components/       # UI 컴포넌트 (파일당 컴포넌트 하나)
  hooks/            # 커스텀 훅
  types/            # 공유 타입 정의
  utils/            # 순수 유틸리티 함수 (부수효과 없음)
  App.tsx           # 루트 컴포넌트
  main.tsx          # 앱 진입점
  index.css         # 전역 스타일
```

---

## 절대 수정 금지 파일

아래 파일들은 명시적 지시 없이 절대 수정하지 말 것.

| 파일 | 이유 |
|------|------|
| `package-lock.json` | npm 자동 생성 — 직접 편집 시 의존성 트리 손상 |
| `node_modules/` | 의존성 설치 폴더 — 직접 수정 금지 |
| `tsconfig.json` | 프로젝트 참조 루트 설정 — 구조 변경 시에만 수정 |
| `tsconfig.node.json` | Vite 전용 TS 설정 — Vite 버전 업그레이드 시에만 수정 |
| `src/main.tsx` | 앱 진입점 — 전역 Provider 추가 외 수정 불필요 |
| `CLAUDE.md` | 이 파일 — 명시적 요청 없이 수정 금지 |

---

## tsconfig 설정 (`tsconfig.app.json`)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```
