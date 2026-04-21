export type Status = "pending" | "done";
export type Priority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  date: string;
  time?: string;
  category: string;
  priority: Priority;
  status: Status;
  reminder?: string | null;
  createdAt: string;
  updatedAt: string;
};