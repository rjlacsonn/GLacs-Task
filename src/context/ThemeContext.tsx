import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("glacs-theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("glacs-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (newTheme: Theme) => setThemeState(newTheme),
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}