import {
  collection, doc, getDocs, getDoc,
  addDoc, updateDoc, deleteDoc,
  query, orderBy, where, serverTimestamp, onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Members ───────────────────────────────────────────────────────────────

export const subscribeToMembers = (callback) => {
  const q = query(collection(db, 'members'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const members = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(members);
  });
};

export const getMember = async (id) => {
  const snap = await getDoc(doc(db, 'members', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const addMember = async (data) => {
  return addDoc(collection(db, 'members'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateMember = async (id, data) => {
  return updateDoc(doc(db, 'members', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteMember = async (id) => {
  return deleteDoc(doc(db, 'members', id));
};

// ─── Cohorts ───────────────────────────────────────────────────────────────

export const subscribeToCohorts = (callback) => {
  const q = query(collection(db, 'cohorts'), orderBy('number', 'asc'));
  return onSnapshot(q, (snap) => {
    const cohorts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(cohorts);
  });
};

export const addCohort = async (data) => {
  return addDoc(collection(db, 'cohorts'), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

// ─── Matches ───────────────────────────────────────────────────────────────

export const subscribeToMatches = (callback) => {
  const q = query(collection(db, 'matches'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const matches = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(matches);
  });
};

export const addMatch = async (data) => {
  return addDoc(collection(db, 'matches'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateMatchStatus = async (id, status) => {
  return updateDoc(doc(db, 'matches', id), {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const deleteMatch = async (id) => {
  return deleteDoc(doc(db, 'matches', id));
};
