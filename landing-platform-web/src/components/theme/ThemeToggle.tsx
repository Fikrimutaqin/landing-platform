'use client';

import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div
      className={`flex items-center bg-neutral-900/90 dark:bg-neutral-900/90 light:bg-slate-100 rounded-lg p-0.5 border border-neutral-800/80 dark:border-neutral-800/80 light:border-slate-200 transition-colors ${className}`}
      title={`Current: ${theme} mode (Click to toggle)`}
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-md transition-all ${
          theme === 'light'
            ? 'bg-white text-amber-500 shadow-sm dark:bg-neutral-800'
            : 'text-neutral-400 hover:text-neutral-200 dark:hover:text-white'
        }`}
        title="Light Mode"
        aria-label="Set light mode"
      >
        <Sun className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-md transition-all ${
          theme === 'dark'
            ? 'bg-neutral-800 text-blue-400 shadow-sm'
            : 'text-neutral-400 hover:text-neutral-200 dark:hover:text-white'
        }`}
        title="Dark Mode"
        aria-label="Set dark mode"
      >
        <Moon className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-md transition-all ${
          theme === 'system'
            ? 'bg-neutral-800 text-emerald-400 shadow-sm'
            : 'text-neutral-400 hover:text-neutral-200 dark:hover:text-white'
        }`}
        title="Follow System Theme"
        aria-label="Follow system theme"
      >
        <Laptop className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
