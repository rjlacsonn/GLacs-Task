import { useTheme } from "../context/ThemeContext";

type Page = "home" | "tasks" | "calendar" | "chat" | "settings";

type NavbarProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

const navItems: {
  key: Page;
  label: string;
  icon: string;
}[] = [
  { key: "home", label: "Home", icon: "⌂" },
  { key: "tasks", label: "Tasks", icon: "✓" },
  { key: "calendar", label: "Calendar", icon: "🗓" },
  { key: "chat", label: "GLacs AI", icon: "💬" },
  { key: "settings", label: "Settings", icon: "⚙" },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { theme } = useTheme();

  const navShellClass =
    theme === "dark"
      ? "flex w-full max-w-3xl items-center justify-between rounded-[28px] border border-white/10 bg-slate-900/90 px-3 py-3 shadow-2xl backdrop-blur-xl"
      : "flex w-full max-w-3xl items-center justify-between rounded-[28px] border border-slate-200 bg-white/90 px-3 py-3 shadow-lg backdrop-blur-xl";

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4">
      <nav className={navShellClass}>
        {navItems.map((item) => {
          const isActive = currentPage === item.key;
          const isChat = item.key === "chat";

          if (isChat) {
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`-mt-10 flex h-20 w-20 flex-col items-center justify-center rounded-full border text-center transition ${
                  isActive
                    ? "border-teal-300/40 bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20"
                    : theme === "dark"
                    ? "border-white/10 bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="mt-1 text-[11px] font-medium">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex min-w-[64px] flex-1 flex-col items-center justify-center rounded-2xl px-2 py-2 text-center transition ${
                isActive
                  ? "text-teal-500"
                  : theme === "dark"
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span
                className={`text-xl ${
                  isActive ? "drop-shadow-[0_0_8px_rgba(45,212,191,0.35)]" : ""
                }`}
              >
                {item.icon}
              </span>
              <span className="mt-1 text-[11px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}