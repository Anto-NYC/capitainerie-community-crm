import React, { useState, useEffect } from 'react';
import { Zap, ChevronDown, ChevronUp, Plus, Check } from 'lucide-react';
import { subscribeToMembers, addMatch } from '../lib/firestore';
import { Button, Select, SectionHeader, EmptyState, Spinner, Badge, Card } from '../components/UI';

const CRITERIA_LABELS = {
  complementarity: { label: 'Complémentarité apports/besoins', max: 30 },
  triggers: { label: 'Résonance des déclencheurs', max: 25 },
  personality: { label: 'Compatibilité personnalité', max: 15 },
  longTermValue: { label: 'Valeur mutuelle long terme', max: 10 },
  passions: { label: 'Passions communes', max: 7 },
  lifestyle: { label: 'Style de vie', max: 5 },
  familyStatus: { label: 'Statut familial', max: 4 },
  investment: { label: 'Domaines d\'investissement', max: 4 },
};

const ScoreBar = ({ score, max }) => {
  const pct = Math.round((score / max) * 100);
  const color = pct >= 75 ? 'var(--status-active)' : pct >= 50 ? 'var(--gold)' : 'var(--text-muted)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ flex: 1, height: 4, background: 'var(--bg-input)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 0.5s ease' }} />
      </div>
      <span style={{ fontSize: '11px', color, fontWeight: 600, minWidth: '32px', textAlign: 'right' }}>
        {score}/{max}
      </span>
    </div>
  );
};

const MatchCard = ({ match, memberName, onSave, saving }) => {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);
  const scoreColor = match.score >= 75 ? 'var(--status-active)' : match.score >= 50 ? 'var(--gold)' : 'var(--text-muted)';

  const handleSave = async () => {
    await onSave(match);
    setSaved(true);
  };

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
    }}>
      {/* Score indicator */}
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${scoreColor}, transparent)` }} />

      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'var(--gold-dim)', border: '1px solid var(--border-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gold)', fontSize: '13px',
            }}>
              {memberName?.[0] || '?'}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px' }}>{memberName}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Score global</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: scoreColor }}>
              {match.score}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>/ 100</div>
          </div>
        </div>

        {match.summary && (
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px', fontStyle: 'italic' }}>
            "{match.summary}"
          </p>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', padding: '8px 12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            color: 'var(--text-secondary)', fontSize: '12px',
          }}
        >
          <span>Détail des critères</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expanded && match.criteria && (
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(match.criteria).map(([key, val]) => {
              const meta = CRITERIA_LABELS[key];
              if (!meta) return null;
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{meta.label}</span>
                  </div>
                  <ScoreBar score={val.score} max={meta.max} />
                  {val.reason && (
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
                      {val.reason}
                    </p>
                  )}
                </div>
              );
            })}

            {match.firstMessage && (
              <div style={{ marginTop: '8px', padding: '10px 12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-accent)' }}>
                <div style={{ fontSize: '10px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  💬 Message suggéré
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{match.firstMessage}</p>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: '12px' }}>
          <Button
            variant={saved ? 'secondary' : 'gold'}
            size="sm"
            style={{ width: '100%' }}
            onClick={handleSave}
            loading={saving}
            disabled={saved}
          >
            {saved ? <><Check size={13} /> Mise en relation enregistrée</> : <><Plus size={13} /> Créer la mise en relation</>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function MatchingPage() {
  const [members, setMembers] = useState([]);
  const [baseMemberId, setBaseMemberId] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = subscribeToMembers(setMembers);
    return unsub;
  }, []);

  const memberOptions = [
    { value: '', label: 'Choisir un membre...' },
    ...members.map(m => ({ value: m.id, label: `${m.firstName} ${m.lastName}` })),
  ];

  const handleMatch = async () => {
    if (!baseMemberId) return;
    setLoading(true);
    setError('');
    setResults(null);

    const baseMember = members.find(m => m.id === baseMemberId);
    const candidates = members.filter(m => m.id !== baseMemberId);

    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseMember, candidates }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur API');
      }

      const data = await res.json();

      // Sort by score desc
      const sorted = (data.matches || []).sort((a, b) => b.score - a.score);
      setResults(sorted);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMatch = async (match) => {
    const baseMember = members.find(m => m.id === baseMemberId);
    const candidate = members.find(m => m.id === match.memberId);
    if (!baseMember || !candidate) return;

    setSaving(s => ({ ...s, [match.memberId]: true }));
    try {
      await addMatch({
        member1Id: baseMemberId,
        member1Name: `${baseMember.firstName} ${baseMember.lastName}`,
        member2Id: match.memberId,
        member2Name: `${candidate.firstName} ${candidate.lastName}`,
        score: match.score,
        summary: match.summary,
        firstMessage: match.firstMessage,
        criteria: match.criteria,
      });
    } finally {
      setSaving(s => ({ ...s, [match.memberId]: false }));
    }
  };

  const getNameById = (id) => {
    const m = members.find(m => m.id === id);
    return m ? `${m.firstName} ${m.lastName}` : id;
  };

  return (
    <div style={{ padding: '24px 16px', paddingBottom: 'calc(var(--nav-height) + 20px)', maxWidth: 600, margin: '0 auto' }}>
      <SectionHeader
        title="Matching IA"
        subtitle="Trouvez les meilleures affinités entre membres"
      />

      {/* Selection */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '8px',
            background: 'var(--gold-dim)', border: '1px solid var(--border-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)',
          }}>
            <Zap size={15} />
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Sélectionnez un membre pour trouver ses meilleures compatibilités
          </p>
        </div>

        <Select
          label="Membre de référence"
          options={memberOptions}
          value={baseMemberId}
          onChange={e => { setBaseMemberId(e.target.value); setResults(null); }}
        />

        {members.length < 2 && (
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '10px' }}>
            Ajoutez au moins 2 membres pour utiliser le matching.
          </p>
        )}

        <Button
          variant="primary"
          onClick={handleMatch}
          loading={loading}
          disabled={!baseMemberId || members.length < 2}
          style={{ width: '100%', marginTop: '14px' }}
        >
          <Zap size={15} /> Lancer l'analyse IA
        </Button>

        {error && (
          <div style={{
            marginTop: '12px', padding: '10px 14px', background: 'var(--red-dim)',
            border: '1px solid rgba(224,82,82,0.3)', borderRadius: 'var(--radius-sm)',
            fontSize: '13px', color: 'var(--red)',
          }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Results */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '40px' }}>
          <Spinner size={36} />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
            L'IA analyse les profils selon 8 critères pondérés…
          </p>
        </div>
      )}

      {results && !loading && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600 }}>
              {results.length} résultat{results.length !== 1 ? 's' : ''}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Triés par score</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {results.map(match => (
              <MatchCard
                key={match.memberId}
                match={match}
                memberName={getNameById(match.memberId)}
                onSave={handleSaveMatch}
                saving={saving[match.memberId]}
              />
            ))}
          </div>
        </div>
      )}

      {!loading && !results && !error && (
        <EmptyState
          icon={Zap}
          title="Prêt pour l'analyse"
          subtitle="Sélectionnez un membre et lancez le matching pour découvrir les affinités"
        />
      )}
    </div>
  );
}
