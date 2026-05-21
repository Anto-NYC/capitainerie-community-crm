import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, Trash2, Edit2, MapPin, Briefcase, Heart, TrendingUp, X } from '../components/Icons';
import { subscribeToMembers, subscribeToCohorts, addMember, updateMember, deleteMember } from '../lib/firestore';
import {
  Button, Modal, SectionHeader, EmptyState, Spinner, StatusBadge, Badge, Divider
} from '../components/UI';
import MemberForm from '../components/MemberForm';
import MemberCard from '../components/MemberCard';

const INITIALS = (m) => ((m.firstName?.[0] || '') + (m.lastName?.[0] || '')).toUpperCase() || '?';
const AVATAR_COLORS = ['#C8A96E','#4A90D9','#52B788','#9B59B6','#E67E22'];
const getAvatarColor = (str = '') => AVATAR_COLORS[str.charCodeAt(0) % AVATAR_COLORS.length];

const InfoRow = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
      <div style={{
        width: 28, height: 28, borderRadius: '6px', background: 'var(--gold-dim)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        color: 'var(--gold)',
      }}>
        <Icon size={13} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '1px', lineHeight: 1.5 }}>{value}</div>
      </div>
    </div>
  );
};

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCohort, setFilterCohort] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editMember, setEditMember] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsub1 = subscribeToMembers((data) => setMembers(data || []));
    const unsub2 = subscribeToCohorts((data) => setCohorts(data || []));
    setLoading(false);
    return () => { unsub1(); unsub2(); };
  }, []);

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
      m.city?.toLowerCase().includes(q) ||
      m.profession?.toLowerCase().includes(q);
    const matchStatus = !filterStatus || m.onboardingStatus === filterStatus;
    const matchCohort = !filterCohort || m.cohortId === filterCohort;
    return matchSearch && matchStatus && matchCohort;
  });

  const handleAdd = async (data) => {
    setSaving(true);
    try { await addMember(data); setShowAdd(false); }
    finally { setSaving(false); }
  };

  const handleEdit = async (data) => {
    setSaving(true);
    try { await updateMember(editMember.id, data); setEditMember(null); setSelectedMember(null); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteMember(confirmDelete.id);
      setConfirmDelete(null);
      setSelectedMember(null);
    } finally { setDeleting(false); }
  };

  const statuses = ['Nouveau', 'Note envoyée', 'Actif'];
  const statusColors = { 'Nouveau': 'var(--status-new)', 'Note envoyée': 'var(--status-note)', 'Actif': 'var(--status-active)' };

  return (
    <div style={{ padding: '20px 16px', paddingBottom: 'calc(var(--nav-height) + 20px)', maxWidth: 600, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ paddingTop: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '14px' }}>⚓</span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Capitainerie
              </h1>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', marginLeft: '42px' }}>
              {members.length} membre{members.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
            <Plus size={15} /> Ajouter
          </Button>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          placeholder="Rechercher..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '10px 14px 10px 36px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
            fontSize: '14px', fontFamily: 'var(--font-body)', outline: 'none',
          }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{
            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
          }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '2px' }}>
        {['', ...statuses].map(s => (
          <button key={s || 'all'} onClick={() => setFilterStatus(s)} style={{
            padding: '5px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 500,
            whiteSpace: 'nowrap', cursor: 'pointer', border: 'none', transition: 'all 0.15s',
            background: filterStatus === s ? 'var(--gold)' : 'var(--bg-card)',
            color: filterStatus === s ? '#0E0E10' : 'var(--text-secondary)',
          }}>
            {s || 'Tous'}
          </button>
        ))}
        {cohorts.map(c => (
          <button key={c.id} onClick={() => setFilterCohort(filterCohort === c.id ? '' : c.id)} style={{
            padding: '5px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 500,
            whiteSpace: 'nowrap', cursor: 'pointer', border: '1px solid var(--border-accent)', transition: 'all 0.15s',
            background: filterCohort === c.id ? 'var(--gold-dim)' : 'transparent',
            color: filterCohort === c.id ? 'var(--gold)' : 'var(--text-muted)',
          }}>
            V{c.number}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Spinner size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Aucun membre"
          subtitle={search ? "Aucun résultat pour cette recherche" : "Commencez par ajouter votre premier membre"}
          action={!search && <Button variant="gold" size="sm" onClick={() => setShowAdd(true)}><Plus size={14} /> Ajouter un membre</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(m => (
            <MemberCard key={m.id} member={m} onClick={setSelectedMember} />
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Nouveau membre" maxWidth={560}>
        <MemberForm cohorts={cohorts} onSubmit={handleAdd} onCancel={() => setShowAdd(false)} loading={saving} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editMember} onClose={() => setEditMember(null)} title="Modifier le membre" maxWidth={560}>
        {editMember && (
          <MemberForm
            initialData={editMember}
            cohorts={cohorts}
            onSubmit={handleEdit}
            onCancel={() => setEditMember(null)}
            loading={saving}
          />
        )}
      </Modal>

      {/* Member Detail Sheet */}
      {selectedMember && !editMember && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 80,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'flex-end',
        }} onClick={e => e.target === e.currentTarget && setSelectedMember(null)}>
          <div style={{
            background: 'var(--bg-elevated)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
            width: '100%', maxHeight: '88vh', overflow: 'auto',
            paddingBottom: 'calc(var(--nav-height) + 16px)',
            animation: 'fadeIn 0.25s ease',
          }}>
            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
              <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 2 }} />
            </div>

            {/* Profile header */}
            <div style={{ padding: '16px 20px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                  background: getAvatarColor(selectedMember.firstName),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', color: '#0E0E10',
                }}>
                  {INITIALS(selectedMember)}
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700 }}>
                    {selectedMember.firstName} {selectedMember.lastName}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                    <StatusBadge status={selectedMember.onboardingStatus} />
                    {selectedMember.cohortName && (
                      <Badge color="gold">Vague {selectedMember.cohortNumber}</Badge>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { setEditMember(selectedMember); }} style={{
                    width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-card)',
                    border: '1px solid var(--border)', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)',
                  }}>
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setSelectedMember(null)} style={{
                    width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-card)',
                    border: '1px solid var(--border)', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)',
                    fontSize: '18px',
                  }}>
                    ×
                  </button>
                </div>
              </div>

              {/* 3 words */}
              {selectedMember.threeWordsArray?.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {selectedMember.threeWordsArray.map(w => (
                    <span key={w} style={{
                      padding: '4px 12px', background: 'var(--gold-dim)', borderRadius: '100px',
                      fontSize: '12px', color: 'var(--gold)', border: '1px solid var(--border-accent)',
                    }}>{w}</span>
                  ))}
                </div>
              )}

              {/* Info grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <InfoRow icon={MapPin} label="Ville" value={selectedMember.city} />
                  <InfoRow icon={Briefcase} label="Situation" value={selectedMember.profession} />
                  <InfoRow icon={Heart} label="Famille" value={selectedMember.familyStatus} />
                  <InfoRow icon={TrendingUp} label="Investissement" value={selectedMember.investmentDomains} />
                </div>

                {selectedMember.lifestyle && (
                  <InfoRow icon={Heart} label="Style de vie" value={selectedMember.lifestyle} />
                )}

                {(selectedMember.passion1 || selectedMember.passion2) && (
                  <InfoRow icon={Heart} label="Passions" value={[selectedMember.passion1, selectedMember.passion2].filter(Boolean).join(' · ')} />
                )}
              </div>

              <Divider label="Communauté" />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {selectedMember.trigger && (
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Déclencheur</div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      {selectedMember.trigger}
                    </p>
                  </div>
                )}
                {selectedMember.brings && (
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Il/Elle apporte</div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      {selectedMember.brings}
                    </p>
                  </div>
                )}
                {selectedMember.seeks && (
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Il/Elle cherche</div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      {selectedMember.seeks}
                    </p>
                  </div>
                )}
                {selectedMember.notes && (
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Notes</div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      {selectedMember.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Delete button */}
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <Button
                  variant="danger"
                  onClick={() => setConfirmDelete(selectedMember)}
                  style={{ width: '100%' }}
                >
                  <Trash2 size={14} /> Supprimer ce membre
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Confirmer la suppression" maxWidth={380}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
            Êtes-vous sûr de vouloir supprimer{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {confirmDelete?.firstName} {confirmDelete?.lastName}
            </strong>{' '}
            ? Cette action est irréversible.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)} style={{ flex: 1 }}>Annuler</Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting} style={{ flex: 1 }}>
              <Trash2 size={14} /> Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
