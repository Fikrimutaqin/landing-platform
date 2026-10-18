'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layers, ArrowRight, Package } from 'lucide-react';

export interface ProductAnalyticsItem {
  id: string;
  name: string;
  sku: string;
  type: 'DIGITAL' | 'PHYSICAL';
  price: number;
  imageUrl: string;
  salesCount: number; // units sold
  revenue: number; // in IDR
  conversionRate: number; // percentage e.g. 8.4
  specSummary: string;
}

interface TopProductsChartProps {
  products?: ProductAnalyticsItem[];
}

export function TopProductsChart({ products = [] }: TopProductsChartProps) {
  const [metric, setMetric] = useState<'units' | 'revenue'>('units');
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('30d');

  // Sort products based on selected metric
  const sorted = [...products].sort((a, b) =>
    metric === 'units' ? b.salesCount - a.salesCount : b.revenue - a.revenue
  );

  const totalVolume = products.reduce((acc, p) => acc + p.salesCount, 0);
  const totalOmset = products.reduce((acc, p) => acc + p.revenue, 0);

  const maxVal = (
    metric === 'units'
      ? Math.max(0, ...sorted.map((p) => p.salesCount))
      : Math.max(0, ...sorted.map((p) => p.revenue))
  ) || 1;

  return (
    <Card className="border border-slate-200/80 dark:border-neutral-800/80 shadow-xs bg-white dark:bg-[#0c0d12] overflow-hidden">
      <CardHeader className="p-5 pb-3 border-b border-slate-100 dark:border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm sm:text-base font-semibold tracking-tight text-slate-900 dark:text-white">
              Produk Paling Banyak Dibeli
            </CardTitle>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400">
              Katalog Terlaris
            </span>
          </div>
          <CardDescription className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Distribusi komparatif kuantitas transaksi dan share omset dari produk teratas.
          </CardDescription>
        </div>

        {/* Metric Switcher & Time Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-neutral-900 rounded-lg p-0.5 border border-slate-200/80 dark:border-neutral-800 text-xs">
            <button
              type="button"
              onClick={() => setMetric('units')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${metric === 'units'
                  ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
                }`}
            >
              Urutkan Unit Terjual
            </button>
            <button
              type="button"
              onClick={() => setMetric('revenue')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${metric === 'revenue'
                  ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
                }`}
            >
              Urutkan Omset
            </button>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-neutral-900 rounded-lg p-0.5 border border-slate-200/80 dark:border-neutral-800 text-xs">
            {(['7d', '30d'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeRange(t)}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-all cursor-pointer ${timeRange === t
                    ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
                  }`}
              >
                {t === '7d' ? '7 Hari' : '30 Hari'}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {products.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <Package className="w-5 h-5" />
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Belum Ada Produk di Katalog</div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
              Katalog produk Anda masih bersih. Tambahkan produk fisik atau digital untuk memulai transaksi dan analitik.
            </p>
            <div className="mt-4">
              <Link href="/dashboard/products">
                <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-xs">
                  + Tambah Produk Baru
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-neutral-300">
              <thead className="bg-slate-50/70 dark:bg-neutral-900/60 border-b border-slate-200/80 dark:border-neutral-800/80 text-[11px] font-medium text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Produk &amp; SKU</th>
                  <th className="px-4 py-3 font-medium">Tipe</th>
                  <th className="px-4 py-3 font-medium text-right">Harga Satuan</th>
                  <th className="px-4 py-3 font-medium text-right">Unit Terjual</th>
                  <th className="px-4 py-3 font-medium min-w-45">Pangsa Penjualan (Share)</th>
                  <th className="px-4 py-3 font-medium text-right">Total Omset</th>
                  <th className="px-5 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-900">
                {sorted.map((product, idx) => {
                  const currentVal = metric === 'units' ? product.salesCount : product.revenue;
                  const pctOfMax = maxVal > 0 ? Math.round((currentVal / maxVal) * 100) : 0;
                  const shareOfTotal = metric === 'units'
                    ? (totalVolume > 0 ? Math.round((product.salesCount / totalVolume) * 100) : 0)
                    : (totalOmset > 0 ? Math.round((product.revenue / totalOmset) * 100) : 0);

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-neutral-900/50 transition-colors group"
                    >
                      {/* Product Name & Thumbnail */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[11px] text-slate-400 shrink-0">
                            0{idx + 1}
                          </span>
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-neutral-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 dark:text-white truncate max-w-xs group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {product.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {product.sku}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="px-4 py-3.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400">
                          {product.type === 'DIGITAL' ? 'Digital' : 'Fisik'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3.5 text-right font-mono text-slate-700 dark:text-neutral-300">
                        Rp {product.price.toLocaleString('id-ID')}
                      </td>

                      {/* Units Sold */}
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {product.salesCount.toLocaleString('id-ID')} unit
                      </td>

                      {/* Proportional Progress Distribution Bar */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-slate-500 dark:text-neutral-400">
                              {shareOfTotal}% dari total
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                              Konv: {product.conversionRate}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-500"
                              style={{ width: `${pctOfMax}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Total Revenue */}
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                        Rp {product.revenue.toLocaleString('id-ID')}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3.5 text-right">
                        <Link href={`/builder?productId=${product.id}`}>
                          <Button
                            size="sm"
                            className="h-7 px-2.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs gap-1"
                          >
                            <Layers className="w-3 h-3" />
                            <span>Buat Funnel</span>
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
