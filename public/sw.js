/* eslint-disable no-restricted-globals */
/* eslint-env serviceworker */

import { app, firebaseConfig } from "../src/firebase/Firebase";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Firebase compat SDK 로드
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

if (!app.length) {
  app.initializeApp(firebaseConfig);
}

const messaging = app.messaging();

// 백그라운드 메시지 처리
messaging.onBackgroundMessage((payload) => {
  console.log("[sw] background message received:", payload);

  const title = payload.notification?.title ?? "알림";
  const body = payload.notification?.body ?? "새 알림이 도착했습니다.";
  const data = payload.data ?? {};

  const options = {
    body,
    icon: "/icon-192.png",
    badge: "/badge-72.png",
    data: {
      url: data.url ?? "/",
      ...data,
    },
    tag: data.tag ?? "default",
    renotify: false,
  };

  self.registration.showNotification(title, options);
});

// 클릭 처리 단일화
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url ?? "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate?.(targetUrl);
          return client.focus();
        }
      }

      return self.clients.openWindow?.(targetUrl);
    })
  );
});