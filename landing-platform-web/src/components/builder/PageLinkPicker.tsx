'use client';

import React, { useState, useEffect } from 'react';
import { PagesApiClient } from '@/lib/api-client';
import { LocalPersistence } from '@/lib/local-persistence';
import { PageSummary } from '../../../../shared/types';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Link as LinkIcon,
  ExternalLink,
  ChevronDown,
  Layers,
  ArrowRight,
  Globe,
  Sparkles,
} from 'lucide-react';

interface PageLinkPickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  showTestButton?: boolean;
}

export function PageLinkPicker({
  label = 'Tautkan ke Halaman Toko (Inter-Page Link)',
  value,
  onChange,
  helperText = 'Pilih halaman tujuan atau ketik URL kustom.',
  showTestButton = true,
}: PageLinkPickerProps) {
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [mode, setMode] = useState<'picker' | 'custom'>('picker');

  useEffect(() => {
    // 1. Load from local cache immediately
    const local = LocalPersistence.getIndex();
    setPages(local);

    // 2. Fetch fresh from API
    PagesApiClient.getProjectPages()
      .then((serverPages) => {
        if (serverPages && serverPages.length > 0) {
          setPages(serverPages);
        }
      })
      .catch(() => {
        // Use local fallback
      });
  }, []);

  // Standard funnel pages
  const defaultFunnelPages = [
    { title: 'Storefront / Katalog Produk', slug: 'sales-page' },
    { title: 'Formulir Checkout', slug: 'checkout-page' },
    { title: 'Instruksi Pembayaran (QRIS/VA)', slug: 'payment-instruction' },
    { title: 'Halaman Sukses & Konfirmasi', slug: 'thank-you-page' },
  ];

  // Merge unique pages
  const allAvailablePages: { title: string; slug: string; isFunnel?: boolean }[] = [
    ...defaultFunnelPages.map((p) => ({ ...p, isFunnel: true })),
  ];

  pages.forEach((p) => {
    const cleanSlug = p.slug.replace(/^\/+/, '');
    if (!allAvailablePages.some((item) => item.slug === cleanSlug)) {
      allAvailablePages.push({ title: p.title || p.slug, slug: cleanSlug });
    }
  });

  const isMatchedPage = allAvailablePages.some((p) => `/p/${p.slug}` === value || p.slug === value);

  return (
    <div className="space-y-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/60 dark:bg-neutral-900/40">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-slate-800 dark:text-neutral-200 flex items-center gap-1.5">
          <LinkIcon className="w-3.5 h-3.5 text-blue-500" />
          <span>{label}</span>
        </label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMode(mode === 'picker' ? 'custom' : 'picker')}
            className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {mode === 'picker' ? 'Input Manual URL' : 'Pilih dari Daftar Halaman'}
          </button>
        </div>
      </div>

      {mode === 'picker' ? (
        <div className="space-y-1.5">
          <div className="relative">
            <select
              value={allAvailablePages.some((p) => `/p/${p.slug}` === value) ? value : isMatchedPage ? `/p/${value}` : ''}
              onChange={(e) => {
                const target = e.target.value;
                if (target === '__custom__') {
                  setMode('custom');
                } else if (target) {
                  onChange(target);
                }
              }}
              className="w-full text-xs p-2 pr-8 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white font-medium focus:ring-1 focus:ring-blue-500 focus:outline-hidden appearance-none cursor-pointer"
            >
              <option value="">-- Pilih Halaman Tujuan --</option>
              <optgroup label="Alur Funnel E-Commerce (Rekomendasi)">
                {defaultFunnelPages.map((p) => (
                  <option key={p.slug} value={`/p/${p.slug}`}>
                    🎯 {p.title} (/p/{p.slug})
                  </option>
                ))}
              </optgroup>
              {allAvailablePages.filter((p) => !p.isFunnel).length > 0 && (
                <optgroup label="Halaman Toko Anda">
                  {allAvailablePages
                    .filter((p) => !p.isFunnel)
                    .map((p) => (
                      <option key={p.slug} value={`/p/${p.slug}`}>
                        📄 {p.title} (/p/{p.slug})
                      </option>
                    ))}
                </optgroup>
              )}
              <option value="__custom__">🔗 Input URL Kustom Lainnya...</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Quick link chips */}
          <div className="flex flex-wrap gap-1 pt-0.5">
            {defaultFunnelPages.map((p) => {
              const target = `/p/${p.slug}`;
              const active = value === target;
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => onChange(target)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${active
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-400 text-blue-600 dark:text-blue-300 font-semibold'
                      : 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-400 hover:border-slate-300'
                    }`}
                >
                  /{p.slug}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Contoh: /p/checkout-page atau https://..."
            className="text-xs h-8 bg-white dark:bg-neutral-900"
          />
        </div>
      )}

      {/* Status & Test Preview */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-neutral-400 pt-0.5">
        <span className="truncate max-w-50 font-mono">
          Target: <span className="text-slate-800 dark:text-neutral-200 font-bold">{value || '-'}</span>
        </span>
        {showTestButton && value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            <span>Buka Test</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
