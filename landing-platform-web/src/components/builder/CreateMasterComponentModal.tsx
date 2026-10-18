'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { MasterComponentCategory } from '../../../../shared/types';
import { Component, X, Layers, Check } from 'lucide-react';

interface CreateMasterComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetName: string;
  targetType: 'block' | 'component';
  onCreateMaster: (name: string, description: string, category: MasterComponentCategory) => void;
}

export function CreateMasterComponentModal({
  isOpen,
  onClose,
  targetName,
  targetType,
  onCreateMaster,
}: CreateMasterComponentModalProps) {
  const [name, setName] = useState(targetName ? `${targetName} Symbol` : 'New Master Component');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MasterComponentCategory>('cards');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a component name.');
      return;
    }
    onCreateMaster(name.trim(), description.trim(), category);
    onClose();
  };

  const categories: { id: MasterComponentCategory; label: string }[] = [
    { id: 'navigation', label: 'Navigation' },
    { id: 'hero', label: 'Hero' },
    { id: 'cards', label: 'Cards & Items' },
    { id: 'cta', label: 'Call to Action' },
    { id: 'footer', label: 'Footer' },
    { id: 'general', label: 'General' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-neutral-900 bg-slate-50/80 dark:bg-neutral-950/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Component className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Create Master Component</h2>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400">Save this {targetType} as a reusable symbol.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
              Component Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Global Navbar, Pricing Card"
              className="text-xs"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
              Category
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {categories.map((c) => {
                const isSelected = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`py-1.5 px-2 rounded-lg text-center font-medium border text-[11px] transition-colors ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                        : 'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this reusable component is used for..."
              rows={2}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Explanation badge */}
          <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex items-start gap-2">
            <Component className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
              When saved, this element becomes a <strong>Linked Master Symbol</strong>. Any instances you insert on other pages will inherit updates to this master component, while allowing per-instance content overrides.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-neutral-900">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
            >
              <span>Create Master Component</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
