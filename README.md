# ⚓ Capitainerie Community CRM

CRM communautaire premium pour La Capitainerie — gestion des membres, cohortes, matching IA et suivi des mises en relation.

## Stack

- **Frontend** : React 18 + React Router
- **Design** : Syne + DM Sans, fond `#0E0E10`, accent or `#C8A96E`
- **Base de données** : Firebase Firestore (`capitainerie-5498e`)
- **IA** : Anthropic Claude via Vercel Serverless Function `/api/match`
- **Déploiement** : Vercel

---

## Structure des fichiers

```
capitainerie-crm/
├── api/
│   └── match.js          ← Fonction Vercel sécurisée (clé Anthropic)
├── src/
│   ├── lib/
│   │   ├── firebase.js   ← Init Firebase
│   │   └── firestore.js  ← CRUD Firestore
│   ├── components/
│   │   ├── UI.jsx        ← Composants réutilisables
│   │   ├── BottomNav.jsx ← Navigation 4 onglets
│   │   ├── MemberCard.jsx
│   │   └── MemberForm.jsx
│   ├── pages/
│   │   ├── Members.jsx   ← Liste + fiche membre + suppression
│   │   ├── Cohorts.jsx   ← Vagues d'arrivée
│   │   ├── Matching.jsx  ← Matching IA (8 critères)
│   │   └── Relations.jsx ← Suivi mises en relation
│   ├── styles/globals.css
│   ├── App.jsx
│   └── index.js
├── public/index.html
├── .env.example
├── vercel.json
└── firestore.rules
```

---

## Déploiement : StackBlitz → GitHub → Vercel

### 1. Ouvrir dans StackBlitz

Glissez le dossier sur [stackblitz.com](https://stackblitz.com) ou utilisez :
```
https://stackblitz.com/github/VOTRE_USERNAME/capitainerie-crm
```

### 2. Variables d'environnement locales

Copiez `.env.example` → `.env` et remplissez :
```env
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=capitainerie-5498e.firebaseapp.com
REACT_APP_FIREBASE_STORAGE_BUCKET=capitainerie-5498e.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

### 3. Récupérer les clés Firebase

1. [console.firebase.google.com](https://console.firebase.google.com)
2. Projet `capitainerie-5498e` → Paramètres du projet → Vos applications
3. SDK Firebase → copier la config

### 4. Pousser sur GitHub

```bash
git init
git add .
git commit -m "init: Capitainerie CRM"
git remote add origin https://github.com/VOUS/capitainerie-crm.git
git push -u origin main
```

### 5. Déployer sur Vercel

1. [vercel.com](https://vercel.com) → New Project → importer le repo
2. **Variables d'environnement Vercel** (Settings → Environment Variables) :
   ```
   REACT_APP_FIREBASE_API_KEY       = votre_clé
   REACT_APP_FIREBASE_AUTH_DOMAIN   = capitainerie-5498e.firebaseapp.com
   REACT_APP_FIREBASE_STORAGE_BUCKET= capitainerie-5498e.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID = ...
   REACT_APP_FIREBASE_APP_ID        = ...
   ANTHROPIC_API_KEY                = sk-ant-... ← clé secrète, jamais côté client
   ```
3. Framework Preset : **Create React App**
4. Deploy ✓

---

## Matching IA — Critères pondérés

| Critère | Poids |
|---|---|
| Complémentarité apports/besoins | 30% |
| Résonance des déclencheurs | 25% |
| Compatibilité personnalité | 15% |
| Valeur mutuelle long terme | 10% |
| Passions communes | 7% |
| Style de vie | 5% |
| Statut familial | 4% |
| Domaines d'investissement | 4% |

L'API `/api/match` reçoit un membre de référence + tous les candidats, appelle Claude claude-sonnet-4-20250514, et retourne les scores + raisonnements + message d'introduction suggéré.

---

## Firestore — Collections

| Collection | Documents |
|---|---|
| `members` | Profils complets des membres |
| `cohorts` | Vagues d'arrivée |
| `matches` | Mises en relation (score, statut, résumé) |

---

## Fonctionnalités

- ✅ Membres avec profil complet (18 champs)
- ✅ Statut onboarding : Nouveau / Note envoyée / Actif
- ✅ Suppression avec confirmation (bouton rouge)
- ✅ Cohortes avec taux d'activation et stats
- ✅ Matching IA 8 critères via Claude
- ✅ Suivi relations : En attente / Fait
- ✅ Navigation bottom bar 4 onglets
- ✅ Design premium sombre, Syne + DM Sans, or `#C8A96E`
- ✅ Temps réel Firestore (onSnapshot)
