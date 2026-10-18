import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
  {
    variants: {
      variant: {
        default:
          'bg-blue-600 text-white hover:bg-blue-500 shadow-xs active:scale-[0.99] font-semibold transition-all',
        primary:
          'bg-blue-600 text-white hover:bg-blue-500 shadow-xs active:scale-[0.99] font-semibold transition-all',
        dark:
          'bg-slate-900 text-white hover:bg-slate-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-white shadow-xs active:scale-[0.99] font-semibold',
        secondary:
          'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:border-neutral-800 shadow-xs active:scale-[0.99]',
        outline:
          'border border-slate-200 dark:border-neutral-800 bg-transparent text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white active:scale-[0.99]',
        ghost:
          'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-100 hover:bg-slate-100 dark:hover:bg-neutral-900/80',
        danger:
          'bg-rose-600 text-white hover:bg-rose-500 shadow-xs active:scale-[0.99]',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-6 text-sm font-semibold',
        icon: 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
