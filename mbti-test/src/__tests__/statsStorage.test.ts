import { recordResult, getStats, clearStats } from '../utils/statsStorage';

beforeEach(() => {
  clearStats();
});

describe('statsStorage', () => {
  it('초기 상태는 16개 유형 모두 0', () => {
    const stats = getStats();
    expect(Object.keys(stats)).toHaveLength(16);
    Object.values(stats).forEach((v) => expect(v).toBe(0));
  });

  it('recordResult 호출 시 해당 유형 카운트 +1', () => {
    recordResult('INTJ');
    const stats = getStats();
    expect(stats.INTJ).toBe(1);
  });

  it('동일 유형 여러 번 기록', () => {
    recordResult('ENFP');
    recordResult('ENFP');
    recordResult('ENFP');
    expect(getStats().ENFP).toBe(3);
  });

  it('다른 유형에는 영향 없음', () => {
    recordResult('INTJ');
    const stats = getStats();
    expect(stats.ENFP).toBe(0);
    expect(stats.ISTJ).toBe(0);
  });

  it('clearStats 후 다시 0으로 리셋', () => {
    recordResult('INFP');
    clearStats();
    expect(getStats().INFP).toBe(0);
  });

  it('손상된 localStorage 데이터는 빈 통계 반환', () => {
    localStorage.setItem('mbti_stats', 'not-valid-json{');
    const stats = getStats();
    Object.values(stats).forEach((v) => expect(v).toBe(0));
  });
});
