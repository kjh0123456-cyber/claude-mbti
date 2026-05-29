import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { getStats, clearStats } from '../utils/statsStorage';
import type { MbtiType } from '../data/mbtiProfiles';

export default function StatsPage() {
  const navigate = useNavigate();
  const stats = getStats();

  const sorted = (Object.entries(stats) as [MbtiType, number][]).sort(
    ([, a], [, b]) => b - a,
  );

  const labels = sorted.map(([type]) => type);
  const data = sorted.map(([, count]) => count);
  const total = data.reduce((s, v) => s + v, 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: '테스트 횟수',
        data,
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  function handleClear() {
    if (window.confirm('모든 통계를 초기화하시겠습니까?')) {
      clearStats();
      navigate(0);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center py-10 px-4">
      <div className="max-w-2xl w-full">
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-600 text-sm transition-colors duration-150"
          >
            ← 홈으로
          </button>
          <h1 className="text-2xl font-bold text-gray-800">성격 유형 통계</h1>
          <button
            type="button"
            onClick={handleClear}
            className="text-red-400 hover:text-red-600 text-sm transition-colors duration-150"
          >
            초기화
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <p className="text-center text-gray-500 text-sm mb-4">
            총 {total}개의 테스트 결과
          </p>
          {total === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-400">아직 테스트 결과가 없습니다.</p>
              <button
                type="button"
                onClick={() => navigate('/test')}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition-colors duration-150"
              >
                테스트 시작하기
              </button>
            </div>
          ) : (
            <Bar data={chartData} options={options} />
          )}
        </div>

        {total > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">순위</h2>
            <ol className="space-y-2">
              {sorted.filter(([, count]) => count > 0).map(([type, count], i) => (
                <li key={type} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm w-5">{i + 1}</span>
                    <span className="font-semibold text-indigo-600">{type}</span>
                  </span>
                  <span className="text-gray-500 text-sm">
                    {count}회 ({Math.round((count / total) * 100)}%)
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
