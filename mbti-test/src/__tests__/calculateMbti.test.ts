import { calculateMbti } from '../utils/calculateMbti';

const ALL_FIRST = Array(12).fill(0);
const ALL_SECOND = Array(12).fill(1);

describe('calculateMbti', () => {
  it('모든 첫 번째 옵션 선택 시 ESTJ 반환', () => {
    const { type } = calculateMbti(ALL_FIRST);
    expect(type).toBe('ESTJ');
  });

  it('모든 두 번째 옵션 선택 시 INFP 반환', () => {
    const { type } = calculateMbti(ALL_SECOND);
    expect(type).toBe('INFP');
  });

  it('각 dimension 점수 합이 문항 수와 일치해야 함', () => {
    const { scores } = calculateMbti(ALL_FIRST);
    expect(scores.E + scores.I).toBe(3);
    expect(scores.S + scores.N).toBe(3);
    expect(scores.T + scores.F).toBe(3);
    expect(scores.J + scores.P).toBe(3);
  });

  it('빈 배열은 동점(0:0)이므로 E/S/T/J 우선 적용 → ESTJ', () => {
    const { type, scores } = calculateMbti([]);
    expect(scores.E).toBe(0);
    expect(scores.I).toBe(0);
    expect(type).toBe('ESTJ');
  });

  it('혼합 답변으로 올바른 유형을 반환', () => {
    // EI: Q1(I), Q5(E), Q9(I) → I 우세
    // SN: Q2(N), Q6(S), Q10(S) → S 우세
    // TF: Q3(T), Q7(F), Q11(T) → T 우세
    // JP: Q4(J), Q8(P), Q12(J) → J 우세
    // 예상: ISTJ
    const answers = [
      1, 1, 0, 0,  // Q1=I, Q2=N, Q3=T, Q4=J
      0, 0, 1, 1,  // Q5=E, Q6=S, Q7=F, Q8=P
      1, 0, 0, 0,  // Q9=I, Q10=S, Q11=T, Q12=J
    ];
    const { type } = calculateMbti(answers);
    expect(type).toBe('ISTJ');
  });
});
