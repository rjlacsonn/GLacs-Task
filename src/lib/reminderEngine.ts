import type { Task } from "../types/task";

const CHECK_INTERVAL_MS = 5000; // every 5 seconds
const TRIGGER_WINDOW_MS = 120000; // 2 minutes

function getNotifiedKey(taskId: string, reminder: string) {
  return `glacs-reminded-${taskId}-${reminder}`;
}

function hasBeenNotified(taskId: string, reminder: string) {
  return localStorage.getItem(getNotifiedKey(taskId, reminder)) === "true";
}

function markAsNotified(taskId: string, reminder: string) {
  localStorage.setItem(getNotifiedKey(taskId, reminder), "true");
}

async function showTaskReminder(task: Task) {
  if (!("Notification" in window)) {
    console.warn("Notifications are not supported in this browser.");
    return;
  }

  if (Notification.permission !== "granted") {
    console.warn("Notification permission is not granted.");
    return;
  }

  const title = "⏰ GLacs Reminder";
  const body = `${task.title}${task.time ? ` • ${task.time}` : ""}`;

  try {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await Promise.race([
          navigator.serviceWorker.ready,
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Service worker not ready.")), 3000)
          ),
        ]);

        await registration.showNotification(title, {
          body,
          icon: "/glacs-icon-192.png",
          badge: "/glacs-icon-192.png",
          tag: `task-reminder-${task.id}`,
        });

        console.log("Reminder shown via service worker:", task.title);
        return;
      } catch (swError) {
        console.warn("Service worker notification failed, using fallback:", swError);
      }
    }

    new Notification(title, {
      body,
      icon: "/glacs-icon-192.png",
    });

    console.log("Reminder shown via Notification fallback:", task.title);
  } catch (error) {
    console.error("Failed to show reminder notification:", error);
  }
}

export function startReminderEngine(tasks: Task[]) {
  console.log("Reminder engine started. Tasks:", tasks);

  const intervalId = window.setInterval(async () => {
    const now = Date.now();

    for (const task of tasks) {
      if (!task.reminder) continue;
      if (task.status === "done") continue;

      const reminderTime = new Date(task.reminder).getTime();
      if (Number.isNaN(reminderTime)) {
        console.warn("Invalid reminder date:", task.reminder, task.title);
        continue;
      }

      const diff = reminderTime - now;

      console.log("Checking reminder:", {
        title: task.title,
        reminder: task.reminder,
        diff,
        alreadyNotified: hasBeenNotified(task.id, task.reminder),
      });

      if (
        diff >= 0 &&
        diff <= TRIGGER_WINDOW_MS &&
        !hasBeenNotified(task.id, task.reminder)
      ) {
        await showTaskReminder(task);
        markAsNotified(task.id, task.reminder);
      }
    }
  }, CHECK_INTERVAL_MS);

  return () => window.clearInterval(intervalId);
}