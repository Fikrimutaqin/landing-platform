'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Layers,
  ExternalLink,
  Eye,
  TrendingUp,
  ArrowRight,
  MousePointerClick,
} from 'lucide-react';

export interface LandingPageTrafficItem {
  id: string;
  title: string;
  slug: string;
  status: 'PUBLISHED';
  views: number;
  uniqueVisitors: number;
  conversionRate: number; // percentage
  revenue: number; // in IDR
  ordersCount: number;
  updatedAt: string;
}

interface DailyPoint {
  date: string;
  dayLabel: string;
  views: number;
  conversions: number;
  topPage: string;
}

const DEFAULT_PAGES: LandingPageTrafficItem[] = [];

const DAILY_SERIES: DailyPoint[] = [
  { date: '12 Okt', dayLabel: 'Sen', views: 0, conversions: 0, topPage: '' },
  { date: '13 Okt', dayLabel: 'Sel', views: 0, conversions: 0, topPage: '' },
  { date: '14 Okt', dayLabel: 'Rab', views: 0, conversions: 0, topPage: '' },
  { date: '15 Okt', dayLabel: 'Kam', views: 0, conversions: 0, topPage: '' },
  { date: '16 Okt', dayLabel: 'Jum', views: 0, conversions: 0, topPage: '' },
  { date: '17 Okt', dayLabel: 'Sab', views: 0, conversions: 0, topPage: '' },
  { date: '18 Okt', dayLabel: 'Min', views: 0, conversions: 0, topPage: '' },
];

export function TopPagesTrafficChart({ pages = DEFAULT_PAGES }: { pages?: LandingPageTrafficItem[] }) {
  const [metricMode, setMetricMode] = useState<'views' | 'conversions'>('views');
  const [activeRange, setActiveRange] = useState<'7d' | '30d'>('7d');
  const [hoveredIdx, setHoveredIdx] = useState<number>(0);

  const maxVal = Math.max(10, ...DAILY_SERIES.map((d) => (metricMode === 'views' ? d.views : d.conversions)));
  const totalViews = pages.reduce((acc, p) => acc + p.views, 0);
  const totalRevenue = pages.reduce((acc, p) => acc + p.revenue, 0);

  // SVG coordinates calculation for the 7 points
  // Width: 600, Height: 180, Padding: x [40, 560], y [20, 160]
  const svgPoints = DAILY_SERIES.map((pt, i) => {
    const x = 50 + i * (500 / (DAILY_SERIES.length - 1));
    const val = metricMode === 'views' ? pt.views : pt.conversions;
    const y = 160 - (val / maxVal) * 130;
    return { x, y, pt };
  });

  // Construct smooth cubic bezier path
  const linePath = svgPoints.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (pt.x - prev.x) / 2;
    const cpX2 = prev.x + (pt.x - prev.x) / 2;
    return `${acc} C ${cpX1} ${prev.y}, ${cpX2} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaPath = `${linePath} L ${svgPoints[svgPoints.length - 1].x} 165 L ${svgPoints[0].x} 165 Z`;

  const activePoint = svgPoints[hoveredIdx];

  return (
    <Card className="border border-slate-200/80 dark:border-neutral-800/80 shadow-xs bg-white dark:bg-[#0c0d12] overflow-hidden">
      <CardHeader className="p-5 pb-3 border-b border-slate-100 dark:border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm sm:text-base font-semibold tracking-tight text-slate-900 dark:text-white">
              Trafik &amp; Kunjungan Landing Page
            </CardTitle>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400">
              Live Funnel Analytics
            </span>
          </div>
          <CardDescription className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Analisis tren pengunjung harian dan atribusi konversi dari seluruh landing page toko Anda.
          </CardDescription>
        </div>

        {/* Metric and Range Segmented Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-neutral-900 rounded-lg p-0.5 border border-slate-200/80 dark:border-neutral-800 text-xs">
            <button
              type="button"
              onClick={() => setMetricMode('views')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${metricMode === 'views'
                  ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
                }`}
            >
              Pengunjung (Views)
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('conversions')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${metricMode === 'conversions'
                  ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
                }`}
            >
              Pesanan (Orders)
            </button>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-neutral-900 rounded-lg p-0.5 border border-slate-200/80 dark:border-neutral-800 text-xs">
            {(['7d', '30d'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setActiveRange(r)}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-all cursor-pointer ${activeRange === r
                    ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
                  }`}
              >
                {r === '7d' ? '7 Hari' : '30 Hari'}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Continuous SVG Area / Spline Chart */}
        <div className="p-5 pb-2 bg-linear-to-b from-slate-50/50 to-transparent dark:from-neutral-900/20 dark:to-transparent border-b border-slate-100 dark:border-neutral-900 relative select-none">
          {/* Active Data Tooltip Indicator */}
          {activePoint && (
            <div className="flex items-center justify-between text-xs mb-2 px-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-400">
                  {activePoint.pt.dayLabel}, {activePoint.pt.date}
                </span>
                <span className="text-slate-300 dark:text-neutral-700">·</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {metricMode === 'views'
                    ? `${activePoint.pt.views.toLocaleString('id-ID')} views`
                    : `${activePoint.pt.conversions.toLocaleString('id-ID')} pesanan`}
                </span>
                <span className="text-slate-300 dark:text-neutral-700">·</span>
                <span className="text-xs text-slate-500 dark:text-neutral-400">
                  Halaman Teratas: <span className="font-mono text-blue-600 dark:text-blue-400 font-medium">{activePoint.pt.topPage}</span>
                </span>
              </div>

              <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium hidden sm:block">
                +18.4% vs periode lalu
              </div>
            </div>
          )}

          {/* SVG Vector Chart Container */}
          <div className="relative w-full h-44 overflow-hidden">
            <svg
              viewBox="0 0 600 180"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Reference Lines */}
              <line x1="40" y1="30" x2="560" y2="30" stroke="currentColor" className="text-slate-200 dark:text-neutral-800" strokeDasharray="3 3" />
              <line x1="40" y1="75" x2="560" y2="75" stroke="currentColor" className="text-slate-200 dark:text-neutral-800" strokeDasharray="3 3" />
              <line x1="40" y1="120" x2="560" y2="120" stroke="currentColor" className="text-slate-200 dark:text-neutral-800" strokeDasharray="3 3" />
              <line x1="40" y1="165" x2="560" y2="165" stroke="currentColor" className="text-slate-200 dark:text-neutral-800" />

              {/* Area Gradient Fill */}
              <path d={areaPath} fill="url(#trafficGradient)" />

              {/* Line Stroke */}
              <path
                d={linePath}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Vertical Crosshair */}
              {activePoint && (
                <>
                  <line
                    x1={activePoint.x}
                    y1="20"
                    x2={activePoint.x}
                    y2="165"
                    stroke="#2563eb"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    className="opacity-75"
                  />
                  <circle
                    cx={activePoint.x}
                    cy={activePoint.y}
                    r="5"
                    fill="#2563eb"
                    className="stroke-white dark:stroke-[#0c0d12]"
                    strokeWidth="2.5"
                  />
                </>
              )}

              {/* Data Point Hitboxes */}
              {svgPoints.map((p, idx) => (
                <rect
                  key={idx}
                  x={p.x - 25}
                  y="0"
                  width="50"
                  height="180"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                />
              ))}
            </svg>
          </div>

          {/* X-Axis Date Labels */}
          <div className="flex justify-between px-6 pt-1 text-[11px] font-mono text-slate-400 select-none">
            {DAILY_SERIES.map((pt, i) => (
              <span
                key={i}
                onClick={() => setHoveredIdx(i)}
                className={`cursor-pointer transition-colors ${hoveredIdx === i ? 'font-bold text-slate-900 dark:text-white' : 'hover:text-slate-600'
                  }`}
              >
                {pt.date}
              </span>
            ))}
          </div>
        </div>

        {/* Enterprise Data Table: Top Performing Landing Pages */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-neutral-300">
            <thead className="bg-slate-50/70 dark:bg-neutral-900/60 border-b border-slate-200/80 dark:border-neutral-800/80 text-[11px] font-medium text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Halaman Landing &amp; Funnel</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Pengunjung (Views)</th>
                <th className="px-4 py-3 font-medium text-right">Pengunjung Unik</th>
                <th className="px-4 py-3 font-medium text-right">Tingkat Konversi</th>
                <th className="px-4 py-3 font-medium text-right">Omset Teratribusi</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-900">
              {pages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-xs text-slate-500 dark:text-neutral-400">
                    Belum ada landing page atau funnel aktif. Klik tombol &ldquo;Buat Halaman Baru&rdquo; di atas untuk mulai membuat funnel penjualan Anda.
                  </td>
                </tr>
              ) : (
                pages.map((page, idx) => (
                  <tr
                    key={page.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-neutral-900/50 transition-colors group"
                  >
                    {/* Title & Slug */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[11px] text-slate-400 shrink-0">
                          0{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 dark:text-white truncate max-w-xs group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {page.title}
                          </div>
                          <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                            /p/{page.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>Live</span>
                      </div>
                    </td>

                    {/* Views */}
                    <td className="px-4 py-3.5 text-right font-mono font-semibold text-slate-900 dark:text-white">
                      {page.views.toLocaleString('id-ID')}
                    </td>

                    {/* Unique Visitors */}
                    <td className="px-4 py-3.5 text-right font-mono text-slate-600 dark:text-neutral-400">
                      {page.uniqueVisitors.toLocaleString('id-ID')}
                    </td>

                    {/* Conversion Rate with Inline Micro-indicator */}
                    <td className="px-4 py-3.5 text-right font-mono">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {page.conversionRate}%
                      </span>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        ({page.ordersCount} pesanan)
                      </span>
                    </td>

                    {/* Attributed Revenue */}
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                      Rp {page.revenue.toLocaleString('id-ID')}
                    </td>

                    {/* Quick Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/builder?pageId=${page.id}`}>
                          <Button
                            size="sm"
                            className="h-7 px-2.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs gap-1"
                          >
                            <Layers className="w-3 h-3" />
                            <span>Edit</span>
                          </Button>
                        </Link>

                        <Link href={`/p/${page.slug}`} target="_blank">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300"
                            title="Buka Halaman Live"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
