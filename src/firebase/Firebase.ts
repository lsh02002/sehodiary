import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: String(process.env.REACT_APP_FIREBASE_API_KEY),
  authDomain: String(process.env.REACT_APP_FIREBASE_AUTH_DOMAIN),
  projectId: String(process.env.REACT_APP_FIREBASE_PROJECT_ID),
  storageBucket: String(process.env.REACT_APP_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: String(process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID),
  appId: String(process.env.REACT_APP_FIREBASE_APP_ID),
};

export const firebase = initializeApp(firebaseConfig);

export async function getFirebaseMessaging() {
  const supported = await isSupported();
  if (!supported) return null;
  return getMessaging(firebase);
}
