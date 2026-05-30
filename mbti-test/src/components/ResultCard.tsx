import { forwardRef } from 'react';
import type { MbtiProfile } from '../data/mbtiProfiles';

interface Props {
  profile: MbtiProfile;
}

const ResultCard = forwardRef<HTMLDivElement, Props>(({ profile }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        backgroundColor: '#F5F2EC',
        color: '#1A1916',
        padding: '52px 48px',
        fontFamily: '"DM Sans", system-ui, sans-serif',
        width: '540px',
      }}
    >
      <p style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#918D87', fontWeight: 600, marginBottom: '20px' }}>
        성격 유형 테스트 결과
      </p>

      <div style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '100px', fontWeight: 700, lineHeight: 0.85, marginBottom: '12px' }}>
        {profile.type}
      </div>

      <p style={{ fontSize: '16px', fontWeight: 500, color: '#918D87', marginBottom: '28px' }}>
        {profile.nickname}
      </p>

      <div style={{ height: '3px', width: '48px', backgroundColor: '#E8DC4A', marginBottom: '24px' }} />

      <p style={{ fontSize: '13px', lineHeight: 1.75, color: '#3A3830', marginBottom: '36px', maxWidth: '420px' }}>
        {profile.description}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginBottom: '28px' }}>
        <div>
          <p style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#918D87', fontWeight: 600, marginBottom: '12px' }}>강점</p>
          {profile.strengths.map(s => (
            <p key={s} style={{ fontSize: '12px', marginBottom: '7px', color: '#1A1916', display: 'flex', gap: '8px' }}>
              <span style={{ color: '#918D87' }}>—</span>{s}
            </p>
          ))}
        </div>
        <div>
          <p style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#918D87', fontWeight: 600, marginBottom: '12px' }}>약점</p>
          {profile.weaknesses.map(w => (
            <p key={w} style={{ fontSize: '12px', marginBottom: '7px', color: '#1A1916', display: 'flex', gap: '8px' }}>
              <span style={{ color: '#918D87' }}>—</span>{w}
            </p>
          ))}
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: '#D0CBC0', marginBottom: '20px' }} />

      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#918D87', fontWeight: 600, marginBottom: '8px' }}>추천 직업</p>
        <p style={{ fontSize: '12px', color: '#1A1916' }}>{profile.careers.join(' · ')}</p>
      </div>

      <div>
        <p style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#918D87', fontWeight: 600, marginBottom: '8px' }}>잘 맞는 유형</p>
        <p style={{ fontSize: '12px', color: '#1A1916' }}>{profile.compatibility.join(', ')}</p>
      </div>
    </div>
  );
});

ResultCard.displayName = 'ResultCard';

export default ResultCard;
