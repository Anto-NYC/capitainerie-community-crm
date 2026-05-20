import React, { useState, useEffect } from 'react';
import { GitBranch, Check, Clock, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { subscribeToMatches, updateMatchStatus, deleteMatch } from '../lib/firestore';
import { Button, SectionHeader, EmptyState, Spinner, StatusBadge, Modal } from '../components/UI';

const RelationCard = ({ match, onStatusChange, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const isDone = match.status === 'done';

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      opacity: isDone ? 0.8 : 1,
    }}>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          {/* Score */}
          <div style={{
            minWidth: 44, height: 44, borderRadius: 'var(--radius-sm)',
            background: match.score >= 70 ? 'rgba(82,183,136,0.15)' : 'var(--gold-dim)',
            border: `1px solid ${match.score >= 70 ? 'rgba(82,183,136,0.3)' : 'var(--border-accent)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column',
          }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px',
              color: match.score >= 70 ? 'var(--status-active)' : 'var(--gold)',
              lineHeight: 1,
            }}>{match.score}</span>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>/100</span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px' }}>
                {match.member1Name}
              </span>
              <span style={{ color: 'var(--gold)', fontSize: '14px' }}>↔</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px' }}>
                {match.member2Name}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <StatusBadge status={match.status} />
              {match.createdAt?.toDate && (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {new Date(match.createdAt.toDate()).toLocaleDateString('fr-FR')}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              onClick={() => onStatusChange(match.id, isDone ? 'pending' : 'done')}
              style={{
                width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDone ? 'rgba(82,183,136,0.2)' : 'var(--bg-input)',
                color: isDone ? 'var(--status-active)' : 'var(--text-muted)',
              }}
              title={isDone ? 'Marquer en attente' : 'Marquer comme fait'}
            >
              {isDone ? <Check size={14} /> : <Clock size={14} />}
            </button>
            <button
              onClick={() => onDelete(match)}
              style={{
                width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-input)', color: 'var(--text-muted)',
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {match.summary && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                width: '100%', marginTop: '10px', background: 'var(--bg-input)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                padding: '6px 10px', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'space-between',
                color: 'var(--text-muted)', fontSize: '11px',
              }}
            >
              <span>Résumé & message</span>
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {expanded && (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {match.summary && (
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                    "{match.summary}"
                  </p>
                )}
                {match.firstMessage && (
                  <div style={{ padding: '10px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-accent)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                      💬 Message suggéré
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {match.firstMessage}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default function RelationsPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsub = subscribeToMatches(d => { setMatches(d); setLoading(false); });
    return unsub;
  }, []);

  const filtered = matches.filter(m => {
    if (filter === 'pending') return m.status === 'pending';
    if (filter === 'done') return m.status === 'done';
    return true;
  });

  const handleDelete = async () => {
    setDeleting(true);
    try { await deleteMatch(confirmDelete.id); setConfirmDelete(null); }
    finally { setDeleting(false); }
  };

  const pendingCount = matches.filter(m => m.status === 'pending').length;
  const doneCount = matches.filter(m => m.status === 'done').length;

  return (
    <div style={{ padding: '24px 16px', paddingBottom: 'calc(var(--nav-height) + 20px)', maxWidth: 600, margin: '0 auto' }}>
      <SectionHeader
        title="Mises en relation"
        subtitle={`${matches.length} relation${matches.length !== 1 ? 's' : ''} · ${doneCount} réalisée${doneCount !== 1 ? 's' : ''}`}
      />

      {/* Stats */}
      {matches.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {[
            { label: 'En attente', value: pendingCount, color: 'var(--status-note)' },
            { label: 'Réalisées', value: doneCount, color: 'var(--status-active)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '14px 16px',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[
          { key: 'all', label: 'Toutes' },
          { key: 'pending', label: 'En attente' },
          { key: 'done', label: 'Réalisées' },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)} style={{
            padding: '5px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: 500,
            cursor: 'pointer', border: 'none', transition: 'all 0.15s',
            background: filter === key ? 'var(--gold)' : 'var(--bg-card)',
            color: filter === key ? '#0E0E10' : 'var(--text-secondary)',
          }}>{label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Spinner size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={GitBranch}
          title="Aucune mise en relation"
          subtitle={filter !== 'all'
            ? "Aucune relation dans cette catégorie"
            : "Utilisez le matching IA pour créer des mises en relation"}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(match => (
            <RelationCard
              key={match.id}
              match={match}
              onStatusChange={updateMatchStatus}
              onDelete={setConfirmDelete}
            />
          ))}
        </div>
      )}

      {/* Confirm Delete */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Supprimer la mise en relation" maxWidth={360}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Supprimer la relation entre{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{confirmDelete?.member1Name}</strong> et{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{confirmDelete?.member2Name}</strong> ?
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)} style={{ flex: 1 }}>Annuler</Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting} style={{ flex: 1 }}>Supprimer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
