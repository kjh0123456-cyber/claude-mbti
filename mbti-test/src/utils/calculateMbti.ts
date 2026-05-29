import { type Dimension, questions } from '../data/questions';
import type { MbtiType } from '../data/mbtiProfiles';

export type { MbtiType };

export interface Scores {
  E: number; I: number;
  S: number; N: number;
  T: number; F: number;
  J: number; P: number;
}

export function calculateMbti(answers: number[]): { type: MbtiType; scores: Scores } {
  const scores: Scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  answers.forEach((answer, index) => {
    const question = questions[index];
    if (!question) return;
    const dim: Dimension = question.dimension;
    const first = dim[0] as keyof Scores;
    const second = dim[1] as keyof Scores;
    if (answer === 0) scores[first]++;
    else scores[second]++;
  });

  const e = scores.E >= scores.I ? 'E' : 'I';
  const s = scores.S >= scores.N ? 'S' : 'N';
  const t = scores.T >= scores.F ? 'T' : 'F';
  const j = scores.J >= scores.P ? 'J' : 'P';

  return { type: `${e}${s}${t}${j}` as MbtiType, scores };
}
