'use client';

import React, { useState } from 'react';
import { MasterComponent, MasterComponentCategory } from '../../../../shared/types';
import { Button } from '../ui/button';
import {
  Component,
  Search,
  Plus,
  Trash2,
  X,
  Layers,
  Sparkles,
  LayoutTemplate,
  CreditCard,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface MasterComponentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  components: MasterComponent[];
  onInsertComponent: (comp: MasterComponent) => void;
  onDeleteComponent: (id: string) => void;
}

export function MasterComponentsModal({
  isOpen,
  onClose,
  components,
  onInsertComponent,
  onDeleteComponent,
}: MasterComponentsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Components' },
    { id: 'cards', label: 'Cards' },
    { id: 'hero', label: 'Hero' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'cta', label: 'Call to Action' },
    { id: 'footer', label: 'Footer' },
    { id: 'general', label: 'General' },
  ];

  const filteredComponents = components.filter((comp) => {
    const matchesCategory = activeCategory === 'all' || comp.category === activeCategory;
    const matchesSearch =
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (comp.description && comp.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-neutral-900 bg-slate-50/80 dark:bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Component className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Reusable Components &amp; Symbols
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                  {components.length} Symbols
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                Insert linked master components. Updates to master propagate across all pages.
              </p>
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

        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-neutral-900 bg-slate-50/40 dark:bg-neutral-900/40 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search components by name or tag..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 ${
                  activeCategory === c.id
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Components Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {filteredComponents.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 flex items-center justify-center text-purple-500 mx-auto mb-3">
                <Component className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-semibold text-slate-800 dark:text-neutral-200 mb-1">
                No components found
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400 max-w-sm mx-auto">
                {searchQuery
                  ? `No component matches "${searchQuery}". Try a different keyword.`
                  : 'Select any element or container section in the builder and click "Create Master Component" to save it here.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredComponents.map((comp) => (
                <div
                  key={comp.id}
                  className="group p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/60 dark:bg-neutral-900/50 hover:border-purple-400 dark:hover:border-purple-600 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-purple-600 dark:text-purple-400 text-xs font-bold">❖</span>
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                          {comp.name}
                        </h4>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-slate-200/80 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300">
                        {comp.category}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-2 mb-3">
                      {comp.description || 'Reusable symbol component.'}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-3">
                      <span className="capitalize">Type: {comp.rootType}</span>
                      <span>•</span>
                      <span>v{comp.schemaVersion}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-neutral-800/80">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete master component '${comp.name}'? Existing instances will remain detached.`)) {
                          onDeleteComponent(comp.id);
                        }
                      }}
                      className="p-1 rounded text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete Master Symbol"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        onInsertComponent(comp);
                        onClose();
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5 ml-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Insert Instance</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
