import { useMemo, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import type { Task, Status } from "../types/task";

type TasksPageProps = {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleDone: (id: string) => void;
  onUpdateTask: (task: Task) => void;
};

type FilterStatus = "all" | Status;

export default function TasksPage({
  tasks,
  onAddTask,
  onDeleteTask,
  onToggleDone,
  onUpdateTask,
}: TasksPageProps) {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(tasks.map((task) => task.category))
    );
    return uniqueCategories;
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === "all" ? true : task.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" ? true : task.category === categoryFilter;

      return matchesStatus && matchesCategory;
    });
  }, [tasks, statusFilter, categoryFilter]);

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleUpdateAndClose = (updatedTask: Task) => {
    onUpdateTask(updatedTask);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tasks</h1>
        <p className="mt-2 text-gray-600">
          Add, manage, and track your tasks here.
        </p>
      </div>

      <TaskForm
        onAddTask={onAddTask}
        onUpdateTask={handleUpdateAndClose}
        editingTask={editingTask}
        onCancelEdit={handleCancelEdit}
      />

      <div className="grid gap-4 rounded-2xl border bg-gray-50 p-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Filter by Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
            className="w-full rounded-lg border bg-white px-3 py-2 outline-none focus:ring"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Filter by Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-lg border bg-white px-3 py-2 outline-none focus:ring"
          >
            <option value="all">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-gray-50 p-6 text-center text-gray-500">
            No tasks found for the selected filters.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onToggleDone={onToggleDone}
              onEdit={handleEditClick}
            />
          ))
        )}
      </div>
    </div>
  );
}