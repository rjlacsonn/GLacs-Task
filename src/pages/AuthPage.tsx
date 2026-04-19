import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useTheme } from "../context/ThemeContext";

export default function AuthPage() {
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          alert(error.message);
        } else {
          alert("Account created successfully. You can now log in.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          alert(error.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const pageClass =
    theme === "dark"
      ? "min-h-screen bg-slate-950 text-white"
      : "min-h-screen bg-slate-100 text-slate-900";

  const shellClass =
    theme === "dark"
      ? "grid min-h-screen lg:grid-cols-2"
      : "grid min-h-screen lg:grid-cols-2";

  const brandPanelClass =
    theme === "dark"
      ? "relative hidden overflow-hidden border-r border-white/10 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 p-10 lg:flex lg:flex-col lg:justify-between"
      : "relative hidden overflow-hidden border-r border-slate-200 bg-gradient-to-br from-white via-teal-50 to-slate-100 p-10 lg:flex lg:flex-col lg:justify-between";

  const formPanelClass =
    theme === "dark"
      ? "flex items-center justify-center p-6"
      : "flex items-center justify-center p-6";

  const formCardClass =
    theme === "dark"
      ? "w-full max-w-md rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-xl backdrop-blur-sm"
      : "w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm";

  const inputClass =
    theme === "dark"
      ? "w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-teal-400/40"
      : "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-400/40";

  const mutedTextClass = theme === "dark" ? "text-slate-400" : "text-slate-500";
  const bodyTextClass = theme === "dark" ? "text-slate-300" : "text-slate-600";

  return (
    <div className={pageClass}>
      <div className={shellClass}>
        {/* Left Branding Panel */}
        <section className={brandPanelClass}>
          <div>
            <div className="inline-flex items-center rounded-full border border-teal-400/20 bg-teal-500/10 px-4 py-2 text-sm font-medium text-teal-300">
              GLacs AI Productivity App
            </div>

            <h1 className="mt-8 max-w-md text-5xl font-semibold leading-tight tracking-tight">
              Organize your schedule with clarity and ease.
            </h1>

            <p className={`mt-6 max-w-lg text-base leading-7 ${bodyTextClass}`}>
              GLacs helps you manage tasks, keep track of important dates,
              talk to your AI assistant, and stay productive without forgetting
              what matters most.
            </p>

            <div className="mt-10 grid gap-4">
              <div
                className={`rounded-3xl p-5 ${
                  theme === "dark"
                    ? "border border-white/10 bg-white/5"
                    : "border border-slate-200 bg-white/80"
                }`}
              >
                <h3 className="text-lg font-semibold">Smart Task Management</h3>
                <p className={`mt-2 text-sm ${mutedTextClass}`}>
                  Add, edit, and track your tasks with a clean and focused workflow.
                </p>
              </div>

              <div
                className={`rounded-3xl p-5 ${
                  theme === "dark"
                    ? "border border-white/10 bg-white/5"
                    : "border border-slate-200 bg-white/80"
                }`}
              >
                <h3 className="text-lg font-semibold">GLacs AI Assistant</h3>
                <p className={`mt-2 text-sm ${mutedTextClass}`}>
                  Ask about your schedules, find free days, and manage tasks with chat.
                </p>
              </div>

              <div
                className={`rounded-3xl p-5 ${
                  theme === "dark"
                    ? "border border-white/10 bg-white/5"
                    : "border border-slate-200 bg-white/80"
                }`}
              >
                <h3 className="text-lg font-semibold">Cloud Sync</h3>
                <p className={`mt-2 text-sm ${mutedTextClass}`}>
                  Access your personal tasks securely across devices with your account.
                </p>
              </div>
            </div>
          </div>

          <div className={mutedTextClass}>
            <p className="text-sm">
              Stay on track. Stay organized. Stay productive.
            </p>
          </div>
        </section>

        {/* Right Auth Form */}
        <section className={formPanelClass}>
          <div className={formCardClass}>
            <div className="mb-8">
              <p className={theme === "dark" ? "text-sm text-teal-300/80" : "text-sm text-teal-700"}>
                Welcome to GLacs
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                {mode === "login" ? "Login to your account" : "Create your account"}
              </h2>
              <p className={`mt-3 text-sm ${bodyTextClass}`}>
                {mode === "login"
                  ? "Continue managing your tasks, schedule, and reminders."
                  : "Start organizing your life with GLacs AI."}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              <div>
                <label className={`mb-2 block text-sm font-medium ${mutedTextClass}`}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className={`mb-2 block text-sm font-medium ${mutedTextClass}`}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-teal-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-teal-300 disabled:opacity-50"
              >
                {loading
                  ? "Please wait..."
                  : mode === "login"
                  ? "Login"
                  : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() =>
                  setMode((prev) => (prev === "login" ? "signup" : "login"))
                }
                className={theme === "dark" ? "text-sm text-teal-300 hover:underline" : "text-sm text-teal-700 hover:underline"}
              >
                {mode === "login"
                  ? "Don’t have an account yet? Sign up"
                  : "Already have an account? Login"}
              </button>
            </div>

            <div
              className={`mt-8 rounded-2xl p-4 ${
                theme === "dark"
                  ? "border border-white/10 bg-white/5"
                  : "border border-slate-200 bg-slate-50"
              }`}
            >
              <p className={`text-xs uppercase tracking-wide ${mutedTextClass}`}>
                Why GLacs?
              </p>
              <p className={`mt-2 text-sm ${bodyTextClass}`}>
                A personal productivity app that combines task tracking,
                scheduling, AI assistance, and cloud sync in one place.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}