import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const subscribeToMembers = (callback) => {
  try {
    return onSnapshot(collection(db, 'members'), (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => callback([]));
  } catch(e) { callback([]); return () => {}; }
};

export const subscribeToCohorts = (callback) => {
  try {
    return onSnapshot(collection(db, 'cohorts'), (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => callback([]));
  } catch(e) { callback([]); return () => {}; }
};

export const subscribeToMatches = (callback) => {
  try {
    return onSnapshot(collection(db, 'matches'), (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => callback([]));
  } catch(e) { callback([]); return () => {}; }
};

export const addMember = (data) => addDoc(collection(db, 'members'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
export const updateMember = (id, data) => updateDoc(doc(db, 'members', id), { ...data, updatedAt: serverTimestamp() });
export const deleteMember = (id) => deleteDoc(doc(db, 'members', id));
export const addCohort = (data) => addDoc(collection(db, 'cohorts'), { ...data, createdAt: serverTimestamp() });
export const addMatch = (data) => addDoc(collection(db, 'matches'), { ...data, status: 'pending', createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
export const updateMatchStatus = (id, status) => updateDoc(doc(db, 'matches', id), { status, updatedAt: serverTimestamp() });
export const deleteMatch = (id) => deleteDoc(doc(db, 'matches', id));
