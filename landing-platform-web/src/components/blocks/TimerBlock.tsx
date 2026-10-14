'use client';
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { BlockStyles } from '../../../../shared/types';

export interface TimerBlockProps {
  urgencyText?: string;
  styles?: BlockStyles;
}

export function TimerBlock({ urgencyText = 'Current Batch Closes In', styles }: TimerBlockProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 18, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 18, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fontClass = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    space: 'font-mono tracking-tight',
    jakarta: 'font-sans',
  }[styles?.fontFamily || 'sans'];

  return (
    <div
      className={`rounded-xl border border-neutral-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs ${fontClass}`}
      style={{
        backgroundColor: styles?.backgroundColor || 'rgba(10, 11, 15, 0.85)',
        color: styles?.textColor || '#ffffff',
      }}
    >
      <div className="flex items-center gap-2 opacity-80">
        <Clock className="w-3.5 h-3.5" style={{ color: styles?.accentColor || '#10b981' }} />
        <span className="font-medium tracking-wide uppercase text-[10px]">
          {urgencyText}
        </span>
      </div>

      <div className="flex items-center gap-1.5 font-mono text-xs font-semibold">
        <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 tabular-nums">
          {String(timeLeft.hours).padStart(2, '0')}h
        </span>
        <span className="opacity-40">:</span>
        <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 tabular-nums">
          {String(timeLeft.minutes).padStart(2, '0')}m
        </span>
        <span className="opacity-40">:</span>
        <span
          className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 tabular-nums"
          style={{ color: styles?.accentColor || '#10b981' }}
        >
          {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </div>
    </div>
  );
}
