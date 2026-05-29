export type MbtiType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface MbtiProfile {
  type: MbtiType;
  nickname: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
  compatibility: MbtiType[];
  emoji: string;
}

export const mbtiProfiles: Record<MbtiType, MbtiProfile> = {
  INTJ: {
    type: 'INTJ',
    nickname: '전략적인 설계자',
    description: '독립적이고 결단력 있는 전략가. 장기적인 목표를 세우고 체계적으로 실행하는 것을 즐깁니다. 높은 기준을 가지고 있으며 지식 추구에 끊임없이 노력합니다.',
    strengths: ['전략적 사고', '독립적', '결단력', '자기 개선 의지'],
    weaknesses: ['지나치게 비판적', '감정 표현 어려움', '완벽주의', '사회성 부족'],
    careers: ['과학자', '엔지니어', '경영 컨설턴트', '건축가'],
    compatibility: ['ENFP', 'ENTP'],
    emoji: '🏛️',
  },
  INTP: {
    type: 'INTP',
    nickname: '논리적인 사색가',
    description: '아이디어와 이론에 매료된 조용한 분석가. 복잡한 문제를 해결하고 새로운 개념을 탐구하는 것을 즐깁니다.',
    strengths: ['분석적 사고', '객관성', '창의성', '독창성'],
    weaknesses: ['우유부단함', '무관심한 태도', '사회적 어색함', '규칙 무시'],
    careers: ['철학자', '수학자', '소프트웨어 개발자', '연구원'],
    compatibility: ['ENFJ', 'ENTJ'],
    emoji: '🔬',
  },
  ENTJ: {
    type: 'ENTJ',
    nickname: '대담한 통솔자',
    description: '타고난 리더십과 카리스마를 가진 지휘관. 목표를 향해 사람들을 이끌고 조직을 효율적으로 운영하는 능력이 탁월합니다.',
    strengths: ['리더십', '자신감', '전략적', '효율성'],
    weaknesses: ['고집스러움', '참을성 부족', '냉담함', '지배적'],
    careers: ['CEO', '변호사', '정치인', '경영자'],
    compatibility: ['INTP', 'INFP'],
    emoji: '👑',
  },
  ENTP: {
    type: 'ENTP',
    nickname: '뜨거운 논쟁을 즐기는 변론가',
    description: '빠른 두뇌와 날카로운 언변을 가진 혁신가. 도전을 즐기고 기존 관념에 의문을 제기하며 창의적인 해결책을 찾습니다.',
    strengths: ['창의성', '빠른 학습', '언변', '적응력'],
    weaknesses: ['논쟁적', '집중력 부족', '과제 마무리 어려움', '규칙 무시'],
    careers: ['기업가', '변호사', '발명가', '마케터'],
    compatibility: ['INTJ', 'INFJ'],
    emoji: '💡',
  },
  INFJ: {
    type: 'INFJ',
    nickname: '선의의 옹호자',
    description: '깊은 통찰력과 강한 신념을 가진 이상주의자. 타인을 돕고 세상을 더 나은 곳으로 만들기 위해 노력합니다.',
    strengths: ['통찰력', '공감 능력', '헌신', '창의성'],
    weaknesses: ['완벽주의', '지나친 감수성', '번아웃', '폐쇄적'],
    careers: ['상담사', '심리학자', '작가', '사회운동가'],
    compatibility: ['ENTP', 'ENFP'],
    emoji: '🌿',
  },
  INFP: {
    type: 'INFP',
    nickname: '열정적인 중재자',
    description: '이상적이고 공감 능력이 풍부한 몽상가. 자신의 가치관에 충실하며 타인의 감정을 깊이 이해합니다.',
    strengths: ['공감 능력', '개방성', '창의성', '헌신'],
    weaknesses: ['비실용적', '자기비판', '감수성 과다', '우유부단'],
    careers: ['작가', '예술가', '상담사', '교사'],
    compatibility: ['ENFJ', 'ENTJ'],
    emoji: '🌸',
  },
  ENFJ: {
    type: 'ENFJ',
    nickname: '정의로운 사회운동가',
    description: '카리스마 넘치는 선천적 리더. 타인에게 영감을 주고 성장을 돕는 데 열정적입니다.',
    strengths: ['공감 능력', '리더십', '소통 능력', '이타심'],
    weaknesses: ['과도한 이상주의', '우유부단', '자기희생', '비판에 민감'],
    careers: ['교사', '코치', '심리학자', 'HR 전문가'],
    compatibility: ['INFP', 'INTP'],
    emoji: '🌟',
  },
  ENFP: {
    type: 'ENFP',
    nickname: '재기발랄한 활동가',
    description: '열정적이고 창의적인 자유로운 영혼. 새로운 아이디어와 가능성에 흥분하며 사람들과의 연결을 소중히 여깁니다.',
    strengths: ['열정', '창의성', '사교성', '공감 능력'],
    weaknesses: ['집중력 부족', '과도한 낙관주의', '감정적', '계획성 부족'],
    careers: ['배우', '저널리스트', '마케터', '기업가'],
    compatibility: ['INTJ', 'INFJ'],
    emoji: '🎨',
  },
  ISTJ: {
    type: 'ISTJ',
    nickname: '청렴결백한 논리주의자',
    description: '신뢰할 수 있고 책임감 강한 현실주의자. 체계와 전통을 중시하며 맡은 일을 끝까지 완수합니다.',
    strengths: ['책임감', '신뢰성', '조직력', '인내심'],
    weaknesses: ['완고함', '변화 저항', '감정 표현 어려움', '과도한 완벽주의'],
    careers: ['회계사', '법률가', '군인', '관리자'],
    compatibility: ['ESFP', 'ESTP'],
    emoji: '📋',
  },
  ISFJ: {
    type: 'ISFJ',
    nickname: '용감한 수호자',
    description: '따뜻하고 헌신적인 보호자. 사랑하는 사람들을 위해 묵묵히 지원하며 조화로운 환경을 만들어갑니다.',
    strengths: ['배려심', '인내심', '신뢰성', '세심함'],
    weaknesses: ['자기주장 부족', '과도한 이타심', '변화 저항', '과부하'],
    careers: ['간호사', '사회복지사', '교사', '행정직'],
    compatibility: ['ESFP', 'ESTP'],
    emoji: '🛡️',
  },
  ESTJ: {
    type: 'ESTJ',
    nickname: '엄격한 관리자',
    description: '실용적이고 사실에 근거한 조직의 기둥. 규칙과 질서를 중시하며 효율적으로 목표를 달성합니다.',
    strengths: ['리더십', '조직력', '책임감', '결단력'],
    weaknesses: ['완고함', '감정 무시', '독선', '융통성 부족'],
    careers: ['경영자', '군인', '판사', '경찰관'],
    compatibility: ['ISFP', 'ISTP'],
    emoji: '⚖️',
  },
  ESFJ: {
    type: 'ESFJ',
    nickname: '사교적인 외교관',
    description: '사람 중심적이고 배려심 넘치는 돌봄이. 타인의 필요를 파악하고 조화로운 환경을 만드는 데 탁월합니다.',
    strengths: ['사교성', '배려심', '책임감', '협력'],
    weaknesses: ['비판에 민감', '변화 저항', '이기적 사람에게 취약', '지나친 관심 추구'],
    careers: ['교사', '간호사', '이벤트 플래너', '영업직'],
    compatibility: ['ISFP', 'ISTP'],
    emoji: '🤝',
  },
  ISTP: {
    type: 'ISTP',
    nickname: '만능 재주꾼',
    description: '대담하고 실용적인 실험가. 손으로 직접 해보며 배우고 위기 상황에서 냉철하게 대응합니다.',
    strengths: ['실용성', '적응력', '논리적 사고', '위기 대응'],
    weaknesses: ['감정 표현 어려움', '장기 계획 약함', '지루함에 약함', '고집'],
    careers: ['엔지니어', '기계공', '조종사', '외과 의사'],
    compatibility: ['ESTJ', 'ESFJ'],
    emoji: '🔧',
  },
  ISFP: {
    type: 'ISFP',
    nickname: '호기심 많은 예술가',
    description: '유연하고 매력적인 예술가. 자신만의 방식으로 아름다움을 표현하며 현재 순간을 충만하게 삽니다.',
    strengths: ['예술적 감각', '공감 능력', '유연성', '개방성'],
    weaknesses: ['갈등 회피', '자기주장 부족', '계획성 부족', '지나친 독립성'],
    careers: ['예술가', '패션 디자이너', '요리사', '수의사'],
    compatibility: ['ESTJ', 'ESFJ'],
    emoji: '🎭',
  },
  ESTP: {
    type: 'ESTP',
    nickname: '모험을 즐기는 사업가',
    description: '에너지 넘치고 인식력 있는 실행가. 위험을 즐기고 즉각적인 결과에 집중하며 사람들을 사로잡습니다.',
    strengths: ['행동력', '적응력', '관찰력', '사교성'],
    weaknesses: ['충동적', '미래 무시', '감수성 부족', '인내심 부족'],
    careers: ['기업가', '마케터', '경찰관', '운동선수'],
    compatibility: ['ISTJ', 'ISFJ'],
    emoji: '⚡',
  },
  ESFP: {
    type: 'ESFP',
    nickname: '자유로운 영혼의 연예인',
    description: '자발적이고 에너지 넘치는 엔터테이너. 현재를 즐기고 주변 사람들에게 기쁨을 나누는 것을 사랑합니다.',
    strengths: ['사교성', '열정', '실용성', '낙관주의'],
    weaknesses: ['계획성 부족', '충동적', '쉽게 지루함', '갈등 회피'],
    careers: ['배우', '이벤트 플래너', '판매원', '관광 가이드'],
    compatibility: ['ISTJ', 'ISFJ'],
    emoji: '🎉',
  },
};
