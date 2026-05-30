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
        backgroundColor: '#E8DC4A',
        borderColor: '#E8DC4A',
        borderWidth: 0,
        borderRadius: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: '#918D87', font: { size: 11 } },
        grid: { color: '#D0CBC0' },
        border: { display: false },
      },
      x: {
        ticks: { color: '#1A1916', font: { size: 11, weight: 'bold' as const } },
        grid: { display: false },
        border: { display: false },
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
          <button
            type="button"
            onClick={handleClear}
            className="text-[10px] tracking-[0.2em] text-muted uppercase font-semibold hover:text-ink transition-colors duration-150"
          >
            초기화
          </button>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="font-editorial text-[clamp(3.5rem,11vw,7rem)] font-bold leading-[0.88] text-ink">
            성격 유형
          </h1>
          <h1 className="font-editorial text-[clamp(3.5rem,11vw,7rem)] font-bold leading-[0.88] italic text-ink">
            통계
          </h1>
        </div>

        <div className="animate-fade-up mt-6 mb-10" style={{ animationDelay: '0.15s' }}>
          <p className="text-[10px] tracking-[0.22em] uppercase text-muted font-semibold">
            총 {total}개의 테스트 결과
          </p>
          <div className="h-[3px] w-12 bg-accent mt-5" />
        </div>

        <div className="h-px bg-line mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }} />

        <div className="animate-fade-up mb-14" style={{ animationDelay: '0.25s' }}>
          {total === 0 ? (
            <div className="border border-line py-20 flex flex-col items-center gap-5">
              <p className="text-[10px] tracking-[0.22em] uppercase text-muted font-semibold">
                아직 테스트 결과가 없습니다
              </p>
              <button
                type="button"
                onClick={() => navigate('/test')}
                className="group flex items-center gap-2 bg-ink text-paper px-7 py-3.5 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-accent hover:text-ink transition-colors duration-200"
              >
                테스트 시작
                <span className="group-hover:translate-x-0.5 transition-transform duration-150">→</span>
              </button>
            </div>
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )}
        </div>

        {total > 0 && (
          <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="h-px bg-line mb-8" />
            <p className="text-[9px] tracking-[0.22em] uppercase text-muted font-semibold mb-6">순위</p>
            <ol>
              {sorted.filter(([, count]) => count > 0).map(([type, count], i) => (
                <li
                  key={type}
                  className="flex items-center justify-between py-4 border-b border-line"
                >
                  <span className="flex items-center gap-6">
                    <span className="text-[10px] text-muted font-semibold w-4 shrink-0">{i + 1}</span>
                    <span className="font-editorial text-2xl font-bold text-ink">{type}</span>
                  </span>
                  <span className="text-[11px] text-muted">
                    {count}회&nbsp;&nbsp;·&nbsp;&nbsp;{Math.round((count / total) * 100)}%
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
