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

  const isDarkBg =
    !styles?.backgroundColor ||
    styles?.backgroundColor?.includes('#0') ||
    styles?.backgroundColor?.includes('#1') ||
    styles?.backgroundColor?.includes('black') ||
    styles?.backgroundColor?.includes('neutral-9');

  const textColor = styles?.textColor || (isDarkBg ? '#ffffff' : '#0f172a');
  const pillBg = isDarkBg ? 'rgba(0, 0, 0, 0.4)' : '#ffffff';
  const pillBorder = isDarkBg ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <div
      className={`rounded-2xl border px-4 py-3 flex flex-wrap items-center justify-between gap-2.5 text-xs shadow-xs ${fontClass}`}
      style={{
        backgroundColor: styles?.backgroundColor || 'rgba(10, 11, 15, 0.85)',
        color: textColor,
        borderColor: isDarkBg ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
      }}
    >
      <div className="flex items-center gap-2 opacity-90">
        <Clock className="w-3.5 h-3.5" style={{ color: styles?.accentColor || '#2563eb' }} />
        <span className="font-semibold tracking-wide uppercase text-[10px]">
          {urgencyText}
        </span>
      </div>

      <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
        <span
          className="px-2 py-0.5 rounded-lg border tabular-nums shadow-2xs"
          style={{ backgroundColor: pillBg, borderColor: pillBorder, color: textColor }}
        >
          {String(timeLeft.hours).padStart(2, '0')}h
        </span>
        <span className="opacity-50">:</span>
        <span
          className="px-2 py-0.5 rounded-lg border tabular-nums shadow-2xs"
          style={{ backgroundColor: pillBg, borderColor: pillBorder, color: textColor }}
        >
          {String(timeLeft.minutes).padStart(2, '0')}m
        </span>
        <span className="opacity-50">:</span>
        <span
          className="px-2 py-0.5 rounded-lg border tabular-nums shadow-2xs font-extrabold"
          style={{
            backgroundColor: pillBg,
            borderColor: pillBorder,
            color: styles?.accentColor || (isDarkBg ? '#38bdf8' : '#2563eb'),
          }}
        >
          {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </div>
    </div>
  );
}
