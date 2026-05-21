import React from 'react';
import { MapPin, Briefcase, Heart, TrendingUp, ChevronRight } from './Icons';
import { StatusBadge, Badge } from './UI';

const INITIALS = (m) => {
  const f = m.firstName?.[0] || '';
  const l = m.lastName?.[0] || '';
  return (f + l).toUpperCase() || '?';
};

const AVATAR_COLORS = [
  ['#C8A96E', '#0E0E10'],
  ['#4A90D9', '#0E0E10'],
  ['#52B788', '#0E0E10'],
  ['#9B59B6', '#fff'],
  ['#E67E22', '#0E0E10'],
];

const getAvatarColor = (str = '') => {
  const idx = str.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

export default function MemberCard({ member, onClick }) {
  const [bg, fg] = getAvatarColor(member.firstName);
  const words = member.threeWordsArray?.slice(0, 3) || [];

  return (
    <div
      onClick={() => onClick(member)}
      style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        padding: '16px', background: 'var(--bg-card)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
        cursor: 'pointer', transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-accent)';
        e.currentTarget.style.background = 'var(--bg-elevated)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.background = 'var(--bg-card)';
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
        background: bg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '16px', fontWeight: 700,
        fontFamily: 'var(--font-display)', color: fg,
        border: '2px solid rgba(255,255,255,0.08)',
      }}>
        {INITIALS(member)}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>
            {member.firstName} {member.lastName}
          </span>
          <StatusBadge status={member.onboardingStatus} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          {member.city && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <MapPin size={11} /> {member.city}
            </span>
          )}
          {member.profession && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Briefcase size={11} /> {member.profession}
            </span>
          )}
          {member.cohortName && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--gold)' }}>
              Vague {member.cohortNumber}
            </span>
          )}
        </div>

        {words.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
            {words.map(w => (
              <span key={w} style={{
                padding: '2px 8px', background: 'var(--bg-input)', borderRadius: '100px',
                fontSize: '11px', color: 'var(--text-muted)', border: '1px solid var(--border)',
              }}>
                {w}
              </span>
            ))}
          </div>
        )}
      </div>

      <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
    </div>
  );
}
