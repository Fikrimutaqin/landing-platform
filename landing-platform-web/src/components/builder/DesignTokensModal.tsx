'use client';

import React, { useState } from 'react';
import {
  Palette,
  Type,
  Square,
  Sparkles,
  Check,
  RotateCcw,
  X,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { DesignTokens } from '../../../../shared/types';
import { DEFAULT_DESIGN_TOKENS, TOKEN_PRESET_THEMES } from '@/lib/design-tokens';
import { Input } from '../ui/input';

interface DesignTokensModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: DesignTokens;
  onSaveTokens: (newTokens: DesignTokens) => void;
}

export function DesignTokensModal({
  isOpen,
  onClose,
  tokens,
  onSaveTokens,
}: DesignTokensModalProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'presets' | 'shapes'>('colors');
  const [draftTokens, setDraftTokens] = useState<DesignTokens>(JSON.parse(JSON.stringify(tokens)));
  const [appliedPresetId, setAppliedPresetId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleColorChange = (key: keyof DesignTokens['colors'], val: string) => {
    setDraftTokens((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: val,
      },
    }));
  };

  const handleFontChange = (type: 'heading' | 'body', val: any) => {
    setDraftTokens((prev) => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [type]: val,
      },
    }));
  };

  const handleApplyPreset = (theme: typeof TOKEN_PRESET_THEMES[0]) => {
    setDraftTokens(JSON.parse(JSON.stringify(theme.tokens)));
    setAppliedPresetId(theme.id);
  };

  const handleReset = () => {
    setDraftTokens(JSON.parse(JSON.stringify(DEFAULT_DESIGN_TOKENS)));
    setAppliedPresetId(null);
  };

  const handleSave = () => {
    onSaveTokens(draftTokens);
    onClose();
  };

  const colorLabels: Record<keyof DesignTokens['colors'], { label: string; desc: string }> = {
    primary: { label: 'Primary Brand Color', desc: 'Main brand identity, hero CTA buttons, and highlighted badges' },
    secondary: { label: 'Secondary / Subdued', desc: 'Subtitle text, secondary borders, and passive controls' },
    accent: { label: 'Accent / Success', desc: 'Trust markers, highlighted tags, and positive metrics' },
    background: { label: 'Page Background', desc: 'Base surface background for pages and main canvas' },
    surface: { label: 'Card Surface', desc: 'Elevated containers, cards, and input backgrounds' },
    muted: { label: 'Muted Typography', desc: 'Helper text, captions, and placeholders' },
    border: { label: 'Border Default', desc: 'Dividers, grid outlines, and card borders' },
    destructive: { label: 'Destructive / Alert', desc: 'Error states, delete warnings, and urgent notices' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0c0d14] border border-slate-200 dark:border-neutral-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Design System &amp; Global Tokens
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Webflow Architecture
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Configure shared brand colors, typography tokens, and shape scales that cascade across your entire website.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/40 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('colors')}
            className={`pb-2.5 px-3 font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'colors'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Brand Colors ({Object.keys(draftTokens.colors).length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('typography')}
            className={`pb-2.5 px-3 font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'typography'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Typography System</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shapes')}
            className={`pb-2.5 px-3 font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'shapes'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Square className="w-4 h-4" />
            <span>Corners &amp; Shadows</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 px-3 font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'presets'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Preset Themes</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 space-y-4">
            {activeTab === 'colors' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-500 dark:text-neutral-400 mb-2">
                  Edit global brand swatches. Any component referencing these design tokens will automatically inherit these values.
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.keys(colorLabels) as Array<keyof DesignTokens['colors']>).map((key) => {
                    const info = colorLabels[key];
                    const val = draftTokens.colors[key];
                    return (
                      <div
                        key={key}
                        className="p-3 rounded-xl border border-slate-200 dark:border-neutral-800/80 bg-slate-50/50 dark:bg-neutral-900/40 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-800 dark:text-neutral-200">
                            {info.label}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 uppercase">
                            {val}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded-lg border border-slate-300 dark:border-neutral-700 overflow-hidden shrink-0 shadow-xs">
                            <input
                              type="color"
                              value={val}
                              onChange={(e) => handleColorChange(key, e.target.value)}
                              className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
                            />
                          </div>
                          <Input
                            value={val}
                            onChange={(e) => handleColorChange(key, e.target.value)}
                            className="h-8 font-mono text-xs uppercase"
                          />
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-neutral-400 leading-tight">
                          {info.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'typography' && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/40 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 dark:text-neutral-200 mb-1">
                      Display / Heading Font Family
                    </label>
                    <p className="text-[11px] text-slate-500 dark:text-neutral-400 mb-2">
                      Applied to h1, h2, h3, h4 headings, hero banners, and display titles.
                    </p>
                    <select
                      value={draftTokens.fonts?.heading || 'sans'}
                      onChange={(e) => handleFontChange('heading', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white"
                    >
                      <option value="sans">Inter / Modern Sans</option>
                      <option value="space">Space Grotesk (Tech / Editorial)</option>
                      <option value="serif">Playfair / Elegant Serif</option>
                      <option value="mono">JetBrains / Developer Mono</option>
                      <option value="jakarta">Plus Jakarta Sans</option>
                    </select>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-neutral-800">
                    <label className="block text-xs font-semibold text-slate-800 dark:text-neutral-200 mb-1">
                      Body &amp; UI Font Family
                    </label>
                    <p className="text-[11px] text-slate-500 dark:text-neutral-400 mb-2">
                      Applied to paragraphs, buttons, navigation menus, labels, and forms.
                    </p>
                    <select
                      value={draftTokens.fonts?.body || 'sans'}
                      onChange={(e) => handleFontChange('body', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white"
                    >
                      <option value="sans">Inter / Modern Sans</option>
                      <option value="jakarta">Plus Jakarta Sans</option>
                      <option value="mono">JetBrains Mono</option>
                      <option value="serif">Playfair Display Serif</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shapes' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/40 space-y-2">
                  <label className="block text-xs font-semibold text-slate-800 dark:text-neutral-200">
                    Global Border Radius Preset
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 mb-2">
                    Default corner radius across buttons, cards, images, and container blocks.
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setDraftTokens((prev) => ({ ...prev, borderRadius: r }))}
                        className={`p-2.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                          draftTokens.borderRadius === r
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                            : 'border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 text-slate-700 dark:text-neutral-300'
                        }`}
                      >
                        {r.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/40 space-y-2">
                  <label className="block text-xs font-semibold text-slate-800 dark:text-neutral-200">
                    Global Elevation / Box Shadow
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['none', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setDraftTokens((prev) => ({ ...prev, shadow: s }))}
                        className={`p-2.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                          draftTokens.shadow === s
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                            : 'border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 text-slate-700 dark:text-neutral-300'
                        }`}
                      >
                        {s.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'presets' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-500 dark:text-neutral-400 mb-2">
                  Choose from professionally curated brand token themes designed for international SaaS and commerce funnels:
                </div>
                <div className="space-y-2.5">
                  {TOKEN_PRESET_THEMES.map((theme) => {
                    const isSelected = appliedPresetId === theme.id;
                    return (
                      <div
                        key={theme.id}
                        onClick={() => handleApplyPreset(theme)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                            : 'border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 bg-slate-50/60 dark:bg-neutral-900/40'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {theme.name}
                            </span>
                            {isSelected && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                <Check className="w-3 h-3" /> Active
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                            {theme.description}
                          </p>
                        </div>

                        {/* Swatches preview */}
                        <div className="flex items-center gap-1.5 shrink-0 ml-4">
                          <div
                            className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                            style={{ backgroundColor: theme.tokens.colors.primary }}
                            title="Primary"
                          />
                          <div
                            className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                            style={{ backgroundColor: theme.tokens.colors.accent }}
                            title="Accent"
                          />
                          <div
                            className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                            style={{ backgroundColor: theme.tokens.colors.surface }}
                            title="Surface"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Design Token Visualizer Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="text-xs font-bold text-slate-800 dark:text-neutral-300 mb-2 flex items-center justify-between">
              <span>Live Token Preview</span>
              <span className="text-[10px] font-mono font-normal text-slate-400">Preview Canvas</span>
            </div>

            <div
              className="p-5 rounded-2xl border flex-1 flex flex-col justify-between space-y-4 shadow-lg transition-all"
              style={{
                backgroundColor: draftTokens.colors.surface,
                borderColor: draftTokens.colors.border,
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${draftTokens.colors.primary}15`,
                      color: draftTokens.colors.primary,
                    }}
                  >
                    <Sparkles className="w-3 h-3" /> Batch 04 Release
                  </span>
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: draftTokens.colors.accent }}
                  >
                    ● 99.98% Conversion Uptime
                  </span>
                </div>

                <div>
                  <h3
                    className="text-lg font-bold leading-tight"
                    style={{
                      color: draftTokens.colors.primary,
                      fontFamily: draftTokens.fonts?.heading === 'serif' ? 'serif' : draftTokens.fonts?.heading === 'mono' ? 'monospace' : 'sans-serif',
                    }}
                  >
                    Next-Gen Commerce Funnel Infrastructure
                  </h3>
                  <p
                    className="text-xs mt-1 leading-relaxed"
                    style={{ color: draftTokens.colors.muted }}
                  >
                    Instant settlement, automated responsive blocks, and zero drop-off checkouts for independent modern merchants.
                  </p>
                </div>

                <div
                  className="p-3 rounded-xl border flex items-center justify-between"
                  style={{
                    backgroundColor: draftTokens.colors.background,
                    borderColor: draftTokens.colors.border,
                  }}
                >
                  <div>
                    <div className="text-[10px] font-bold" style={{ color: draftTokens.colors.secondary }}>
                      ESTIMATED GROSS
                    </div>
                    <div className="text-sm font-black" style={{ color: draftTokens.colors.primary }}>
                      $24,580.00
                    </div>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                    style={{
                      backgroundColor: `${draftTokens.colors.accent}20`,
                      color: draftTokens.colors.accent,
                    }}
                  >
                    +34.2% Growth
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  className="flex-1 py-2 px-3 text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                  style={{
                    backgroundColor: draftTokens.colors.primary,
                    borderRadius: draftTokens.borderRadius === 'full' ? '9999px' : '10px',
                  }}
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="py-2 px-3 text-xs font-semibold border transition-colors"
                  style={{
                    borderColor: draftTokens.colors.border,
                    color: draftTokens.colors.secondary,
                    borderRadius: draftTokens.borderRadius === 'full' ? '9999px' : '10px',
                  }}
                >
                  Docs
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-800 text-xs font-semibold text-slate-600 dark:text-neutral-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30 transition-transform active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Design Tokens</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
