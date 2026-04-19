import { useMemo, useState } from "react";
import type { Task } from "../types/task";
import { useTheme } from "../context/ThemeContext";

type CalendarPageProps = {
  tasks: Task[];
};

function formatMonthYear(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatFullDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function getPriorityDotClass(priority: string) {
  switch (priority) {
    case "high":
      return "bg-rose-400";
    case "medium":
      return "bg-amber-400";
    case "low":
      return "bg-teal-400";
    default:
      return "bg-slate-400";
  }
}

export default function CalendarPage({ tasks }: CalendarPageProps) {
  const { theme } = useTheme();

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(todayString);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [daysInMonth, firstDay]);

  const tasksForSelectedDate = useMemo(() => {
    return tasks
      .filter((task) => task.date === selectedDate)
      .sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  }, [tasks, selectedDate]);

  const selectedDateStats = useMemo(() => {
    const done = tasksForSelectedDate.filter((task) => task.status === "done").length;
    const pending = tasksForSelectedDate.filter((task) => task.status === "pending").length;
    const total = tasksForSelectedDate.length;
    const rate = total === 0 ? 0 : Math.round((done / total) * 100);

    return { done, pending, total, rate };
  }, [tasksForSelectedDate]);

  const monthLabel = formatMonthYear(new Date(currentYear, currentMonth, 1));

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleGoToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(todayString);
  };

  const getDateString = (day: number) => {
    const month = String(currentMonth + 1).padStart(2, "0");
    const date = String(day).padStart(2, "0");
    return `${currentYear}-${month}-${date}`;
  };

  const hasTaskOnDate = (dateString: string) => {
    return tasks.some((task) => task.date === dateString);
  };

  const getTasksForDate = (dateString: string) => {
    return tasks.filter((task) => task.date === dateString);
  };

  const heroClass =
    theme === "dark"
      ? "rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 p-6 shadow-xl"
      : "rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-teal-50 to-slate-100 p-6 shadow-sm";

  const panelClass =
    theme === "dark"
      ? "rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-lg"
      : "rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm";

  const mutedTextClass = theme === "dark" ? "text-slate-400" : "text-slate-500";
  const bodyTextClass = theme === "dark" ? "text-slate-300" : "text-slate-600";
  const textClass = theme === "dark" ? "text-white" : "text-slate-900";

  return (
    <div className={`space-y-8 ${textClass}`}>
      {/* Header */}
      <section className={heroClass}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className={theme === "dark" ? "text-sm text-teal-300/80" : "text-sm text-teal-700"}>
              Calendar
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              {monthLabel}
            </h1>
            <p className={`mt-3 text-sm ${bodyTextClass}`}>
              Organize your schedule and see tasks by day.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleGoToday}
              className={`rounded-2xl px-5 py-3 text-sm font-medium transition ${
                theme === "dark"
                  ? "border border-teal-400/20 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20"
                  : "border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100"
              }`}
            >
              Today
            </button>

            <button
              onClick={handlePrevMonth}
              className={`rounded-2xl px-5 py-3 text-lg transition ${
                theme === "dark"
                  ? "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              ←
            </button>

            <button
              onClick={handleNextMonth}
              className={`rounded-2xl px-5 py-3 text-lg transition ${
                theme === "dark"
                  ? "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* Calendar Grid + Summary */}
      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.9fr]">
        {/* Calendar Grid */}
        <div className={panelClass}>
          <div className={`grid grid-cols-7 gap-3 text-center text-sm ${mutedTextClass}`}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2 font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-7 gap-3">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="h-20 rounded-2xl" />;
              }

              const dateString = getDateString(day);
              const isSelected = selectedDate === dateString;
              const isToday = dateString === todayString;
              const dateTasks = getTasksForDate(dateString);

              return (
                <button
                  key={dateString}
                  onClick={() => setSelectedDate(dateString)}
                  className={`flex h-20 flex-col items-center justify-center rounded-2xl border transition ${
                    isSelected
                      ? "border-teal-300/40 bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20"
                      : isToday
                      ? theme === "dark"
                        ? "border-teal-400/30 bg-teal-500/10 text-white"
                        : "border-teal-300 bg-teal-50 text-slate-900"
                      : theme === "dark"
                      ? "border-white/10 bg-white/5 text-white hover:bg-white/[0.08]"
                      : "border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-lg font-medium">{day}</span>

                  {hasTaskOnDate(dateString) && (
                    <div className="mt-2 flex items-center gap-1">
                      {dateTasks.slice(0, 3).map((task) => (
                        <span
                          key={task.id}
                          className={`h-1.5 w-1.5 rounded-full ${
                            isSelected
                              ? "bg-slate-950/70"
                              : getPriorityDotClass(task.priority)
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Summary */}
        <div className={panelClass}>
          <p className={theme === "dark" ? "text-sm text-teal-300/80" : "text-sm text-teal-700"}>
            Selected Day
          </p>
          <h2 className="mt-2 text-3xl font-semibold">
            {formatFullDate(selectedDate)}
          </h2>

          <div
            className={`mt-6 rounded-3xl p-5 ${
              theme === "dark"
                ? "border border-white/10 bg-white/5"
                : "border border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm ${mutedTextClass}`}>Tasks</p>
                <p className="mt-2 text-4xl font-semibold">
                  {selectedDateStats.total}
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
                  {selectedDateStats.rate}%
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div
                className={`rounded-2xl p-3 ${
                  theme === "dark" ? "bg-white/5" : "bg-white border border-slate-200"
                }`}
              >
                <p className={`text-xs ${mutedTextClass}`}>Done</p>
                <p className="mt-2 text-xl font-semibold text-emerald-400">
                  {selectedDateStats.done}
                </p>
              </div>

              <div
                className={`rounded-2xl p-3 ${
                  theme === "dark" ? "bg-white/5" : "bg-white border border-slate-200"
                }`}
              >
                <p className={`text-xs ${mutedTextClass}`}>Pending</p>
                <p className="mt-2 text-xl font-semibold text-amber-400">
                  {selectedDateStats.pending}
                </p>
              </div>

              <div
                className={`rounded-2xl p-3 ${
                  theme === "dark" ? "bg-white/5" : "bg-white border border-slate-200"
                }`}
              >
                <p className={`text-xs ${mutedTextClass}`}>Rate</p>
                <p className="mt-2 text-xl font-semibold text-cyan-400">
                  {selectedDateStats.rate}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tasks List */}
      <section className={panelClass}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              Tasks for{" "}
              {new Date(selectedDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </h2>
            <p className={`mt-1 text-sm ${mutedTextClass}`}>
              Your task list for the selected day.
            </p>
          </div>

          <div
            className={`rounded-full px-4 py-2 text-sm ${
              theme === "dark"
                ? "border border-teal-400/20 bg-teal-500/10 text-teal-300"
                : "border border-teal-200 bg-teal-50 text-teal-700"
            }`}
          >
            {selectedDateStats.rate}% complete
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {tasksForSelectedDate.length === 0 ? (
            <div
              className={`rounded-3xl p-6 text-center ${
                theme === "dark"
                  ? "border border-dashed border-white/10 bg-white/5 text-slate-400"
                  : "border border-dashed border-slate-200 bg-slate-50 text-slate-500"
              }`}
            >
              No tasks scheduled for this day.
            </div>
          ) : (
            tasksForSelectedDate.map((task) => (
              <div
                key={task.id}
                className={`rounded-3xl p-4 transition ${
                  theme === "dark"
                    ? "border border-white/10 bg-white/5 hover:bg-white/[0.07]"
                    : "border border-slate-200 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 h-3 w-3 rounded-full ${getPriorityDotClass(
                        task.priority
                      )}`}
                    />

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-lg font-medium ${
                            task.status === "done"
                              ? "text-slate-500 line-through"
                              : textClass
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
      </section>
    </div>
  );
}