import type { Task } from "../types/task";

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Bayad ng bills",
    date: "2026-04-20",
    time: "18:00",
    priority: "high",
    category: "Personal",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Review project notes",
    date: "2026-04-21",
    time: "14:00",
    priority: "medium",
    category: "School",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
  id: "3",
  title: "Check internship emails",
  date: new Date().toISOString().split("T")[0],
  time: "09:00",
  priority: "high",
  category: "Work",
  status: "pending",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  },
];