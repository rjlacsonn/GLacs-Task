import type { Task } from "../types/task";

type HomePageProps = {
  tasks: Task[];
};

export default function HomePage({ tasks }: HomePageProps) {
  const today = new Date().toISOString().split("T")[0];

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const doneTasks = tasks.filter((task) => task.status === "done").length;
  const todayTasks = tasks.filter((task) => task.date === today);
  const upcomingTasks = tasks
    .filter((task) => task.date >= today && task.status === "pending")
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-3xl font-bold">GLacs</h1>
      <p className="mt-2 text-gray-600">
        Your personal AI productivity app that helps you manage tasks,
        schedules, and reminders.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-gray-50 p-4">
          <h2 className="text-sm font-medium text-gray-500">Total Tasks</h2>
          <p className="mt-2 text-3xl font-bold">{totalTasks}</p>
        </div>

        <div className="rounded-2xl border bg-gray-50 p-4">
          <h2 className="text-sm font-medium text-gray-500">Pending</h2>
          <p className="mt-2 text-3xl font-bold">{pendingTasks}</p>
        </div>

        <div className="rounded-2xl border bg-gray-50 p-4">
          <h2 className="text-sm font-medium text-gray-500">Done</h2>
          <p className="mt-2 text-3xl font-bold">{doneTasks}</p>
        </div>

        <div className="rounded-2xl border bg-gray-50 p-4">
          <h2 className="text-sm font-medium text-gray-500">Today</h2>
          <p className="mt-2 text-3xl font-bold">{todayTasks.length}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold">Today's Tasks</h2>

          <div className="mt-4 space-y-3">
            {todayTasks.length === 0 ? (
              <p className="text-sm text-gray-500">No tasks for today.</p>
            ) : (
              todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border bg-gray-50 p-3"
                >
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-500">
                    {task.category} • {task.time || "No time"} • {task.priority}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold">Upcoming Tasks</h2>

          <div className="mt-4 space-y-3">
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-gray-500">No upcoming tasks.</p>
            ) : (
              upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border bg-gray-50 p-3"
                >
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-500">
                    {task.date} • {task.time || "No time"} • {task.category}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}