import Dexie, { type Table } from "dexie";
import type { Task } from "../types/task";

class GlacsDatabase extends Dexie {
  tasks!: Table<Task, string>;

  constructor() {
    super("glacsDB");

    this.version(1).stores({
      tasks: "id, title, date, status, category, priority",
    });
  }
}

export const db = new GlacsDatabase();