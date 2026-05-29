import { forwardRef } from 'react';
import type { MbtiProfile } from '../data/mbtiProfiles';

interface Props {
  profile: MbtiProfile;
}

const ResultCard = forwardRef<HTMLDivElement, Props>(({ profile }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white text-center shadow-2xl"
    >
      <div className="text-6xl mb-4">{profile.emoji}</div>
      <div className="text-sm font-semibold tracking-widest uppercase opacity-80 mb-1">
        {profile.type}
      </div>
      <h2 className="text-2xl font-bold mb-4">{profile.nickname}</h2>
      <p className="text-white/80 text-sm leading-relaxed mb-6">
        {profile.description}
      </p>

      <div className="grid grid-cols-2 gap-3 text-left">
        <div className="bg-white/10 rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-2">강점</p>
          <ul className="space-y-1">
            {profile.strengths.map((s) => (
              <li key={s} className="text-sm flex items-center gap-1">
                <span className="opacity-70">✓</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white/10 rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-2">약점</p>
          <ul className="space-y-1">
            {profile.weaknesses.map((w) => (
              <li key={w} className="text-sm flex items-center gap-1">
                <span className="opacity-70">△</span> {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 bg-white/10 rounded-2xl p-4 text-left">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-2">추천 직업</p>
        <p className="text-sm">{profile.careers.join(' · ')}</p>
      </div>

      <div className="mt-4 bg-white/10 rounded-2xl p-4 text-left">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-2">잘 맞는 유형</p>
        <p className="text-sm">{profile.compatibility.join(', ')}</p>
      </div>
    </div>
  );
});

ResultCard.displayName = 'ResultCard';

export default ResultCard;
