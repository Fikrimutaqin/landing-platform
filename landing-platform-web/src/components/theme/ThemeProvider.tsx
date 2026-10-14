'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = (localStorage.getItem('platform_theme') as Theme) || 'system';
    setThemeState(savedTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const computeResolved = (t: Theme): ResolvedTheme => {
      if (t === 'system') {
        return mediaQuery.matches ? 'dark' : 'light';
      }
      return t;
    };

    const initialResolved = computeResolved(savedTheme);
    setResolvedTheme(initialResolved);
    applyThemeToDOM(initialResolved);
    setMounted(true);

    const handleSystemChange = (e: MediaQueryListEvent) => {
      const currentSaved = (localStorage.getItem('platform_theme') as Theme) || 'system';
      if (currentSaved === 'system') {
        const newResolved = e.matches ? 'dark' : 'light';
        setResolvedTheme(newResolved);
        applyThemeToDOM(newResolved);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'platform_theme') {
        const updated = (e.newValue as Theme) || 'system';
        setThemeState(updated);
        const newResolved = computeResolved(updated);
        setResolvedTheme(newResolved);
        applyThemeToDOM(newResolved);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const applyThemeToDOM = (resolved: ResolvedTheme) => {
    const root = document.documentElement;
    if (resolved === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    root.style.colorScheme = resolved;
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('platform_theme', newTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const newResolved: ResolvedTheme =
      newTheme === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : newTheme;

    setResolvedTheme(newResolved);
    applyThemeToDOM(newResolved);
  };

  const toggleTheme = () => {
    const nextTheme: Theme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
