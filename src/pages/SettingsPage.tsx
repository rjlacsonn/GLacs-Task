import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  getNotificationPermission,
  requestNotificationPermission,
  showTestNotification,
} from "../lib/notifications";
import { useTheme } from "../context/ThemeContext";

type SettingsPageProps = {
  userEmail?: string;
};

export default function SettingsPage({ userEmail }: SettingsPageProps) {
  const { theme, setTheme } = useTheme();

  const [permission, setPermission] = useState<string>("default");
  const [isRequesting, setIsRequesting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
    }
  };

  const handleEnableNotifications = async () => {
    setIsRequesting(true);

    try {
      const result = await requestNotificationPermission();
      setPermission(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to request permission.";
      alert(message);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleTestNotification = async () => {
    setIsTesting(true);

    try {
      if (permission !== "granted") {
        alert("Please enable notifications first.");
        return;
      }

      await showTestNotification();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to show notification.";
      alert(message);
    } finally {
      setIsTesting(false);
    }
  };

  const handleThemeChange = (value: "dark" | "light") => {
    setTheme(value);
  };

  const permissionLabel =
    permission === "granted"
      ? "Allowed"
      : permission === "denied"
      ? "Blocked"
      : permission === "unsupported"
      ? "Not supported"
      : "Not yet allowed";

  const sectionClass =
    theme === "dark"
      ? "rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-lg"
      : "rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm";

  const innerCardClass =
    theme === "dark"
      ? "rounded-3xl border border-white/10 bg-white/5 p-5"
      : "rounded-3xl border border-slate-200 bg-slate-50 p-5";

  const mutedTextClass =
    theme === "dark" ? "text-slate-400" : "text-slate-500";

  const bodyTextClass =
    theme === "dark" ? "text-slate-300" : "text-slate-600";

  return (
    <div className={`space-y-8 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
      {/* Header */}
      <section
        className={
          theme === "dark"
            ? "rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 p-6 shadow-xl"
            : "rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-teal-50 to-slate-100 p-6 shadow-sm"
        }
      >
        <div>
          <p className={theme === "dark" ? "text-sm text-teal-300/80" : "text-sm text-teal-700"}>
            Settings
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            App Preferences
          </h1>
          <p className={`mt-3 max-w-2xl text-sm leading-6 ${bodyTextClass}`}>
            Manage your account, notifications, appearance, legal details, and
            other preferences for your GLacs experience.
          </p>
        </div>
      </section>

      {/* Profile + Appearance */}
      <section className="grid gap-6 xl:grid-cols-2">
        <div className={sectionClass}>
          <h2 className="text-2xl font-semibold">Profile</h2>
          <p className={`mt-1 text-sm ${mutedTextClass}`}>
            View your account information.
          </p>

          <div className={`mt-6 ${innerCardClass}`}>
            <p className={`text-xs uppercase tracking-wide ${mutedTextClass}`}>
              Email
            </p>
            <p className="mt-2 text-lg font-medium">
              {userEmail || "Unknown user"}
            </p>

            <div className="mt-5 inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
              Account Active
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-2xl font-semibold">Appearance</h2>
          <p className={`mt-1 text-sm ${mutedTextClass}`}>
            Choose how GLacs looks for you.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => handleThemeChange("dark")}
              className={`rounded-3xl border p-5 text-left transition ${
                theme === "dark"
                  ? "border-teal-300/40 bg-teal-500/10"
                  : theme === "light"
                  ? "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  : "border-white/10 bg-white/5 hover:bg-white/[0.07]"
              }`}
            >
              <p className={`text-sm ${mutedTextClass}`}>Theme</p>
              <h3 className="mt-2 text-lg font-semibold">Dark Mode</h3>
              <p className={`mt-2 text-sm ${bodyTextClass}`}>
                Best for a focused and premium experience.
              </p>
            </button>

            <button
              onClick={() => handleThemeChange("light")}
              className={`rounded-3xl border p-5 text-left transition ${
                theme === "light"
                  ? "border-teal-300/40 bg-teal-500/10"
                  : theme === "dark"
                  ? "border-white/10 bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "border-slate-200 bg-white hover:bg-slate-100"
              }`}
            >
              <p
                className={`text-sm ${
                  theme === "dark"
                    ? "text-slate-400"
                    : mutedTextClass
                }`}
              >
                Theme
              </p>
              <h3 className="mt-2 text-lg font-semibold">Light Mode</h3>
              <p
                className={`mt-2 text-sm ${
                  theme === "dark" ? "text-slate-400" : bodyTextClass
                }`}
              >
                A cleaner bright layout for daytime use.
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className={sectionClass}>
        <h2 className="text-2xl font-semibold">Notifications</h2>
        <p className={`mt-1 text-sm ${mutedTextClass}`}>
          Enable reminders and test browser notifications.
        </p>

        <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className={innerCardClass}>
            <p className={`text-xs uppercase tracking-wide ${mutedTextClass}`}>
              Permission Status
            </p>
            <p className="mt-2 text-xl font-semibold text-teal-300">
              {permissionLabel}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleEnableNotifications}
              disabled={isRequesting}
              className="rounded-2xl bg-teal-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-teal-300 disabled:opacity-50"
            >
              {isRequesting ? "Requesting..." : "Enable Notifications"}
            </button>

            <button
              onClick={handleTestNotification}
              disabled={isTesting}
              className={`rounded-2xl px-5 py-3 transition disabled:opacity-50 ${
                theme === "dark"
                  ? "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  : "border border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100"
              }`}
            >
              {isTesting ? "Sending..." : "Test Notification"}
            </button>
          </div>
        </div>
      </section>

      {/* Help + Legal */}
      <section className="grid gap-6 xl:grid-cols-2">
        <div className={sectionClass}>
          <h2 className="text-2xl font-semibold">Help & Support</h2>
          <p className={`mt-1 text-sm ${mutedTextClass}`}>
            Quick information if you need guidance.
          </p>

          <div className="mt-6 space-y-4">
            <div className={innerCardClass}>
              <h3 className="font-medium">How does GLacs AI work?</h3>
              <p className={`mt-2 text-sm ${mutedTextClass}`}>
                GLacs AI helps you manage your tasks through simple commands,
                summaries, and reminders.
              </p>
            </div>

            <div className={innerCardClass}>
              <h3 className="font-medium">Need help?</h3>
              <p className={`mt-2 text-sm ${mutedTextClass}`}>
                You can add an FAQ page, support email, or contact section here later.
              </p>
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-2xl font-semibold">Legal & Policies</h2>
          <p className={`mt-1 text-sm ${mutedTextClass}`}>
            Important information about privacy and app usage.
          </p>

          <div className="mt-6 space-y-4">
            <div className={innerCardClass}>
              <h3 className="font-medium">Privacy Policy</h3>
              <p className={`mt-2 text-sm ${mutedTextClass}`}>
                Your data is stored securely and used only for your productivity features.
              </p>
            </div>

            <div className={innerCardClass}>
              <h3 className="font-medium">Terms of Use</h3>
              <p className={`mt-2 text-sm ${mutedTextClass}`}>
                GLacs is intended to help users manage tasks, reminders, and schedules responsibly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About + Logout */}
      <section className="grid gap-6 xl:grid-cols-2">
        <div className={sectionClass}>
          <h2 className="text-2xl font-semibold">About GLacs</h2>
          <p className={`mt-1 text-sm ${mutedTextClass}`}>
            App information and purpose.
          </p>

          <div className={`mt-6 ${innerCardClass}`}>
            <p className={`text-sm ${bodyTextClass}`}>
              GLacs is a personal AI productivity app designed to help users
              track tasks, organize schedules, and avoid forgetting important things.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full border border-teal-400/20 bg-teal-500/10 px-3 py-1 text-xs text-teal-300">
                Version 1.0
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  theme === "dark"
                    ? "border border-white/10 bg-white/5 text-slate-300"
                    : "border border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                React + Supabase
              </span>
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-2xl font-semibold">Session</h2>
          <p className={`mt-1 text-sm ${mutedTextClass}`}>
            Manage your current account session.
          </p>

          <div className="mt-6 rounded-3xl border border-rose-400/15 bg-rose-500/10 p-5">
            <h3 className="font-medium">Logout from your account</h3>
            <p className={`mt-2 text-sm ${bodyTextClass}`}>
              You can sign out safely and switch to a different account anytime.
            </p>

            <button
              onClick={handleLogout}
              className="mt-5 rounded-2xl bg-rose-500 px-5 py-3 font-medium text-white transition hover:bg-rose-400"
            >
              Logout
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}