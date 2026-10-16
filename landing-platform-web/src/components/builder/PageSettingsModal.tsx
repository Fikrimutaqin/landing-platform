'use client';

import React from 'react';
import {
  X,
  Globe,
  FileText,
  Search,
  Share2,
  Check,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface PageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageName: string;
  onPageNameChange: (name: string) => void;
  pageSlug?: string;
  onPageSlugChange?: (slug: string) => void;
  metaTitle?: string;
  onMetaTitleChange?: (title: string) => void;
  metaDescription?: string;
  onMetaDescriptionChange?: (desc: string) => void;
  customDomain?: string;
}

export function PageSettingsModal({
  isOpen,
  onClose,
  pageName,
  onPageNameChange,
  pageSlug = 'home',
  onPageSlugChange,
  metaTitle = '',
  onMetaTitleChange,
  metaDescription = '',
  onMetaDescriptionChange,
  customDomain = 'checkout.merchant-brand.com',
}: PageSettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-neutral-900 bg-slate-50/80 dark:bg-neutral-950/80">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Page Settings &amp; SEO Configuration
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-700 dark:text-neutral-300">
          {/* General Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>General Settings</span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                Page Title (Internal)
              </label>
              <Input
                value={pageName}
                onChange={(e) => onPageNameChange(e.target.value)}
                placeholder="e.g. Mechanical Keyboard Kit Landing"
                className="text-xs h-8"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                URL Slug
              </label>
              <div className="flex items-center rounded-lg border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 overflow-hidden">
                <span className="px-3 py-1.5 text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-neutral-950 border-r border-slate-200 dark:border-neutral-800">
                  {customDomain ? `https://${customDomain}/` : 'https://brand.com/'}
                </span>
                <input
                  type="text"
                  value={pageSlug}
                  onChange={(e) => onPageSlugChange?.(e.target.value)}
                  placeholder="edition-01"
                  className="flex-1 px-2.5 py-1.5 text-xs font-mono bg-transparent text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SEO & Search Engine Preview */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-neutral-900">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
              <Search className="w-3.5 h-3.5 text-emerald-500" />
              <span>Search Engine Optimization (SEO)</span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                Meta Title
              </label>
              <Input
                value={metaTitle || pageName}
                onChange={(e) => onMetaTitleChange?.(e.target.value)}
                placeholder="Title shown in Google Search and browser tab"
                className="text-xs h-8"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Recommended length: 50-60 characters
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                Meta Description
              </label>
              <textarea
                value={metaDescription}
                onChange={(e) => onMetaDescriptionChange?.(e.target.value)}
                rows={3}
                placeholder="Brief summary of your landing page for search results..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Google Search Snippet Preview */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Google Search Result Preview
              </span>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium hover:underline truncate">
                {metaTitle || pageName || 'Untitled Page'} · Independent Merchant
              </div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 truncate">
                https://{customDomain}/{pageSlug}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {metaDescription ||
                  'Discover high-performance commerce funnels and precision products engineered for conversion.'}
              </p>
            </div>
          </div>

          {/* Social Share / Open Graph */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-neutral-900">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
              <Share2 className="w-3.5 h-3.5 text-purple-500" />
              <span>Social Media Card (Open Graph)</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400">
              When someone shares your link on WhatsApp, Twitter, or Facebook, the title and preview image will display automatically.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-neutral-900 bg-slate-50/80 dark:bg-neutral-950/80 flex items-center justify-end gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs h-8">
            Done
          </Button>
          <Button variant="default" size="sm" onClick={onClose} className="text-xs h-8">
            <Check className="w-3.5 h-3.5 mr-1" />
            Apply Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
