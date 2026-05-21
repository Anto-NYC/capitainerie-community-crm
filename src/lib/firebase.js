import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyALztD7QZAvUAKJ8I4lxqzcYKtcw5H-P00",
  authDomain: "capitainerie-5498e.firebaseapp.com",
  projectId: "capitainerie-5498e",
  storageBucket: "capitainerie-5498e.firebasestorage.app",
  messagingSenderId: "532000161107",
  appId: "1:532000161107:web:7692a47352602aca58f5a6",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
