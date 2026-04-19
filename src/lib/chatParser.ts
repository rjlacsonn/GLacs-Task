import type { Task } from "../types/task";
import { getTodayDate, getTomorrowDate } from "./dateUtils";

type ParserResult =
  | {
      type: "add";
      task: Task;
      reply: string;
    }
  | {
      type: "delete";
      taskId: string;
      reply: string;
    }
  | {
      type: "toggle-status";
      taskId: string;
      newStatus: "done" | "pending";
      reply: string;
    }
  | {
      type: "query";
      reply: string;
    }
  | {
      type: "unknown";
      reply: string;
    };

function normalizeText(text: string) {
  return text.toLowerCase().trim();
}

function findTaskByTitle(tasks: Task[], searchText: string) {
  const normalizedSearch = normalizeText(searchText);

  return tasks.find((task) =>
    normalizeText(task.title).includes(normalizedSearch)
  );
}

export function parseChatCommand(message: string, tasks: Task[]): ParserResult {
  const lowerMessage = normalizeText(message);

  // ADD TASK
  if (lowerMessage.startsWith("add task") || lowerMessage.startsWith("add")) {
    let title = message.replace(/add task/i, "").replace(/add/i, "").trim();

    let date = "";
    let cleanTitle = title;

    if (lowerMessage.includes("bukas") || lowerMessage.includes("tomorrow")) {
      date = getTomorrowDate();
      cleanTitle = cleanTitle
        .replace(/bukas/i, "")
        .replace(/tomorrow/i, "")
        .trim();
    } else if (
      lowerMessage.includes("today") ||
      lowerMessage.includes("ngayon")
    ) {
      date = getTodayDate();
      cleanTitle = cleanTitle
        .replace(/today/i, "")
        .replace(/ngayon/i, "")
        .trim();
    }

    if (!cleanTitle) {
      return {
        type: "unknown",
        reply: "Please tell me the task title clearly.",
      };
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: cleanTitle,
      date: date || getTomorrowDate(),
      time: "",
      category: "General",
      priority: "medium",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      type: "add",
      task: newTask,
      reply: `Okay, I added "${cleanTitle}" on ${newTask.date}.`,
    };
  }

  // QUERY TODAY TASKS
  if (
    lowerMessage.includes("ano gagawin ko today") ||
    lowerMessage.includes("ano gagawin ko ngayon") ||
    lowerMessage.includes("what are my tasks today") ||
    lowerMessage.includes("my tasks today") ||
    lowerMessage.includes("schedule today")
  ) {
    const today = getTodayDate();
    const todayTasks = tasks.filter((task) => task.date === today);

    if (todayTasks.length === 0) {
      return {
        type: "query",
        reply: "You have no tasks scheduled for today.",
      };
    }

    const taskList = todayTasks
      .map((task) => `• ${task.title}${task.time ? ` at ${task.time}` : ""}`)
      .join("\n");

    return {
      type: "query",
      reply: `Here are your tasks for today:\n${taskList}`,
    };
  }

  // QUERY TOMORROW TASKS
  if (
    lowerMessage.includes("ano gagawin ko bukas") ||
    lowerMessage.includes("what are my tasks tomorrow") ||
    lowerMessage.includes("my tasks tomorrow") ||
    lowerMessage.includes("schedule tomorrow")
  ) {
    const tomorrow = getTomorrowDate();
    const tomorrowTasks = tasks.filter((task) => task.date === tomorrow);

    if (tomorrowTasks.length === 0) {
      return {
        type: "query",
        reply: "You have no tasks scheduled for tomorrow.",
      };
    }

    const taskList = tomorrowTasks
      .map((task) => `• ${task.title}${task.time ? ` at ${task.time}` : ""}`)
      .join("\n");

    return {
      type: "query",
      reply: `Here are your tasks for tomorrow:\n${taskList}`,
    };
  }

  // DELETE TASK
  if (
    lowerMessage.startsWith("delete task") ||
    lowerMessage.startsWith("delete") ||
    lowerMessage.startsWith("burahin mo") ||
    lowerMessage.startsWith("burahin")
  ) {
    const searchText = message
      .replace(/delete task/i, "")
      .replace(/delete/i, "")
      .replace(/burahin mo/i, "")
      .replace(/burahin/i, "")
      .trim();

    if (!searchText) {
      return {
        type: "unknown",
        reply: "Please tell me which task you want to delete.",
      };
    }

    const matchedTask = findTaskByTitle(tasks, searchText);

    if (!matchedTask) {
      return {
        type: "unknown",
        reply: `I couldn't find a task matching "${searchText}".`,
      };
    }

    return {
      type: "delete",
      taskId: matchedTask.id,
      reply: `Okay, I deleted "${matchedTask.title}".`,
    };
  }

  // MARK DONE
  if (
    lowerMessage.startsWith("mark done") ||
    lowerMessage.startsWith("done") ||
    lowerMessage.startsWith("complete") ||
    lowerMessage.startsWith("mark as done")
  ) {
    const searchText = message
      .replace(/mark as done/i, "")
      .replace(/mark done/i, "")
      .replace(/done/i, "")
      .replace(/complete/i, "")
      .trim();

    if (!searchText) {
      return {
        type: "unknown",
        reply: "Please tell me which task you want to mark as done.",
      };
    }

    const matchedTask = findTaskByTitle(tasks, searchText);

    if (!matchedTask) {
      return {
        type: "unknown",
        reply: `I couldn't find a task matching "${searchText}".`,
      };
    }

    return {
      type: "toggle-status",
      taskId: matchedTask.id,
      newStatus: "done",
      reply: `Okay, I marked "${matchedTask.title}" as done.`,
    };
  }

  // MARK PENDING / UNDO
  if (
    lowerMessage.startsWith("mark pending") ||
    lowerMessage.startsWith("pending") ||
    lowerMessage.startsWith("undo")
  ) {
    const searchText = message
      .replace(/mark pending/i, "")
      .replace(/pending/i, "")
      .replace(/undo/i, "")
      .trim();

    if (!searchText) {
      return {
        type: "unknown",
        reply: "Please tell me which task you want to mark as pending.",
      };
    }

    const matchedTask = findTaskByTitle(tasks, searchText);

    if (!matchedTask) {
      return {
        type: "unknown",
        reply: `I couldn't find a task matching "${searchText}".`,
      };
    }

    return {
      type: "toggle-status",
      taskId: matchedTask.id,
      newStatus: "pending",
      reply: `Okay, I marked "${matchedTask.title}" as pending again.`,
    };
  }

  return {
    type: "unknown",
    reply:
      'Sorry, I only understand simple commands for now. Try: "Add task bukas bayad ng bills", "Ano gagawin ko bukas?", "Delete task bayad ng bills", or "Mark done bayad ng bills".',
  };
}