'use client';

import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  X,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  Tag,
  Truck,
  Box,
  Package,
  User,
  Users,
  Mail,
  Phone,
  MessageCircle,
  Send,
  Bell,
  Star,
  Zap,
  Flame,
  Shield,
  Award,
  Heart,
  Globe,
  Compass,
  Layout,
  Layers,
  Search,
  Sliders,
  Calendar,
  Clock,
  Code,
  Terminal,
  Cpu,
  Laptop,
  Smartphone,
  Smile,
  HelpCircle,
  Folder,
  FileText,
  Settings,
  Link as LinkIcon,
  Eye,
  Lock,
  ThumbsUp,
  Bookmark,
  Share2,
} from 'lucide-react';

export const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Check,
  CheckCircle2,
  X,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  Tag,
  Truck,
  Box,
  Package,
  User,
  Users,
  Mail,
  Phone,
  MessageCircle,
  Send,
  Bell,
  Star,
  Zap,
  Flame,
  Shield,
  Award,
  Heart,
  Globe,
  Compass,
  Layout,
  Layers,
  Search,
  Sliders,
  Calendar,
  Clock,
  Code,
  Terminal,
  Cpu,
  Laptop,
  Smartphone,
  Smile,
  HelpCircle,
  Folder,
  FileText,
  Settings,
  Link: LinkIcon,
  Eye,
  Lock,
  ThumbsUp,
  Bookmark,
  Share2,
};

export const POPULAR_ICONS = Object.keys(ICON_MAP);

export function DynamicIcon({
  name,
  className = 'w-4 h-4',
  fallback,
}: {
  name?: string;
  className?: string;
  fallback?: React.ReactNode;
}) {
  if (!name) return fallback ? <>{fallback}</> : null;

  // Check if it's in ICON_MAP
  const IconComp = ICON_MAP[name];
  if (IconComp) {
    return <IconComp className={className} />;
  }

  // If it's an emoji or 1-2 characters
  if (name.length <= 4) {
    return <span className="inline-block text-center leading-none">{name}</span>;
  }

  return fallback ? <>{fallback}</> : <Check className={className} />;
}

interface IconPickerProps {
  label?: string;
  value?: string;
  onChange: (iconName: string) => void;
  showCustomInput?: boolean;
}

export function IconPicker({
  label = 'Select Icon',
  value = 'Check',
  onChange,
  showCustomInput = true,
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = POPULAR_ICONS.filter((icon) =>
    icon.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <label className="block text-xs font-medium text-slate-700 dark:text-neutral-300">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-slate-800 dark:text-neutral-200 hover:border-slate-300 dark:hover:border-neutral-700 transition-colors shadow-xs"
        >
          <div className="flex items-center gap-2 truncate">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shrink-0">
              <DynamicIcon name={value} className="w-3.5 h-3.5" fallback={<span>{value || '•'}</span>} />
            </div>
            <span className="font-mono text-[11px] truncate">{value || 'None'}</span>
          </div>
          <span className="text-[10px] text-slate-400">▾</span>
        </button>

        {isOpen && (
          <div className="absolute top-full mt-1.5 left-0 w-64 z-50 p-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search icons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {showCustomInput && (
              <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-neutral-800">
                <input
                  type="text"
                  placeholder="Custom icon name (e.g. Tag, Check)"
                  value={value && !ICON_MAP[value] ? value : ''}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-neutral-100"
                />
              </div>
            )}

            <div className="grid grid-cols-6 gap-1 max-h-44 overflow-y-auto p-1 custom-scrollbar">
              {filtered.map((iconName) => {
                const IconComp = ICON_MAP[iconName];
                const isSelected = value === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    title={iconName}
                    onClick={() => {
                      onChange(iconName);
                      setIsOpen(false);
                    }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="col-span-6 py-4 text-center text-xs text-slate-400">
                  No icons match &quot;{search}&quot;
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
