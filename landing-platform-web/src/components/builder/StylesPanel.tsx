'use client';

import React from 'react';
import { ElementStyles, BlockStyles, StyleClass, DesignTokens } from '../../../../shared/types';
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
  Layers,
  X,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { Input } from '../ui/input';
import { ImageSourcePicker } from './ImageSourcePicker';
import { useTheme } from '../theme/ThemeProvider';
import { ClassSelectorManager } from './ClassSelectorManager';

interface StylesPanelProps {
  styles?: ElementStyles | BlockStyles;
  onChange: (key: string, value: any) => void;
  isElement?: boolean;
  isContainer?: boolean;
  defaultAccentColor?: string;
  defaultAccentGradient?: string;
  viewport?: 'desktop' | 'tablet' | 'mobile';
  onViewportChange?: (vp: 'desktop' | 'tablet' | 'mobile') => void;
  onResetBreakpoint?: (vp: 'tablet' | 'mobile') => void;
  classNames?: string[];
  styleClasses?: StyleClass[];
  tokens?: DesignTokens;
  onAddClass?: (name: string) => void;
  onRemoveClass?: (name: string) => void;
  onCreateClass?: (name: string) => void;
  targetClassName?: string | null;
  onSelectTargetClass?: (name: string | null) => void;
  isEditingSharedClass?: boolean;
  onToggleEditSharedClass?: (enabled: boolean) => void;
  onOpenTokensModal?: () => void;
}

export function StylesPanel({
  styles = {},
  onChange,
  isElement = false,
  isContainer = false,
  defaultAccentColor,
  defaultAccentGradient,
  viewport,
  onViewportChange,
  onResetBreakpoint,
  classNames = [],
  styleClasses = [],
  tokens,
  onAddClass,
  onRemoveClass,
  onCreateClass,
  targetClassName,
  onSelectTargetClass,
  isEditingSharedClass = false,
  onToggleEditSharedClass,
  onOpenTokensModal,
}: StylesPanelProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  const isTablet = viewport === 'tablet';
  const isMobile = viewport === 'mobile';
  const rawStyles = (styles || {}) as Record<string, any>;
  const activeOverrides = isMobile
    ? { ...(rawStyles.tablet || {}), ...(rawStyles.mobile || {}) }
    : isTablet
    ? { ...(rawStyles.tablet || {}) }
    : {};

  const s = {
    ...rawStyles,
    ...activeOverrides,
  };

  const hasTabletOverrides = Boolean(rawStyles.tablet && Object.keys(rawStyles.tablet).length > 0);
  const hasMobileOverrides = Boolean(rawStyles.mobile && Object.keys(rawStyles.mobile).length > 0);
  const hasCurrentOverrides = isTablet ? hasTabletOverrides : isMobile ? hasMobileOverrides : false;

  const colorPresets = [
    { label: 'Transparent', value: 'transparent' },
    { label: 'Primary Brand Token', value: tokens?.colors.primary || '#2563eb' },
    { label: 'Secondary Token', value: tokens?.colors.secondary || '#64748b' },
    { label: 'Accent Token', value: tokens?.colors.accent || '#10b981' },
    { label: 'Dark Navy', value: '#090a0f' },
    { label: 'Slate 900', value: '#0f172a' },
    { label: 'White', value: '#ffffff' },
    { label: 'Slate 100', value: '#f1f5f9' },
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
      {/* 1. Webflow Style Selector (Class Manager) */}
      {onAddClass && onRemoveClass && (
        <ClassSelectorManager
          classNames={classNames}
          styleClasses={styleClasses}
          onAddClassToElement={onAddClass}
          onRemoveClassFromElement={onRemoveClass}
          onCreateClassFromElement={onCreateClass || onAddClass}
          targetClassName={targetClassName}
          onSelectTargetClass={onSelectTargetClass}
          isEditingSharedClass={isEditingSharedClass}
          onToggleEditSharedClass={onToggleEditSharedClass}
        />
      )}

      {/* 2. Global Design Tokens Quick Button */}
      {onOpenTokensModal && (
        <button
          type="button"
          onClick={onOpenTokensModal}
          className="w-full flex items-center justify-between p-2.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-xs">Design System Tokens</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">Configure</span>
        </button>
      )}

      {/* 3. Device Viewport Selector */}
      {onViewportChange && (
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700 dark:text-neutral-200">Device Style View:</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              {viewport || 'desktop'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 bg-slate-200/70 dark:bg-neutral-950 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => onViewportChange('desktop')}
              className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 text-[11px] font-medium transition-all ${
                (viewport || 'desktop') === 'desktop'
                  ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => onViewportChange('tablet')}
              className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 text-[11px] font-medium transition-all ${
                viewport === 'tablet'
                  ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
              {hasTabletOverrides && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Custom tablet style overrides" />}
            </button>
            <button
              type="button"
              onClick={() => onViewportChange('mobile')}
              className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 text-[11px] font-medium transition-all ${
                viewport === 'mobile'
                  ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
              {hasMobileOverrides && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Custom mobile style overrides" />}
            </button>
          </div>
          <div className="flex items-center justify-between pt-1">
            <p className="text-[10px] text-slate-500 dark:text-neutral-400 leading-tight">
              {viewport === 'desktop'
                ? 'Base styles: applied to all devices unless overridden.'
                : hasCurrentOverrides
                ? `✓ Custom styles active for ${viewport === 'tablet' ? 'Tablet' : 'Mobile'}.`
                : `Inheriting from ${viewport === 'mobile' ? 'Tablet/Desktop' : 'Desktop'}. Edit below to override.`}
            </p>
            {hasCurrentOverrides && onResetBreakpoint && (
              <button
                type="button"
                onClick={() => onResetBreakpoint(viewport as 'tablet' | 'mobile')}
                className="text-[10px] text-red-500 hover:text-red-400 underline font-medium shrink-0 ml-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}
      {/* ======================================================== */}
      {/* 4. BACKGROUND (COLOR & IMAGE)                            */}
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
                value={s.backgroundColor?.startsWith('#') ? s.backgroundColor : (isLight ? '#ffffff' : '#090a0f')}
                onChange={(e) => onChange('backgroundColor', e.target.value)}
                className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                title="Choose background color"
              />
            </div>
            <Input
              value={s.backgroundColor ?? ''}
              placeholder={isLight ? 'e.g. #ffffff or transparent' : 'e.g. #090a0f or transparent'}
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

        {/* Background Image (URL or Device Upload) */}
        <div className="pt-2 border-t border-slate-200 dark:border-neutral-900">
          <ImageSourcePicker
            label="Background Image"
            value={s.backgroundImage ?? ''}
            onChange={(val) => onChange('backgroundImage', val)}
            placeholder="Enter image URL or choose file from device..."
          />

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

        {/* Section / Element Text Color */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-medium text-slate-600 dark:text-neutral-400">
              {isElement ? 'Text Color' : 'Section Text Color'}
            </label>
            <span className="text-[10px] text-slate-400">Headings &amp; Body</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-lg border border-slate-200 dark:border-neutral-800 overflow-hidden shrink-0 shadow-xs">
              <input
                type="color"
                value={s.textColor?.startsWith('#') ? s.textColor : (isLight ? '#0f172a' : '#ffffff')}
                onChange={(e) => onChange('textColor', e.target.value)}
                className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                title="Choose text color"
              />
            </div>
            <Input
              value={s.textColor ?? ''}
              placeholder={isLight ? 'e.g. #0f172a' : 'e.g. #ffffff'}
              onChange={(e) => onChange('textColor', e.target.value)}
              className="font-mono text-xs flex-1 h-8"
            />
          </div>
        </div>

        {/* Accent / CTA Color */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-medium text-slate-600 dark:text-neutral-400">
              Accent / CTA Color
            </label>
            {s.accentColor && (
              <button
                type="button"
                onClick={() => onChange('accentColor', '')}
                className="text-[10px] text-slate-400 hover:text-red-500 hover:underline"
              >
                Reset to default
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-lg border border-slate-200 dark:border-neutral-800 overflow-hidden shrink-0 shadow-xs">
              <input
                type="color"
                value={s.accentColor?.startsWith('#') ? s.accentColor : (defaultAccentColor || '#ff2d9b')}
                onChange={(e) => onChange('accentColor', e.target.value)}
                className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                title="Choose accent color"
              />
              {!s.accentColor && defaultAccentGradient && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: defaultAccentGradient.startsWith('linear-gradient')
                      ? defaultAccentGradient
                      : 'linear-gradient(to right, #ff2d9b, #ff7a2f, #ffd21f)',
                  }}
                  title="Default template gradient"
                />
              )}
            </div>
            <Input
              value={s.accentColor ?? ''}
              placeholder={
                defaultAccentGradient && !s.accentColor
                  ? 'Default: Template Gradient'
                  : defaultAccentColor
                  ? `Default: ${defaultAccentColor}`
                  : 'e.g. #ff2d9b or #10b981'
              }
              onChange={(e) => onChange('accentColor', e.target.value)}
              className="font-mono text-xs flex-1 h-8"
            />
          </div>
          {!s.accentColor && defaultAccentGradient && (
            <p className="text-[10px] text-slate-400 dark:text-neutral-500 mt-1">
              Using template default gradient. Pick a color to override.
            </p>
          )}
        </div>

        {/* ======================================================== */}
        {/* ELEMENT TYPOGRAPHY (IF ELEMENT)                          */}
        {/* ======================================================== */}
        {isElement && (
          <>
            {/* Element Font Size */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-medium text-slate-600 dark:text-neutral-400">
                  Font Size {viewport && <span className="uppercase text-[9px] text-blue-600 dark:text-blue-400">({viewport})</span>}
                </label>
                {s.fontSize && (
                  <button
                    type="button"
                    onClick={() => onChange('fontSize', undefined)}
                    className="text-[10px] text-slate-400 hover:text-blue-500 hover:underline"
                  >
                    Default
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { id: 'xs', label: 'XS', px: '12px' },
                  { id: 'sm', label: 'SM', px: '14px' },
                  { id: 'base', label: 'Base', px: '16px' },
                  { id: 'lg', label: 'LG', px: '18px' },
                  { id: 'xl', label: 'XL', px: '20px' },
                  { id: '2xl', label: '2XL', px: '24px' },
                  { id: '3xl', label: '3XL', px: '30px' },
                ].map((f) => {
                  const active = s.fontSize === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => onChange('fontSize', f.id)}
                      className={`py-1 px-1 rounded-lg border text-center transition-colors flex flex-col items-center justify-center ${
                        active
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-white font-semibold shadow-xs'
                          : 'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 hover:border-slate-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      <span className="text-[11px] font-medium">{f.label}</span>
                      <span className="text-[9px] opacity-60 leading-none">{f.px}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Element Text Alignment */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-medium text-slate-600 dark:text-neutral-400">
                  Text Alignment {viewport && <span className="uppercase text-[9px] text-blue-600 dark:text-blue-400">({viewport})</span>}
                </label>
                {s.textAlign && (
                  <button
                    type="button"
                    onClick={() => onChange('textAlign', undefined)}
                    className="text-[10px] text-slate-400 hover:text-blue-500 hover:underline"
                  >
                    Default
                  </button>
                )}
              </div>
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
          </>
        )}

        {/* ======================================================== */}
        {/* SECTION & CONTAINER TYPOGRAPHY (IF SECTION / CONTAINER)  */}
        {/* ======================================================== */}
        {!isElement && (
          <>
            {/* Section Headline Font Size (H1 / H2) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <label className="text-[11px] font-medium text-slate-700 dark:text-neutral-300">
                    Headline Size (H1/H2)
                  </label>
                  {viewport && (
                    <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {viewport}
                    </span>
                  )}
                </div>
                {s.headlineFontSize && (
                  <button
                    type="button"
                    onClick={() => onChange('headlineFontSize', undefined)}
                    className="text-[10px] text-blue-500 hover:underline font-medium"
                  >
                    Reset Default
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { id: 'sm', label: 'SM', px: '24px' },
                  { id: 'md', label: 'MD', px: '30px' },
                  { id: 'lg', label: 'LG', px: '36px' },
                  { id: 'xl', label: 'XL', px: '48px' },
                  { id: '2xl', label: '2XL', px: '60px' },
                  { id: '3xl', label: '3XL', px: '72px' },
                  { id: '4xl', label: '4XL', px: '84px' },
                ].map((hf) => {
                  const active = s.headlineFontSize === hf.id;
                  return (
                    <button
                      key={hf.id}
                      type="button"
                      onClick={() => onChange('headlineFontSize', hf.id)}
                      className={`py-1 px-1 rounded-lg border text-center transition-all flex flex-col items-center justify-center ${
                        active
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-white font-semibold shadow-xs ring-1 ring-blue-500/20'
                          : 'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 hover:border-slate-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      <span className="text-[11px] font-medium">{hf.label}</span>
                      <span className="text-[9px] opacity-60 leading-none">{hf.px}</span>
                    </button>
                  );
                })}
              </div>
              {!s.headlineFontSize && (
                <p className="text-[10px] text-slate-400 dark:text-neutral-500 mt-1">
                  Using section template default heading scale.
                </p>
              )}
            </div>

            {/* Section Body / Text Font Size */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <label className="text-[11px] font-medium text-slate-700 dark:text-neutral-300">
                    Body / Paragraph Size
                  </label>
                  {viewport && (
                    <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {viewport}
                    </span>
                  )}
                </div>
                {s.fontSize && (
                  <button
                    type="button"
                    onClick={() => onChange('fontSize', undefined)}
                    className="text-[10px] text-blue-500 hover:underline font-medium"
                  >
                    Reset Default
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { id: 'xs', label: 'XS', px: '12px' },
                  { id: 'sm', label: 'SM', px: '14px' },
                  { id: 'base', label: 'Base', px: '16px' },
                  { id: 'lg', label: 'LG', px: '18px' },
                  { id: 'xl', label: 'XL', px: '20px' },
                  { id: '2xl', label: '2XL', px: '24px' },
                  { id: '3xl', label: '3xl', px: '30px' },
                ].map((f) => {
                  const active = s.fontSize === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => onChange('fontSize', f.id)}
                      className={`py-1 px-1 rounded-lg border text-center transition-all flex flex-col items-center justify-center ${
                        active
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-white font-semibold shadow-xs ring-1 ring-blue-500/20'
                          : 'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 hover:border-slate-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      <span className="text-[11px] font-medium">{f.label}</span>
                      <span className="text-[9px] opacity-60 leading-none">{f.px}</span>
                    </button>
                  );
                })}
              </div>
              {!s.fontSize && (
                <p className="text-[10px] text-slate-400 dark:text-neutral-500 mt-1">
                  Using section template default text size.
                </p>
              )}
            </div>

            {/* Section Text Alignment */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <label className="text-[11px] font-medium text-slate-700 dark:text-neutral-300">
                    Section Text Alignment
                  </label>
                  {viewport && (
                    <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {viewport}
                    </span>
                  )}
                </div>
                {s.textAlign && (
                  <button
                    type="button"
                    onClick={() => onChange('textAlign', undefined)}
                    className="text-[10px] text-blue-500 hover:underline font-medium"
                  >
                    Reset Default
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: 'left', icon: <AlignLeft className="w-3.5 h-3.5" />, label: 'Left' },
                  { id: 'center', icon: <AlignCenter className="w-3.5 h-3.5" />, label: 'Center' },
                  { id: 'right', icon: <AlignRight className="w-3.5 h-3.5" />, label: 'Right' },
                ].map((al) => {
                  const active = s.textAlign === al.id;
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

            {/* Section Font Family */}
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
          </>
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
          <Sun className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400" />
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
