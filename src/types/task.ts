export type Priority = "low" | "medium" | "high";
export type Status = "pending" | "done";

export type Task = {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  priority: Priority;
  category: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
};