import { useMemo, useState } from "react";
import type { Task } from "../types/task";
import type { ChatMessage } from "../types/chat";
import { parseChatCommand } from "../lib/chatParser";
import { useTheme } from "../context/ThemeContext";

type ChatPageProps = {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onSetTaskStatus: (id: string, status: "done" | "pending") => void;
};

function getCurrentMonthTasks(tasks: Task[]) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return tasks.filter((task) => {
    const taskDate = new Date(task.date);
    return (
      taskDate.getMonth() === currentMonth &&
      taskDate.getFullYear() === currentYear
    );
  });
}

function formatMonthlyTaskSummary(tasks: Task[]) {
  if (tasks.length === 0) {
    return "You don’t have any tasks for this month yet.";
  }

  const grouped = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const date = task.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  const result = sortedDates
    .map((date) => {
      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });

      const items = grouped[date]
        .sort((a, b) => (a.time || "").localeCompare(b.time || ""))
        .map(
          (task, index) =>
            `${index + 1}. ${task.title}${task.time ? ` — ${task.time}` : ""}`
        )
        .join("\n");

      return `${formattedDate}:\n${items}`;
    })
    .join("\n\n");

  return `Hello! Here are your tasks for this month:\n\n${result}`;
}

function findFreeDaysThisWeek(tasks: Task[]) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const start = new Date(today);
  start.setDate(today.getDate() - dayOfWeek);

  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    weekDates.push(d.toISOString().split("T")[0]);
  }

  const occupiedDates = new Set(tasks.map((task) => task.date));
  const freeDates = weekDates.filter((date) => !occupiedDates.has(date));

  if (freeDates.length === 0) {
    return "You have tasks scheduled every day this week.";
  }

  const formatted = freeDates
    .map((date) =>
      new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    )
    .join(", ");

  return `Here are your free days this week:\n${formatted}`;
}

export default function ChatPage({
  tasks,
  onAddTask,
  onDeleteTask,
  onSetTaskStatus,
}: ChatPageProps) {
  const { theme } = useTheme();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "Hi! I’m GLacs AI. I can help you manage your tasks, schedules, and reminders. Try asking me about your plans today or this month.",
    },
  ]);

  const monthlyTasks = useMemo(() => getCurrentMonthTasks(tasks), [tasks]);

  const handleQuickAction = (type: "month" | "free-days" | "today") => {
    let userText = "";
    let replyText = "";

    if (type === "month") {
      userText = "Show all my tasks this month";
      replyText = formatMonthlyTaskSummary(monthlyTasks);
    }

    if (type === "free-days") {
      userText = "Find my free days this week";
      replyText = findFreeDaysThisWeek(tasks);
    }

    if (type === "today") {
      userText = "Ano gagawin ko today?";
      const result = parseChatCommand(userText, tasks);
      replyText = result.reply;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: userText,
    };

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      text: replyText,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const trimmedInput = input.trim();

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmedInput,
    };

    let reply = "";
    let shouldUseDefaultParser = true;

    const lowerInput = trimmedInput.toLowerCase();

    if (lowerInput.includes("all my task") && lowerInput.includes("month")) {
      reply = formatMonthlyTaskSummary(monthlyTasks);
      shouldUseDefaultParser = false;
    }

    if (lowerInput.includes("free day") || lowerInput.includes("free days")) {
      reply = findFreeDaysThisWeek(tasks);
      shouldUseDefaultParser = false;
    }

    if (shouldUseDefaultParser) {
      const result = parseChatCommand(trimmedInput, tasks);

      if (result.type === "add") {
        onAddTask(result.task);
      }

      if (result.type === "delete") {
        onDeleteTask(result.taskId);
      }

      if (result.type === "toggle-status") {
        onSetTaskStatus(result.taskId, result.newStatus);
      }

      reply = result.reply;
    }

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      text: reply,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
  };

  const heroClass =
    theme === "dark"
      ? "rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 p-6 shadow-xl"
      : "rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-teal-50 to-slate-100 p-6 shadow-sm";

  const panelClass =
    theme === "dark"
      ? "rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-lg"
      : "rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm";

  const mutedTextClass = theme === "dark" ? "text-slate-400" : "text-slate-500";
  const bodyTextClass = theme === "dark" ? "text-slate-300" : "text-slate-600";
  const textClass = theme === "dark" ? "text-white" : "text-slate-900";

  return (
    <div className={`space-y-8 ${textClass}`}>
      {/* Header */}
      <section className={heroClass}>
        <div className="flex items-start gap-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl shadow-lg ${
              theme === "dark"
                ? "border border-teal-300/20 bg-teal-400/10 shadow-teal-500/10"
                : "border border-teal-200 bg-teal-100 shadow-sm"
            }`}
          >
            💬
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold">GLacs AI</h1>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  theme === "dark"
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                Online
              </span>
            </div>

            <p className={`mt-3 max-w-2xl text-sm leading-6 ${bodyTextClass}`}>
              Ask about your schedule, add tasks, remove tasks, mark them done,
              or let GLacs AI summarize your month and free days.
            </p>
          </div>
        </div>
      </section>

      {/* Chat Box */}
      <section className={panelClass}>
        <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex max-w-[88%] items-end gap-3">
                {message.role === "assistant" && (
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
                      theme === "dark"
                        ? "border border-teal-300/20 bg-teal-400/10"
                        : "border border-teal-200 bg-teal-100"
                    }`}
                  >
                    ✨
                  </div>
                )}

                <div
                  className={`whitespace-pre-line rounded-[24px] px-5 py-4 text-sm leading-7 shadow-sm ${
                    message.role === "user"
                      ? "rounded-br-md bg-amber-400 text-slate-950"
                      : theme === "dark"
                      ? "rounded-bl-md border border-white/10 bg-teal-950/60 text-slate-100"
                      : "rounded-bl-md border border-slate-200 bg-slate-50 text-slate-900"
                  }`}
                >
                  {message.text}
                </div>

                {message.role === "user" && (
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
                      theme === "dark"
                        ? "border border-amber-300/20 bg-amber-400/10"
                        : "border border-amber-200 bg-amber-100"
                    }`}
                  >
                    👤
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => handleQuickAction("today")}
            className={`rounded-full px-4 py-2 text-sm transition ${
              theme === "dark"
                ? "border border-teal-400/20 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20"
                : "border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100"
            }`}
          >
            📅 Today
          </button>

          <button
            onClick={() => handleQuickAction("free-days")}
            className={`rounded-full px-4 py-2 text-sm transition ${
              theme === "dark"
                ? "border border-teal-400/20 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20"
                : "border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100"
            }`}
          >
            ✨ Free Days
          </button>

          <button
            onClick={() => handleQuickAction("month")}
            className={`rounded-full px-4 py-2 text-sm transition ${
              theme === "dark"
                ? "border border-teal-400/20 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20"
                : "border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100"
            }`}
          >
            📋 This Month
          </button>
        </div>

        {/* Input */}
        <div
          className={`mt-6 flex items-center gap-3 rounded-[28px] p-3 ${
            theme === "dark"
              ? "border border-white/10 bg-white/5"
              : "border border-slate-200 bg-slate-50"
          }`}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Ask GLacs AI about your tasks..."
            className={`flex-1 bg-transparent px-3 py-3 text-sm outline-none ${
              theme === "dark"
                ? "text-white placeholder:text-slate-500"
                : "text-slate-900 placeholder:text-slate-400"
            }`}
          />

          <button
            onClick={handleSend}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-400 text-slate-950 transition hover:scale-[1.03] hover:bg-teal-300"
          >
            ➤
          </button>
        </div>
      </section>
    </div>
  );
}