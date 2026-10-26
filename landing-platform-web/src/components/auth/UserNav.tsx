'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  User,
  LogOut,
  Building2,
  ExternalLink,
  LogIn,
  UserPlus,
  Crown,
  CheckCircle2,
  Layers,
  LayoutDashboard,
} from 'lucide-react';

export function UserNav() {
  const { user, organization, isAuthenticated, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="h-8 w-24 rounded-lg bg-slate-200/60 dark:bg-neutral-800/60 animate-pulse" />
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-1.5">
        <Link href="/login">
          <Button variant="outline" size="sm" className="h-8 text-xs font-medium">
            <LogIn className="w-3.5 h-3.5 mr-1" />
            Masuk
          </Button>
        </Link>
        <Link href="/register">
          <Button variant="default" size="sm" className="h-8 text-xs font-semibold">
            <UserPlus className="w-3.5 h-3.5 mr-1" />
            Daftar
          </Button>
        </Link>
      </div>
    );
  }

  // Initials for avatar
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 pl-3 pr-1 py-1 rounded-lg  dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 hover:bg-slate-100 dark:hover:bg-neutral-800/80 transition-all cursor-pointer group select-none"
        aria-label="User profile menu"
      >
        {/* User Name on Left */}
        <span className="text-xs font-semibold text-slate-800 dark:text-neutral-200 max-w-32.5 sm:max-w-40 truncate">
          {user.name}
        </span>

        {/* Avatar on Right */}
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs shadow-xs shrink-0">
          {initials || <User className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* shadCN-styled Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-2 shadow-xl dark:shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-neutral-900/60 mb-1 border border-slate-100 dark:border-neutral-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-xs">
                {initials}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-bold text-slate-900 dark:text-neutral-100 truncate">
                  {user.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-neutral-400 truncate">
                  {user.email}
                </span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-neutral-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-neutral-300 font-medium">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-32.5">
                  {organization?.name || user.organizationName}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                <Crown className="w-3 h-3" />
                <span>{organization?.planTier || 'PRO'}</span>
              </div>
            </div>
          </div>

          <Separator className="my-1" />

          {/* Nav items */}
          <div className="space-y-0.5 py-1">
            <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 dark:text-neutral-500 tracking-wider uppercase">
              Navigasi Cepat
            </div>

            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-700 dark:text-neutral-300 rounded-md hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors"
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                Dashboard Merchant
              </span>
            </Link>

            <Link
              href="/builder"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-700 dark:text-neutral-300 rounded-md hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors font-medium"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                Builder Web
              </span>
              <span className="text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1 py-0.2 rounded border border-blue-500/20">
                Visual
              </span>
            </Link>

            <Separator className="my-1" />

            <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 dark:text-neutral-500 tracking-wider uppercase">
              Informasi Akun
            </div>

            <div className="flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-700 dark:text-neutral-300 rounded-md hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Status Sesi
              </span>
              <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Aktif
              </span>
            </div>

            <a
              href="http://localhost:4000/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-700 dark:text-neutral-300 rounded-md hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                API & Swagger Docs
              </span>
              <span className="text-[10px] text-slate-400">:4000</span>
            </a>
          </div>

          <Separator className="my-1" />

          {/* Logout Action */}
          <button
            onClick={async () => {
              setIsOpen(false);
              await logout();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            Keluar dari Akun (Sign Out)
          </button>
        </div>
      )}
    </div>
  );
}
