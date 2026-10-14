'use client';

import React from 'react';
import { ElementStyles, BlockStyles } from '../../../../shared/types';
import {
  Palette,
  Image as ImageIcon,
  Square,
  Maximize2,
  Minimize2,
  Sliders,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sun,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';
import { Input } from '../ui/input';

interface StylesPanelProps {
  styles?: ElementStyles | BlockStyles;
  onChange: (key: string, value: any) => void;
  isElement?: boolean;
  isContainer?: boolean;
}

export function StylesPanel({
  styles = {},
  onChange,
  isElement = false,
  isContainer = false,
}: StylesPanelProps) {
  const s = styles as Record<string, any>;

  const colorPresets = [
    { label: 'Transparent', value: 'transparent' },
    { label: 'Dark Navy', value: '#090a0f' },
    { label: 'Slate 900', value: '#0f172a' },
    { label: 'Zinc 900', value: '#18181b' },
    { label: 'White', value: '#ffffff' },
    { label: 'Slate 100', value: '#f1f5f9' },
    { label: 'Blue 600', value: '#2563eb' },
    { label: 'Emerald 600', value: '#059669' },
    { label: 'Violet 600', value: '#7c3aed' },
    { label: 'Amber 500', value: '#f59e0b' },
    { label: 'Rose 600', value: '#e11d48' },
  ];

  const sampleImages = [
    {
      label: 'Abstract Dark',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    },
    {
      label: 'Modern Gradient',
      url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
    },
    {
      label: 'Neon Wave',
      url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  return (
    <div className="space-y-5 text-xs select-none">
      {/* ======================================================== */}
      {/* 1. BACKGROUND (COLOR & IMAGE)                            */}
      {/* ======================================================== */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-neutral-200">
          <Palette className="w-3.5 h-3.5 text-blue-500" />
          <span>Background</span>
        </div>

        {/* Background Color Picker */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5">
            Background Color
          </label>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-lg border border-slate-200 dark:border-neutral-800 overflow-hidden shrink-0 shadow-xs">
              <input
                type="color"
                value={s.backgroundColor?.startsWith('#') ? s.backgroundColor : '#090a0f'}
                onChange={(e) => onChange('backgroundColor', e.target.value)}
                className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                title="Choose background color"
              />
            </div>
            <Input
              value={s.backgroundColor ?? ''}
              placeholder="e.g. #090a0f or transparent"
              onChange={(e) => onChange('backgroundColor', e.target.value)}
              className="font-mono text-xs flex-1 h-8"
            />
          </div>

          {/* Color Presets */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {colorPresets.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => onChange('backgroundColor', c.value)}
                className="w-5 h-5 rounded-md border border-slate-300 dark:border-neutral-700 hover:scale-110 transition-transform shadow-xs shrink-0"
                style={{
                  backgroundColor: c.value === 'transparent' ? 'transparent' : c.value,
                  backgroundImage:
                    c.value === 'transparent'
                      ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                      : undefined,
                  backgroundSize: '6px 6px',
                }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Background Image URL */}
        <div className="pt-2 border-t border-slate-200 dark:border-neutral-900">
          <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
            Background Image URL
          </label>
          <div className="flex items-center gap-1.5">
            <Input
              value={s.backgroundImage ?? ''}
              placeholder="https://images.unsplash.com/..."
              onChange={(e) => onChange('backgroundImage', e.target.value)}
              className="font-mono text-xs flex-1 h-8"
            />
            {s.backgroundImage && (
              <button
                type="button"
                onClick={() => onChange('backgroundImage', '')}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-neutral-800 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick preset background images */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-[10px] text-slate-400 dark:text-neutral-500">Presets:</span>
            {sampleImages.map((img) => (
              <button
                key={img.label}
                type="button"
                onClick={() => onChange('backgroundImage', img.url)}
                className="text-[10px] text-blue-500 dark:text-blue-400 hover:underline px-1 py-0.5"
              >
                {img.label}
              </button>
            ))}
          </div>

          {/* Image Overlay Opacity (if image present) */}
          {s.backgroundImage && (
            <div className="mt-2.5 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-neutral-400">
                <span>Dark Overlay Tint</span>
                <span className="font-mono">{Math.round((s.backgroundOverlay ?? 0.75) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={s.backgroundOverlay ?? 0.75}
                onChange={(e) => onChange('backgroundOverlay', parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-neutral-800 rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. BORDER SIZE, COLOR & STYLE                            */}
      {/* ======================================================== */}
      <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-neutral-900">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-neutral-200">
          <Square className="w-3.5 h-3.5 text-indigo-500" />
          <span>Border &amp; Corners</span>
        </div>

        {/* Border Size / Width */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5">
            Border Width (Size)
          </label>
          <div className="grid grid-cols-5 gap-1">
            {[0, 1, 2, 4, 8].map((size) => {
              const active = (s.borderWidth ?? (isElement ? 0 : 1)) === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onChange('borderWidth', size)}
                  className={`py-1.5 rounded-lg border text-center font-mono text-xs transition-colors ${
                    active
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-white font-bold'
                      : 'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {size}px
                </button>
              );
            })}
          </div>
        </div>

        {/* Border Color */}
        {(s.borderWidth ?? 0) > 0 && (
          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5">
              Border Color
            </label>
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-lg border border-slate-200 dark:border-neutral-800 overflow-hidden shrink-0 shadow-xs">
                <input
                  type="color"
                  value={s.borderColor?.startsWith('#') ? s.borderColor : '#262626'}
                  onChange={(e) => onChange('borderColor', e.target.value)}
                  className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                  title="Choose border color"
                />
              </div>
              <Input
                value={s.borderColor ?? ''}
                placeholder="e.g. #3b82f6 or #262626"
                onChange={(e) => onChange('borderColor', e.target.value)}
                className="font-mono text-xs flex-1 h-8"
              />
            </div>
          </div>
        )}

        {/* Border Style */}
        {(s.borderWidth ?? 0) > 0 && (
          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5">
              Border Style
            </label>
            <div className="grid grid-cols-4 gap-1">
              {[
                { id: 'solid', label: 'Solid' },
                { id: 'dashed', label: 'Dashed' },
                { id: 'dotted', label: 'Dotted' },
                { id: 'none', label: 'None' },
              ].map((style) => {
                const active = (s.borderStyle || 'solid') === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => onChange('borderStyle', style.id)}
                    className={`py-1 text-[11px] rounded-lg border text-center transition-colors ${
                      active
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-white font-semibold'
                        : 'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400'
                    }`}
                  >
                    {style.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Border Radius */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5">
            Corner Radius
          </label>
          <div className="grid grid-cols-4 gap-1">
            {[
              { id: 'none', label: '0px' },
              { id: 'sm', label: 'SM' },
              { id: 'md', label: 'MD' },
              { id: 'lg', label: 'LG' },
              { id: 'xl', label: 'XL' },
              { id: '2xl', label: '2XL' },
              { id: 'full', label: 'Pill' },
            ].map((r) => {
              const active = (s.borderRadius || (isContainer ? '2xl' : 'lg')) === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onChange('borderRadius', r.id)}
                  className={`py-1 text-[11px] rounded-lg border text-center transition-colors ${
                    active
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-white font-semibold'
                      : 'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400'
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. TYPOGRAPHY & TEXT COLORING                            */}
      {/* ======================================================== */}
      <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-neutral-900">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-neutral-200">
          <Type className="w-3.5 h-3.5 text-amber-500" />
          <span>Text &amp; Coloring</span>
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5">
            Text Color
          </label>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-lg border border-slate-200 dark:border-neutral-800 overflow-hidden shrink-0 shadow-xs">
              <input
                type="color"
                value={s.textColor?.startsWith('#') ? s.textColor : '#ffffff'}
                onChange={(e) => onChange('textColor', e.target.value)}
                className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                title="Choose text color"
              />
            </div>
            <Input
              value={s.textColor ?? ''}
              placeholder="e.g. #ffffff or #0f172a"
              onChange={(e) => onChange('textColor', e.target.value)}
              className="font-mono text-xs flex-1 h-8"
            />
          </div>
        </div>

        {/* Accent / CTA Color */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5">
            Accent / CTA Color
          </label>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-lg border border-slate-200 dark:border-neutral-800 overflow-hidden shrink-0 shadow-xs">
              <input
                type="color"
                value={s.accentColor?.startsWith('#') ? s.accentColor : '#10b981'}
                onChange={(e) => onChange('accentColor', e.target.value)}
                className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                title="Choose accent color"
              />
            </div>
            <Input
              value={s.accentColor ?? ''}
              placeholder="e.g. #10b981 or #3b82f6"
              onChange={(e) => onChange('accentColor', e.target.value)}
              className="font-mono text-xs flex-1 h-8"
            />
          </div>
        </div>

        {/* Element Font Size (if element) */}
        {isElement && (
          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5">
              Font Size
            </label>
            <div className="grid grid-cols-4 gap-1">
              {[
                { id: 'xs', label: 'XS' },
                { id: 'sm', label: 'SM' },
                { id: 'base', label: 'Base' },
                { id: 'lg', label: 'LG' },
                { id: 'xl', label: 'XL' },
                { id: '2xl', label: '2XL' },
                { id: '3xl', label: '3XL' },
              ].map((f) => {
                const active = s.fontSize === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onChange('fontSize', f.id)}
                    className={`py-1 text-[11px] rounded-lg border text-center transition-colors ${
                      active
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-white font-semibold'
                        : 'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Element Text Alignment (if element) */}
        {isElement && (
          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5">
              Text Alignment
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'left', icon: <AlignLeft className="w-3.5 h-3.5" />, label: 'Left' },
                { id: 'center', icon: <AlignCenter className="w-3.5 h-3.5" />, label: 'Center' },
                { id: 'right', icon: <AlignRight className="w-3.5 h-3.5" />, label: 'Right' },
              ].map((al) => {
                const active = (s.textAlign || 'left') === al.id;
                return (
                  <button
                    key={al.id}
                    type="button"
                    onClick={() => onChange('textAlign', al.id)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg border text-xs transition-colors ${
                      active
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-white font-semibold'
                        : 'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400'
                    }`}
                  >
                    {al.icon}
                    <span>{al.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Container Font Family */}
        {isContainer && (
          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5">
              Font Family
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'sans', label: 'Geist Sans' },
                { id: 'serif', label: 'Playfair Serif' },
                { id: 'mono', label: 'JetBrains Mono' },
                { id: 'space', label: 'Space Grotesk' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onChange('fontFamily', f.id)}
                  className={`p-2 rounded-lg border text-left text-xs transition-colors ${
                    (s.fontFamily || 'sans') === f.id
                      ? 'border-slate-400 dark:border-neutral-400 bg-slate-200 dark:bg-neutral-800 text-slate-900 dark:text-white font-semibold'
                      : 'border-slate-200 dark:border-neutral-800 bg-slate-50/80 dark:bg-neutral-900/60 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. SPACING (PADDING & MARGIN)                            */}
      {/* ======================================================== */}
      <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-neutral-900">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-neutral-200">
          <Maximize2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Spacing &amp; Padding</span>
        </div>

        {/* Padding */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5">
            Internal Padding
          </label>
          <div className="grid grid-cols-4 gap-1">
            {[
              { id: 'none', label: '0px' },
              { id: 'xs', label: '4px' },
              { id: 'sm', label: '8px' },
              { id: 'md', label: '16px' },
              { id: 'lg', label: '24px' },
              { id: 'xl', label: '32px' },
              { id: '2xl', label: '40px' },
            ].map((p) => {
              const active = (s.padding || (isContainer ? 'md' : 'none')) === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onChange('padding', p.id)}
                  className={`py-1 text-[11px] rounded-lg border text-center transition-colors ${
                    active
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-white font-semibold'
                      : 'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Margin */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5">
            Outer Margin
          </label>
          <div className="grid grid-cols-4 gap-1">
            {[
              { id: 'none', label: '0px' },
              { id: 'xs', label: '4px' },
              { id: 'sm', label: '8px' },
              { id: 'md', label: '12px' },
              { id: 'lg', label: '16px' },
              { id: 'xl', label: '24px' },
            ].map((m) => {
              const active = (s.margin || 'none') === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChange('margin', m.id)}
                  className={`py-1 text-[11px] rounded-lg border text-center transition-colors ${
                    active
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-white font-semibold'
                      : 'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. EFFECTS (SHADOW & OPACITY)                            */}
      {/* ======================================================== */}
      <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-neutral-900">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-neutral-200">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span>Effects &amp; Elevation</span>
        </div>

        {/* Shadow */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5">
            Drop Shadow
          </label>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'none', label: 'None' },
              { id: 'sm', label: 'Subtle' },
              { id: 'md', label: 'Medium' },
              { id: 'lg', label: 'Large' },
              { id: 'xl', label: 'Float' },
              { id: '2xl', label: 'Dramatic' },
            ].map((sh) => {
              const active = (s.shadow || 'none') === sh.id;
              return (
                <button
                  key={sh.id}
                  type="button"
                  onClick={() => onChange('shadow', sh.id)}
                  className={`py-1 text-[11px] rounded-lg border text-center transition-colors ${
                    active
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-white font-semibold'
                      : 'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400'
                  }`}
                >
                  {sh.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Opacity */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-neutral-400">
            <span>Opacity</span>
            <span className="font-mono">{s.opacity ?? 100}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={s.opacity ?? 100}
            onChange={(e) => onChange('opacity', parseInt(e.target.value, 10))}
            className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-neutral-800 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
