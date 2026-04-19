import { useMemo, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import type { Task, Status } from "../types/task";
import { useTheme } from "../context/ThemeContext";

type TasksPageProps = {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleDone: (id: string) => void;
  onUpdateTask: (task: Task) => void;
};

type FilterStatus = "all" | Status;

function getTaskStats(tasks: Task[]) {
  const total = tasks.length;
  const done = tasks.filter((task) => task.status === "done").length;
  const pending = tasks.filter((task) => task.status === "pending").length;
  const highPriority = tasks.filter((task) => task.priority === "high").length;

  return { total, done, pending, highPriority };
}

export default function TasksPage({
  tasks,
  onAddTask,
  onDeleteTask,
  onToggleDone,
  onUpdateTask,
}: TasksPageProps) {
  const { theme } = useTheme();

  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const stats = useMemo(() => getTaskStats(tasks), [tasks]);

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

  const heroClass =
    theme === "dark"
      ? "rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 p-6 shadow-xl"
      : "rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-teal-50 to-slate-100 p-6 shadow-sm";

  const panelClass =
    theme === "dark"
      ? "rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-lg"
      : "rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm";

  const statCardClass =
    theme === "dark"
      ? "rounded-2xl border border-white/10 bg-white/5 p-4"
      : "rounded-2xl border border-slate-200 bg-white p-4";

  const selectClass =
    theme === "dark"
      ? "w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-teal-400/40"
      : "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-teal-400/40";

  const mutedTextClass = theme === "dark" ? "text-slate-400" : "text-slate-500";
  const bodyTextClass = theme === "dark" ? "text-slate-300" : "text-slate-600";

  return (
    <div className={theme === "dark" ? "space-y-8 text-white" : "space-y-8 text-slate-900"}>
      {/* Header */}
      <section className={heroClass}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className={theme === "dark" ? "text-sm text-teal-300/80" : "text-sm text-teal-700"}>
              Tasks
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              Manage Your Work
            </h1>
            <p className={`mt-3 text-sm leading-6 ${bodyTextClass}`}>
              Add, organize, edit, and complete your tasks in one clean space.
              Keep your daily workflow simple and focused.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
            <div className={statCardClass}>
              <p className={`text-xs uppercase tracking-wide ${mutedTextClass}`}>
                Total
              </p>
              <p className="mt-2 text-2xl font-semibold">{stats.total}</p>
            </div>

            <div className={statCardClass}>
              <p className={`text-xs uppercase tracking-wide ${mutedTextClass}`}>
                Done
              </p>
              <p className="mt-2 text-2xl font-semibold text-emerald-400">
                {stats.done}
              </p>
            </div>

            <div className={statCardClass}>
              <p className={`text-xs uppercase tracking-wide ${mutedTextClass}`}>
                Pending
              </p>
              <p className="mt-2 text-2xl font-semibold text-amber-400">
                {stats.pending}
              </p>
            </div>

            <div className={statCardClass}>
              <p className={`text-xs uppercase tracking-wide ${mutedTextClass}`}>
                High Priority
              </p>
              <p className="mt-2 text-2xl font-semibold text-rose-400">
                {stats.highPriority}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form + Filters */}
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className={panelClass}>
          <div className="mb-5">
            <h2 className="text-2xl font-semibold">
              {editingTask ? "Edit Task" : "Create a Task"}
            </h2>
            <p className={`mt-1 text-sm ${mutedTextClass}`}>
              Fill in the task details and keep your schedule updated.
            </p>
          </div>

          <TaskForm
            onAddTask={onAddTask}
            onUpdateTask={handleUpdateAndClose}
            editingTask={editingTask}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        <div className={panelClass}>
          <div className="mb-5">
            <h2 className="text-2xl font-semibold">Filter Tasks</h2>
            <p className={`mt-1 text-sm ${mutedTextClass}`}>
              Narrow down your task list by status or category.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className={`mb-2 block text-sm font-medium ${bodyTextClass}`}>
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className={selectClass}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className={`mb-2 block text-sm font-medium ${bodyTextClass}`}>
                Filter by Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={selectClass}
              >
                <option value="all">All</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div
              className={`rounded-2xl p-4 ${
                theme === "dark"
                  ? "border border-teal-400/15 bg-teal-500/10"
                  : "border border-teal-200 bg-teal-50"
              }`}
            >
              <p
                className={
                  theme === "dark"
                    ? "text-xs uppercase tracking-wide text-teal-200/80"
                    : "text-xs uppercase tracking-wide text-teal-700"
                }
              >
                Results
              </p>
              <p className="mt-2 text-2xl font-semibold text-teal-500">
                {filteredTasks.length}
              </p>
              <p className={`mt-1 text-sm ${bodyTextClass}`}>
                task{filteredTasks.length !== 1 ? "s" : ""} matched
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Task List */}
      <section className={panelClass}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Your Task List</h2>
            <p className={`mt-1 text-sm ${mutedTextClass}`}>
              View all tasks that match your current filters.
            </p>
          </div>

          <div
            className={`rounded-full px-4 py-2 text-sm ${
              theme === "dark"
                ? "border border-teal-400/20 bg-teal-500/10 text-teal-300"
                : "border border-teal-200 bg-teal-50 text-teal-700"
            }`}
          >
            {filteredTasks.length} active result
            {filteredTasks.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {filteredTasks.length === 0 ? (
            <div
              className={`rounded-3xl p-8 text-center ${
                theme === "dark"
                  ? "border border-dashed border-white/10 bg-white/5 text-slate-400"
                  : "border border-dashed border-slate-200 bg-slate-50 text-slate-500"
              }`}
            >
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
      </section>
    </div>
  );
}