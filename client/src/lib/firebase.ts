import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, isSupported } from "firebase/messaging";
import { Messaging } from "firebase/messaging"; 

const firebaseConfig = {
  apiKey: "AIzaSyAfgswoA7g4xRIN7KM0Y-stIh7kb7rxtJY",
  authDomain: "grant-e982c.firebaseapp.com",
  projectId: "grant-e982c",
  storageBucket: "grant-e982c.firebasestorage.app",
  messagingSenderId: "800955503496",
  appId: "1:800955503496:web:1674c62b6c2e11edcc203d"
};

// Initialize Firebase App
console.log("Initializing Firebase with config:", firebaseConfig);
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
console.log("Firebase app initialized:", app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
console.log("Firebase services initialized successfully");

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