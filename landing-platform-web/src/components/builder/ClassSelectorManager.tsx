'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Tag,
  Plus,
  X,
  Layers,
  ChevronDown,
  Info,
  Check,
} from 'lucide-react';
import { StyleClass } from '../../../../shared/types';
import { normalizeClassName } from '@/lib/style-cascade';

interface ClassSelectorManagerProps {
  classNames?: string[];
  styleClasses: StyleClass[];
  onAddClassToElement: (className: string) => void;
  onRemoveClassFromElement: (className: string) => void;
  onCreateClassFromElement: (className: string) => void;
  targetClassName?: string | null;
  onSelectTargetClass?: (className: string | null) => void;
  isEditingSharedClass?: boolean;
  onToggleEditSharedClass?: (enabled: boolean) => void;
}

export function ClassSelectorManager({
  classNames = [],
  styleClasses = [],
  onAddClassToElement,
  onRemoveClassFromElement,
  onCreateClassFromElement,
  targetClassName,
  onSelectTargetClass,
  isEditingSharedClass = false,
  onToggleEditSharedClass,
}: ClassSelectorManagerProps) {
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsInputOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedQuery = normalizeClassName(query);
  const filteredClasses = styleClasses.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) &&
      !classNames.includes(c.name)
  );

  const handleCreateOrAdd = (nameToUse: string) => {
    const cleanName = normalizeClassName(nameToUse);
    if (!cleanName) return;

    // Check if class exists
    const exists = styleClasses.some((c) => c.name === cleanName);
    if (exists) {
      onAddClassToElement(cleanName);
    } else {
      onCreateClassFromElement(cleanName);
    }
    setQuery('');
    setIsInputOpen(false);
    setIsDropdownOpen(false);
    if (onSelectTargetClass) onSelectTargetClass(cleanName);
  };

  return (
    <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-2 select-none" ref={dropdownRef}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="text-[11px] font-bold text-slate-800 dark:text-neutral-200">
            Style Selector (Class)
          </span>
        </div>

        {classNames.length > 0 && onToggleEditSharedClass && (
          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-medium text-slate-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-300">
            <input
              type="checkbox"
              checked={isEditingSharedClass}
              onChange={(e) => onToggleEditSharedClass(e.target.checked)}
              className="rounded text-blue-600 focus:ring-0 w-3 h-3"
            />
            <span>Edit Shared Class</span>
          </label>
        )}
      </div>

      {/* Class Tag Pills Container */}
      <div className="flex flex-wrap items-center gap-1.5 min-h-7 p-1 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800">
        {classNames.map((clsName) => {
          const isSelectedTarget = targetClassName === clsName;
          return (
            <span
              key={clsName}
              onClick={() => onSelectTargetClass && onSelectTargetClass(clsName)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold cursor-pointer transition-all ${isSelectedTarget
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 hover:bg-blue-100 dark:hover:bg-blue-900/40'
                }`}
            >
              <span>.{clsName}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveClassFromElement(clsName);
                  if (targetClassName === clsName && onSelectTargetClass) {
                    onSelectTargetClass(null);
                  }
                }}
                className="hover:opacity-100 opacity-60 ml-0.5 cursor-pointer"
                title="Remove class"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}

        {/* Add Class Button / Input */}
        {isInputOpen ? (
          <div className="relative flex-1 min-w-30">
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCreateOrAdd(query);
                } else if (e.key === 'Escape') {
                  setIsInputOpen(false);
                  setIsDropdownOpen(false);
                }
              }}
              placeholder="e.g. hero-title"
              className="w-full text-xs font-mono py-0.5 px-1 bg-transparent text-slate-900 dark:text-white outline-none"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsInputOpen(true);
              setIsDropdownOpen(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add Class</span>
          </button>
        )}
      </div>

      {/* Auto-Complete & Class Browser Dropdown */}
      {isDropdownOpen && (
        <div className="absolute z-50 left-4 right-4 mt-1 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl shadow-xl p-1.5 max-h-48 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-100">
          {query.trim().length > 0 && !styleClasses.some((c) => c.name === normalizedQuery) && (
            <button
              type="button"
              onClick={() => handleCreateOrAdd(normalizedQuery)}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center justify-between transition-colors"
            >
              <span>
                Create new class: <strong className="font-mono">.{normalizedQuery}</strong>
              </span>
              <Plus className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            </button>
          )}

          {filteredClasses.length > 0 && (
            <div className="space-y-0.5">
              <div className="text-[10px] font-mono text-slate-400 dark:text-neutral-500 px-2 pt-1 pb-0.5 uppercase tracking-wider">
                Existing Classes
              </div>
              {filteredClasses.map((cls) => (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => handleCreateOrAdd(cls.name)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      .{cls.name}
                    </span>
                    {cls.description && (
                      <span className="text-[10px] text-slate-400 truncate max-w-35">
                        {cls.description}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">Use</span>
                </button>
              ))}
            </div>
          )}

          {filteredClasses.length === 0 && query.trim().length === 0 && (
            <div className="p-2 text-center text-[11px] text-slate-400">
              Type a name to create a new class selector
            </div>
          )}
        </div>
      )}

      {/* Shared Class vs Local Status Info Bar */}
      {isEditingSharedClass && targetClassName ? (
        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-700 dark:text-amber-300 leading-tight flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
          <span>
            You are editing the shared class <strong className="font-mono">.{targetClassName}</strong>. Changes will apply to all elements sharing this class.
          </span>
        </div>
      ) : classNames.length > 0 ? (
        <div className="text-[10px] text-slate-500 dark:text-neutral-400 leading-tight">
          Inheriting styles from <strong className="font-mono text-slate-700 dark:text-neutral-300">.{classNames.join(', .')}</strong>. Local edits will override class styles.
        </div>
      ) : (
        <div className="text-[10px] text-slate-400 dark:text-neutral-500 leading-tight">
          No class assigned. Assign a class to share styles across multiple elements.
        </div>
      )}
    </div>
  );
}
