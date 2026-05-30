import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { MbtiType } from '../data/mbtiProfiles';
import type { StatsMap } from './statsStorage';

const ALL_TYPES: MbtiType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

// 16개 MBTI 유형을 키로, 카운트를 0으로 초기화한 빈 통계 객체를 생성한다
function emptyStats(): StatsMap {
  return Object.fromEntries(ALL_TYPES.map(t => [t, 0])) as StatsMap;
}

// Firestore에서 특정 사용자의 통계 문서를 읽어 StatsMap으로 반환한다. 문서가 없으면 빈 통계를 반환한다
async function fetchStats(uid: string): Promise<StatsMap> {
  const snap = await getDoc(doc(db, 'stats', uid));
  if (!snap.exists()) return emptyStats();
  const base = emptyStats();
  const data = snap.data() as Partial<StatsMap>;
  for (const type of ALL_TYPES) {
    const v = data[type];
    if (typeof v === 'number') base[type] = v;
  }
  return base;
}

// 특정 사용자의 Firestore 통계를 조회해 반환한다
export async function cloudGetStats(uid: string): Promise<StatsMap> {
  return fetchStats(uid);
}

// 특정 사용자의 Firestore 통계에서 지정한 MBTI 유형의 카운트를 1 증가시킨다
export async function cloudRecordResult(uid: string, type: MbtiType): Promise<void> {
  const stats = await fetchStats(uid);
  stats[type] += 1;
  await setDoc(doc(db, 'stats', uid), stats);
}

// 특정 사용자의 Firestore 통계를 모두 0으로 초기화한다
export async function cloudClearStats(uid: string): Promise<void> {
  await setDoc(doc(db, 'stats', uid), emptyStats());
}

// localStorage 통계와 Firestore 통계를 합산해 Firestore에 저장한다. 로그인 시 기존 데이터 이전에 사용한다
export async function migrateLocalToCloud(uid: string, localStats: StatsMap): Promise<void> {
  const cloud = await fetchStats(uid);
  const merged = emptyStats();
  for (const type of ALL_TYPES) {
    merged[type] = cloud[type] + localStats[type];
  }
  await setDoc(doc(db, 'stats', uid), merged);
}
