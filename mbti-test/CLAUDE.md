# MBTI 성격 유형 테스트 — 개발 가이드라인

## 프로젝트 구조

```
mbti-test/
├── vite.config.ts           # Vite 설정 + Vitest 테스트 환경
├── tailwind.config.js       # Tailwind 콘텐츠 경로
├── src/
│   ├── main.tsx             # 앱 진입점 — Chart.js 전역 등록 포함
│   ├── App.tsx              # React Router 라우트 정의만
│   ├── index.css            # @tailwind base/components/utilities + Pretendard 폰트
│   ├── data/
│   │   ├── questions.ts     # 12개 질문 (Dimension 타입 포함, 수정 금지)
│   │   └── mbtiProfiles.ts  # 16개 유형 프로필 (MbtiProfile 타입 포함, 수정 금지)
│   ├── utils/
│   │   ├── calculateMbti.ts # 순수 함수 — 부수효과 없음, 테스트 대상
│   │   └── statsStorage.ts  # localStorage 읽기/쓰기, 순수 함수, 테스트 대상
│   ├── components/
│   │   ├── ProgressBar.tsx  # current / total props만 받음
│   │   ├── QuestionCard.tsx # 질문 텍스트 + 선택지 2개, 상태 없음
│   │   └── ResultCard.tsx   # forwardRef — html2canvas 캡처 대상
│   └── pages/
│       ├── LandingPage.tsx  # 진입 화면
│       ├── TestPage.tsx     # 테스트 진행 + 라우팅 책임
│       ├── ResultPage.tsx   # 결과 표시 + 공유 기능
│       └── StatsPage.tsx    # Chart.js 통계 차트
└── src/__tests__/
    ├── setup.ts             # @testing-library/jest-dom import
    ├── calculateMbti.test.ts
    ├── statsStorage.test.ts
    └── ProgressBar.test.tsx
```

**파일별 책임은 위 목록 그대로 유지한다.** 데이터 파일(`data/`)에 로직을 넣거나, 페이지 컴포넌트에 계산 로직을 넣지 않는다.

---

## 기술 스택

| 항목 | 선택 | 비고 |
|------|------|------|
| 번들러 | Vite 5 | `npm run dev` / `npm run build` |
| UI | React 18 + TypeScript | strict 모드 |
| 스타일 | Tailwind CSS v3 | 유틸리티 클래스만 사용, 인라인 style 금지 |
| 라우팅 | React Router v6 | `<Routes>` + `<Route>` |
| 상태 | React 내장 (`useState`, `useNavigate`) | 전역 상태 라이브러리 없음 |
| 이미지 저장 | html2canvas | `ResultCard` ref에만 적용 |
| 차트 | chart.js + react-chartjs-2 | `main.tsx`에서 전역 등록 |
| 테스트 | Vitest + @testing-library/react | `jsdom` 환경 |
| 폰트 | Pretendard (CDN) | `index.css`에서 import |

---

## 주요 명령어

```bash
npm run dev        # 개발 서버 (http://localhost:5173)
npm run build      # 프로덕션 빌드 → dist/
npm run preview    # 빌드 결과물 미리보기
npx vitest run     # 전체 테스트
npx tsc --noEmit   # 타입 체크만
```

---

## 코드 스타일

### 기본 규칙
- **TypeScript strict** 모드 — `any` 사용 금지
- 모든 props에 **인터페이스** 정의 (`interface Props { ... }`)
- 컴포넌트는 **named export** (`export default function X`)
- 유틸 함수는 **순수 함수**로 작성 — 부수효과 없음, 테스트 용이

### 타입 정의 위치
```ts
// data/ 파일에서 타입을 export — 다른 파일에서 import해서 사용
// questions.ts
export type Dimension = 'EI' | 'SN' | 'TF' | 'JP';
export interface Question { id: number; text: string; dimension: Dimension; options: [string, string]; }

// calculateMbti.ts
export type MbtiType = 'INTJ' | 'INTP' | ... ;  // 16개
export interface Scores { E: number; I: number; S: number; N: number; T: number; F: number; J: number; P: number; }
```

### 컴포넌트 작성 규칙
```tsx
// 좋음 — props 인터페이스 분리, Tailwind 클래스
interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const pct = total === 0 ? 0 : Math.round((current / total) * 100);
  return (
    <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      ...
    </div>
  );
}

// 나쁨 — 인라인 style, any, 타입 미정의
export default function ProgressBar(props: any) {
  return <div style={{ width: props.current / props.total * 100 + '%' }} />;
}
```

### 금지 패턴
```ts
// ❌ any 사용
const profile: any = mbtiProfiles[type];

// ✅ 타입 가드
const profile = mbtiProfiles[type as MbtiType];

// ❌ 페이지에서 계산 로직 직접 작성
function TestPage() {
  const scores = { E: 0, I: 0, ... };
  answers.forEach(...);  // 계산 로직을 페이지에 넣음
}

// ✅ utils 함수 사용
function TestPage() {
  const { type, scores } = calculateMbti(answers);
}

// ❌ Chart.js를 컴포넌트 내부에서 등록
import { Chart, BarElement } from 'chart.js';
Chart.register(BarElement);  // StatsPage 내부

// ✅ main.tsx에서 전역 1회 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, ...);
```

---

## 아키텍처 원칙

### MBTI 계산 (클라이언트 전용)
```
answers: number[]   →   calculateMbti()   →   { type: MbtiType, scores: Scores }
```
- 계산은 **100% 클라이언트**에서 즉시 처리 — 서버 통신 없음
- `answers[i]` = 0 이면 해당 dimension의 첫 번째 글자(E/S/T/J), 1 이면 두 번째 글자(I/N/F/P)
- 동점 시 첫 번째 글자(E/S/T/J) 우선

### 라우팅 구조
```
/                → LandingPage
/test            → TestPage     (answers state 보유)
/result/:type    → ResultPage   (useParams로 type 수신, useLocation으로 answers 수신)
/stats           → StatsPage
```
- `TestPage`가 `answers` 배열을 소유하고 완료 시 `navigate('/result/:type', { state: { answers } })`로 전달
- `ResultPage`는 URL `:type`이 없거나 유효하지 않으면 에러 화면 표시

### 통계 저장
```ts
// statsStorage.ts 계약
recordResult(type: MbtiType): void   // localStorage에 카운트 +1
getStats(): StatsMap                  // 16개 유형 전부 반환 (없으면 0)
clearStats(): void                    // 테스트/리셋용
```
- `StatsMap = Record<MbtiType, number>`
- `recordResult`는 `TestPage`의 결과 계산 직후, navigate 직전에 한 번만 호출

### html2canvas 캡처
- `ResultCard`는 `forwardRef<HTMLDivElement, Props>`로 작성
- `handleDownload`는 `ResultPage`에만 존재
- `ResultCard` 내부에서 `html2canvas`를 호출하지 않는다

### Chart.js 전역 등록
- `main.tsx` 상단에서 `ChartJS.register(...)` 1회만 실행
- `StatsPage`에서 재등록하지 않는다

---

## 테스트 원칙

- **순수 함수** (`calculateMbti`, `statsStorage`)는 반드시 단위 테스트 작성
- **컴포넌트** 테스트는 사용자 관점(텍스트, role, aria 속성)으로 작성
- `localStorage`를 사용하는 테스트는 `beforeEach`에서 `clearStats()` 호출

```ts
// 좋은 테스트 — 구현 세부 사항이 아닌 동작 검증
it('모든 두 번째 옵션 선택 시 INFP 반환', () => {
  const { type } = calculateMbti(Array(12).fill(1));
  expect(type).toBe('INFP');
});

// 나쁜 테스트 — 내부 구현(scores 배열 순서)에 의존
it('scores[0]이 I여야 함', () => { ... });
```

---

## 개발 우선순위 (Phase)

| Phase | 포함 기능 | 완료 기준 |
|-------|-----------|-----------|
| **Phase 1 — MVP** | 테스트 플로우(12문항) + 결과 페이지 + 이미지 저장 | `npm run build` 성공, 전체 테스트 통과 |
| **Phase 2 — 성장** | 통계 페이지, 다크모드, SNS 공유 | Lighthouse 85점 이상 |
| **Phase 3 — 확장** | 프리미엄 리포트, 다국어 | 미정 |

**Phase 1 완료 전에 Phase 2 기능을 추가하지 않는다.**

---

## 수정 금지 파일

| 파일 | 이유 |
|------|------|
| `src/data/questions.ts` | 질문 내용 변경 시 기존 통계 데이터와 불일치 발생 |
| `src/data/mbtiProfiles.ts` | 16개 유형 키가 `MbtiType`과 1:1 대응 — 키 변경 시 타입 오류 전파 |
| `src/__tests__/setup.ts` | 테스트 환경 초기화 파일, 건드리면 전체 테스트 영향 |

---

## MBTI 상표 주의

- 서비스 내에서 **"MBTI 테스트"** 표현은 보조 키워드로만 사용
- 주요 명칭은 **"성격 유형 테스트"** 또는 **"16가지 성격 유형"**으로 표기
- The Myers-Briggs Company 상표권 침해 방지 목적
