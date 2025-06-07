import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ✅ REPLACE the config values below with your Firebase project's config
const firebaseConfig = {
   apiKey: "AIzaSyB4-Da_F-lKW2z5EJF-ZJBf3fCgdyIMfzo",
  authDomain: "aptitude-checklist.firebaseapp.com",
  projectId: "aptitude-checklist",
  storageBucket: "aptitude-checklist.firebasestorage.app",
  messagingSenderId: "603581773263",
  appId: "1:603581773263:web:d6d04f01b9ea7917dd4eba"
};

// ✅ Initialize Firebase first
const app = initializeApp(firebaseConfig);

// ✅ Then export Firestore instance
export const db = getFirestore(app);