

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envPath = path.resolve(process.cwd(), 'client', '.env.local');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_MEASUREMENT_ID,
};

const configScript = `const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};`;

const outputPath = path.resolve(process.cwd(), 'client', 'public', 'firebase-config.js');
fs.writeFileSync(outputPath, configScript);

console.log('✅ Firebase service worker config generated successfully!');