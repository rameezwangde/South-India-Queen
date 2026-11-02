// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// These should be populated in your .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Safe initialization so local development won't crash when env variables are not set
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
} else {
  console.warn("Firebase API key missing in environment variables. Firebase features are disabled locally.");
}

export { app, auth, googleProvider, yahooProvider, db };
