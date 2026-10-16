'use client';

import React from 'react';
import {
  Columns,
  Grid,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Maximize2,
  WrapText,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { ContainerLayout, ResponsiveLayoutOverrides, DeviceViewport } from '../../../../shared/types';

interface EnhancedFlexGridControlsProps {
  layout: ContainerLayout;
  viewport?: DeviceViewport;
  onChange: (field: string, value: any) => void;
  onResetBreakpoint?: (vp: 'tablet' | 'mobile') => void;
}

export function EnhancedFlexGridControls({
  layout,
  viewport = 'desktop',
  onChange,
  onResetBreakpoint,
}: EnhancedFlexGridControlsProps) {
  const isTablet = viewport === 'tablet';
  const isMobile = viewport === 'mobile';

  const activeOverrides = isMobile
    ? { ...(layout.tablet || {}), ...(layout.mobile || {}) }
    : isTablet
    ? { ...(layout.tablet || {}) }
    : {};

  const effectiveLayout: ContainerLayout = {
    ...layout,
    ...activeOverrides,
  };

  const isGrid = effectiveLayout.display === 'grid';
  const hasTabletOverride = Boolean(layout.tablet && Object.keys(layout.tablet).length > 0);
  const hasMobileOverride = Boolean(layout.mobile && Object.keys(layout.mobile).length > 0);
  const isDeviceOverridden = isMobile ? hasMobileOverride : isTablet ? hasTabletOverride : false;

  return (
    <div className="space-y-4 text-xs select-none">
      {/* Display Mode Switcher (Flex vs Grid) */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
          Display Engine
        </label>
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => onChange('display', 'flex')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all ${
              !isGrid
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Flexbox</span>
          </button>
          <button
            type="button"
            onClick={() => onChange('display', 'grid')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all ${
              isGrid
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>CSS Grid</span>
          </button>
        </div>
      </div>

      {/* ---------------- FLEXBOX CONTROLS ---------------- */}
      {!isGrid && (
        <div className="space-y-3.5 pt-1">
          {/* Flex Direction */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-medium text-slate-600 dark:text-neutral-400">
                Direction
              </label>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                {effectiveLayout.flexDirection} {effectiveLayout.reverse ? '(Rev)' : ''}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  onChange('flexDirection', 'row');
                  onChange('reverse', false);
                }}
                className={`py-1.5 rounded-md flex flex-col items-center gap-1 text-[10px] font-medium transition-all ${
                  effectiveLayout.flexDirection === 'row' && !effectiveLayout.reverse
                    ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Horizontal Row (Left to Right)"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Row</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange('flexDirection', 'row');
                  onChange('reverse', true);
                }}
                className={`py-1.5 rounded-md flex flex-col items-center gap-1 text-[10px] font-medium transition-all ${
                  effectiveLayout.flexDirection === 'row' && effectiveLayout.reverse
                    ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Reverse Row (Right to Left)"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Rev Row</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange('flexDirection', 'col');
                  onChange('reverse', false);
                }}
                className={`py-1.5 rounded-md flex flex-col items-center gap-1 text-[10px] font-medium transition-all ${
                  effectiveLayout.flexDirection === 'col' && !effectiveLayout.reverse
                    ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Vertical Column Stack (Top to Bottom)"
              >
                <ArrowDown className="w-3.5 h-3.5" />
                <span>Col</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange('flexDirection', 'col');
                  onChange('reverse', true);
                }}
                className={`py-1.5 rounded-md flex flex-col items-center gap-1 text-[10px] font-medium transition-all ${
                  effectiveLayout.flexDirection === 'col' && effectiveLayout.reverse
                    ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Reverse Column (Bottom to Top)"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Rev Col</span>
              </button>
            </div>
          </div>

          {/* Justify Content */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5">
              Justify Content (Main Axis)
            </label>
            <div className="grid grid-cols-6 gap-1 p-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
              {[
                { val: 'start', label: 'Start', title: 'Pack items toward start' },
                { val: 'center', label: 'Center', title: 'Center items' },
                { val: 'end', label: 'End', title: 'Pack items toward end' },
                { val: 'between', label: 'Between', title: 'Space between items' },
                { val: 'around', label: 'Around', title: 'Space around items' },
                { val: 'evenly', label: 'Evenly', title: 'Equal spacing around all' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => onChange('justify', item.val)}
                  className={`py-1.5 rounded-md text-[10px] font-medium transition-all text-center ${
                    effectiveLayout.justify === item.val
                      ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={item.title}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Align Items */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5">
              Align Items (Cross Axis)
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
              {[
                { val: 'start', label: 'Top / Start' },
                { val: 'center', label: 'Center' },
                { val: 'end', label: 'Bottom / End' },
                { val: 'stretch', label: 'Stretch' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => onChange('align', item.val)}
                  className={`py-1.5 rounded-md text-[10px] font-medium transition-all text-center ${
                    effectiveLayout.align === item.val
                      ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flex Wrap Toggle */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
            <div className="flex items-center gap-1.5">
              <WrapText className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px] font-medium text-slate-700 dark:text-neutral-300">
                Flex Wrap (Multi-line)
              </span>
            </div>
            <button
              type="button"
              onClick={() => onChange('wrap', !effectiveLayout.wrap)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                effectiveLayout.wrap
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400'
              }`}
            >
              {effectiveLayout.wrap ? 'Wrap On' : 'No Wrap'}
            </button>
          </div>
        </div>
      )}

      {/* ---------------- CSS GRID CONTROLS ---------------- */}
      {isGrid && (
        <div className="space-y-3.5 pt-1">
          {/* Column Count Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-medium text-slate-600 dark:text-neutral-400">
                Grid Columns ({effectiveLayout.columns})
              </label>
              <span className="text-[10px] font-mono text-slate-400">
                repeat({effectiveLayout.columns}, 1fr)
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1 p-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
              {([1, 2, 3, 4, 6, 12] as const).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onChange('columns', num)}
                  className={`py-1.5 rounded-md text-[11px] font-mono font-bold transition-all text-center ${
                    effectiveLayout.columns === num
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout Presets */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5">
              Column Width Templates
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'equal', label: '1:1 Equal', desc: '50% / 50%', cols: 2 },
                { id: 'split-left', label: '2:1 Big Left', desc: '66% / 33%', cols: 2 },
                { id: 'split-right', label: '1:2 Big Right', desc: '33% / 66%', cols: 2 },
                { id: '3-col', label: '3-Columns', desc: '33% / 33% / 33%', cols: 3 },
                { id: '4-col', label: '4-Columns', desc: '25% each', cols: 4 },
                { id: 'sidebar', label: 'Sidebar + Body', desc: 'Fixed + 1fr', cols: 2 },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => {
                    onChange('columns', tmpl.cols);
                    onChange('templatePreset', tmpl.id);
                  }}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    effectiveLayout.templatePreset === tmpl.id
                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                      : 'border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-slate-300 dark:hover:border-neutral-700 text-slate-700 dark:text-neutral-300'
                  }`}
                >
                  <div className="text-[11px] font-semibold">{tmpl.label}</div>
                  <div className="text-[9px] text-slate-400 font-mono">{tmpl.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SHARED GAP CONTROLS ---------------- */}
      <div className="pt-2 border-t border-slate-200 dark:border-neutral-800">
        <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5">
          Grid / Flex Gap Spacing
        </label>
        <div className="grid grid-cols-6 gap-1 p-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
          {(['none', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onChange('gap', g)}
              className={`py-1.5 rounded-md text-[10px] font-medium transition-all text-center uppercase ${
                effectiveLayout.gap === g
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
