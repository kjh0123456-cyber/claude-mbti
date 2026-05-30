import type { MbtiType } from '../data/mbtiProfiles';

export type StatsMap = Record<MbtiType, number>;

const STORAGE_KEY = 'mbti_stats';

const ALL_TYPES: MbtiType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

// 16개 MBTI 유형을 키로, 카운트를 0으로 초기화한 빈 통계 객체를 생성한다
function emptyStats(): StatsMap {
  return Object.fromEntries(ALL_TYPES.map((t) => [t, 0])) as StatsMap;
}

// localStorage에서 통계 데이터를 읽어 StatsMap 형태로 반환한다. 데이터가 없거나 파싱에 실패하면 빈 통계를 반환한다
export function getStats(): StatsMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStats();
    const parsed = JSON.parse(raw) as Partial<StatsMap>;
    const base = emptyStats();
    for (const type of ALL_TYPES) {
      const v = parsed[type];
      if (typeof v === 'number') base[type] = v;
    }
    return base;
  } catch {
    return emptyStats();
  }
}

// 지정한 MBTI 유형의 테스트 결과 카운트를 localStorage에서 1 증가시킨다
export function recordResult(type: MbtiType): void {
  const stats = getStats();
  stats[type] += 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

// localStorage에 저장된 모든 통계 데이터를 삭제한다
export function clearStats(): void {
  localStorage.removeItem(STORAGE_KEY);
}
