import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAl_bpqYylbzPUGN4ClCl44OY3hIQz7LVY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "myadec-pro.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "myadec-pro",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "myadec-pro.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "612256706230",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:612256706230:web:d52be99910e61c840a4017",
};

// Initialisation idempotente de l'application Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
