import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, isSupported } from "firebase/messaging";
import { Messaging } from "firebase/messaging"; 

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Guard: surface clearer error if env vars are missing/misconfigured
(() => {
  const required = [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_APP_ID",
  ] as const;

  const missing = required.filter((k) => !import.meta.env[k] || String(import.meta.env[k]).trim() === "");
  if (missing.length > 0) {
    // Do not log actual secrets; only which keys are missing
    throw new Error(
      `Missing Firebase env variables: ${missing.join(", ")}. Create client/.env.local with VITE_* keys from Firebase Console (Project settings > General > Your apps).`
    );
  }

  const key = String(import.meta.env.VITE_FIREBASE_API_KEY || "");
  if (!key.startsWith("AIza")) {
    // Web API keys issued by Google typically start with AIza
    throw new Error(
      "VITE_FIREBASE_API_KEY looks invalid. Ensure you pasted the Web API key from Firebase Console (starts with AIza)."
    );
  }
})();

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Declare messaging with its type, initially as null
let messaging: Messaging | null = null;

// This function will be called from App.tsx to ensure messaging is initialized
const initializeMessaging = async () => {
  const isMessagingSupported = await isSupported();
  if (isMessagingSupported) {
    messaging = getMessaging(app);
  } else {
    console.log("Firebase Messaging is not supported in this browser.");
  }
  return messaging;
};


export { app, auth, db, storage, messaging, initializeMessaging };