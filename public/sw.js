/* eslint-disable no-restricted-globals */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  console.log("push received", event);

  let data = {
    title: "알림",
    body: "새 알림이 도착했습니다.",
    url: "/",
  };

  if (event.data) {
    try {
      data = event.data.json();
      console.log("push json:", data);
    } catch (e) {
      const text = event.data.text();
      console.log("push text:", text);
      data.body = text;
    }
  }

  event.waitUntil(
    self.registration
      .showNotification(data.title || "알림", {
        body: data.body || "새 알림이 도착했습니다.",
        data: {
          url: data.url || "/",
        },
      })
      .then(() => {
        console.log("showNotification success");
      })
      .catch((err) => {
        console.error("showNotification failed", err);
      }),
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log("notification clicked", event);
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client && client.url.includes(targetUrl)) {
            return client.focus();
          }
        }

        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      }),
  );
});
