import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/questions';
import { calculateMbti } from '../utils/calculateMbti';
import { recordResult } from '../utils/statsStorage';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';

export default function TestPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<number[]>([]);

  const current = answers.length;
  const question = questions[current];

  function handleAnswer(value: 0 | 1) {
    const next = [...answers, value];
    if (next.length < questions.length) {
      setAnswers(next);
      return;
    }
    const { type } = calculateMbti(next);
    recordResult(type);
    navigate(`/result/${type}`, { state: { answers: next } });
  }

  function handleBack() {
    if (answers.length === 0) {
      navigate('/');
    } else {
      setAnswers(answers.slice(0, -1));
    }
  }

  if (!question) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full">
        <div className="mb-8">
          <ProgressBar current={current} total={questions.length} />
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 min-h-[260px] flex flex-col justify-center">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-4 text-center">
            질문 {current + 1} / {questions.length}
          </p>
          <QuestionCard question={question} onAnswer={handleAnswer} />
        </div>

        <button
          type="button"
          onClick={handleBack}
          className="text-gray-400 hover:text-gray-600 text-sm transition-colors duration-150 flex items-center gap-1"
        >
          ← 이전으로
        </button>
      </div>
    </div>
  );
}
