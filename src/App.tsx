import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import TasksPage from "./pages/TasksPage";
import CalendarPage from "./pages/CalendarPage";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";
import { mockTasks } from "./data/mockTasks";
import type { Task } from "./types/task";
import {
  addTaskToDB,
  deleteTaskFromDB,
  getAllTasks,
  saveAllTasksToDB,
  updateTaskInDB,
} from "./services/taskStorage";

type Page = "home" | "tasks" | "calendar" | "chat" | "settings";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await getAllTasks();

        if (savedTasks.length > 0) {
          setTasks(savedTasks);
        } else {
          setTasks(mockTasks);
          await saveAllTasksToDB(mockTasks);
        }
      } catch (error) {
        console.error("Failed to load tasks from IndexedDB:", error);
        setTasks(mockTasks);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleAddTask = async (newTask: Task) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);

    try {
      await addTaskToDB(newTask);
    } catch (error) {
      console.error("Failed to add task to DB:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

    try {
      await deleteTaskFromDB(id);
    } catch (error) {
      console.error("Failed to delete task from DB:", error);
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

    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? updatedTask : task))
    );

    try {
      await updateTaskInDB(updatedTask);
    } catch (error) {
      console.error("Failed to update task in DB:", error);
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

    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? updatedTask : task))
    );

    try {
      await updateTaskInDB(updatedTask);
    } catch (error) {
      console.error("Failed to set task status in DB:", error);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );

    try {
      await updateTaskInDB(updatedTask);
    } catch (error) {
      console.error("Failed to update task in DB:", error);
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
        return <SettingsPage />;
      default:
        return <HomePage tasks={tasks} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-700">
        Loading GLacs...
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