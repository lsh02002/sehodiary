import { getToken, onMessage } from 'firebase/messaging';
import { getFirebaseMessaging } from '../firebase/Firebase';

const VAPID_KEY = process.env.FIREBASE_VAPID_KEY;

export async function requestFcmToken() {
  const messaging = await getFirebaseMessaging();
  if (!messaging) {
    console.log('This browser does not support Firebase Messaging');
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.log('Notification permission denied');
    return null;
  }

  const registration = await navigator.serviceWorker.register('/public/sw.js');

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  if (!token) {
    console.log('No registration token available');
    return null;
  }

  return token;
}

export async function listenForegroundMessage() {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log('foreground message:', payload);

    // 여기서 toast 띄우거나 상태 업데이트
  });
}