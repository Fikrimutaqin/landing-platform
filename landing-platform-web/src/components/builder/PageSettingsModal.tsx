'use client';

import React, { useState } from 'react';
import {
  X,
  Check,
} from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

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
  // Per-Page Marketing & Tracking Pixels
  facebookPixelId?: string;
  onFacebookPixelIdChange?: (id: string) => void;
  tiktokPixelId?: string;
  onTiktokPixelIdChange?: (id: string) => void;
  googleAnalyticsId?: string;
  onGoogleAnalyticsIdChange?: (id: string) => void;
  customHeadScripts?: string;
  onCustomHeadScriptsChange?: (scripts: string) => void;
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
  facebookPixelId = '',
  onFacebookPixelIdChange,
  tiktokPixelId = '',
  onTiktokPixelIdChange,
  googleAnalyticsId = '',
  onGoogleAnalyticsIdChange,
  customHeadScripts = '',
  onCustomHeadScriptsChange,
}: PageSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'pixels'>('general');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-neutral-900 bg-slate-50/80 dark:bg-neutral-950/80">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Pengaturan Halaman
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
              Konfigurasi slug URL, metadata pencarian, dan pixel analitik.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-neutral-900 px-5 bg-white dark:bg-neutral-950 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-2.5 px-3 font-medium border-b-2 transition-all ${
              activeTab === 'general'
                ? 'border-blue-600 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Umum
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`py-2.5 px-3 font-medium border-b-2 transition-all ${
              activeTab === 'seo'
                ? 'border-blue-600 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            SEO &amp; Metadata
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pixels')}
            className={`py-2.5 px-3 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'pixels'
                ? 'border-blue-600 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Tracking Pixel</span>
            {(facebookPixelId || tiktokPixelId || googleAnalyticsId) && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-700 dark:text-neutral-300">
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                  Judul Halaman (Internal)
                </label>
                <Input
                  value={pageName}
                  onChange={(e) => onPageNameChange(e.target.value)}
                  placeholder="e.g. Landing Page Promo Ramadhan"
                  className="text-xs h-8"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                  URL Slug
                </label>
                <div className="flex items-center rounded-lg border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 overflow-hidden">
                  <span className="px-3 py-1.5 text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-neutral-950 border-r border-slate-200 dark:border-neutral-800">
                    {customDomain ? `https://${customDomain}/p/` : 'https://toko.com/p/'}
                  </span>
                  <input
                    type="text"
                    value={pageSlug}
                    onChange={(e) => onPageSlugChange?.(e.target.value)}
                    placeholder="promo-ramadhan"
                    className="flex-1 px-2.5 py-1.5 text-xs font-mono bg-transparent text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SEO & SOCIAL GRAPH */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                  Meta Title
                </label>
                <Input
                  value={metaTitle || pageName}
                  onChange={(e) => onMetaTitleChange?.(e.target.value)}
                  placeholder="Judul yang tampil di tab browser dan hasil pencarian"
                  className="text-xs h-8"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                  Meta Description
                </label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => onMetaDescriptionChange?.(e.target.value)}
                  rows={3}
                  placeholder="Deskripsi singkat halaman untuk hasil pencarian..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Google Preview */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Preview Google Search
                </span>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium truncate">
                  {metaTitle || pageName || 'Toko Online'}
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 truncate font-mono">
                  https://{customDomain}/p/{pageSlug}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {metaDescription ||
                    'Dapatkan penawaran terbaik dengan proses pemesanan cepat dan aman.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: MARKETING TRACKING PIXELS */}
          {activeTab === 'pixels' && (
            <div className="space-y-4">
              {/* Facebook Pixel ID */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-medium text-slate-900 dark:text-white">
                      Facebook Pixel ID (Meta)
                    </label>
                    <span className="text-[10px] text-slate-400">ID Pelacakan dari Meta Events Manager</span>
                  </div>
                  {facebookPixelId ? (
                    <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-300 text-[10px] font-mono">
                      Aktif
                    </Badge>
                  ) : (
                    <span className="text-[10px] text-slate-400">Belum diatur</span>
                  )}
                </div>

                <Input
                  value={facebookPixelId}
                  onChange={(e) => onFacebookPixelIdChange?.(e.target.value)}
                  placeholder="e.g. 123456789012345"
                  className="h-8 text-xs font-mono"
                />
              </div>

              {/* TikTok Pixel ID */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-medium text-slate-900 dark:text-white">
                      TikTok Pixel ID
                    </label>
                    <span className="text-[10px] text-slate-400">ID Pelacakan TikTok Ads Manager</span>
                  </div>
                  {tiktokPixelId ? (
                    <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-300 text-[10px] font-mono">
                      Aktif
                    </Badge>
                  ) : (
                    <span className="text-[10px] text-slate-400">Belum diatur</span>
                  )}
                </div>

                <Input
                  value={tiktokPixelId}
                  onChange={(e) => onTiktokPixelIdChange?.(e.target.value)}
                  placeholder="e.g. C1234567890ABCDEF"
                  className="h-8 text-xs font-mono"
                />
              </div>

              {/* Google Analytics GA4 ID */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-medium text-slate-900 dark:text-white">
                      Google Analytics Measurement ID (GA4)
                    </label>
                    <span className="text-[10px] text-slate-400">Properti Google Analytics 4</span>
                  </div>
                  {googleAnalyticsId ? (
                    <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-300 text-[10px] font-mono">
                      Aktif
                    </Badge>
                  ) : (
                    <span className="text-[10px] text-slate-400">Belum diatur</span>
                  )}
                </div>

                <Input
                  value={googleAnalyticsId}
                  onChange={(e) => onGoogleAnalyticsIdChange?.(e.target.value)}
                  placeholder="e.g. G-XXXXXXXXXX"
                  className="h-8 text-xs font-mono"
                />
              </div>

              {/* Custom Header Tracking Scripts */}
              <div className="pt-2">
                <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                  Custom Head Script (GTM / Script Tambahan)
                </label>
                <textarea
                  value={customHeadScripts}
                  onChange={(e) => onCustomHeadScriptsChange?.(e.target.value)}
                  rows={2}
                  placeholder="<script>/* Custom script */</script>"
                  className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-neutral-900 bg-slate-50/80 dark:bg-neutral-950/80 flex items-center justify-end gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs h-8">
            Batal
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onClose}
            className="text-xs h-8 bg-blue-600 hover:bg-blue-500 text-white font-medium"
          >
            <Check className="w-3.5 h-3.5 mr-1" />
            Terapkan
          </Button>
        </div>
      </div>
    </div>
  );
}
