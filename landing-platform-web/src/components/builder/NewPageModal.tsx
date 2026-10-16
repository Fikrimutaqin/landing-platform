'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FileText, LayoutTemplate, Sparkles, Layers, ArrowRight, X } from 'lucide-react';

interface NewPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePage: (title: string, slug: string, templateKey: string) => void;
  existingSlugs?: string[];
}

export function NewPageModal({
  isOpen,
  onClose,
  onCreatePage,
  existingSlugs = [],
}: NewPageModalProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [templateKey, setTemplateKey] = useState<string>('blank');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugCustomized) {
      const autoSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(autoSlug);
    }
  };

  const handleSlugChange = (val: string) => {
    setIsSlugCustomized(true);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '-')
        .replace(/^-+/, ''),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');

    if (!cleanTitle) {
      setError('Please provide a page title.');
      return;
    }
    if (!cleanSlug) {
      setError('Please provide a valid URL slug.');
      return;
    }
    if (existingSlugs.includes(cleanSlug)) {
      setError(`Slug '/${cleanSlug}' is already in use by another page.`);
      return;
    }

    onCreatePage(cleanTitle, cleanSlug, templateKey);
    // Reset state
    setTitle('');
    setSlug('');
    setIsSlugCustomized(false);
    setError(null);
    onClose();
  };

  const templates = [
    {
      id: 'blank',
      title: 'Blank Canvas',
      desc: 'Start with an empty page container.',
      icon: <Layers className="w-4 h-4 text-slate-500" />,
    },
    {
      id: 'hero_cta',
      title: 'Hero & CTA Funnel',
      desc: 'High-converting headline, lead text, and action buttons.',
      icon: <LayoutTemplate className="w-4 h-4 text-blue-500" />,
    },
    {
      id: 'alex_full',
      title: 'Alex Travis Storefront',
      desc: 'Full 14-section showcase page with dark modern theme.',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-neutral-900 bg-slate-50/80 dark:bg-neutral-950/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Create New Page</h2>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400">Add a new page or funnel step to this project.</p>
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

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
              Page Title
            </label>
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Summer Sale, Pricing, FAQ"
              className="text-xs"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
              URL Slug
            </label>
            <div className="flex items-center rounded-md border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/80 px-2.5">
              <span className="text-xs text-slate-400 select-none">/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="summer-sale"
                className="w-full bg-transparent p-2 text-xs text-slate-900 dark:text-neutral-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
              Starter Template
            </label>
            <div className="grid grid-cols-1 gap-2">
              {templates.map((tmpl) => {
                const isSelected = templateKey === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setTemplateKey(tmpl.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs'
                        : 'border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50 hover:border-slate-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700">
                        {tmpl.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-neutral-100">{tmpl.title}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-neutral-400">{tmpl.desc}</p>
                      </div>
                    </div>
                    {isSelected && <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-neutral-900">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5">
              <span>Create Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
