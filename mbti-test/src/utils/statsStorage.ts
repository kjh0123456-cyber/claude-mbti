import type { MbtiType } from '../data/mbtiProfiles';

export type StatsMap = Record<MbtiType, number>;

const STORAGE_KEY = 'mbti_stats';

const ALL_TYPES: MbtiType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

function emptyStats(): StatsMap {
  return Object.fromEntries(ALL_TYPES.map((t) => [t, 0])) as StatsMap;
}

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

export function recordResult(type: MbtiType): void {
  const stats = getStats();
  stats[type] += 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function clearStats(): void {
  localStorage.removeItem(STORAGE_KEY);
}
