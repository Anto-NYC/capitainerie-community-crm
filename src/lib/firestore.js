import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  query, onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

export const subscribeToMembers = (callback) => {
  const q = query(collection(db, 'members'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }, () => callback([]));
};

export const subscribeToCohorts = (callback) => {
  const q = query(collection(db, 'cohorts'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }, () => callback([]));
};

export const subscribeToMatches = (callback) => {
  const q = query(collection(db, 'matches'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }, () => callback([]));
};

export const addMember = (data) => addDoc(collection(db, 'members'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
export const updateMember = (id, data) => updateDoc(doc(db, 'members', id), { ...data, updatedAt: serverTimestamp() });
export const deleteMember = (id) => deleteDoc(doc(db, 'members', id));

export const addCohort = (data) => addDoc(collection(db, 'cohorts'), { ...data, createdAt: serverTimestamp() });

export const addMatch = (data) => addDoc(collection(db, 'matches'), { ...data, status: 'pending', createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
export const updateMatchStatus = (id, status) => updateDoc(doc(db, 'matches', id), { status, updatedAt: serverTimestamp() });
export const deleteMatch = (id) => deleteDoc(doc(db, 'matches', id));
