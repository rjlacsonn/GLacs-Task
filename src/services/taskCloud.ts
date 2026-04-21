import { supabase } from "../lib/supabase";
import type { Task } from "../types/task";

export async function getUserTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((task) => ({
    id: task.id,
    title: task.title,
    date: task.date,
    time: task.time ?? "",
    category: task.category,
    priority: task.priority,
    status: task.status,
    reminder: task.reminder ?? null,
    createdAt: task.created_at,
    updatedAt: task.updated_at,
  }));
}

export async function addTaskToCloud(task: Task, userId: string) {
  const { error } = await supabase.from("tasks").insert([
    {
      user_id: userId,
      title: task.title,
      date: task.date,
      time: task.time ?? "",
      category: task.category,
      priority: task.priority,
      status: task.status,
      reminder: task.reminder ?? null,
    },
  ]);

  if (error) throw error;
}

export async function updateTaskInCloud(task: Task) {
  const { error } = await supabase
    .from("tasks")
    .update({
      title: task.title,
      date: task.date,
      time: task.time ?? "",
      category: task.category,
      priority: task.priority,
      status: task.status,
      reminder: task.reminder ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", task.id);

  if (error) throw error;
}

export async function deleteTaskFromCloud(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) throw error;
}