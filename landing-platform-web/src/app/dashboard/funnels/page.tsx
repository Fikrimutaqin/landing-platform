'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FunnelStore } from '@/lib/funnel-store';
import { LocalPersistence } from '@/lib/local-persistence';
import { FunnelPipeline, FunnelPipelineStep } from '../../../../../shared/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GitFork,
  ArrowRight,
  ExternalLink,
  Edit,
  Play,
  RotateCcw,
  CheckCircle2,
  Workflow,
  Sparkles,
  Link as LinkIcon,
  ShoppingBag,
  CreditCard,
  CheckCircle,
  FileText,
  AlertCircle,
  Save,
} from 'lucide-react';

export default function FunnelFlowPage() {
  const router = useRouter();
  const [pipeline, setPipeline] = useState<FunnelPipeline>(FunnelStore.getPipeline());
  const [availablePages, setAvailablePages] = useState<Array<{ id: string; title: string; slug: string }>>([]);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    // 1. Load pipeline from store
    const p = FunnelStore.getPipeline();
    setPipeline(p);

    // Subscribe to store updates
    const unsub = FunnelStore.subscribe((updated) => setPipeline(updated));

    // 2. Load available pages from LocalPersistence
    const pageSummaries = LocalPersistence.getIndex();
    if (pageSummaries && pageSummaries.length > 0) {
      setAvailablePages(
        pageSummaries.map((s: any) => ({
          id: s.id,
          title: s.title || s.slug,
          slug: s.slug,
        }))
      );
    } else {
      // Default fallbacks
      setAvailablePages([
        { id: 'page_sales_page', title: 'Katalog & Sales Page', slug: 'sales-page' },
        { id: 'page_checkout_page', title: 'Formulir Checkout', slug: 'checkout-page' },
        { id: 'page_payment_instruction', title: 'Instruksi Bayar QRIS/VA', slug: 'payment-instruction' },
        { id: 'page_thank_you_page', title: 'Konfirmasi Sukses', slug: 'thank-you-page' },
      ]);
    }

    return () => unsub();
  }, []);

  const handleConnectionChange = (stepId: string, nextSlug: string) => {
    const updated = FunnelStore.updateStepConnection(stepId, nextSlug);
    setPipeline({ ...updated });
    setSavedNotice(`Koneksi alur berhasil diperbarui: dialihkan ke /p/${nextSlug}`);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleReset = () => {
    if (confirm('Kembalikan koneksi funnel ke alur default 4-Step E-Commerce?')) {
      const def = FunnelStore.resetToDefault();
      setPipeline({ ...def });
      setSavedNotice('Alur halaman berhasil di-reset ke koneksi default!');
      setTimeout(() => setSavedNotice(null), 3000);
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'SALES_PAGE':
        return <ShoppingBag className="w-4 h-4 text-blue-500" />;
      case 'CHECKOUT':
        return <FileText className="w-4 h-4 text-amber-500" />;
      case 'PAYMENT_INSTRUCTION':
        return <CreditCard className="w-4 h-4 text-indigo-500" />;
      case 'THANK_YOU':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default:
        return <Workflow className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#08090c] text-slate-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-blue-100 dark:selection:bg-neutral-800">
      <DashboardHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
        {/* Toast notice */}
        {savedNotice && (
          <div className="fixed top-6 right-6 z-50 p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>{savedNotice}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                <Workflow className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
                Funnel Page Flow Connector
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Alur Koneksi Antar Halaman (Funnel Flow)
            </h1>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 max-w-2xl">
              Atur dan hubungkan alur langkah demi langkah secara terpisah: <strong>Katalog</strong> &rarr; <strong>Checkout Form</strong> &rarr; <strong>Instruksi Bayar QRIS/VA</strong> &rarr; <strong>Halaman Sukses</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-8 text-xs font-semibold px-2.5 text-slate-600 dark:text-neutral-300 border-slate-200 dark:border-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer"
              title="Reset ke alur default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Default</span>
            </Button>

            <a
              href="/p/sales-page"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                className="h-8 text-xs font-semibold px-3 bg-blue-600 hover:bg-blue-500 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Uji Alur Dari Awal</span>
              </Button>
            </a>
          </div>
        </div>

        {/* 1. VISUAL FLOW PIPELINE DIAGRAM */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Diagram Visual Alur Penjualan (Interactive Flowchart)
              </h2>
            </div>
            <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40">
              4 Langkah Terhubung Aktif
            </Badge>
          </div>

          {/* Interactive Steps Stream */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative pt-2">
            {pipeline.steps.map((step, idx) => {
              const isLast = idx === pipeline.steps.length - 1;
              return (
                <div key={step.id} className="relative flex flex-col">
                  {/* Step Card */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/70 dark:bg-neutral-900/40 flex-1 flex flex-col justify-between space-y-3 hover:border-blue-400 dark:hover:border-blue-600 transition-all shadow-xs">
                    <div>
                      {/* Step Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center font-mono shadow-xs">
                          {step.stepNumber}
                        </span>
                        <div className="flex items-center gap-1">
                          {getStepIcon(step.type)}
                          <span className="text-[10px] font-semibold text-slate-500 uppercase">
                            {step.type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Title & Slug */}
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {step.name}
                      </h3>
                      <div className="font-mono text-[11px] text-blue-600 dark:text-blue-400 mt-0.5">
                        /p/{step.slug}
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Step Connection Selector */}
                    <div className="pt-2 border-t border-slate-200 dark:border-neutral-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-semibold flex items-center gap-1">
                          <LinkIcon className="w-3 h-3 text-blue-500" />
                          Target Selanjutnya:
                        </span>
                      </div>

                      <select
                        value={step.nextStepSlug || ''}
                        onChange={(e) => handleConnectionChange(step.id, e.target.value)}
                        className="w-full h-8 text-[11px] px-2 rounded-lg border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-slate-800 dark:text-neutral-200 cursor-pointer focus:outline-hidden font-medium"
                      >
                        {availablePages.map((p) => (
                          <option key={p.slug} value={p.slug}>
                            &rarr; /p/{p.slug} ({p.title})
                          </option>
                        ))}
                      </select>

                      {/* Action buttons: Edit & View */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <Link
                          href={`/builder?pageId=${step.pageId || `page_${step.slug.replace('-', '_')}`}`}
                          className="flex-1"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full h-7 text-[10px] font-semibold border-slate-200 dark:border-neutral-700 flex items-center justify-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit Builder</span>
                          </Button>
                        </Link>

                        <a
                          href={`/p/${step.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-[10px] text-slate-600 dark:text-neutral-300"
                            title="Buka Preview Langsung"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Connecting Arrow for Desktop */}
                  {!isLast && (
                    <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-blue-600 text-white items-center justify-center shadow-md">
                      <ArrowRight className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. DETAIL TABLE & FLOW SPECIFICATION */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Tabel Konfigurasi Alur Halaman Terkoneksi
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-neutral-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-neutral-900/50">
                  <th className="py-2.5 px-3">Langkah</th>
                  <th className="py-2.5 px-3">Nama Halaman</th>
                  <th className="py-2.5 px-3">URL Sumber</th>
                  <th className="py-2.5 px-3">Pemicu Aksi (Trigger)</th>
                  <th className="py-2.5 px-3">Target Halaman Terhubung</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                {pipeline.steps.map((step) => {
                  let triggerText = 'Klik Tombol CTA / Beli Langsung';
                  if (step.type === 'CHECKOUT') triggerText = 'Submit Form Pemesanan';
                  if (step.type === 'PAYMENT_INSTRUCTION') triggerText = 'Verifikasi Pembayaran Otomatis / Simulasi';
                  if (step.type === 'THANK_YOU') triggerText = 'Tombol Kembali Belanja';

                  return (
                    <tr key={step.id} className="hover:bg-slate-50/60 dark:hover:bg-neutral-900/30 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        Step {step.stepNumber}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        {step.name}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-neutral-400">
                        /p/{step.slug}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-neutral-300">
                        <Badge variant="outline" className="text-[10px] font-normal border-slate-200 dark:border-neutral-700">
                          {triggerText}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={step.nextStepSlug || ''}
                          onChange={(e) => handleConnectionChange(step.id, e.target.value)}
                          className="h-7 text-xs px-2 rounded-md border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-mono text-blue-600 dark:text-blue-400 font-semibold cursor-pointer"
                        >
                          {availablePages.map((p) => (
                            <option key={p.slug} value={p.slug}>
                              /p/{p.slug}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/builder?pageId=${step.pageId || `page_${step.slug.replace('-', '_')}`}`}>
                            <Button size="sm" variant="outline" className="h-7 text-[10px] px-2 font-semibold">
                              Edit
                            </Button>
                          </Link>
                          <a href={`/p/${step.slug}`} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-[10px]">
                              Buka
                            </Button>
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. VERIFICATION & ARCHITECTURE SUMMARY */}
        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              <strong>Koneksi Terverifikasi:</strong> Alur berjalan mulus antar halaman independen dengan parameter <code>orderId</code> dan <code>productId</code> diteruskan otomatis.
            </span>
          </div>

          <a
            href="/p/sales-page"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button size="sm" className="h-7 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs">
              <span>Mulai Uji Transaksi Live</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </a>
        </div>
      </main>
    </div>
  );
}
