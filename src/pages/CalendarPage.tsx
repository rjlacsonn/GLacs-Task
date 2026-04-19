import { useMemo, useState } from "react";
import type { Task } from "../types/task";

type CalendarPageProps = {
  tasks: Task[];
};

export default function CalendarPage({ tasks }: CalendarPageProps) {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const tasksForSelectedDate = useMemo(() => {
  return tasks
    .filter((task) => task.date === selectedDate)
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  }, [tasks, selectedDate]);

  const datesWithTasks = useMemo(() => {
    const uniqueDates = Array.from(new Set(tasks.map((task) => task.date)));
    return uniqueDates.sort();
  }, [tasks]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="mt-2 text-gray-600">
          View your tasks by date and check your schedule easily.
        </p>
      </div>

      <div className="rounded-2xl border bg-gray-50 p-4">
        <label className="mb-2 block text-sm font-medium">
          Select a Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded-lg border bg-white px-3 py-2 outline-none focus:ring"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold">
            Tasks for {selectedDate}
          </h2>

          <div className="mt-4 space-y-3">
            {tasksForSelectedDate.length === 0 ? (
              <p className="text-sm text-gray-500">
                No tasks scheduled for this date.
              </p>
            ) : (
              tasksForSelectedDate.map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border bg-gray-50 p-3"
                >
                  <p
                    className={`font-medium ${
                      task.status === "done"
                        ? "line-through text-gray-400"
                        : ""
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {task.category} • {task.time || "No time"} • {task.priority}
                  </p>
                  <p className="mt-1 text-xs uppercase text-gray-400">
                    Status: {task.status}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold">Dates with Tasks</h2>

          <div className="mt-4 space-y-2">
            {datesWithTasks.length === 0 ? (
              <p className="text-sm text-gray-500">
                No scheduled dates yet.
              </p>
            ) : (
              datesWithTasks.map((date) => {
                const count = tasks.filter((task) => task.date === date).length;

                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition hover:bg-gray-50 ${
                      selectedDate === date
                        ? "border-black bg-gray-100"
                        : "bg-white"
                    }`}
                  >
                    <span className="font-medium">{date}</span>
                    <span className="text-sm text-gray-500">
                      {count} task{count > 1 ? "s" : ""}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}