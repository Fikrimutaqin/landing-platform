'use client';

import React, { useState } from 'react';
import {
  Plus,
  LayoutGrid,
  Columns,
  Square,
  Type,
  MousePointerClick,
  Sparkles,
  Search,
  Component,
  FolderPlus,
  ArrowRight,
  GripVertical,
} from 'lucide-react';
import { ShadcnComponentType } from '../../../../shared/types';
import { SHADCN_CATALOG } from '../shadcn-catalog/catalog-data';

interface AddElementsPanelProps {
  targetColumnIndex?: number;
  onAddLayoutSection: (layoutType: 'container' | 'grid-2' | 'grid-3' | 'grid-4' | 'flex-row') => void;
  onAddShadcnComponent: (type: ShadcnComponentType, defaultProps: Record<string, any>) => void;
  onOpenTemplateLibrary?: () => void;
  onInsertAlexSection?: (sectionKey: string) => void;
}

export function AddElementsPanel({
  targetColumnIndex = 0,
  onAddLayoutSection,
  onAddShadcnComponent,
  onOpenTemplateLibrary,
  onInsertAlexSection,
}: AddElementsPanelProps) {
  const [activeTab, setActiveTab] = useState<'basics' | 'shadcn' | 'sections'>('basics');
  const [shadcnSearch, setShadcnSearch] = useState('');
  const [shadcnCategory, setShadcnCategory] = useState('All');

  const filteredShadcn = SHADCN_CATALOG.filter((item) => {
    const matchesCat = shadcnCategory === 'All' || item.category === shadcnCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(shadcnSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(shadcnSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="flex flex-col h-full space-y-3 select-none">
      {/* 3-Segmented Tab Header */}
      <div className="px-3 pt-2 shrink-0">
        <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 text-[11px] font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('basics')}
            className={`py-1 rounded-md transition-colors ${
              activeTab === 'basics'
                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Structure
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shadcn')}
            className={`py-1 rounded-md transition-colors ${
              activeTab === 'shadcn'
                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Elements ({SHADCN_CATALOG.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sections')}
            className={`py-1 rounded-md transition-colors ${
              activeTab === 'sections'
                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sections
          </button>
        </div>
      </div>

      {/* Target Column Info Banner */}
      <div className="mx-3 px-2.5 py-1.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/50 flex items-center justify-between text-[11px] shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-600 dark:text-neutral-300">Target:</span>
          <span className="px-1.5 py-0.2 rounded font-mono font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px]">
            Col {targetColumnIndex + 1}
          </span>
        </div>
        <span className="text-[10px] text-blue-600/80 dark:text-blue-400/80 italic">
          Click or Drag to canvas
        </span>
      </div>

      {/* Tab 1: Structure / Basics */}
      {activeTab === 'basics' && (
        <div className="flex-1 overflow-y-auto px-3 space-y-4">
          {/* Section & Grid Layouts */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-neutral-500">
              Layout &amp; Grid
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'container', label: 'Boxed Section', icon: <Square className="w-4 h-4 text-blue-500" /> },
                { id: 'grid-2', label: '2 Columns (50/50)', icon: <Columns className="w-4 h-4 text-cyan-500" /> },
                { id: 'grid-3', label: '3 Columns (33x3)', icon: <LayoutGrid className="w-4 h-4 text-indigo-500" /> },
                { id: 'grid-4', label: '4 Columns Grid', icon: <LayoutGrid className="w-4 h-4 text-purple-500" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      'application/json',
                      JSON.stringify({
                        type: 'LAYOUT_SECTION',
                        layoutType: item.id,
                      })
                    );
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  onClick={() => onAddLayoutSection(item.id as any)}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 text-left transition-all flex flex-col gap-1.5 group cursor-grab active:cursor-grabbing shadow-2xs"
                  title="Click to insert or drag to canvas"
                >
                  <div className="flex items-center justify-between w-full">
                    {item.icon}
                    <Plus className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-white">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Core Elements */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-neutral-500">
              Core Typography &amp; Actions
            </span>
            <div className="space-y-1">
              {[
                {
                  type: 'Typography',
                  title: 'Heading (H2)',
                  desc: 'Bold display headline',
                  icon: <Type className="w-3.5 h-3.5 text-amber-500" />,
                  defaultProps: { variant: 'h2', text: 'Engaging Headline Here' },
                },
                {
                  type: 'Typography',
                  title: 'Paragraph Text',
                  desc: 'Multi-line readable body copy',
                  icon: <Type className="w-3.5 h-3.5 text-amber-500" />,
                  defaultProps: {
                    variant: 'p',
                    text: 'Craft compelling descriptions that explain your product value propositions clearly.',
                  },
                },
                {
                  type: 'Button',
                  title: 'Call to Action Button',
                  desc: 'Interactive button with link',
                  icon: <MousePointerClick className="w-3.5 h-3.5 text-emerald-500" />,
                  defaultProps: { label: 'Get Started Now', variant: 'default' },
                },
                {
                  type: 'Badge',
                  title: 'Badge / Pill',
                  desc: 'Compact highlight indicator',
                  icon: <Sparkles className="w-3.5 h-3.5 text-pink-500" />,
                  defaultProps: { label: 'New Release 2026', variant: 'default' },
                },
                {
                  type: 'Card',
                  title: 'Card Container',
                  desc: 'Structured box with border and padding',
                  icon: <Square className="w-3.5 h-3.5 text-blue-500" />,
                  defaultProps: { title: 'Feature Spotlight', description: 'Highlight key product advantages.' },
                },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      'application/json',
                      JSON.stringify({
                        type: 'SHADCN_ELEMENT',
                        elementType: item.type,
                        defaultProps: item.defaultProps,
                      })
                    );
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  onClick={() => onAddShadcnComponent(item.type as any, item.defaultProps)}
                  className="w-full p-2 rounded-lg border border-slate-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-950 hover:border-slate-300 dark:hover:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-900 text-left transition-colors flex items-center justify-between group cursor-grab active:cursor-grabbing"
                  title="Click to add or drag into any column on canvas"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <GripVertical className="w-3 h-3 text-slate-300 dark:text-neutral-700 group-hover:text-slate-400 dark:group-hover:text-neutral-500 shrink-0" />
                    <div className="p-1.5 rounded-md bg-slate-100 dark:bg-neutral-900 shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-white truncate">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-neutral-400 truncate">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 shrink-0 opacity-70 group-hover:opacity-100 pl-2">
                    + Add
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: All 60+ Shadcn Components */}
      {activeTab === 'shadcn' && (
        <div className="flex-1 overflow-y-auto px-3 space-y-2 flex flex-col min-h-0">
          {/* Quick Search */}
          <div className="relative shrink-0">
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
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] shrink-0">
            {['All', 'Forms & Inputs', 'Layout', 'Typography', 'Navigation', 'Feedback & Data', 'Overlays'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setShadcnCategory(cat)}
                className={`px-2 py-0.5 rounded whitespace-nowrap transition-colors ${
                  shadcnCategory === cat
                    ? 'bg-slate-900 dark:bg-neutral-800 text-white font-medium'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Component List with Drag-and-Drop */}
          <div className="space-y-1.5 overflow-y-auto flex-1 pr-0.5">
            {filteredShadcn.map((item) => (
              <button
                key={item.type}
                type="button"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    'application/json',
                    JSON.stringify({
                      type: 'SHADCN_ELEMENT',
                      elementType: item.type,
                      defaultProps: item.defaultProps,
                    })
                  );
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                onClick={() => onAddShadcnComponent(item.type, item.defaultProps)}
                className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 hover:bg-slate-50 dark:hover:bg-neutral-900 hover:border-slate-300 dark:hover:border-neutral-700 text-left transition-colors group cursor-grab active:cursor-grabbing"
                title="Click to add or drag into any column on canvas"
              >
                <div className="flex items-center gap-2 truncate mr-2">
                  <GripVertical className="w-3 h-3 text-slate-300 dark:text-neutral-700 group-hover:text-slate-400 dark:group-hover:text-neutral-500 shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-semibold text-slate-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-white truncate">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-neutral-400 truncate">
                      {item.category}
                    </div>
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

      {/* Tab 3: Prebuilt Bespoke Sections with Drag-and-Drop */}
      {activeTab === 'sections' && (
        <div className="flex-1 overflow-y-auto px-3 space-y-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 space-y-1">
            <span className="font-semibold block">Alex Travis High-Craft Sections</span>
            <p className="text-[10px] text-slate-600 dark:text-neutral-400">
              Add pixel-perfect responsive sections with two-tone headings, gradients, and dark mode styling.
            </p>
          </div>

          <div className="space-y-1.5">
            {[
              { id: 'hero', name: 'Hero Section', desc: 'Lime pill badge, gradient CTA, and photo card' },
              { id: 'navbar', name: 'Navigation Bar', desc: 'AT logo, brand title, and contact button' },
              { id: 'performance', name: 'Performance & Metrics', desc: 'Ring chart graphic and 8+ years stats' },
              { id: 'services', name: 'Services 01.1 - 01.3', desc: 'Interactive service expandable accordion list' },
              { id: 'case-studies', name: 'Selected Projects', desc: 'Project showcase with category filters' },
              { id: 'pricing', name: 'Pricing Tiers', desc: 'Basic ($4,650) & Enterprise scale packages' },
              { id: 'testimonials', name: 'Client Testimonials', desc: 'Avatar, quote and 140% conversion badge' },
              { id: 'articles', name: 'Articles & Insights', desc: 'Card grid with publication dates' },
              { id: 'faq', name: 'FAQ Accordion', desc: 'Collapsible questions & answers' },
              { id: 'footer', name: 'Footer Section', desc: 'Giant faded Alex Travis watermark' },
            ].map((sec) => (
              <button
                key={sec.id}
                type="button"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    'application/json',
                    JSON.stringify({
                      type: 'ALEX_SECTION',
                      sectionKey: sec.id,
                    })
                  );
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                onClick={() => onInsertAlexSection?.(sec.id)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-neutral-900 text-left transition-colors flex items-center justify-between group cursor-grab active:cursor-grabbing"
                title="Click to insert or drag to canvas"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-white">
                    {sec.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-neutral-400">
                    {sec.desc}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0 ml-2" />
              </button>
            ))}
          </div>

          {onOpenTemplateLibrary && (
            <button
              type="button"
              onClick={onOpenTemplateLibrary}
              className="w-full mt-2 py-2 px-3 rounded-lg border border-dashed border-slate-300 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all flex items-center justify-center gap-1.5"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Browse Full Template Library...</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
