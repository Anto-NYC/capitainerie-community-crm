import React, { useState } from 'react';
import { Input, Select, Textarea, Button, Divider } from './UI';

const ONBOARDING_STATUS = [
  { value: 'Nouveau', label: 'Nouveau' },
  { value: 'Note envoyée', label: 'Note envoyée' },
  { value: 'Actif', label: 'Actif' },
];

const GENRE_OPTIONS = [
  { value: '', label: 'Choisir...' },
  { value: 'Homme', label: 'Homme' },
  { value: 'Femme', label: 'Femme' },
  { value: 'Autre', label: 'Autre' },
];

const SITUATION_PRO = [
  { value: '', label: 'Choisir...' },
  { value: 'Salarié', label: 'Salarié' },
  { value: 'Entrepreneur', label: 'Entrepreneur' },
  { value: 'Investisseur', label: 'Investisseur' },
  { value: 'Profession libérale', label: 'Profession libérale' },
  { value: 'Manager / Cadre', label: 'Manager / Cadre' },
  { value: 'Autre', label: 'Autre' },
];

const STATUT_FAMILIAL = [
  { value: '', label: 'Choisir...' },
  { value: 'Célibataire', label: 'Célibataire' },
  { value: 'En couple', label: 'En couple' },
  { value: 'Marié(e)', label: 'Marié(e)' },
  { value: 'Marié(e) avec enfants', label: 'Marié(e) avec enfants' },
  { value: 'Parent solo', label: 'Parent solo' },
  { value: 'Autre', label: 'Autre' },
];

const EMPTY_FORM = {
  // Identity
  firstName: '',
  lastName: '',
  age: '',
  gender: '',
  city: '',
  // Professional
  profession: '',
  familyStatus: '',
  lifestyle: '',
  // Passions
  passion1: '',
  passion2: '',
  // Investment
  investmentDomains: '',
  // Community
  trigger: '',
  brings: '',
  seeks: '',
  threeWords: '',
  // Onboarding
  cohortId: '',
  onboardingStatus: 'Nouveau',
  // Extra
  notes: '',
};

export default function MemberForm({ initialData = {}, cohorts = [], onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialData });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'Requis';
    if (!form.lastName.trim()) errs.lastName = 'Requis';
    if (!form.cohortId) errs.cohortId = 'Requis';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const cohort = cohorts.find(c => c.id === form.cohortId);
    onSubmit({
      ...form,
      age: form.age ? parseInt(form.age) : null,
      cohortName: cohort?.name || '',
      cohortNumber: cohort?.number || null,
      threeWordsArray: form.threeWords.split(',').map(w => w.trim()).filter(Boolean),
    });
  };

  const cohortOptions = [
    { value: '', label: 'Sélectionner une cohorte...' },
    ...cohorts.map(c => ({ value: c.id, label: `Vague ${c.number} — ${c.name}` })),
  ];

  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '16px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <Divider label="Identité" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <Input label="Prénom *" value={form.firstName} onChange={set('firstName')} error={errors.firstName} placeholder="Antoine" />
        <Input label="Nom *" value={form.lastName} onChange={set('lastName')} error={errors.lastName} placeholder="Martin" />
        <Input label="Âge" type="number" value={form.age} onChange={set('age')} placeholder="35" />
        <Select label="Genre" options={GENRE_OPTIONS} value={form.gender} onChange={set('gender')} />
      </div>
      <Input label="Ville" value={form.city} onChange={set('city')} placeholder="Paris, Lyon, Bordeaux..." />

      <Divider label="Profil" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <Select label="Situation pro" options={SITUATION_PRO} value={form.profession} onChange={set('profession')} />
        <Select label="Statut familial" options={STATUT_FAMILIAL} value={form.familyStatus} onChange={set('familyStatus')} />
      </div>
      <Input label="Style de vie" value={form.lifestyle} onChange={set('lifestyle')} placeholder="Nomade digital, Sédentaire, Voyageur..." />

      <Divider label="Passions" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <Input label="Passion 1" value={form.passion1} onChange={set('passion1')} placeholder="Sport, Voyages..." />
        <Input label="Passion 2" value={form.passion2} onChange={set('passion2')} placeholder="Gastronomie, Musique..." />
      </div>

      <Divider label="Investissement" />
      <Input
        label="Domaines d'investissement"
        value={form.investmentDomains}
        onChange={set('investmentDomains')}
        placeholder="Immobilier, Bourse, Crypto, Entreprises..."
      />

      <Divider label="Communauté" />
      <div style={fieldStyle}>
        <Textarea
          label="Déclencheur d'entrée"
          value={form.trigger}
          onChange={set('trigger')}
          rows={2}
          placeholder="Pourquoi a-t-il/elle rejoint La Capitainerie ?"
        />
        <Textarea
          label="Ce qu'il/elle apporte"
          value={form.brings}
          onChange={set('brings')}
          rows={2}
          placeholder="Compétences, réseau, expérience..."
        />
        <Textarea
          label="Ce qu'il/elle cherche"
          value={form.seeks}
          onChange={set('seeks')}
          rows={2}
          placeholder="Objectifs, besoins, attentes..."
        />
        <Input
          label="3 mots (séparés par virgules)"
          value={form.threeWords}
          onChange={set('threeWords')}
          placeholder="Ambitieux, Généreux, Curieux"
        />
      </div>

      <Divider label="Suivi" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <Select
          label="Cohorte *"
          options={cohortOptions}
          value={form.cohortId}
          onChange={set('cohortId')}
          error={errors.cohortId}
        />
        <Select
          label="Statut onboarding"
          options={ONBOARDING_STATUS}
          value={form.onboardingStatus}
          onChange={set('onboardingStatus')}
        />
      </div>
      <Textarea
        label="Notes complémentaires"
        value={form.notes}
        onChange={set('notes')}
        rows={3}
        placeholder="Informations supplémentaires..."
      />

      <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
        <Button variant="secondary" onClick={onCancel} style={{ flex: 1 }}>Annuler</Button>
        <Button variant="primary" onClick={handleSubmit} loading={loading} style={{ flex: 2 }}>
          {initialData.id ? 'Enregistrer' : 'Ajouter le membre'}
        </Button>
      </div>
    </div>
  );
}
