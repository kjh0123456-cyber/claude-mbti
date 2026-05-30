import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/questions';
import { calculateMbti } from '../utils/calculateMbti';
import { useStats } from '../hooks/useStats';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';

// 12개 질문을 순서대로 보여주고 답변을 수집하며, 완료 시 결과를 계산해 저장 후 결과 페이지로 이동한다
export default function TestPage() {
  const navigate = useNavigate();
  const { recordResult } = useStats();
  const [answers, setAnswers] = useState<number[]>([]);

  const current = answers.length;
  const question = questions[current];

  // 선택한 답변을 기록하고, 12문항이 완료되면 MBTI를 계산해 통계에 저장한 뒤 결과 페이지로 이동한다
  async function handleAnswer(value: 0 | 1) {
    const next = [...answers, value];
    if (next.length < questions.length) {
      setAnswers(next);
      return;
    }
    const { type } = calculateMbti(next);
    await recordResult(type);
    navigate(`/result/${type}`, { state: { answers: next } });
  }

  // 이전 질문으로 돌아가거나, 첫 번째 질문이면 홈으로 이동한다
  function handleBack() {
    if (answers.length === 0) {
      navigate('/');
    } else {
      setAnswers(answers.slice(0, -1));
    }
  }

  if (!question) return null;

  return (
    <div className="min-h-screen bg-paper">
      <ProgressBar current={current} total={questions.length} />

      <div className="max-w-2xl mx-auto px-8 sm:px-16 pt-16 pb-20">
        <div className="flex justify-between items-center mb-20">
          <button
            type="button"
            onClick={handleBack}
            className="text-[10px] tracking-[0.2em] text-muted uppercase font-semibold hover:text-ink transition-colors duration-150"
          >
            ← 이전
          </button>
          <span className="text-[10px] tracking-[0.2em] text-muted uppercase font-semibold">
            {current + 1}&thinsp;/&thinsp;{questions.length}
          </span>
        </div>

        <div className="mb-6 animate-fade-up" style={{ animationDelay: '0s' }}>
          <p className="font-editorial text-[clamp(5rem,16vw,9.5rem)] font-bold text-line leading-none select-none">
            Q.{String(current + 1).padStart(2, '0')}
          </p>
        </div>

        <div className="h-px bg-line mb-10 animate-fade-up" style={{ animationDelay: '0.05s' }} />

        <QuestionCard key={current} question={question} onAnswer={handleAnswer} />
      </div>
    </div>
  );
}
