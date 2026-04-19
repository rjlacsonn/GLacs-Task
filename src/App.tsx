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
import {
  getUserTasks,
  addTaskToCloud,
  updateTaskInCloud,
  deleteTaskFromCloud,
} from "./services/taskCloud";

type Page = "home" | "tasks" | "calendar" | "chat" | "settings";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // Check auth session on app load and listen for auth changes
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

  // Load tasks from Supabase for the logged-in user
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
        setTasks(data);
      } catch (error) {
        console.error("Failed to load cloud tasks:", error);
      } finally {
        setIsLoadingTasks(false);
      }
    };

    loadTasks();
  }, [session, authChecked]);

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

  const handleSetTaskStatus = async (id: string, status: "done" | "pending") => {
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
        return <SettingsPage userEmail={session.user.email} />;
      default:
        return <HomePage tasks={tasks} />;
    }
  };

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-700">
        Checking session...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <AuthPage />
      </div>
    );
  }

  if (isLoadingTasks) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-700">
        Loading your tasks...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}