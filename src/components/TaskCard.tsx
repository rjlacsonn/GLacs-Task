import type { Task } from "../types/task";

type TaskCardProps = {
  task: Task;
  onDelete: (id: string) => void;
  onToggleDone: (id: string) => void;
  onEdit: (task: Task) => void;
};

function getPriorityStyle(priority: Task["priority"]) {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function TaskCard({
  task,
  onDelete,
  onToggleDone,
  onEdit,
}: TaskCardProps) {
  return (
    <div className="rounded-2xl border bg-gray-50 p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`text-lg font-semibold ${
                task.status === "done" ? "line-through text-gray-400" : ""
              }`}
            >
              {task.title}
            </h3>

            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityStyle(
                task.priority
              )}`}
            >
              {task.priority}
            </span>

            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
              {task.category}
            </span>
          </div>

          <p className="text-sm text-gray-600">
            {task.date} • {task.time || "No time"}
          </p>

          <p className="text-xs uppercase tracking-wide text-gray-500">
            Status: {task.status}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onEdit(task)}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-white"
          >
            Edit
          </button>

          <button
            onClick={() => onToggleDone(task.id)}
            className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:opacity-90"
          >
            {task.status === "done" ? "Undo" : "Done"}
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}