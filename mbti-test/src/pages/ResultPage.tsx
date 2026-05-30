import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { mbtiProfiles } from '../data/mbtiProfiles';
import type { MbtiType } from '../data/mbtiProfiles';
import ResultCard from '../components/ResultCard';

export default function ResultPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  if (!type || !(type in mbtiProfiles)) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center gap-6">
        <p className="text-[10px] tracking-[0.22em] uppercase text-muted font-semibold">유효하지 않은 유형입니다.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-[11px] tracking-[0.2em] uppercase border-b border-ink hover:border-accent hover:text-muted pb-0.5 transition-colors duration-150"
        >
          처음으로
        </button>
      </div>
    );
  }

  const profile = mbtiProfiles[type as MbtiType];

  async function handleDownload() {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { scale: 2 });
    const link = document.createElement('a');
    link.download = `mbti-${type}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  async function handleShare() {
    const text = `나의 성격 유형은 ${type} - ${profile.nickname}입니다! 16가지 성격 유형 테스트를 해보세요.`;
    if (navigator.share) {
      await navigator.share({ title: '성격 유형 테스트 결과', text });
    } else {
      await navigator.clipboard.writeText(text);
      alert('결과가 클립보드에 복사되었습니다!');
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto px-8 sm:px-16 pt-12 pb-24">

        <div className="flex justify-between items-center mb-20 animate-fade-up">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-[10px] tracking-[0.2em] text-muted uppercase font-semibold hover:text-ink transition-colors duration-150"
          >
            ← 홈
          </button>
          <span className="text-[10px] tracking-[0.2em] text-muted uppercase font-semibold">나의 성격 유형</span>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="font-editorial text-[clamp(6rem,20vw,12rem)] font-bold leading-none text-ink tracking-tight">
            {type}
          </h1>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <p className="text-base font-medium text-muted mt-3 mb-6">{profile.nickname}</p>
          <div className="h-[3px] w-12 bg-accent mb-10" />
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-sm text-ink leading-relaxed max-w-prose mb-10">{profile.description}</p>
        </div>

        <div className="h-px bg-line mb-10 animate-fade-up" style={{ animationDelay: '0.25s' }} />

        <div className="grid grid-cols-2 gap-10 mb-10 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div>
            <p className="text-[9px] tracking-[0.22em] uppercase text-muted font-semibold mb-5">강점</p>
            <ul className="space-y-2.5">
              {profile.strengths.map(s => (
                <li key={s} className="flex items-start gap-3 text-sm text-ink">
                  <span className="text-muted mt-px shrink-0">—</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[9px] tracking-[0.22em] uppercase text-muted font-semibold mb-5">약점</p>
            <ul className="space-y-2.5">
              {profile.weaknesses.map(w => (
                <li key={w} className="flex items-start gap-3 text-sm text-ink">
                  <span className="text-muted mt-px shrink-0">—</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="h-px bg-line mb-10" />

        <div className="mb-8 animate-fade-up" style={{ animationDelay: '0.35s' }}>
          <p className="text-[9px] tracking-[0.22em] uppercase text-muted font-semibold mb-3">추천 직업</p>
          <p className="text-sm text-ink">{profile.careers.join(' · ')}</p>
        </div>

        <div className="mb-14 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-[9px] tracking-[0.22em] uppercase text-muted font-semibold mb-3">잘 맞는 유형</p>
          <p className="text-sm text-ink">{profile.compatibility.join(', ')}</p>
        </div>

        <div className="h-px bg-line mb-10" />

        <div className="flex flex-col sm:flex-row gap-2.5 animate-fade-up" style={{ animationDelay: '0.45s' }}>
          <button
            type="button"
            onClick={() => navigate('/test')}
            className="group flex-1 flex items-center justify-center gap-2 bg-ink text-paper py-3.5 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-accent hover:text-ink transition-colors duration-200"
          >
            다시 테스트
            <span className="group-hover:translate-x-0.5 transition-transform duration-150">→</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 py-3.5 text-[11px] tracking-[0.18em] uppercase font-semibold border border-line text-ink hover:border-ink hover:bg-surface transition-colors duration-150"
          >
            이미지 저장
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 py-3.5 text-[11px] tracking-[0.18em] uppercase font-semibold border border-line text-ink hover:border-ink hover:bg-surface transition-colors duration-150"
          >
            공유하기
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate('/stats')}
          className="mt-5 w-full text-center text-[10px] tracking-[0.18em] text-muted uppercase hover:text-ink transition-colors duration-150 py-2"
        >
          통계 보기
        </button>
      </div>

      {/* Hidden card for image export */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <ResultCard ref={cardRef} profile={profile} />
      </div>
    </div>
  );
}
