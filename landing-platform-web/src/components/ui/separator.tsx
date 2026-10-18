import * as React from 'react';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

export function Separator({
  className = '',
  orientation = 'horizontal',
  ...props
}: SeparatorProps) {
  return (
    <div
      role="separator"
      className={`${orientation === 'horizontal'
          ? 'h-px w-full bg-slate-200 dark:bg-neutral-800'
          : 'h-full w-px bg-slate-200 dark:bg-neutral-800'
        } shrink-0 ${className}`}
      {...props}
    />
  );
}
