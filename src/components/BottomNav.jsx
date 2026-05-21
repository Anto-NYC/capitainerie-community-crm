import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users, Anchor, Zap, GitBranch } from './Icons';

const NAV_ITEMS = [
  { path: '/', label: 'Membres', icon: Users },
  { path: '/cohorts', label: 'Cohortes', icon: Anchor },
  { path: '/matching', label: 'Matching IA', icon: Zap },
  { path: '/relations', label: 'Relations', icon: GitBranch },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      height: 'var(--nav-height)',
      background: 'rgba(14,14,16,0.92)', backdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'stretch',
    }}>
      {/* Gold top line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
        opacity: 0.4,
      }} />

      {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
        const active = isActive(path);
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: '4px', background: 'none', border: 'none',
              cursor: 'pointer', padding: '8px 4px',
              color: active ? 'var(--gold)' : 'var(--text-muted)',
              transition: 'color 0.2s ease', position: 'relative',
            }}
          >
            {active && (
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: '32px', height: '2px', background: 'var(--gold)',
                borderRadius: '0 0 4px 4px',
              }} />
            )}
            <Icon
              size={20}
              style={{
                transform: active ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.2s ease',
              }}
            />
            <span style={{
              fontSize: '10px', fontWeight: active ? 600 : 400,
              fontFamily: 'var(--font-body)', letterSpacing: '0.02em',
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
