import React from 'react';

// ─── Button ────────────────────────────────────────────────────────────────
export const Button = ({
  children, variant = 'primary', size = 'md',
  disabled, loading, onClick, className = '', type = 'button', ...props
}) => {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', fontFamily: 'var(--font-body)', fontWeight: 500,
    border: 'none', cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.5 : 1,
    transition: 'all 0.2s ease', borderRadius: 'var(--radius-md)',
    whiteSpace: 'nowrap', outline: 'none',
  };

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '13px' },
    md: { padding: '10px 18px', fontSize: '14px' },
    lg: { padding: '13px 24px', fontSize: '15px' },
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)',
      color: '#0E0E10',
    },
    secondary: {
      background: 'var(--bg-card)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
    },
    danger: {
      background: 'var(--red-dim)',
      color: 'var(--red)',
      border: '1px solid rgba(224,82,82,0.25)',
    },
    gold: {
      background: 'var(--gold-dim)',
      color: 'var(--gold)',
      border: '1px solid var(--border-accent)',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ ...base, ...sizes[size], ...variants[variant] }}
      className={className}
      {...props}
    >
      {loading ? <Spinner size={16} /> : children}
    </button>
  );
};

// ─── Input ─────────────────────────────────────────────────────────────────
export const Input = ({ label, error, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {label && (
      <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </label>
    )}
    <input
      style={{
        background: 'var(--bg-input)', border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-sm)', padding: '10px 14px',
        color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'var(--font-body)',
        outline: 'none', width: '100%', transition: 'border-color 0.2s',
      }}
      onFocus={e => e.target.style.borderColor = 'var(--gold)'}
      onBlur={e => e.target.style.borderColor = error ? 'var(--red)' : 'var(--border)'}
      {...props}
    />
    {error && <span style={{ fontSize: '12px', color: 'var(--red)' }}>{error}</span>}
  </div>
);

// ─── Select ────────────────────────────────────────────────────────────────
export const Select = ({ label, options = [], error, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {label && (
      <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </label>
    )}
    <select
      style={{
        background: 'var(--bg-input)', border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-sm)', padding: '10px 14px',
        color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'var(--font-body)',
        outline: 'none', width: '100%', cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%239B9794' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'calc(100% - 12px) center',
        paddingRight: '36px',
      }}
      onFocus={e => e.target.style.borderColor = 'var(--gold)'}
      onBlur={e => e.target.style.borderColor = error ? 'var(--red)' : 'var(--border)'}
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value} style={{ background: 'var(--bg-card)' }}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <span style={{ fontSize: '12px', color: 'var(--red)' }}>{error}</span>}
  </div>
);

// ─── Textarea ──────────────────────────────────────────────────────────────
export const Textarea = ({ label, rows = 3, error, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {label && (
      <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </label>
    )}
    <textarea
      rows={rows}
      style={{
        background: 'var(--bg-input)', border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-sm)', padding: '10px 14px',
        color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'var(--font-body)',
        outline: 'none', width: '100%', resize: 'vertical', lineHeight: 1.6,
      }}
      onFocus={e => e.target.style.borderColor = 'var(--gold)'}
      onBlur={e => e.target.style.borderColor = error ? 'var(--red)' : 'var(--border)'}
      {...props}
    />
    {error && <span style={{ fontSize: '12px', color: 'var(--red)' }}>{error}</span>}
  </div>
);

// ─── Card ──────────────────────────────────────────────────────────────────
export const Card = ({ children, onClick, style = {}, className = '' }) => (
  <div
    onClick={onClick}
    style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '20px',
      cursor: onClick ? 'pointer' : 'default',
      transition: onClick ? 'all 0.2s ease' : 'none',
      ...style,
    }}
    className={className}
    onMouseEnter={onClick ? e => {
      e.currentTarget.style.borderColor = 'var(--border-accent)';
      e.currentTarget.style.transform = 'translateY(-1px)';
    } : undefined}
    onMouseLeave={onClick ? e => {
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.transform = 'translateY(0)';
    } : undefined}
  >
    {children}
  </div>
);

// ─── Badge ─────────────────────────────────────────────────────────────────
export const Badge = ({ children, color = 'gold' }) => {
  const colors = {
    gold: { bg: 'var(--gold-dim)', text: 'var(--gold)', border: 'var(--border-accent)' },
    blue: { bg: 'rgba(74,144,217,0.15)', text: 'var(--status-new)', border: 'rgba(74,144,217,0.25)' },
    orange: { bg: 'rgba(232,160,48,0.15)', text: 'var(--status-note)', border: 'rgba(232,160,48,0.25)' },
    green: { bg: 'rgba(82,183,136,0.15)', text: 'var(--status-active)', border: 'rgba(82,183,136,0.25)' },
    red: { bg: 'var(--red-dim)', text: 'var(--red)', border: 'rgba(224,82,82,0.25)' },
  };
  const c = colors[color] || colors.gold;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 500,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>
      {children}
    </span>
  );
};

// ─── Spinner ───────────────────────────────────────────────────────────────
export const Spinner = ({ size = 20 }) => (
  <div style={{
    width: size, height: size, border: `2px solid var(--border)`,
    borderTopColor: 'var(--gold)', borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  }} />
);

// ─── Modal ─────────────────────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, children, maxWidth = 540 }) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', width: '100%', maxWidth,
        maxHeight: '90vh', overflow: 'auto',
        animation: 'fadeIn 0.25s ease',
        marginBottom: 'var(--nav-height)',
      }}>
        {title && (
          <div style={{
            padding: '20px 24px 0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600 }}>
              {title}
            </h3>
            <button onClick={onClose} style={{
              background: 'var(--bg-input)', border: 'none', color: 'var(--text-secondary)',
              width: 32, height: 32, borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
            }}>×</button>
          </div>
        )}
        <div style={{ padding: '20px 24px 24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// ─── Status Badge ──────────────────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const map = {
    'Nouveau': { color: 'blue', label: 'Nouveau' },
    'Note envoyée': { color: 'orange', label: 'Note envoyée' },
    'Actif': { color: 'green', label: 'Actif' },
    'pending': { color: 'orange', label: 'En attente' },
    'done': { color: 'green', label: 'Fait' },
  };
  const s = map[status] || { color: 'gold', label: status };
  return <Badge color={s.color}>{s.label}</Badge>;
};

// ─── Section Header ────────────────────────────────────────────────────────
export const SectionHeader = ({ title, subtitle, action }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '20px' }}>
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
        {title}
      </h2>
      {subtitle && <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

// ─── Empty State ───────────────────────────────────────────────────────────
export const EmptyState = ({ icon: Icon, title, subtitle, action }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '60px 20px', textAlign: 'center', gap: '12px',
  }}>
    {Icon && (
      <div style={{
        width: 56, height: 56, borderRadius: '50%', background: 'var(--gold-dim)',
        border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: 'var(--gold)',
      }}>
        <Icon size={24} />
      </div>
    )}
    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600 }}>{title}</h3>
    {subtitle && <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '260px' }}>{subtitle}</p>}
    {action}
  </div>
);

// ─── Divider ───────────────────────────────────────────────────────────────
export const Divider = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    {label && <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>}
    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
  </div>
);
