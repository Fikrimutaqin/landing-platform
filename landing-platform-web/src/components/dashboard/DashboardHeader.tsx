'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { UserNav } from '@/components/auth/UserNav';
import {
  Layers,
  LayoutDashboard,
  Package,
  ReceiptText,
  LayoutTemplate,
} from 'lucide-react';

export function DashboardHeader() {
  const pathname = usePathname();
  const { user, organization } = useAuth();

  const navLinks = [
    {
      label: 'Ringkasan',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
    },
    {
      label: 'Produk',
      href: '/dashboard/products',
      icon: Package,
      active: pathname.startsWith('/dashboard/products'),
    },
    {
      label: 'Transaksi',
      href: '/dashboard/transactions',
      icon: ReceiptText,
      active: pathname.startsWith('/dashboard/transactions'),
    },
    {
      label: 'Template Funnel',
      href: '/dashboard/templates',
      icon: LayoutTemplate,
      active: pathname.startsWith('/dashboard/templates'),
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-neutral-900 bg-white/95 dark:bg-[#08090c]/95 backdrop-blur-md px-4 sm:px-6 h-14 shrink-0 flex items-center justify-between select-none">
      {/* Brand & Store Name */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-bold tracking-tight text-slate-900 dark:text-white">
              Landing Platform
            </span>
            <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
              Merchant Hub
            </span>
          </div>
        </Link>

        <span className="text-slate-300 dark:text-neutral-700 hidden sm:inline">/</span>

        <span className="text-xs text-slate-500 dark:text-neutral-400 font-medium hidden sm:inline truncate max-w-40">
          {organization?.name || user?.organizationName || 'OrderOnline Store'}
        </span>
      </div>

      {/* Center Navigation - Tabs */}
      <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${item.active
                  ? 'bg-slate-100 dark:bg-neutral-800 text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-neutral-800/50'
                }`}
            >
              <Icon className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right Section: Theme & User Profile */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
}
