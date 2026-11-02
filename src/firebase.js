// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Live Firebase configuration connected to Sankey Events
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCKFqcNNIHlb9BxQWNNEJPqj4lOgEt8BtQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sanskey-events.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sanskey-events",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sanskey-events.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "297931424748",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:297931424748:web:6e1ae2b07fdd2e35def6c9",
};

// Safe initialization
let app = null;
let auth = null;
let googleProvider = null;
let yahooProvider = null;
let db = null;

if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    yahooProvider = new OAuthProvider('yahoo.com');
    db = getFirestore(app);
  } catch (err) {
    console.warn("Failed to initialize Firebase:", err);
  }
}

export { app, auth, googleProvider, yahooProvider, db };
