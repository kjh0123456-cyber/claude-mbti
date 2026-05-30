# 16가지 성격 유형 테스트

12개 질문으로 나의 성격 유형을 발견하는 클라이언트 사이드 웹 애플리케이션입니다.  
서버 통신 없이 즉시 결과를 계산하며, Google 로그인 시 Firestore를 통해 기기 간 통계를 동기화합니다.

---

## 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [설치 방법](#설치-방법)
- [Firebase 설정 (선택)](#firebase-설정-선택)
- [사용법](#사용법)
- [API 문서](#api-문서)
- [테스트](#테스트)
- [빌드 및 배포](#빌드-및-배포)

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **성격 유형 테스트** | 12개 질문에 답변하면 16가지 유형 중 하나를 즉시 계산 |
| **상세 결과 페이지** | 유형별 설명, 강점/약점, 추천 직업, 잘 맞는 유형 제공 |
| **이미지 저장** | 결과 카드를 2배 해상도 PNG로 다운로드 |
| **공유하기** | Web Share API 또는 클립보드 복사로 결과 공유 |
| **통계 차트** | 전체 테스트 결과를 막대 차트와 순위 목록으로 시각화 |
| **Google 로그인** | 로그인 시 통계를 Firestore에 저장해 기기 간 동기화 |
| **로컬 저장** | 비로그인 상태에서도 localStorage로 통계 유지 |
| **자동 마이그레이션** | 로그인 시 기존 localStorage 통계를 Firestore로 자동 이전 |

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 번들러 | Vite 5 |
| UI | React 18 + TypeScript (strict 모드) |
| 스타일 | Tailwind CSS v3 |
| 라우팅 | React Router v6 (HashRouter) |
| 차트 | Chart.js + react-chartjs-2 |
| 이미지 캡처 | html2canvas |
| 인증 | Firebase Authentication (Google) |
| 데이터베이스 | Firebase Firestore |
| 테스트 | Vitest + @testing-library/react |
| 폰트 | Pretendard (CDN) |

---

## 프로젝트 구조

```
mbti-test/
├── src/
│   ├── main.tsx               # 앱 진입점 — Chart.js 전역 등록, AuthProvider 마운트
│   ├── App.tsx                # React Router 라우트 정의
│   ├── firebase.ts            # Firebase 앱 초기화 (auth, db, googleProvider)
│   │
│   ├── context/
│   │   └── AuthContext.tsx    # 인증 상태 Context — useAuth 훅 제공
│   │
│   ├── hooks/
│   │   └── useStats.ts        # 로그인 여부에 따라 로컬/클라우드 통계 자동 선택
│   │
│   ├── data/                  # 수정 금지
│   │   ├── questions.ts       # 12개 질문 + Dimension 타입
│   │   └── mbtiProfiles.ts    # 16개 유형 프로필 + MbtiType 타입
│   │
│   ├── utils/
│   │   ├── calculateMbti.ts   # 순수 함수 — 답변 배열 → MBTI 유형 계산
│   │   ├── statsStorage.ts    # localStorage 통계 CRUD
│   │   └── cloudStatsStorage.ts # Firestore 통계 CRUD
│   │
│   ├── components/
│   │   ├── ProgressBar.tsx    # 상단 진행바 (current / total)
│   │   ├── QuestionCard.tsx   # 질문 텍스트 + 선택지 2개
│   │   └── ResultCard.tsx     # 이미지 캡처 전용 결과 카드 (forwardRef)
│   │
│   ├── pages/
│   │   ├── LandingPage.tsx    # 진입 화면 + Google 로그인 버튼
│   │   ├── TestPage.tsx       # 테스트 진행 — answers 상태 보유
│   │   ├── ResultPage.tsx     # 결과 표시 + 이미지 저장 + 공유
│   │   └── StatsPage.tsx      # 통계 차트 + 순위 목록
│   │
│   └── __tests__/
│       ├── setup.ts
│       ├── calculateMbti.test.ts
│       ├── statsStorage.test.ts
│       └── ProgressBar.test.tsx
│
├── .env.example               # Firebase 환경변수 템플릿
└── CLAUDE.md                  # 개발 가이드라인
```

---

## 설치 방법

### 사전 요구사항

- Node.js 18 이상
- npm 9 이상

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd mbti-test

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 서버가 `http://localhost:5173`에서 시작됩니다.

---

## Firebase 설정 (선택)

Google 로그인과 기기 간 통계 동기화를 사용하려면 Firebase 프로젝트가 필요합니다.  
이 기능 없이도 앱은 로컬 모드로 완전히 동작합니다.

### 1단계 — Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com)에서 새 프로젝트를 생성합니다.
2. **Authentication** → Sign-in method → **Google**을 활성화합니다.
3. **Firestore Database** → 데이터베이스 생성 → 테스트 모드로 시작합니다.
4. 프로젝트 설정 → 웹 앱 추가 → config 값을 복사합니다.

### 2단계 — 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일에 Firebase config 값을 입력합니다:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3단계 — Firestore 보안 규칙 (프로덕션 배포 전 필수)

테스트 모드의 기본 규칙은 모든 접근을 허용하므로, 배포 전 아래 규칙으로 교체해야 합니다:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /stats/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

이 규칙은 각 사용자가 자신의 통계 문서(`stats/{uid}`)에만 읽기·쓰기할 수 있도록 제한합니다.

---

## 사용법

### 테스트 진행

1. 랜딩 페이지에서 **테스트 시작** 버튼을 클릭합니다.
2. 12개 질문에 대해 A 또는 B를 선택합니다.
3. 언제든 **← 이전** 버튼으로 이전 질문으로 돌아갈 수 있습니다.
4. 12문항 완료 후 결과 페이지로 자동 이동합니다.

### 결과 확인

결과 페이지에서 아래 정보를 확인할 수 있습니다:

- MBTI 유형 코드 및 별명
- 유형 설명
- 강점 / 약점
- 추천 직업
- 잘 맞는 유형

### 결과 저장 및 공유

| 버튼 | 동작 |
|------|------|
| **이미지 저장** | 결과 카드를 PNG 파일(`mbti-{유형}.png`)로 다운로드 |
| **공유하기** | Web Share API 지원 기기에서는 시스템 공유 시트 표시, 미지원 시 클립보드 복사 |

### 통계 확인

- 랜딩 페이지 또는 결과 페이지 하단의 **통계 보기** 버튼으로 이동합니다.
- 전체 테스트 횟수, 유형별 막대 차트, 순위 목록을 확인할 수 있습니다.
- **초기화** 버튼으로 모든 통계를 삭제할 수 있습니다.

### Google 로그인

1. 랜딩 페이지 헤더 우측의 **Google 로그인** 버튼을 클릭합니다.
2. Google 계정을 선택하면 팝업이 닫히고 로그인이 완료됩니다.
3. 기존 localStorage에 통계 데이터가 있으면 Firestore로 자동 이전됩니다.
4. 이후 테스트 결과는 Firestore에 저장되어 다른 기기에서도 확인 가능합니다.

---

## API 문서

앱의 핵심 로직은 `src/utils/`의 순수 함수들로 구성됩니다.

### `calculateMbti(answers)`

답변 배열을 받아 MBTI 유형과 각 지표별 점수를 계산합니다.

```ts
import { calculateMbti } from './utils/calculateMbti';

const { type, scores } = calculateMbti([0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0]);
// type: 'INTJ'
// scores: { E: 3, I: 4, S: 2, N: 4, T: 5, F: 2, J: 4, P: 2 }
```

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `answers` | `number[]` | 길이 12인 배열. `0` = 첫 번째 선택지, `1` = 두 번째 선택지 |

| 반환값 | 타입 | 설명 |
|--------|------|------|
| `type` | `MbtiType` | 16개 유형 중 하나 (예: `'INTJ'`) |
| `scores` | `Scores` | 8개 지표 각각의 응답 횟수 |

> **동점 처리**: E/S/T/J가 우선합니다 (예: E와 I 점수가 같으면 E).

---

### `statsStorage` (localStorage)

로그인하지 않은 상태에서 사용하는 로컬 통계 함수들입니다.

```ts
import { getStats, recordResult, clearStats } from './utils/statsStorage';
```

#### `getStats(): StatsMap`

localStorage에서 통계를 읽어 16개 유형 전체를 반환합니다.

```ts
const stats = getStats();
// { INTJ: 3, INFP: 7, ENTP: 1, ... }  ← 기록 없는 유형은 0
```

#### `recordResult(type: MbtiType): void`

지정한 유형의 카운트를 1 증가시켜 localStorage에 저장합니다.

```ts
recordResult('INFP');
```

#### `clearStats(): void`

localStorage의 모든 통계를 삭제합니다.

```ts
clearStats();
```

---

### `cloudStatsStorage` (Firestore)

로그인한 상태에서 사용하는 Firestore 통계 함수들입니다.  
데이터 경로: `stats/{uid}` 문서에 16개 유형 카운트를 평탄하게 저장합니다.

```ts
import {
  cloudGetStats,
  cloudRecordResult,
  cloudClearStats,
  migrateLocalToCloud,
} from './utils/cloudStatsStorage';
```

#### `cloudGetStats(uid): Promise<StatsMap>`

Firestore에서 사용자 통계를 조회합니다.

```ts
const stats = await cloudGetStats(user.uid);
```

#### `cloudRecordResult(uid, type): Promise<void>`

Firestore에서 지정한 유형의 카운트를 1 증가시킵니다.

```ts
await cloudRecordResult(user.uid, 'ENFP');
```

#### `cloudClearStats(uid): Promise<void>`

Firestore의 사용자 통계를 모두 0으로 초기화합니다.

```ts
await cloudClearStats(user.uid);
```

#### `migrateLocalToCloud(uid, localStats): Promise<void>`

localStorage 통계와 Firestore 통계를 합산해 Firestore에 저장합니다.  
로그인 시 기존 로컬 데이터가 있을 때 자동 호출됩니다.

```ts
const local = getStats();
await migrateLocalToCloud(user.uid, local);
```

---

### `useStats()` 훅

로그인 여부를 자동으로 감지해 적절한 스토리지 함수를 반환합니다.  
컴포넌트에서 직접 `statsStorage`나 `cloudStatsStorage`를 import하는 대신 이 훅을 사용합니다.

```ts
import { useStats } from './hooks/useStats';

function MyComponent() {
  const { recordResult, getStats, clearStats } = useStats();

  // 로그인 상태 → Firestore 사용
  // 비로그인 상태 → localStorage 사용
  // 호출 방식은 동일
  const stats = await getStats();
  await recordResult('INTP');
  await clearStats();
}
```

---

### `useAuth()` 훅

인증 상태와 로그인/로그아웃 함수를 제공합니다.

```ts
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, loading, signIn, signOut } = useAuth();

  if (loading) return <Spinner />;
  if (user) return <p>{user.displayName}님 환영합니다</p>;
  return <button onClick={signIn}>Google 로그인</button>;
}
```

| 값 | 타입 | 설명 |
|----|------|------|
| `user` | `User \| null` | Firebase User 객체. 비로그인 시 `null` |
| `loading` | `boolean` | Firebase 인증 상태 초기화 중 `true` |
| `signIn` | `() => Promise<void>` | Google 팝업 로그인 실행 |
| `signOut` | `() => Promise<void>` | 로그아웃 실행 |

---

## 테스트

```bash
# 전체 테스트 실행
npx vitest run

# 감시 모드로 실행 (파일 변경 시 자동 재실행)
npx vitest

# 커버리지 측정
npx vitest run --coverage
```

### 테스트 대상

| 파일 | 테스트 항목 |
|------|------------|
| `calculateMbti.test.ts` | 모든 답변 0 → ESTJ, 모든 답변 1 → INFP, 동점 처리 등 |
| `statsStorage.test.ts` | 기록 저장, 누적 카운트, 초기화, 빈 상태 반환 |
| `ProgressBar.test.tsx` | 진행률 aria 속성, 렌더링 |

---

## 빌드 및 배포

```bash
# 프로덕션 빌드 (dist/ 폴더 생성)
npm run build

# 빌드 결과물 로컬 미리보기
npm run preview

# 타입 체크만 실행 (빌드 없이)
npx tsc --noEmit
```

### GitHub Pages 배포

이 프로젝트는 GitHub Pages 자동 배포 워크플로가 설정되어 있습니다.  
`main` 브랜치에 push하면 GitHub Actions가 빌드 후 자동 배포합니다.

> `HashRouter`를 사용하는 이유: GitHub Pages는 서버 사이드 라우팅을 지원하지 않기 때문에,  
> URL 해시(`#`)를 통해 클라이언트 라우팅을 처리합니다.

---

## 라이선스

이 프로젝트는 학습 및 개인 사용 목적으로 제작되었습니다.

> **상표 주의**: "MBTI"는 The Myers-Briggs Company의 등록 상표입니다.  
> 서비스 내 주요 명칭은 "성격 유형 테스트" 또는 "16가지 성격 유형"으로 표기합니다.
