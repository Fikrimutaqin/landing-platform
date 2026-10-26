'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { TopProductsChart } from '@/components/dashboard/TopProductsChart';
import { TopPagesTrafficChart } from '@/components/dashboard/TopPagesTrafficChart';
import { TransactionsStore } from '@/lib/transactions-store';
import { ProductsStore } from '@/lib/products-store';
import { PagesApiClient } from '@/lib/api-client';
import { LocalPersistence } from '@/lib/local-persistence';
import { Transaction, Product } from '../../../../shared/types';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Trash2, CheckCircle2 } from 'lucide-react';

export default function MerchantDashboard() {
  const router = useRouter();
  const { organization, isAuthenticated, isLoading } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [visitors, setVisitors] = useState<number>(0);
  const [clearedNotice, setClearedNotice] = useState<boolean>(false);

  // Protect route
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  const loadData = () => {
    setTransactions(TransactionsStore.getTransactions());
    setProducts(ProductsStore.getProducts());
    if (typeof window !== 'undefined') {
      const v = parseInt(localStorage.getItem('lp_total_visitors') || '0', 10);
      setVisitors(v);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.location.search.includes('clear=true') || window.location.search.includes('clear=1'))) {
      ProductsStore.clearAll();
      TransactionsStore.clearAll();
      PagesApiClient.clearProjectPages('proj_default');
      LocalPersistence.clearAll();
      localStorage.removeItem('lp_total_visitors');
      setTransactions([]);
      setProducts([]);
      setVisitors(0);
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 3500);
      window.history.replaceState({}, '', '/dashboard');
      return;
    }
    loadData();
  }, []);

  const handleClearAllData = async () => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        'Hapus semua data produk, transaksi, dan halaman testing? Ini akan mengosongkan semua data agar Anda bisa testing dari 0.'
      );
      if (!confirmed) return;

      ProductsStore.clearAll();
      TransactionsStore.clearAll();
      await PagesApiClient.clearProjectPages('proj_default');
      LocalPersistence.clearAll();
      localStorage.removeItem('lp_total_visitors');

      // Clear any page views
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('lp_page_views_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));

      setTransactions([]);
      setProducts([]);
      setVisitors(0);
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 3500);
    }
  };

  const paidTransactions = transactions.filter((t) => t.paymentStatus === 'PAID');
  const totalOmset = paidTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
  const totalOrders = paidTransactions.length;
  const aov = totalOrders > 0 ? Math.round(totalOmset / totalOrders) : 0;
  const totalVisitors = visitors > 0 ? visitors : (transactions.length > 0 ? transactions.length * 2 : 0);

  const dynamicTopProducts = products.map((p) => {
    const pTxs = paidTransactions.filter((t) => t.productId === p.id);
    const count = pTxs.reduce((sum, t) => sum + t.quantity, 0);
    const rev = pTxs.reduce((sum, t) => sum + t.totalAmount, 0);

    return {
      id: p.id,
      name: p.name,
      sku: p.sku || 'SKU-001',
      type: p.type,
      price: p.price,
      imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      salesCount: count,
      revenue: rev,
      conversionRate: count > 0 ? (p.type === 'DIGITAL' ? 8.4 : 5.8) : 0,
      specSummary: p.type === 'DIGITAL' ? 'Akses Digital Instan' : `Stok: ${p.stock || 0} unit`,
    };
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-neutral-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white animate-spin" />
          <span className="text-xs text-neutral-500 font-medium">Memuat Merchant Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#08090c] text-slate-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-blue-100 dark:selection:bg-neutral-800">
      <DashboardHeader />

      {/* Main Merchant Portal Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
        {clearedNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Semua data dummy telah dibersihkan. Anda sekarang siap melakukan testing end-to-end dari nol!</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Ringkasan Toko
            </h1>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              Analitik penjualan, performa trafik landing page, dan status finansial toko Anda.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAllData}
              className="h-8 text-xs font-medium text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1.5 shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan Data Testing</span>
            </Button>

            <Link href="/builder">
              <Button size="sm" className="h-8 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white gap-1.5 shadow-xs">
                <Plus className="w-3.5 h-3.5" />
                <span>Buat Halaman Baru</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Unified Enterprise Metric Banner (Stripe / Linear style) */}
        <div className="rounded-xl border border-slate-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#0c0d12] shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-neutral-900 overflow-hidden">
          {/* Metric 1 */}
          <div className="p-4 sm:p-5 space-y-1">
            <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Total Pengunjung</div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {totalVisitors.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-neutral-500 font-medium pt-0.5 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span>{totalVisitors > 0 ? `${totalVisitors} kunjungan terlacak` : 'Belum ada kunjungan'}</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="p-4 sm:p-5 space-y-1">
            <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Pesanan Selesai</div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {totalOrders.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-neutral-400 pt-0.5 font-mono">
              {transactions.length > 0 ? `${paidTransactions.length} dari ${transactions.length} tagihan lunas` : 'Belum ada pesanan'}
            </div>
          </div>

          {/* Metric 3 */}
          <div className="p-4 sm:p-5 space-y-1">
            <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Total Omset</div>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              Rp {totalOmset.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-neutral-400 pt-0.5 font-mono">
              AOV: Rp {aov.toLocaleString('id-ID')} / pesanan
            </div>
          </div>

          {/* Metric 4 */}
          <div className="p-4 sm:p-5 space-y-1">
            <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Gateway Pembayaran</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 pt-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Xendit VA &amp; QRIS</span>
            </div>
            <div className="text-[11px] text-slate-400 dark:text-neutral-500 font-mono pt-1">
              BYOK Terenkripsi AES-256
            </div>
          </div>
        </div>

        {/* SECTION 1: CHART TRAFIK LANDING PAGE (CONTINUOUS SPLINE & ATTR TABLE) */}
        <section aria-label="Trafik Landing Page">
          <TopPagesTrafficChart />
        </section>

        {/* SECTION 2: CHART PRODUK PALING BANYAK DIBELI (DISTRIBUTION LEDGER) */}
        <section aria-label="Produk Paling Banyak Dibeli">
          <TopProductsChart products={dynamicTopProducts} />
        </section>
      </main>
    </div>
  );
}
