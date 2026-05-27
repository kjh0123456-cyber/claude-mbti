# CLAUDE.md — Todo App

## 프로젝트 개요
React + TypeScript 기반 투두리스트 웹 앱.

## 기술 스택
- **React 19.2** — `useEffectEvent`, Actions, `use()` 훅 등 최신 API 활용
- **TypeScript 5.8** — `strict: true` 필수, `noUncheckedIndexedAccess` 권장 (TypeScript 6 마이그레이션 예정)
- **Vite** — 빌드 도구
- **패키지 매니저**: `npm`

## 개발 명령어
```bash
npm install        # 의존성 설치
npm run dev        # 개발 서버 (localhost:5173)
npm run build      # 프로덕션 빌드
npm run typecheck  # 타입 검사 (tsc --noEmit)
npm run lint       # ESLint 검사
```

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

## 문제 해결 우선순위
1. 실제 동작하는 해결책 찾기
2. 기존 코드 패턴 분석 및 일관성 유지
3. 타입 안전성 보장하기
4. 재사용 가능한 구조로 설계하기

## 코드 컨벤션

### TypeScript
- `strict: true` + `noUncheckedIndexedAccess: true` 활성화
- `any` 사용 금지 — `unknown` 또는 적절한 타입으로 대체
- 타입은 `interface`(확장 가능한 객체), `type`(유니언·유틸리티)로 구분
- React 19부터 `React.FC` 대신 일반 함수 시그니처 사용

```typescript
// 올바른 방식
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

function TodoItem({ todo }: { todo: Todo }) { ... }
```

### React 19 주요 규칙
- **`forwardRef` 제거됨** — ref를 일반 prop으로 전달
- **`propTypes` 제거됨** — TypeScript 타입으로 대체
- **`defaultProps` 제거됨** — ES6 기본 매개변수 사용
- 비동기 로직은 `useEffect` 내 async 함수로 처리 (effect callback에 async 직접 사용 금지)
- 비반응형 이벤트 핸들러 로직은 `useEffectEvent` 사용

```typescript
// forwardRef 없이 ref 전달 (React 19+)
function Input({ ref, ...props }: React.ComponentProps<'input'>) {
  return <input ref={ref} {...props} />;
}

// useEffect 내 비동기 처리
useEffect(() => {
  async function loadTodos() {
    const data = await fetchTodos();
    setTodos(data);
  }
  loadTodos();
}, []);
```

### 파일 구조
```
src/
  components/       # UI 컴포넌트
  hooks/            # 커스텀 훅
  types/            # 공유 타입 정의
  utils/            # 순수 유틸리티 함수
  App.tsx
  main.tsx
```

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
