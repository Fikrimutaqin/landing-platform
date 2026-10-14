'use client';

import React, { useState } from 'react';
import {
  Box,
  Layers,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Search,
  Component,
} from 'lucide-react';
import { BlockType, ShadcnComponentType } from '../../../../shared/types';
import { SHADCN_CATALOG } from '../shadcn-catalog/catalog-data';

export interface BlockItem {
  id: string;
  type: BlockType;
  content: any;
  styles: any;
  layout?: any;
  columnsContent?: any[];
}

interface ElementorSidebarProps {
  blocks: BlockItem[];
  selectedBlockId: string | null;
  activeSidebarTab?: 'shadcn' | 'navigator';
  onSidebarTabChange?: (tab: 'shadcn' | 'navigator') => void;
  targetColumnIndex?: number;
  onSelectBlock: (id: string) => void;
  onAddBlock: (templateKey: string) => void;
  onAddShadcnToActiveSection?: (type: ShadcnComponentType, defaultProps: Record<string, any>) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDuplicate: (index: number) => void;
  onDelete: (index: number) => void;
}

export function ElementorSidebar({
  blocks,
  selectedBlockId,
  activeSidebarTab,
  onSidebarTabChange,
  targetColumnIndex = 0,
  onSelectBlock,
  onAddBlock,
  onAddShadcnToActiveSection,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}: ElementorSidebarProps) {
  const [localTab, setLocalTab] = useState<'shadcn' | 'navigator'>('shadcn');
  const currentTab = activeSidebarTab !== undefined ? activeSidebarTab : localTab;
  const setTab = (t: 'shadcn' | 'navigator') => {
    setLocalTab(t);
    if (onSidebarTabChange) onSidebarTabChange(t);
  };
  const [shadcnSearch, setShadcnSearch] = useState('');
  const [shadcnCategory, setShadcnCategory] = useState('All');

  const formatName = (block: BlockItem) => {
    if (block.content?.label) return block.content.label;
    if (block.type === 'CONTAINER') {
      const isGrid = block.layout?.display === 'grid';
      return isGrid ? `Grid (${block.layout?.columns || 2} Cols)` : `Flex (${block.layout?.flexDirection || 'row'})`;
    }
    return block.type
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const filteredShadcn = SHADCN_CATALOG.filter((item) => {
    const matchesCat = shadcnCategory === 'All' || item.category === shadcnCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(shadcnSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(shadcnSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <aside className="w-80 border-r border-slate-200 dark:border-neutral-900 bg-white dark:bg-[#08090c] text-slate-800 dark:text-neutral-100 flex flex-col h-full sticky top-0 shrink-0 z-30 select-none transition-colors duration-200">
      {/* 2-Tab Segmented Control: ShadCN | Navigator */}
      <div className="flex border-b border-slate-200 dark:border-neutral-900 bg-slate-100/80 dark:bg-neutral-950 p-1 shrink-0">
        <button
          type="button"
          onClick={() => setTab('shadcn')}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-semibold rounded-md transition-colors ${currentTab === 'shadcn'
            ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs'
            : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200'
            }`}
        >
          <Component className="w-3 h-3 text-blue-500 dark:text-blue-400" />
          <span>ShadCN UI ({SHADCN_CATALOG.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('navigator')}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-semibold rounded-md transition-colors ${currentTab === 'navigator'
            ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs'
            : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200'
            }`}
        >
          <Layers className="w-3 h-3" />
          <span>Tree ({blocks.length})</span>
        </button>
      </div>

      {/* Tab 2: All 64 ShadCN Components */}
      {currentTab === 'shadcn' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3 flex flex-col">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                ShadCN UI Primitives
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-300 font-bold">
                {SHADCN_CATALOG.length} Elements
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-neutral-400">
              <span>Click to insert into section:</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300 font-mono text-[10px] font-semibold">
                Column {targetColumnIndex + 1}
              </span>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search Button, Input, Accordion..."
              value={shadcnSearch}
              onChange={(e) => setShadcnSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-xs text-slate-900 dark:text-neutral-100 placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
            {['All', 'Forms & Inputs', 'Layout', 'Typography', 'Navigation', 'Feedback & Data', 'Overlays'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setShadcnCategory(cat)}
                className={`px-2 py-0.5 rounded whitespace-nowrap transition-colors ${shadcnCategory === cat
                  ? 'bg-slate-900 dark:bg-neutral-800 text-white font-medium'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-900'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Components List */}
          <div className="space-y-1.5 overflow-y-auto flex-1 pr-0.5">
            {filteredShadcn.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => {
                  if (onAddShadcnToActiveSection) {
                    onAddShadcnToActiveSection(item.type, item.defaultProps);
                  }
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-neutral-900 bg-slate-50/70 dark:bg-neutral-950 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:border-slate-300 dark:hover:border-neutral-700 text-left transition-colors group cursor-pointer"
              >
                <div className="truncate mr-2">
                  <div className="text-xs font-semibold text-slate-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-white truncate">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-neutral-400 truncate">
                    {item.category}
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 shrink-0 opacity-70 group-hover:opacity-100">
                  + Add
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Navigator Tree */}
      {currentTab === 'navigator' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Section Structure Tree
            </div>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">Reorder, duplicate, or delete sections.</p>
          </div>

          <div className="space-y-1.5 pt-1">
            {blocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-slate-200 dark:border-neutral-800 text-center space-y-2 bg-slate-50/60 dark:bg-neutral-950/40 my-2">
                <Box className="w-5 h-5 text-slate-400 dark:text-neutral-600" />
                <div className="text-xs font-medium text-slate-700 dark:text-neutral-400">No sections added yet</div>
                <p className="text-[10px] text-slate-500 dark:text-neutral-500 leading-normal">
                  Add container sections to structure your layout.
                </p>
              </div>
            ) : (
              blocks.map((b, index) => {
                const isSelected = selectedBlockId === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => onSelectBlock(b.id)}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-all cursor-pointer group ${isSelected
                      ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/30 text-blue-700 dark:text-white font-medium shadow-xs'
                      : 'border-slate-200 dark:border-neutral-900 bg-slate-50/60 dark:bg-neutral-950 text-slate-700 dark:text-neutral-300 hover:border-slate-300 dark:hover:border-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-900'
                      }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[10px] font-mono text-slate-400 dark:text-neutral-400 w-3.5 text-center">
                        {index + 1}
                      </span>
                      <span className="truncate">{formatName(b)}</span>
                    </div>

                    {/* Actions on hover or selection */}
                    <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveUp(index);
                        }}
                        className="p-1 hover:text-slate-900 dark:hover:text-white disabled:opacity-20"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={index === blocks.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveDown(index);
                        }}
                        className="p-1 hover:text-slate-900 dark:hover:text-white disabled:opacity-20"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicate(index);
                        }}
                        className="p-1 hover:text-blue-500 dark:hover:text-blue-400"
                        title="Duplicate"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(index);
                        }}
                        className="p-1 hover:text-rose-500 dark:hover:text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              }))}
          </div>
        </div>
      )}
    </aside>
  );
}
