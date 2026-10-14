import * as React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'success' | 'warning' | 'info';
}

export function Badge({ className = '', variant = 'neutral', children, ...props }: BadgeProps) {
  const styles = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-800',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60',
    info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
