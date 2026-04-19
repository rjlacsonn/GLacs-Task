import type { Task } from "../types/task";
import { useTheme } from "../context/ThemeContext";

type HomePageProps = {
  tasks: Task[];
};

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getSmartMessage(
  totalTasks: number,
  pendingTasks: number,
  doneTasks: number
) {
  if (totalTasks === 0) {
    return {
      title: "Amazing! All done 🎉",
      subtitle: "You have no tasks right now. Enjoy your time and stay refreshed.",
    };
  }

  if (pendingTasks === 0 && doneTasks > 0) {
    return {
      title: "Everything is completed ✅",
      subtitle: "You finished all your tasks today. Great job staying productive.",
    };
  }

  if (pendingTasks <= 2) {
    return {
      title: "You’re doing great 💪",
      subtitle: "Only a few tasks left. Keep going, you’re almost done.",
    };
  }

  return {
    title: "Let’s get to work 🚀",
    subtitle: `You still have ${pendingTasks} task${
      pendingTasks > 1 ? "s" : ""
    } waiting today.`,
  };
}

function getTaskProgress(tasksForToday: Task[]) {
  const done = tasksForToday.filter((task) => task.status === "done").length;
  const pending = tasksForToday.filter((task) => task.status === "pending").length;
  const total = tasksForToday.length;

  const completionRate = total === 0 ? 0 : Math.round((done / total) * 100);

  return { done, pending, total, completionRate };
}

export default function HomePage({ tasks }: HomePageProps) {
  const { theme } = useTheme();

  const today = new Date().toISOString().split("T")[0];

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const doneTasks = tasks.filter((task) => task.status === "done").length;

  const todayTasks = tasks.filter((task) => task.date === today);
  const upcomingTasks = tasks
    .filter((task) => task.date >= today && task.status === "pending")
    .slice(0, 5);

  const greeting = getGreeting();
  const smartMessage = getSmartMessage(totalTasks, pendingTasks, doneTasks);
  const todayProgress = getTaskProgress(todayTasks);

  const heroClass =
    theme === "dark"
      ? "overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 p-6 shadow-xl"
      : "overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-teal-50 to-slate-100 p-6 shadow-sm";

  const cardClass =
    theme === "dark"
      ? "rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg"
      : "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm";

  const panelClass =
    theme === "dark"
      ? "rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-lg"
      : "rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm";

  const taskItemClass =
    theme === "dark"
      ? "rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.07]"
      : "rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100";

  const mutedTextClass = theme === "dark" ? "text-slate-400" : "text-slate-500";
  const bodyTextClass = theme === "dark" ? "text-slate-300" : "text-slate-600";
  const titleTextClass = theme === "dark" ? "text-white" : "text-slate-900";

  return (
    <div className={`space-y-8 ${titleTextClass}`}>
      {/* Hero Section */}
      <section className={heroClass}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p
              className={
                theme === "dark" ? "text-sm text-teal-300/80" : "text-sm text-teal-700"
              }
            >
              {greeting}
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              GLacs Dashboard
            </h1>

            <p className={`mt-3 max-w-xl text-sm leading-6 ${bodyTextClass}`}>
              Stay focused on what matters. Track your schedule, manage tasks,
              and let GLacs keep your day organized.
            </p>

            <div
              className={`mt-5 inline-flex items-center rounded-full px-4 py-2 text-sm ${
                theme === "dark"
                  ? "border border-white/10 bg-white/5 text-slate-300"
                  : "border border-slate-200 bg-white text-slate-600"
              }`}
            >
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-teal-400" />
              Today’s date: {today}
            </div>
          </div>

          <div
            className={`min-w-[240px] rounded-3xl p-5 ${
              theme === "dark"
                ? "border border-teal-400/20 bg-white/5 backdrop-blur-sm"
                : "border border-teal-200 bg-white/80 backdrop-blur-sm"
            }`}
          >
            <p className={theme === "dark" ? "text-sm text-teal-200" : "text-sm text-teal-700"}>
              Today’s Status
            </p>
            <h2 className="mt-2 text-2xl font-semibold">{smartMessage.title}</h2>
            <p className={`mt-3 text-sm leading-6 ${bodyTextClass}`}>
              {smartMessage.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Overview Cards */}
      <section>
        <p className={`mb-4 text-xs uppercase tracking-[0.2em] ${mutedTextClass}`}>
          Today&apos;s Overview
        </p>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className={cardClass}>
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${
                theme === "dark" ? "bg-teal-500/15" : "bg-teal-100"
              }`}
            >
              📋
            </div>
            <p className={`text-sm ${mutedTextClass}`}>Total Tasks</p>
            <p className="mt-2 text-3xl font-semibold">{totalTasks}</p>
          </div>

          <div className={cardClass}>
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${
                theme === "dark" ? "bg-emerald-500/15" : "bg-emerald-100"
              }`}
            >
              ✅
            </div>
            <p className={`text-sm ${mutedTextClass}`}>Completed</p>
            <p className="mt-2 text-3xl font-semibold">{doneTasks}</p>
          </div>

          <div className={cardClass}>
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${
                theme === "dark" ? "bg-amber-500/15" : "bg-amber-100"
              }`}
            >
              ⏳
            </div>
            <p className={`text-sm ${mutedTextClass}`}>Pending</p>
            <p className="mt-2 text-3xl font-semibold">{pendingTasks}</p>
          </div>

          <div className={cardClass}>
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${
                theme === "dark" ? "bg-cyan-500/15" : "bg-cyan-100"
              }`}
            >
              📅
            </div>
            <p className={`text-sm ${mutedTextClass}`}>Today</p>
            <p className="mt-2 text-3xl font-semibold">{todayTasks.length}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        {/* Today's Tasks */}
        <div className={panelClass}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Today&apos;s Tasks</h2>
              <p className={`mt-1 text-sm ${mutedTextClass}`}>
                See what you need to finish today.
              </p>
            </div>

            <div
              className={`rounded-2xl px-4 py-3 text-right ${
                theme === "dark"
                  ? "border border-teal-400/20 bg-teal-500/10"
                  : "border border-teal-200 bg-teal-50"
              }`}
            >
              <p
                className={
                  theme === "dark"
                    ? "text-xs uppercase tracking-wide text-teal-200/80"
                    : "text-xs uppercase tracking-wide text-teal-700"
                }
              >
                Completion
              </p>
              <p className="text-2xl font-semibold text-teal-500">
                {todayProgress.completionRate}%
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {todayTasks.length === 0 ? (
              <div
                className={`rounded-3xl p-6 text-center ${
                  theme === "dark"
                    ? "border border-dashed border-white/10 bg-white/5 text-slate-400"
                    : "border border-dashed border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                No tasks scheduled for today.
              </div>
            ) : (
              todayTasks.map((task) => (
                <div key={task.id} className={taskItemClass}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-lg font-medium ${
                            task.status === "done"
                              ? "text-slate-500 line-through"
                              : titleTextClass
                          }`}
                        >
                          {task.title}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            theme === "dark"
                              ? "bg-teal-500/15 text-teal-300"
                              : "bg-teal-100 text-teal-700"
                          }`}
                        >
                          {task.category}
                        </span>
                      </div>

                      <p className={`mt-2 text-sm ${mutedTextClass}`}>
                        {task.time || "No time"} • {task.priority} priority
                      </p>
                    </div>

                    <div
                      className={`rounded-full px-3 py-1 text-xs ${
                        theme === "dark"
                          ? "border border-white/10 bg-slate-800/80 text-slate-300"
                          : "border border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      {task.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className={panelClass}>
          <div>
            <h2 className="text-2xl font-semibold">Upcoming Tasks</h2>
            <p className={`mt-1 text-sm ${mutedTextClass}`}>
              Your next pending tasks from the coming days.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {upcomingTasks.length === 0 ? (
              <div
                className={`rounded-3xl p-6 text-center ${
                  theme === "dark"
                    ? "border border-dashed border-white/10 bg-white/5 text-slate-400"
                    : "border border-dashed border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                No upcoming tasks right now.
              </div>
            ) : (
              upcomingTasks.map((task, index) => (
                <div key={task.id} className={taskItemClass}>
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 h-3 w-3 rounded-full ${
                        index % 3 === 0
                          ? "bg-teal-400"
                          : index % 3 === 1
                          ? "bg-amber-400"
                          : "bg-cyan-400"
                      }`}
                    />

                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      <p className={`mt-1 text-sm ${mutedTextClass}`}>
                        {task.date} • {task.time || "No time"}
                      </p>
                      <p
                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs ${
                          theme === "dark"
                            ? "bg-slate-800 text-slate-300"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {task.category}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}