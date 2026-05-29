import type { Question } from '../data/questions';

interface Props {
  question: Question;
  onAnswer: (value: 0 | 1) => void;
}

export default function QuestionCard({ question, onAnswer }: Props) {
  return (
    <div className="w-full">
      <p className="text-xl font-semibold text-gray-800 text-center mb-8 leading-relaxed">
        {question.text}
      </p>
      <div className="flex flex-col gap-3">
        {question.options.map((option, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onAnswer(i as 0 | 1)}
            className="w-full text-left bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-400 text-gray-700 font-medium py-4 px-6 rounded-xl transition-all duration-150 shadow-sm"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
