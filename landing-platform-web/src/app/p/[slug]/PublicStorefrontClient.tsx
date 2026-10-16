'use client';

import React, { useEffect, useState } from 'react';
import { ProductionRenderer } from '@/components/builder/ProductionRenderer';
import { PagesApiClient } from '@/lib/api-client';
import { ALEX_TRAVIS_TEMPLATE } from '@/components/templates/alex-travis-template';
import { ArrowLeft, Globe, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface PublicStorefrontClientProps {
  initialData?: any;
  slug: string;
}

export function PublicStorefrontClient({ initialData, slug }: PublicStorefrontClientProps) {
  const [page, setPage] = useState<any>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) return;

    PagesApiClient.getPublicPage(slug)
      .then((data) => {
        setPage(data);
        setLoading(false);
      })
      .catch((err) => {
        // If it's the home page and empty, provide the default Alex Travis storefront showcase
        if (slug === 'home') {
          setPage({
            title: 'Alex Travis — Creative Direction & Strategy',
            slug: 'home',
            status: 'PUBLISHED',
            blocks: ALEX_TRAVIS_TEMPLATE,
          });
          setLoading(false);
          return;
        }
        setError(err.message || 'Page not found or not published yet.');
        setLoading(false);
      });
  }, [slug, initialData]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#08090c] text-slate-900 dark:text-white select-none">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium">Loading published storefront...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-[#08090c] text-slate-900 dark:text-white select-none">
        <div className="max-w-md w-full bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-neutral-800 rounded-2xl p-8 text-center shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight mb-2">Page Not Published Yet</h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mb-6 leading-relaxed">
            The page <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 font-mono text-blue-600 dark:text-blue-400 font-semibold">/{slug}</code> is either in draft mode or has not been published to production yet.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Open Editor Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If page blocks are empty (e.g. freshly seeded home), fallback to Alex Travis template for rich first impression
  const blocksToRender =
    page.blocks && page.blocks.length > 0
      ? page.blocks
      : slug === 'home'
      ? ALEX_TRAVIS_TEMPLATE
      : [];

  return (
    <ProductionRenderer
      blocks={blocksToRender}
      tokens={page.tokens}
      styleClasses={page.styleClasses}
      viewport="desktop"
    />
  );
}
