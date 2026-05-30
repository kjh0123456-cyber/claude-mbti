import type { Question } from '../data/questions';

interface Props {
  question: Question;
  onAnswer: (value: 0 | 1) => void;
}

export default function QuestionCard({ question, onAnswer }: Props) {
  return (
    <div className="w-full animate-fade-up">
      <p className="font-editorial text-[clamp(1.6rem,4vw,2.4rem)] font-semibold italic text-ink leading-snug mb-12">
        {question.text}
      </p>

      <div className="border-t border-line">
        {question.options.map((option, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onAnswer(i as 0 | 1)}
            className="group w-full text-left border-b border-line py-5 flex items-center justify-between hover:bg-accent/20 transition-colors duration-150"
          >
            <span className="flex items-center gap-6">
              <span className="text-[10px] tracking-[0.2em] uppercase text-muted font-semibold w-4 shrink-0">
                {i === 0 ? 'A' : 'B'}
              </span>
              <span className="text-sm text-ink font-medium leading-relaxed">{option}</span>
            </span>
            <span className="text-muted text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-150 shrink-0 ml-4">
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
