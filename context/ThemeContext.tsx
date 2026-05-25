"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Theme = "dark" | "light";
export type LayoutMode = "default" | "compact";

interface ThemeCtx {
  theme: Theme;
  layout: LayoutMode;
  setTheme: (t: Theme) => void;
  setLayout: (l: LayoutMode) => void;
}

const Ctx = createContext<ThemeCtx>({
  theme: "dark",
  layout: "default",
  setTheme: () => {},
  setLayout: () => {},
});

export const useTheme = () => useContext(Ctx);

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [layout, setLayoutState] = useState<LayoutMode>("default");

  useEffect(() => {
    const t = (localStorage.getItem("nyx-theme") as Theme) || "dark";
    const l = (localStorage.getItem("nyx-layout") as LayoutMode) || "default";
    setThemeState(t);
    setLayoutState(l);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("nyx-theme", t);
    document.documentElement.setAttribute("data-theme", t);
  };

  const setLayout = (l: LayoutMode) => {
    setLayoutState(l);
    localStorage.setItem("nyx-layout", l);
    document.documentElement.setAttribute("data-layout", l);
  };

  return (
    <Ctx.Provider value={{ theme, layout, setTheme, setLayout }}>
      {children}
    </Ctx.Provider>
  );
}
