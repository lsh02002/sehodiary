/* eslint-disable no-restricted-globals */
/* eslint-env serviceworker */

self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: "알림",
      body: event.data?.text?.() || "",
      url: "/",
    };
  }

  event.waitUntil(
    (async () => {
      const clientList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      const hasVisibleClient = clientList.some(
        (client) => client.visibilityState === "visible",
      );

      for (const client of clientList) {
        client.postMessage({
          type: "PUSH_DATA",
          payload: data,
        });
      }

      if (hasVisibleClient) return;

      const tag = data.tag || "default";
      const existing = await self.registration.getNotifications({ tag });
      const prev = existing[0];
      const prevCount = prev?.data?.count || 0;
      const nextCount = prevCount + 1;

      const titleBase = data.title || "알림";
      const title = nextCount > 1 ? `${titleBase} (${nextCount})` : titleBase;

      await self.registration.showNotification(title, {
        body: data.body || data.message || "",
        tag,
        renotify: false,
        requireInteraction: false,
        data: {
          url: data.url || "/",
          count: nextCount,
        },
      });
    })(),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification?.data?.url || "/",
    self.location.origin,
  ).href;

  event.waitUntil(
    (async () => {
      const clientList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of clientList) {
        if ("focus" in client) {
          const clientUrl = new URL(client.url);
          const target = new URL(targetUrl);

          if (
            clientUrl.origin === target.origin &&
            clientUrl.pathname === target.pathname
          ) {
            await client.focus();
            return;
          }
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
    })(),
  );
});
