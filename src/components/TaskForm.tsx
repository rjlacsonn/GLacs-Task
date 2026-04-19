import { useEffect, useState } from "react";
import type { Priority, Task } from "../types/task";
import { useTheme } from "../context/ThemeContext";

type TaskFormProps = {
  onAddTask: (task: Task) => void;
  onUpdateTask?: (task: Task) => void;
  editingTask?: Task | null;
  onCancelEdit?: () => void;
};

const categoryOptions = ["General", "School", "Personal", "Work", "Health"];

export default function TaskForm({
  onAddTask,
  onUpdateTask,
  editingTask,
  onCancelEdit,
}: TaskFormProps) {
  const { theme } = useTheme();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState<Priority>("medium");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDate(editingTask.date);
      setTime(editingTask.time || "");
      setCategory(editingTask.category || "General");
      setPriority(editingTask.priority);
    } else {
      setTitle("");
      setDate("");
      setTime("");
      setCategory("General");
      setPriority("medium");
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !date) {
      alert("Please enter a task title and date.");
      return;
    }

    if (editingTask && onUpdateTask) {
      const updatedTask: Task = {
        ...editingTask,
        title: title.trim(),
        date,
        time,
        category,
        priority,
        updatedAt: new Date().toISOString(),
      };

      onUpdateTask(updatedTask);
      return;
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      date,
      time,
      category,
      priority,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddTask(newTask);

    setTitle("");
    setDate("");
    setTime("");
    setCategory("General");
    setPriority("medium");
  };

  const inputClass =
    theme === "dark"
      ? "w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-teal-400/40"
      : "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-400/40";

  const mutedTextClass = theme === "dark" ? "text-slate-300" : "text-slate-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className={theme === "dark" ? "text-lg font-semibold text-white" : "text-lg font-semibold text-slate-900"}>
          {editingTask ? "Update Task Details" : "Task Details"}
        </h2>

        {editingTask && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className={`rounded-xl px-3 py-2 text-sm transition ${
              theme === "dark"
                ? "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            Cancel
          </button>
        )}
      </div>

      <div>
        <label className={`mb-2 block text-sm font-medium ${mutedTextClass}`}>
          Task Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={`mb-2 block text-sm font-medium ${mutedTextClass}`}>
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={`mb-2 block text-sm font-medium ${mutedTextClass}`}>
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={`mb-2 block text-sm font-medium ${mutedTextClass}`}>
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`mb-2 block text-sm font-medium ${mutedTextClass}`}>
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className={inputClass}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-teal-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-teal-300"
      >
        {editingTask ? "Save Changes" : "Add Task"}
      </button>
    </form>
  );
}