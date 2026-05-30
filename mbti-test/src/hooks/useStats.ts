import { useAuth } from '../context/AuthContext';
import { recordResult as localRecord, getStats as localGetStats, clearStats as localClear } from '../utils/statsStorage';
import { cloudRecordResult, cloudGetStats, cloudClearStats } from '../utils/cloudStatsStorage';
import type { MbtiType } from '../data/mbtiProfiles';
import type { StatsMap } from '../utils/statsStorage';

// 로그인 여부에 따라 localStorage 또는 Firestore를 자동 선택하는 통계 함수들을 반환하는 훅이다
export function useStats() {
  const { user } = useAuth();

  // 로그인 상태면 Firestore에, 미로그인 상태면 localStorage에 결과를 저장한다
  async function recordResult(type: MbtiType): Promise<void> {
    if (user) {
      await cloudRecordResult(user.uid, type);
    } else {
      localRecord(type);
    }
  }

  // 로그인 상태면 Firestore에서, 미로그인 상태면 localStorage에서 통계를 불러온다
  async function getStats(): Promise<StatsMap> {
    if (user) {
      return cloudGetStats(user.uid);
    }
    return Promise.resolve(localGetStats());
  }

  // 로그인 상태면 Firestore의, 미로그인 상태면 localStorage의 통계를 초기화한다
  async function clearStats(): Promise<void> {
    if (user) {
      await cloudClearStats(user.uid);
    } else {
      localClear();
    }
  }

  return { recordResult, getStats, clearStats };
}
