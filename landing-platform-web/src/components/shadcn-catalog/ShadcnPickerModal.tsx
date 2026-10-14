'use client';

import React, { useState } from 'react';
import { SHADCN_CATALOG, CatalogItem } from './catalog-data';
import { Search, X, Layers, Plus } from 'lucide-react';
import { ShadcnComponentType } from '../../../../shared/types';

interface ShadcnPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComponent: (type: ShadcnComponentType, defaultProps: Record<string, any>) => void;
}

export function ShadcnPickerModal({
  isOpen,
  onClose,
  onSelectComponent,
}: ShadcnPickerModalProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Layout', 'Typography', 'Forms & Inputs', 'Navigation', 'Feedback & Data', 'Overlays'];

  const filtered = SHADCN_CATALOG.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-[#0c0d12] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-900 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">ShadCN Component Catalog</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-300 font-bold">
                {SHADCN_CATALOG.length} Components
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Select any official shadcn/ui primitive to insert into your container column.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Category Filters */}
        <div className="p-4 border-b border-neutral-900 bg-neutral-950/60 space-y-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search components (e.g. Button, Input, Accordion, Avatar, Dialog, Table)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-neutral-800 bg-neutral-900 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors text-xs font-medium ${
                  selectedCategory === cat
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Components Grid */}
        <div className="flex-1 overflow-y-auto p-5 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => {
                onSelectComponent(item.type, item.defaultProps);
                onClose();
              }}
              className="flex flex-col justify-between p-3.5 rounded-xl border border-neutral-800/80 bg-neutral-900/40 hover:bg-neutral-900 hover:border-blue-500/60 text-left transition-all group active:scale-[0.98]"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white group-hover:text-blue-300">
                    {item.title}
                  </span>
                  <span className="text-[9px] font-mono uppercase text-neutral-500">
                    {item.category}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end text-[10px] text-blue-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>+ Insert</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
