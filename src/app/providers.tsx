"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, type Lang, type TranslationType } from "./translations";

interface AppContextProps {
  lang: Lang;
  t: TranslationType;
  theme: string;
  toggleTheme: () => void;
  setLang: (l: Lang) => void;
}

const AppContext = createContext<AppContextProps>({
  lang: "pt",
  t: translations.pt,
  theme: "dark",
  toggleTheme: () => { },
  setLang: () => { },
});

export const useApp = () => useContext(AppContext);

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState<Lang>("pt");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("carlos_portfolio_lang");
      if (savedLang === "en" || savedLang === "pt") {
        setLang(savedLang);
      }
      
      const savedTheme = localStorage.getItem("carlos_portfolio_theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme === "dark" ? "" : "light");
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("carlos_portfolio_theme", next);
    document.documentElement.setAttribute("data-theme", next === "dark" ? "" : "light");
  };

  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem("carlos_portfolio_lang", newLang);
  };

  const t = translations[lang];

  return (
    <AppContext.Provider value={{ lang, t, theme, toggleTheme, setLang: handleSetLang }}>
      {children}
    </AppContext.Provider>
  );
};
