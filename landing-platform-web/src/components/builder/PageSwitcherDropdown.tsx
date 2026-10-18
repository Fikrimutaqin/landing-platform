'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PageSummary } from '../../../../shared/types';
import {
  FileText,
  ChevronDown,
  Plus,
  Home,
  Copy,
  Trash2,
  Settings,
  Search,
  ExternalLink,
  Layers,
} from 'lucide-react';

interface PageSwitcherDropdownProps {
  currentPageId: string;
  pages: PageSummary[];
  onSelectPage: (pageId: string) => void;
  onOpenNewPageModal: () => void;
  onOpenPageSettings: (pageId: string) => void;
  onDuplicatePage: (pageId: string) => void;
  onDeletePage: (pageId: string) => void;
}

export function PageSwitcherDropdown({
  currentPageId,
  pages,
  onSelectPage,
  onOpenNewPageModal,
  onOpenPageSettings,
  onDuplicatePage,
  onDeletePage,
}: PageSwitcherDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentPage = pages.find((p) => p.id === currentPageId) || pages[0] || {
    id: currentPageId,
    title: 'Storefront Home',
    slug: 'home',
    status: 'PUBLISHED',
  };

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const filteredPages = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current Page Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/90 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all text-xs cursor-pointer group"
        title="Switch or manage pages in this project"
      >
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-neutral-100">
          {currentPage.slug === 'home' ? (
            <Home className="w-3.5 h-3.5 text-blue-500" />
          ) : (
            <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
          )}
          <span className="truncate max-w-32.5 sm:max-w-40">{currentPage.title}</span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">/{currentPage.slug}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-72 rounded-xl bg-white dark:bg-[#0d0e14] border border-slate-200 dark:border-neutral-800 shadow-2xl z-50 overflow-hidden flex flex-col text-xs animate-in fade-in zoom-in-95 duration-100">
          {/* Search Header */}
          <div className="p-2 border-b border-slate-100 dark:border-neutral-800/80 bg-slate-50/50 dark:bg-neutral-900/50">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages by title or slug..."
                className="w-full bg-transparent text-[11px] text-slate-900 dark:text-neutral-100 outline-none"
                autoFocus
              />
            </div>
          </div>

          {/* Pages List */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
            {filteredPages.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs">No pages found matching &quot;{searchQuery}&quot;</div>
            ) : (
              filteredPages.map((page) => {
                const isSelected = page.id === currentPage.id;
                return (
                  <div
                    key={page.id}
                    className={`group/item flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60'
                        : 'hover:bg-slate-100 dark:hover:bg-neutral-800/60 border border-transparent'
                      }`}
                    onClick={() => {
                      onSelectPage(page.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {page.slug === 'home' ? (
                        <Home className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-semibold truncate ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-neutral-200'
                              }`}
                          >
                            {page.title}
                          </span>
                          {page.status === 'PUBLISHED' ? (
                            <span className="text-[9px] px-1 py-0.2 rounded font-bold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                              Live
                            </span>
                          ) : (
                            <span className="text-[9px] px-1 py-0.2 rounded font-bold uppercase bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400">
                              Draft
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">/{page.slug}</span>
                      </div>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => {
                          onOpenPageSettings(page.id);
                          setIsOpen(false);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-neutral-700"
                        title="Page Settings (SEO & Slug)"
                      >
                        <Settings className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onDuplicatePage(page.id);
                          setIsOpen(false);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-neutral-700"
                        title="Duplicate Page"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {page.slug !== 'home' && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete '${page.title}'? This cannot be undone.`)) {
                              onDeletePage(page.id);
                              setIsOpen(false);
                            }
                          }}
                          className="p-1 rounded text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Delete Page"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Add Page Button Footer */}
          <div className="p-2 border-t border-slate-100 dark:border-neutral-800/80 bg-slate-50 dark:bg-neutral-900/60">
            <button
              type="button"
              onClick={() => {
                onOpenNewPageModal();
                setIsOpen(false);
              }}
              className="w-full py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Page</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
