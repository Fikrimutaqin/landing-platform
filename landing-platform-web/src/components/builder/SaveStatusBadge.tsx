'use client';

import React from 'react';
import { SaveStatus } from '../../../../shared/types';
import { Cloud, Loader2, AlertCircle } from 'lucide-react';

interface SaveStatusBadgeProps {
  status: SaveStatus;
  lastSavedAt: Date | null;
  onSaveManual?: () => void;
  isSavingManual?: boolean;
}

export function SaveStatusBadge({
  status,
  lastSavedAt,
  onSaveManual,
  isSavingManual = false,
}: SaveStatusBadgeProps) {
  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isSaving = status === 'saving' || isSavingManual;

  return (
    <div
      onClick={status === 'unsaved' || status === 'error' ? onSaveManual : undefined}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all select-none ${
        status === 'unsaved' || status === 'error' ? 'cursor-pointer hover:opacity-90' : 'cursor-default'
      } ${
        isSaving
          ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300'
          : status === 'unsaved'
          ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300'
          : status === 'error'
          ? 'bg-red-50/80 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300'
          : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400'
      }`}
      title={
        status === 'saved'
          ? `Autosaved. Last saved at ${formatTime(lastSavedAt)}`
          : isSaving
          ? 'Autosaving draft changes...'
          : status === 'unsaved'
          ? 'Unsaved changes (Click to save now)'
          : 'Save failed (Click to retry)'
      }
    >
      {isSaving ? (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600 dark:text-blue-400" />
          <span className="hidden xl:inline">Saving...</span>
        </>
      ) : status === 'unsaved' ? (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="hidden xl:inline">Unsaved</span>
        </>
      ) : status === 'error' ? (
        <>
          <AlertCircle className="w-3 h-3 text-red-500" />
          <span className="hidden xl:inline">Save Failed</span>
        </>
      ) : (
        <>
          <Cloud className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden xl:inline">Autosaved</span>
        </>
      )}
    </div>
  );
}
