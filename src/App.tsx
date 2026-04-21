import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import TasksPage from "./pages/TasksPage";
import CalendarPage from "./pages/CalendarPage";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import type { Task } from "./types/task";
import { supabase } from "./lib/supabase";
import { useTheme } from "./context/ThemeContext";
import { startReminderEngine } from "./lib/reminderEngine";
import { syncAllTaskReminders } from "./lib/nativeNotifications";
import {
  getUserTasks,
  addTaskToCloud,
  updateTaskInCloud,
  deleteTaskFromCloud,
} from "./services/taskCloud";

type Page = "home" | "tasks" | "calendar" | "chat" | "settings";

export default function App() {
  const { theme } = useTheme();

  const [session, setSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setAuthChecked(true);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthChecked(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!authChecked) return;

    if (!session) {
      setTasks([]);
      setIsLoadingTasks(false);
      return;
    }

    const loadTasks = async () => {
      setIsLoadingTasks(true);

      try {
        const data = await getUserTasks(session.user.id);
        console.log("Loaded tasks from cloud:", data);
        setTasks(data);
      } catch (error) {
        console.error("Failed to load cloud tasks:", error);
      } finally {
        setIsLoadingTasks(false);
      }
    };

    loadTasks();
  }, [session, authChecked]);

  useEffect(() => {
    if (!session) return;
    if (tasks.length === 0) return;
    void syncAllTaskReminders(tasks);
    const stopReminderEngine = startReminderEngine(tasks);

    return () => {
      stopReminderEngine();
    };
  }, [tasks, session]);

  const handleAddTask = async (newTask: Task) => {
    if (!session) return;

    try {
      await addTaskToCloud(newTask, session.user.id);

      const refreshedTasks = await getUserTasks(session.user.id);
      setTasks(refreshedTasks);
    } catch (error) {
      console.error("Failed to add task to cloud:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!session) return;

    try {
      await deleteTaskFromCloud(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task from cloud:", error);
    }
  };

  const handleToggleDone = async (id: string) => {
    const targetTask = tasks.find((task) => task.id === id);
    if (!targetTask) return;

    const updatedTask: Task = {
      ...targetTask,
      status: targetTask.status === "done" ? "pending" : "done",
      updatedAt: new Date().toISOString(),
    };

    try {
      await updateTaskInCloud(updatedTask);

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Failed to update task status in cloud:", error);
    }
  };

  const handleSetTaskStatus = async (
    id: string,
    status: "done" | "pending"
  ) => {
    const targetTask = tasks.find((task) => task.id === id);
    if (!targetTask) return;

    const updatedTask: Task = {
      ...targetTask,
      status,
      updatedAt: new Date().toISOString(),
    };

    try {
      await updateTaskInCloud(updatedTask);

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Failed to set task status in cloud:", error);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await updateTaskInCloud(updatedTask);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error("Failed to update task in cloud:", error);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage tasks={tasks} />;
      case "tasks":
        return (
          <TasksPage
            tasks={tasks}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onToggleDone={handleToggleDone}
            onUpdateTask={handleUpdateTask}
          />
        );
      case "calendar":
        return <CalendarPage tasks={tasks} />;
      case "chat":
        return (
          <ChatPage
            tasks={tasks}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onSetTaskStatus={handleSetTaskStatus}
          />
        );
      case "settings":
        return <SettingsPage userEmail={session?.user?.email ?? ""} />;
      default:
        return <HomePage tasks={tasks} />;
    }
  };

  if (!authChecked) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${
          theme === "dark"
            ? "bg-slate-950 text-slate-200"
            : "bg-slate-100 text-slate-900"
        }`}
      >
        Checking session...
      </div>
    );
  }

  if (!session) {
    return (
      <div
        className={`min-h-screen p-6 ${
          theme === "dark"
            ? "bg-slate-950 text-white"
            : "bg-slate-100 text-slate-900"
        }`}
      >
        <AuthPage />
      </div>
    );
  }

  if (isLoadingTasks) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${
          theme === "dark"
            ? "bg-slate-950 text-slate-200"
            : "bg-slate-100 text-slate-900"
        }`}
      >
        Loading your tasks...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-slate-950 text-white"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="mx-auto max-w-6xl px-4 py-8 pb-32">
        <div
          className={`rounded-[32px] p-6 shadow-none backdrop-blur-sm ${
            theme === "dark"
              ? "border border-white/10 bg-slate-950/80"
              : "border border-slate-200 bg-white"
          }`}
        >
          {renderPage()}
        </div>
      </main>
    </div>
  );
}