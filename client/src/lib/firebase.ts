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