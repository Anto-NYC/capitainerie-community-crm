import React, { useState, useEffect } from 'react';
import { Plus, Anchor, Users, Calendar } from 'lucide-react';
import { subscribeToCohorts, subscribeToMembers, addCohort } from '../lib/firestore';
import { Button, Card, Modal, Input, Textarea, SectionHeader, EmptyState, Spinner, Badge } from '../components/UI';

const STATUS_COLORS = {
  'Nouveau': 'blue',
  'Note envoyée': 'orange',
  'Actif': 'green',
};

export default function CohortsPage() {
  const [cohorts, setCohorts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', number: '', description: '', date: '' });

  useEffect(() => {
    const u1 = subscribeToCohorts(d => { setCohorts(d); setLoading(false); });
    const u2 = subscribeToMembers(setMembers);
    return () => { u1(); u2(); };
  }, []);

  const handleAdd = async () => {
    if (!form.name || !form.number) return;
    setSaving(true);
    try {
      await addCohort({ ...form, number: parseInt(form.number) });
      setShowAdd(false);
      setForm({ name: '', number: '', description: '', date: '' });
    } finally { setSaving(false); }
  };

  const getMembersForCohort = (cohortId) => members.filter(m => m.cohortId === cohortId);

  const getStatusCounts = (cohortMembers) => {
    return cohortMembers.reduce((acc, m) => {
      acc[m.onboardingStatus] = (acc[m.onboardingStatus] || 0) + 1;
      return acc;
    }, {});
  };

  return (
    <div style={{ padding: '24px 16px', paddingBottom: 'calc(var(--nav-height) + 20px)', maxWidth: 600, margin: '0 auto' }}>
      <SectionHeader
        title="Cohortes"
        subtitle="Vagues d'arrivée des membres"
        action={
          <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
            <Plus size={15} /> Nouvelle vague
          </Button>
        }
      />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Spinner size={32} />
        </div>
      ) : cohorts.length === 0 ? (
        <EmptyState
          icon={Anchor}
          title="Aucune cohorte"
          subtitle="Créez votre première vague pour organiser vos membres"
          action={<Button variant="gold" size="sm" onClick={() => setShowAdd(true)}><Plus size={14} /> Créer une vague</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {cohorts.map(cohort => {
            const cohortMembers = getMembersForCohort(cohort.id);
            const statusCounts = getStatusCounts(cohortMembers);
            const activeCount = statusCounts['Actif'] || 0;
            const progressPct = cohortMembers.length > 0 ? Math.round((activeCount / cohortMembers.length) * 100) : 0;

            return (
              <div key={cohort.id} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              }}>
                {/* Gold top bar */}
                <div style={{ height: '2px', background: 'linear-gradient(90deg, var(--gold), var(--gold-light), transparent)' }} />

                <div style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '8px',
                          background: 'var(--gold-dim)', border: '1px solid var(--border-accent)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--gold)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px',
                        }}>
                          {cohort.number}
                        </div>
                        <div>
                          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px' }}>
                            {cohort.name}
                          </h3>
                          {cohort.date && (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Calendar size={10} /> {cohort.date}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                      <Users size={14} />
                      <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{cohortMembers.length}</strong>
                    </div>
                  </div>

                  {cohort.description && (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.5 }}>
                      {cohort.description}
                    </p>
                  )}

                  {/* Progress bar */}
                  {cohortMembers.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Taux d'activation</span>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gold)' }}>{progressPct}%</span>
                      </div>
                      <div style={{ height: 4, background: 'var(--bg-input)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${progressPct}%`,
                          background: 'linear-gradient(90deg, var(--gold), var(--gold-light))',
                          borderRadius: 2, transition: 'width 0.5s ease',
                        }} />
                      </div>
                    </div>
                  )}

                  {/* Status breakdown */}
                  {cohortMembers.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {Object.entries(statusCounts).map(([status, count]) => (
                        <span key={status} style={{
                          padding: '3px 10px', borderRadius: '100px', fontSize: '11px',
                          background: 'var(--bg-input)', color: 'var(--text-secondary)',
                          border: '1px solid var(--border)',
                        }}>
                          {status}: <strong style={{ color: 'var(--text-primary)' }}>{count}</strong>
                        </span>
                      ))}
                    </div>
                  )}

                  {cohortMembers.length === 0 && (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Aucun membre dans cette vague
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Cohort Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Nouvelle vague" maxWidth={420}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
            <Input
              label="Numéro"
              type="number"
              value={form.number}
              onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
              placeholder="1"
            />
            <Input
              label="Nom"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Vague Alpha"
            />
          </div>
          <Input
            label="Date (optionnel)"
            type="date"
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
          />
          <Textarea
            label="Description (optionnel)"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={2}
            placeholder="Contexte de cette vague..."
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setShowAdd(false)} style={{ flex: 1 }}>Annuler</Button>
            <Button variant="primary" onClick={handleAdd} loading={saving} style={{ flex: 1 }}>Créer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
