export type Dimension = 'EI' | 'SN' | 'TF' | 'JP';

export interface Question {
  id: number;
  text: string;
  dimension: Dimension;
  options: [string, string];
}

export const questions: Question[] = [
  {
    id: 1,
    text: '주말 계획이 갑자기 취소되었을 때 당신은?',
    dimension: 'EI',
    options: ['친구에게 연락해서 다른 약속을 만든다', '혼자만의 시간을 즐긴다'],
  },
  {
    id: 2,
    text: '새로운 정보를 접할 때 더 관심 있는 것은?',
    dimension: 'SN',
    options: ['구체적인 사실과 실제 경험', '숨겨진 의미와 미래 가능성'],
  },
  {
    id: 3,
    text: '친구가 힘든 상황을 털어놓을 때 당신은?',
    dimension: 'TF',
    options: ['원인을 분석하고 해결책을 제안한다', '먼저 공감하고 감정을 나눈다'],
  },
  {
    id: 4,
    text: '여행을 계획할 때 선호하는 방식은?',
    dimension: 'JP',
    options: ['일정·숙소·동선을 미리 꼼꼼히 계획한다', '큰 틀만 잡고 현지에서 즉흥적으로 결정한다'],
  },
  {
    id: 5,
    text: '에너지를 얻는 방법은?',
    dimension: 'EI',
    options: ['사람들과 어울리며 대화할 때', '조용히 혼자 있는 시간을 가질 때'],
  },
  {
    id: 6,
    text: '문제를 해결할 때 주로 의존하는 것은?',
    dimension: 'SN',
    options: ['과거의 경험과 검증된 방법', '직관과 새로운 아이디어'],
  },
  {
    id: 7,
    text: '중요한 결정을 내릴 때 더 중시하는 것은?',
    dimension: 'TF',
    options: ['논리적 분석과 객관적 기준', '관계에 미치는 영향과 감정'],
  },
  {
    id: 8,
    text: '마감이 있는 과제를 처리하는 방식은?',
    dimension: 'JP',
    options: ['미리 완료해서 여유를 남긴다', '마감 직전 집중해서 끝낸다'],
  },
  {
    id: 9,
    text: '모임에서 당신의 모습에 가까운 것은?',
    dimension: 'EI',
    options: ['먼저 말을 걸며 다양한 사람과 이야기한다', '편한 소수와 깊게 이야기하는 편이다'],
  },
  {
    id: 10,
    text: '아이디어를 낼 때 더 강한 쪽은?',
    dimension: 'SN',
    options: ['현실적으로 실행 가능한 방법을 생각한다', '기존과 다른 창의적인 방법을 생각한다'],
  },
  {
    id: 11,
    text: '갈등 상황에서 당신이 우선시하는 것은?',
    dimension: 'TF',
    options: ['공정한 원칙에 따라 처리한다', '모두가 상처받지 않도록 조율한다'],
  },
  {
    id: 12,
    text: '할 일 목록에 대한 당신의 태도는?',
    dimension: 'JP',
    options: ['목록대로 하나씩 완료하는 게 좋다', '상황에 따라 유동적으로 바꾸는 게 편하다'],
  },
];
