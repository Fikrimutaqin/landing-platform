'use client';

import React, { useState, useEffect } from 'react';
import { FunnelStore } from '@/lib/funnel-store';
import { LocalPersistence } from '@/lib/local-persistence';
import { FunnelPipeline, FunnelPipelineStep } from '../../../../shared/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Workflow,
  ArrowRight,
  Link as LinkIcon,
  CheckCircle2,
  ExternalLink,
  Edit,
  RotateCcw,
  Play,
  ShoppingBag,
  CreditCard,
  CheckCircle,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

interface FunnelFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPageId?: string;
  onSelectPage?: (pageId: string) => void;
}

export function FunnelFlowModal({
  isOpen,
  onClose,
  currentPageId,
  onSelectPage,
}: FunnelFlowModalProps) {
  const [pipeline, setPipeline] = useState<FunnelPipeline>(FunnelStore.getPipeline());
  const [availablePages, setAvailablePages] = useState<Array<{ id: string; title: string; slug: string }>>([]);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const p = FunnelStore.getPipeline();
    setPipeline(p);

    const summaries = LocalPersistence.getIndex();
    if (summaries && summaries.length > 0) {
      setAvailablePages(
        summaries.map((s: any) => ({
          id: s.id,
          title: s.title || s.slug,
          slug: s.slug,
        }))
      );
    } else {
      setAvailablePages([
        { id: 'page_sales_page', title: 'Katalog & Sales Page', slug: 'sales-page' },
        { id: 'page_checkout_page', title: 'Formulir Checkout', slug: 'checkout-page' },
        { id: 'page_payment_instruction', title: 'Instruksi Bayar QRIS/VA', slug: 'payment-instruction' },
        { id: 'page_thank_you_page', title: 'Konfirmasi Sukses', slug: 'thank-you-page' },
      ]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnectionChange = (stepId: string, nextSlug: string) => {
    const updated = FunnelStore.updateStepConnection(stepId, nextSlug);
    setPipeline({ ...updated });
    setSavedNotice(`Terkoneksi ke /p/${nextSlug}`);
    setTimeout(() => setSavedNotice(null), 2500);
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'SALES_PAGE':
        return <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />;
      case 'CHECKOUT':
        return <FileText className="w-3.5 h-3.5 text-amber-500" />;
      case 'PAYMENT_INSTRUCTION':
        return <CreditCard className="w-3.5 h-3.5 text-indigo-500" />;
      case 'THANK_YOU':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Workflow className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-neutral-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between bg-slate-50/70 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
              <Workflow className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Alur Koneksi Antar Halaman (Funnel Pipeline)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                Hubungkan navigasi dan alur transaksi dari satu halaman ke halaman berikutnya.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard/funnels" onClick={onClose}>
              <Button size="sm" variant="outline" className="h-7 text-[10px] px-2 font-semibold">
                <ExternalLink className="w-3 h-3 mr-1" />
                Buka Halaman Penuh
              </Button>
            </Link>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {savedNotice && (
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{savedNotice}</span>
            </div>
          )}

          {/* Interactive Steps Stream */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pipeline.steps.map((step, idx) => {
              const isCurrent = currentPageId && (step.pageId === currentPageId || currentPageId.includes(step.slug));

              return (
                <div
                  key={step.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                    isCurrent
                      ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                      : 'bg-white dark:bg-neutral-900/60 border-slate-200 dark:border-neutral-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="w-5 h-5 rounded-md bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                        {step.stepNumber}
                      </span>
                      {isCurrent && (
                        <Badge className="bg-blue-600 text-white text-[9px] px-1.5 py-0 font-bold">
                          Sedang Diedit
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      {getStepIcon(step.type)}
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {step.name}
                      </h4>
                    </div>

                    <div className="font-mono text-[10px] text-blue-600 dark:text-blue-400">
                      /p/{step.slug}
                    </div>
                  </div>

                  {/* Connected Target Selector */}
                  <div className="pt-2 border-t border-slate-100 dark:border-neutral-800 space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 dark:text-neutral-400 flex items-center gap-1">
                      <LinkIcon className="w-2.5 h-2.5 text-blue-500" />
                      <span>Konek ke Halaman:</span>
                    </label>

                    <select
                      value={step.nextStepSlug || ''}
                      onChange={(e) => handleConnectionChange(step.id, e.target.value)}
                      className="w-full h-7 text-[11px] px-1.5 rounded-md border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-slate-800 dark:text-neutral-200 cursor-pointer font-medium"
                    >
                      {availablePages.map((p) => (
                        <option key={p.slug} value={p.slug}>
                          &rarr; /p/{p.slug}
                        </option>
                      ))}
                    </select>

                    {/* Switch Page Button inside Builder */}
                    {onSelectPage && !isCurrent && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const targetId = step.pageId || `page_${step.slug.replace('-', '_')}`;
                          onSelectPage(targetId);
                          onClose();
                        }}
                        className="w-full h-6 text-[10px] mt-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                      >
                        Buka Halaman Ini di Builder
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-xs text-slate-600 dark:text-neutral-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Semua halaman saling terhubung otomatis tanpa kode.</span>
            </span>

            <a
              href="/p/sales-page"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 text-[11px]"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Test Live Funnel</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
