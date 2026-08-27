import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD9XQ54GLyINIcUFH5OJGNlveM3e4K551Y",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "civicpulse-656ca.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "civicpulse-656ca",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "civicpulse-656ca.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "166852179251",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:166852179251:web:083083611410bb941f3a46",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-687XX1RDS2"
};

// Initialize Firebase App singleton for Next.js SSR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Analytics singleton (only initialized on browser client)
let analytics: Analytics | null = null;

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.warn('Firebase analytics initialization skipped:', err);
  });
}

export { app, analytics };
