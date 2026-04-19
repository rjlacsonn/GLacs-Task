import type { Task } from "../types/task";
import { useTheme } from "../context/ThemeContext";

type TaskCardProps = {
  task: Task;
  onDelete: (id: string) => void;
  onToggleDone: (id: string) => void;
  onEdit: (task: Task) => void;
};

function getPriorityStyle(priority: Task["priority"], theme: "dark" | "light") {
  switch (priority) {
    case "high":
      return theme === "dark"
        ? "bg-rose-500/15 text-rose-300 border border-rose-400/20"
        : "bg-rose-100 text-rose-700 border border-rose-200";
    case "medium":
      return theme === "dark"
        ? "bg-amber-500/15 text-amber-300 border border-amber-400/20"
        : "bg-amber-100 text-amber-700 border border-amber-200";
    case "low":
      return theme === "dark"
        ? "bg-teal-500/15 text-teal-300 border border-teal-400/20"
        : "bg-teal-100 text-teal-700 border border-teal-200";
    default:
      return theme === "dark"
        ? "bg-slate-500/15 text-slate-300 border border-slate-400/20"
        : "bg-slate-100 text-slate-700 border border-slate-200";
  }
}

export default function TaskCard({
  task,
  onDelete,
  onToggleDone,
  onEdit,
}: TaskCardProps) {
  const { theme } = useTheme();

  return (
    <div
      className={`rounded-[24px] p-5 transition ${
        theme === "dark"
          ? "border border-white/10 bg-white/5 hover:bg-white/[0.07]"
          : "border border-slate-200 bg-slate-50 hover:bg-slate-100"
      }`}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`text-lg font-semibold ${
                task.status === "done"
                  ? "text-slate-500 line-through"
                  : theme === "dark"
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >
              {task.title}
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityStyle(
                task.priority,
                theme
              )}`}
            >
              {task.priority}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                theme === "dark"
                  ? "border border-teal-400/20 bg-teal-500/10 text-teal-300"
                  : "border border-teal-200 bg-teal-100 text-teal-700"
              }`}
            >
              {task.category}
            </span>
          </div>

          <p className={theme === "dark" ? "text-sm text-slate-400" : "text-sm text-slate-500"}>
            {task.date} • {task.time || "No time"}
          </p>

          <div
            className={`inline-flex rounded-full px-3 py-1 text-xs ${
              theme === "dark"
                ? "border border-white/10 bg-slate-800/80 text-slate-300"
                : "border border-slate-200 bg-white text-slate-600"
            }`}
          >
            Status: {task.status}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onEdit(task)}
            className={`rounded-xl px-4 py-2 text-sm transition ${
              theme === "dark"
                ? "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            Edit
          </button>

          <button
            onClick={() => onToggleDone(task.id)}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400"
          >
            {task.status === "done" ? "Undo" : "Done"}
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-400"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}