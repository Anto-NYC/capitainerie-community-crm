import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyALztD7QZAvUAKJ8I4lxqzcYKtcw5H-P00",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "capitainerie-5498e.firebaseapp.com",
  projectId: "capitainerie-5498e",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "capitainerie-5498e.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "532000161107",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:532000161107:web:7692a47352602aca58f5a6",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
