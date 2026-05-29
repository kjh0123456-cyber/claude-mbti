import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-7xl mb-6">🧠</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          16가지 성격 유형 테스트
        </h1>
        <p className="text-gray-500 text-lg mb-2">
          12개의 질문으로 나의 성격 유형을 알아보세요
        </p>
        <p className="text-gray-400 text-sm mb-10">
          소요 시간: 약 3분
        </p>
        <button
          type="button"
          onClick={() => navigate('/test')}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-2xl text-lg transition-colors duration-200 shadow-lg shadow-indigo-200"
        >
          테스트 시작하기
        </button>
        <button
          type="button"
          onClick={() => navigate('/stats')}
          className="mt-4 w-full bg-white hover:bg-gray-50 text-gray-600 font-medium py-3 px-8 rounded-2xl text-base transition-colors duration-200 border border-gray-200"
        >
          📊 통계 보기
        </button>
      </div>
    </div>
  );
}
