import {
  collection, doc, getDocs, getDoc,
  addDoc, updateDoc, deleteDoc,
  query, orderBy, onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

export const subscribeToMembers = (callback) => {
  const q = query(collection(db, 'members'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const members = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(members);
  }, (error) => {
    console.error('Members error:', error);
    callback([]);
  });
};

export const subscribeToCohorts = (callback) => {
  const q = query(collection(db, 'cohorts'), orderBy('number', 'asc'));
  return onSnapshot(q, (snap) => {
    const cohorts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(cohorts);
  }, (error) => {
    console.error('Cohorts error:', error);
    callback([]);
  });
};

export const subscribeToMatches = (callback) => {
  const q = query(collection(db, 'matches'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const matches = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(matches);
  }, (error) => {
    console.error('Matches error:', error);
    callback([]);
  });
};

export const addMember = (data) => addDoc(collection(db, 'members'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
export const updateMember = (id, data) => updateDoc(doc(db, 'members', id), { ...data, updatedAt: serverTimestamp() });
export const deleteMember = (id) => deleteDoc(doc(db, 'members', id));

export const addCohort = (data) => addDoc(collection(db, 'cohorts'), { ...data, createdAt: serverTimestamp() });

export const addMatch = (data) => addDoc(collection(db, 'matches'), { ...data, status: 'pending', createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
export const updateMatchStatus = (id, status) => updateDoc(doc(db, 'matches', id), { status, updatedAt: serverTimestamp() });
export const deleteMatch = (id) => deleteDoc(doc(db, 'matches', id));
