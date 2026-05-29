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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-gray-500 text-lg">유효하지 않은 유형입니다.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center py-10 px-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          나의 성격 유형
        </h1>

        <ResultCard ref={cardRef} profile={profile} />

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors duration-150"
          >
            📷 이미지 저장
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors duration-150"
          >
            🔗 공유하기
          </button>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/test')}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors duration-150"
          >
            다시 테스트
          </button>
          <button
            type="button"
            onClick={() => navigate('/stats')}
            className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors duration-150"
          >
            📊 통계 보기
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-4 w-full text-center text-gray-400 hover:text-gray-600 text-sm transition-colors duration-150"
        >
          처음으로 돌아가기
        </button>
      </div>
    </div>
  );
}
