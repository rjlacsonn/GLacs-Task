import { LocalNotifications } from "@capacitor/local-notifications";
import type { Task } from "../types/task";

function taskToNotificationId(task: Task) {
  // deterministic numeric id from task id
  let hash = 0;
  for (let i = 0; i < task.id.length; i++) {
    hash = (hash * 31 + task.id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export async function requestNativeNotificationPermission() {
  const check = await LocalNotifications.checkPermissions();

  if (check.display === "granted") {
    return check.display;
  }

  const result = await LocalNotifications.requestPermissions();
  return result.display;
}

export async function scheduleTaskReminder(task: Task) {
  if (!task.reminder) return;
  if (task.status === "done") return;

  const at = new Date(task.reminder);
  if (Number.isNaN(at.getTime())) return;

  // ignore past reminders
  if (at.getTime() <= Date.now()) return;

  const id = taskToNotificationId(task);

  await LocalNotifications.schedule({
    notifications: [
      {
        id,
        title: "⏰ GLacs Reminder",
        body: `${task.title}${task.time ? ` • ${task.time}` : ""}`,
        schedule: { at },
        extra: {
          taskId: task.id,
        },
      },
    ],
  });
}

export async function cancelTaskReminder(task: Task) {
  const id = taskToNotificationId(task);

  await LocalNotifications.cancel({
    notifications: [{ id }],
  });
}

export async function rescheduleTaskReminder(task: Task) {
  await cancelTaskReminder(task);
  await scheduleTaskReminder(task);
}

export async function syncAllTaskReminders(tasks: Task[]) {
  for (const task of tasks) {
    await cancelTaskReminder(task);

    if (task.reminder && task.status !== "done") {
      await scheduleTaskReminder(task);
    }
  }
}