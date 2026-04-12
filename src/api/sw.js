/* eslint-disable no-restricted-globals */
/* eslint-env serviceworker */

import { firebase } from "firebase/app";

const firebaseConfig = {
  apiKey: String(process.env.REACT_APP_FIREBASE_API_KEY),
  authDomain: String(process.env.REACT_APP_FIREBASE_AUTH_DOMAIN),
  projectId: String(process.env.REACT_APP_FIREBASE_PROJECT_ID),
  storageBucket: String(process.env.REACT_APP_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: String(process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID),
  appId: String(process.env.REACT_APP_FIREBASE_APP_ID),
};

console.log(firebaseConfig);

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[sw] background message received:", payload);

  const title = payload.notification?.title ?? "알림";
  const body = payload.notification?.body ?? "새 알림이 도착했습니다.";
  const data = payload.data ?? {};

  self.registration.showNotification(title, {
    body,
    icon: "/icon-192.png",
    badge: "/badge-72.png",
    data: {
      url: data.url ?? "/",
      ...data,
    },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification?.data?.url ?? "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            if ("navigate" in client) {
              client.navigate(targetUrl);
            }
            return client.focus();
          }
        }
        return self.clients.openWindow(targetUrl);
      }),
  );
});
