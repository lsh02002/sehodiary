import { api } from "../../api/sehodiary-api";

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service Worker 미지원 브라우저");
  }

  const registration = await navigator.serviceWorker.register("/sw.js");
  return registration;
}

export function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export async function subscribePush() {
  const storedUserId = localStorage.getItem("userId");

  const userId =
    storedUserId && !isNaN(Number(storedUserId)) ? Number(storedUserId) : null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("알림 권한이 허용되지 않았습니다.");
  }

  const registration = await navigator.serviceWorker.ready;

  const keyResponse = await api.get("/api/push/public-key");
  const { publicKey } = await keyResponse.data;

  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }

  await api.post("/api/push/subscribe", {
    body: JSON.stringify({
      userId,
      endpoint: subscription.endpoint,
      keys: subscription.toJSON().keys,
    }),
    headers: { "Content-Type": "application/json" },
  });

  return subscription;
}
