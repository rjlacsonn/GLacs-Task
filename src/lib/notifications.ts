export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    throw new Error("This browser does not support notifications.");
  }

  const permission = await Notification.requestPermission();
  return permission;
}

export function getNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}

export async function showTestNotification() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service worker is not supported in this browser.");
  }

  const registration = await navigator.serviceWorker.ready;

  await registration.showNotification("GLacs Reminder", {
    body: "This is a test notification from GLacs.",
    icon: "/glacs-icon-192.png",
    badge: "/glacs-icon-192.png",
    tag: "glacs-test-notification",
  });
}