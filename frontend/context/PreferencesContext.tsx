"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { soundEffects } from "@/lib/sound";

export type ThemeMode = "dark" | "light";

interface PreferencesContextType {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  motivationalEnabled: boolean;
  theme: ThemeMode;
  setSoundEnabled: (enabled: boolean) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setMotivationalEnabled: (enabled: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [animationsEnabled, setAnimationsEnabledState] = useState<boolean>(true);
  const [motivationalEnabled, setMotivationalEnabledState] = useState<boolean>(true);
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage on client mount
  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    const storedSound = localStorage.getItem("pref_sound") !== "false";
    const storedAnim = localStorage.getItem("pref_animations") !== "false";
    const storedMotivation = localStorage.getItem("pref_motivation") !== "false";
    const storedTheme = (localStorage.getItem("pref_theme") as ThemeMode) || "dark";

    setSoundEnabledState(storedSound);
    setAnimationsEnabledState(storedAnim);
    setMotivationalEnabledState(storedMotivation);
    setThemeState(storedTheme);

    // Apply theme classes to document root
    applyThemeClass(storedTheme);
  }, []);

  const applyThemeClass = (newTheme: ThemeMode) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (newTheme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
    root.setAttribute("data-theme", newTheme);
  };

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("pref_sound", String(enabled));
      if (enabled) {
        soundEffects.playCorrect();
      }
    }
  }, []);

  const setAnimationsEnabled = useCallback((enabled: boolean) => {
    setAnimationsEnabledState(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("pref_animations", String(enabled));
    }
  }, []);

  const setMotivationalEnabled = useCallback((enabled: boolean) => {
    setMotivationalEnabledState(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("pref_motivation", String(enabled));
    }
  }, []);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    applyThemeClass(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("pref_theme", newTheme);
      soundEffects.playClick();
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      applyThemeClass(next);
      if (typeof window !== "undefined") {
        localStorage.setItem("pref_theme", next);
        soundEffects.playClick();
      }
      return next;
    });
  }, []);

  return (
    <PreferencesContext.Provider
      value={{
        soundEnabled,
        animationsEnabled,
        motivationalEnabled,
        theme,
        setSoundEnabled,
        setAnimationsEnabled,
        setMotivationalEnabled,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export function usePreferences(): PreferencesContextType {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
