import { useEffect, useState } from "react";
import type { Priority, Task } from "../types/task";

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

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {editingTask ? "Edit Task" : "Add New Task"}
        </h2>

        {editingTask && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Task Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-black px-4 py-2 text-white hover:opacity-90"
      >
        {editingTask ? "Save Changes" : "Add Task"}
      </button>
    </form>
  );
}