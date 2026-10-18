'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ECOMMERCE_FUNNEL_STEPS, FunnelStepInfo } from '@/components/templates/ecommerce-funnel-templates';
import { LocalPersistence } from '@/lib/local-persistence';
import { PagesApiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Eye,
  ArrowRight,
} from 'lucide-react';

export default function TemplatesPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [installedNotice, setInstalledNotice] = useState<string | null>(null);

  const handleUseTemplate = async (step: FunnelStepInfo) => {
    const pageId = `page_${step.slug.replace('-', '_')}`;
    const pageDoc = {
      id: pageId,
      projectId: 'proj_default',
      title: step.name.replace(/^\d+\.\s*/, ''),
      slug: step.slug,
      status: 'PUBLISHED' as const,
      blocks: step.blocks,
      seoMetadata: {
        metaTitle: `${step.title} | Storefront`,
        metaDescription: step.description,
        facebookPixelId: '123456789012345',
        tiktokPixelId: 'C1234567890ABCDEF',
        googleAnalyticsId: 'G-XXXXXXXXXX',
      },
    };

    LocalPersistence.saveDraft(pageId, pageDoc);
    try {
      await PagesApiClient.saveDraft(pageId, pageDoc);
      await PagesApiClient.publishPage(pageId, `Dipasang dari Template ${step.name}`);
    } catch {
      // Local draft preserved
    }

    setInstalledNotice(`Template "${step.name}" berhasil dipasang dan dipublikasikan. Mengalihkan ke Web Builder...`);
    setTimeout(() => {
      router.push(`/builder?pageId=${pageId}`);
    }, 600);
  };

  const handleInstallEntireFunnel = async () => {
    setInstalledNotice('Menyiapkan dan menerbitkan 4 halaman e-commerce terhubung...');

    for (const step of ECOMMERCE_FUNNEL_STEPS) {
      const pageId = `page_${step.slug.replace('-', '_')}`;
      const pageDoc = {
        id: pageId,
        projectId: 'proj_default',
        title: step.name.replace(/^\d+\.\s*/, ''),
        slug: step.slug,
        status: 'PUBLISHED' as const,
        blocks: step.blocks,
        seoMetadata: {
          metaTitle: `${step.title} | Storefront`,
          metaDescription: step.description,
          facebookPixelId: '123456789012345',
          tiktokPixelId: 'C1234567890ABCDEF',
          googleAnalyticsId: 'G-XXXXXXXXXX',
        },
      };

      LocalPersistence.saveDraft(pageId, pageDoc);
      try {
        await PagesApiClient.saveDraft(pageId, pageDoc);
        await PagesApiClient.publishPage(pageId, `Dipasang dari Funnel Multi-Step: ${step.name}`);
      } catch {
        // Fallback to local
      }
    }

    setInstalledNotice('Seluruh Funnel 4-Step E-Commerce berhasil disiapkan & dipublikasikan. Membuka Web Builder...');
    setTimeout(() => {
      router.push('/builder?pageId=page_sales_page');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-[#08090c] text-slate-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-blue-100 dark:selection:bg-neutral-800">
      <DashboardHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Template Funnel E-Commerce
            </h1>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5 max-w-2xl">
              Template alur penjualan 4-halaman: Landing Jualan, Checkout Form, Instruksi Pembayaran QRIS/VA, dan Halaman Sukses dengan konfigurasi tracking pixel.
            </p>
          </div>

          <Button
            size="sm"
            onClick={handleInstallEntireFunnel}
            className="h-8 px-3 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs flex items-center gap-1.5"
          >
            <span>Pasang Seluruh Funnel 4-Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Notice Notification */}
        {installedNotice && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{installedNotice}</span>
          </div>
        )}

        {/* 4-Step Pipeline Flow Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ECOMMERCE_FUNNEL_STEPS.map((step) => {
            const isSelected = activeStep === step.stepNumber;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.stepNumber)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white dark:bg-neutral-900 border-blue-600 shadow-sm ring-1 ring-blue-500/20'
                    : 'bg-white/70 dark:bg-neutral-950/70 border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold text-slate-400">
                      Step {step.stepNumber}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      /{step.slug}
                    </span>
                  </div>
                  <h3 className="font-semibold text-xs text-slate-900 dark:text-white line-clamp-1">
                    {step.name.replace(/^\d+\.\s*/, '')}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {step.title}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Pixel:</span>
                  <span className="text-slate-700 dark:text-neutral-300 font-medium">
                    {step.defaultPixels.fbEvent}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Deep-Dive Card */}
        {(() => {
          const step = ECOMMERCE_FUNNEL_STEPS.find((s) => s.stepNumber === activeStep)!;
          return (
            <div className="rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Details & Per-Page Tracking Pixels */}
              <div className="lg:col-span-7 p-6 sm:p-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-slate-200 dark:border-neutral-800 text-[10px] font-mono">
                      Step {step.stepNumber}
                    </Badge>
                    <span className="text-xs font-mono text-slate-400">
                      /{step.slug}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {step.name}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Components List */}
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">
                      Struktur Halaman
                    </div>
                    <div className="space-y-1.5">
                      {step.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-neutral-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Per-Page Tracking Pixels Configuration */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">
                        Konfigurasi Tracking Pixel Halaman Ini
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Per-page Dispatch
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      {/* Facebook Pixel */}
                      <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-1">
                        <div className="text-[10px] text-slate-500 font-medium">Facebook (Meta)</div>
                        <div className="font-mono text-[11px] text-slate-900 dark:text-white font-medium">
                          {step.defaultPixels.fbEvent}
                        </div>
                      </div>

                      {/* TikTok Pixel */}
                      <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-1">
                        <div className="text-[10px] text-slate-500 font-medium">TikTok Events</div>
                        <div className="font-mono text-[11px] text-slate-900 dark:text-white font-medium">
                          {step.defaultPixels.tiktokEvent}
                        </div>
                      </div>

                      {/* Google Analytics GA4 */}
                      <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-1">
                        <div className="text-[10px] text-slate-500 font-medium">Google Analytics</div>
                        <div className="font-mono text-[11px] text-slate-900 dark:text-white font-medium">
                          {step.defaultPixels.gaEvent}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-neutral-900 flex flex-wrap items-center gap-3">
                  <Button
                    size="sm"
                    onClick={() => handleUseTemplate(step)}
                    className="h-8 px-3 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs flex items-center gap-1.5"
                  >
                    <span>Gunakan Template Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>

                  <Link href={`/p/${step.slug}`} target="_blank">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs font-medium text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-neutral-800 flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual Wireframe Mockup Preview */}
              <div className="lg:col-span-5 bg-slate-50/70 dark:bg-neutral-900/40 p-6 sm:p-7 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-neutral-800 flex flex-col justify-center">
                <div className="w-full max-w-sm mx-auto rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 shadow-sm overflow-hidden p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-neutral-800 text-[10px] text-slate-400 font-mono">
                    <span>Preview Layout</span>
                    <span>/{step.slug}</span>
                  </div>

                  {/* Wireframe Blocks Stack */}
                  <div className="space-y-2 py-1">
                    {step.blocks.map((blk, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/30 flex items-center justify-between text-[11px]"
                      >
                        <span className="font-mono text-slate-700 dark:text-neutral-300 text-xs font-medium">
                          {blk.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">0{idx + 1}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-center text-[10px] text-slate-400 font-mono">
                    {step.blocks.length} Komponen Terstruktur
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </main>
    </div>
  );
}
