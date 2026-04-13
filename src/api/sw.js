/* eslint-disable no-restricted-globals */
/* eslint-env serviceworker */

self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { message: event.data?.text?.() || "" };
  }

  event.waitUntil((async () => {
    const clientList = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });

    for (const client of clientList) {
      client.postMessage({
        type: "PUSH_DATA",
        payload: data,
      });
    }

    // 알림 띄우고 싶지 않으면 showNotification 호출 안 함
  })());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(event.notification?.data?.url || "/", self.location.origin).href;

  event.waitUntil((async () => {
    const clientList = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });

    for (const client of clientList) {
      if (client.url === targetUrl && "focus" in client) {
        await client.focus();
        return;
      }
    }

    for (const client of clientList) {
      if ("focus" in client) {
        try {
          if ("navigate" in client) {
            await client.navigate(targetUrl);
          }
        } catch (err) {
          console.error("Failed to navigate client:", err);
        }

        await client.focus();
        return;
      }
    }

    if ("openWindow" in self.clients) {
      await self.clients.openWindow(targetUrl);
    }
  })());
});