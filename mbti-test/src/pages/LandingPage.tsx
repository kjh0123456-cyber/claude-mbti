import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="flex justify-between items-center px-8 sm:px-16 pt-10">
        <span className="text-[10px] tracking-[0.22em] text-muted uppercase font-semibold">
          성격 유형 연구소
        </span>
        <span className="text-[10px] tracking-[0.22em] text-muted uppercase font-semibold">
          No.&thinsp;16
        </span>
      </header>

      <main className="flex-1 flex flex-col justify-center px-8 sm:px-16 max-w-4xl w-full mx-auto py-16">
        <p
          className="text-[10px] tracking-[0.25em] text-muted uppercase font-semibold mb-10 animate-fade-up"
          style={{ animationDelay: '0s' }}
        >
          자기 이해의 첫걸음
        </p>

        <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="font-editorial text-[clamp(4.5rem,13vw,9rem)] font-bold leading-[0.88] text-ink">
            당신의
          </h1>
          <h1 className="font-editorial text-[clamp(4.5rem,13vw,9rem)] font-bold leading-[0.88] text-ink">
            성격을
          </h1>
          <h1 className="font-editorial text-[clamp(4.5rem,13vw,9rem)] font-bold leading-[0.88] italic">
            <span className="bg-accent px-1">발견하세요</span>
          </h1>
        </div>

        <div className="h-px bg-line mt-12 mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }} />

        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 animate-fade-up"
          style={{ animationDelay: '0.3s' }}
        >
          <div>
            <p className="text-sm font-medium text-ink">16가지 성격 유형 테스트</p>
            <p className="text-xs text-muted mt-1">12개 질문 · 약 3분 소요</p>
          </div>

          <div className="flex flex-col sm:items-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/test')}
              className="group flex items-center gap-3 bg-ink text-paper px-8 py-3.5 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-accent hover:text-ink transition-colors duration-200 self-start sm:self-auto"
            >
              테스트 시작
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/stats')}
              className="text-[10px] tracking-[0.18em] text-muted uppercase underline underline-offset-4 hover:text-ink transition-colors duration-150 self-start sm:self-auto"
            >
              통계 보기
            </button>
          </div>
        </div>
      </main>

      <footer className="px-8 sm:px-16 pb-10">
        <p className="text-[10px] text-muted tracking-wider">© 16가지 성격 유형</p>
      </footer>
    </div>
  );
}
