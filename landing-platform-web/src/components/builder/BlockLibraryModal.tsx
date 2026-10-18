'use client';

import React, { useState } from 'react';
import {
  Columns,
  Box,
  LayoutGrid,
  Compass,
  Layout,
  LayoutTemplate,
  Layers,
  CreditCard,
  HelpCircle,
  Shield,
  X,
  Search,
} from 'lucide-react';

interface BlockLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBlock: (templateKey: string) => void;
}

export function BlockLibraryModal({
  isOpen,
  onClose,
  onSelectBlock,
}: BlockLibraryModalProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const catalog: Array<{
    templateKey: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    category: string;
  }> = [
    {
      templateKey: 'flex_row',
      title: 'Flex Row Container (2-Col)',
      description: 'Horizontal flexbox layout with 2 configurable columns, ideal for navbars or split features.',
      icon: <Columns className="w-5 h-5 text-blue-500" />,
      category: 'Layout Containers',
    },
    {
      templateKey: 'flex_col',
      title: 'Flex Column Container',
      description: 'Vertical stack flexbox layout with custom gap spacing and full-width alignment.',
      icon: <Box className="w-5 h-5 text-emerald-500" />,
      category: 'Layout Containers',
    },
    {
      templateKey: 'grid_2',
      title: 'Grid (2-Column)',
      description: 'CSS Grid section splitting components across 2 balanced responsive columns.',
      icon: <LayoutGrid className="w-5 h-5 text-indigo-500" />,
      category: 'Layout Containers',
    },
    {
      templateKey: 'grid_3',
      title: 'Grid (3-Column)',
      description: '3-column CSS Grid section for metrics, product feature cards, or customer badges.',
      icon: <LayoutGrid className="w-5 h-5 text-purple-500" />,
      category: 'Layout Containers',
    },
    {
      templateKey: 'navbar',
      title: 'Navbar Header',
      description: 'Header section with brand typography, navigation links, and call-to-action button.',
      icon: <Compass className="w-5 h-5 text-cyan-500" />,
      category: 'Section Presets',
    },
    {
      templateKey: 'hero',
      title: 'Hero Banner',
      description: 'Headline banner section with lead text, primary/secondary action buttons, and visual media.',
      icon: <Layout className="w-5 h-5 text-blue-500" />,
      category: 'Section Presets',
    },
    {
      templateKey: 'showcase',
      title: 'Features & Showcase',
      description: 'Interactive showcase grid with metrics, progress indicators, and feature highlights.',
      icon: <Layers className="w-5 h-5 text-emerald-500" />,
      category: 'Section Presets',
    },
    {
      templateKey: 'checkout',
      title: 'Direct Checkout Form',
      description: 'Conversion-focused checkout form with product selection, payment method, and summary.',
      icon: <CreditCard className="w-5 h-5 text-indigo-500" />,
      category: 'Section Presets',
    },
    {
      templateKey: 'faq',
      title: 'FAQ Accordion',
      description: 'Expandable accordion section for customer questions and answers.',
      icon: <HelpCircle className="w-5 h-5 text-purple-500" />,
      category: 'Section Presets',
    },
    {
      templateKey: 'footer',
      title: 'Footer',
      description: 'Clean bottom section with brand copyright, legal links, and social badges.',
      icon: <Shield className="w-5 h-5 text-neutral-500" />,
      category: 'Section Presets',
    },
    {
      templateKey: 'alex_travis_full',
      title: 'Alex Travis • Portfolio Template',
      description: 'Complete 14-section design portfolio featuring hero, stats ring, services, cards, pricing, and footer.',
      icon: <LayoutTemplate className="w-5 h-5 text-slate-700 dark:text-neutral-300" />,
      category: 'Full Templates',
    },
    {
      templateKey: 'sales_page_full',
      title: '1. Landing Page Jualan (Sales Funnel)',
      description: 'Full sales page with hero headline, timer urgency, spotlight produk, ulasan pelanggan, FAQ, dan checkout.',
      icon: <Layout className="w-5 h-5 text-blue-500" />,
      category: 'Full Templates',
    },
    {
      templateKey: 'checkout_page_full',
      title: '2. Page Checkout (Form Pemesanan)',
      description: 'Halaman checkout form 1-page frictionless dengan alamat pengiriman / akses email dan kupon promo.',
      icon: <CreditCard className="w-5 h-5 text-purple-500" />,
      category: 'Full Templates',
    },
    {
      templateKey: 'payment_page_full',
      title: '3. Page Payment (Instruksi QRIS & VA)',
      description: 'Instruksi pembayaran Xendit QRIS dinamis & nomor Virtual Account dengan countdown 15 menit.',
      icon: <Box className="w-5 h-5 text-amber-500" />,
      category: 'Full Templates',
    },
    {
      templateKey: 'success_page_full',
      title: '4. Success / Thank You Page',
      description: 'Konfirmasi order berhasil dengan tombol download materi digital atau estimasi pengiriman kurir fisik.',
      icon: <Shield className="w-5 h-5 text-emerald-500" />,
      category: 'Full Templates',
    },
  ];

  const categories = ['All', 'Full Templates', 'Layout Containers', 'Section Presets'];

  const filtered = catalog.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0c0d12] shadow-2xl p-6 space-y-5 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-neutral-900 shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Add Container Section</h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              Insert a pure Flex/Grid layout container or pre-built ShadCN section.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-neutral-900 pb-3 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-neutral-800 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Catalog List */}
        <div className="grid sm:grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1">
          {filtered.map((item) => (
            <button
              key={item.templateKey}
              type="button"
              onClick={() => {
                onSelectBlock(item.templateKey);
                onClose();
              }}
              className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-200 dark:border-neutral-800/80 bg-slate-50/70 dark:bg-neutral-900/40 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:border-blue-500/60 text-left transition-all group active:scale-[0.98]"
            >
              <div className="w-9 h-9 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 flex items-center justify-center shrink-0 group-hover:border-slate-300 dark:group-hover:border-neutral-700">
                {item.icon}
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 truncate">
                    {item.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
