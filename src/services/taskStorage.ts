import { db } from "../db/glacsDB";
import type { Task } from "../types/task";

export async function getAllTasks(): Promise<Task[]> {
  return await db.tasks.toArray();
}

export async function addTaskToDB(task: Task): Promise<void> {
  await db.tasks.add(task);
}

export async function updateTaskInDB(task: Task): Promise<void> {
  await db.tasks.put(task);
}

export async function deleteTaskFromDB(id: string): Promise<void> {
  await db.tasks.delete(id);
}

export async function saveAllTasksToDB(tasks: Task[]): Promise<void> {
  await db.tasks.clear();
  await db.tasks.bulkAdd(tasks);
}