'use client';

import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Globe,
  ExternalLink,
  Copy,
  Check,
  History,
  RotateCcw,
  Sparkles,
  X,
  Search,
  Share2,
  Calendar,
  Layers,
  Loader2,
  FileText,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { PageSeoMetadata, PublishedPageVersion } from '../../../../shared/types';
import { PagesApiClient } from '@/lib/api-client';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageId: string;
  pageTitle: string;
  pageSlug: string;
  pageStatus: 'DRAFT' | 'PUBLISHED';
  seoMetadata: PageSeoMetadata;
  onUpdateSeo: (seo: PageSeoMetadata) => void;
  onPublishSuccess?: (publishedData: any) => void;
  onRollbackSuccess?: (restoredPage: any) => void;
}

export function PublishModal({
  isOpen,
  onClose,
  pageId,
  pageTitle,
  pageSlug,
  pageStatus,
  seoMetadata,
  onUpdateSeo,
  onPublishSuccess,
  onRollbackSuccess,
}: PublishModalProps) {
  const [activeTab, setActiveTab] = useState<'publish' | 'history' | 'seo'>('publish');
  const [releaseNotes, setReleaseNotes] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Version History State
  const [versions, setVersions] = useState<PublishedPageVersion[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState<string | null>(null);

  // SEO Form local state
  const [localSeo, setLocalSeo] = useState<PageSeoMetadata>({
    metaTitle: seoMetadata.metaTitle || pageTitle,
    metaDescription: seoMetadata.metaDescription || '',
    ogImage: seoMetadata.ogImage || '',
    keywords: seoMetadata.keywords || '',
    canonicalUrl: seoMetadata.canonicalUrl || '',
  });

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const publicUrl = `${origin}/p/${pageSlug}`;

  useEffect(() => {
    if (isOpen) {
      loadVersions();
    }
  }, [isOpen, pageId]);

  const loadVersions = async () => {
    setIsLoadingVersions(true);
    try {
      const list = await PagesApiClient.getPageVersions(pageId);
      setVersions(list);
    } catch (err) {
      console.warn('Failed to load version snapshots:', err);
    } finally {
      setIsLoadingVersions(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // 1. Sync SEO metadata first
      onUpdateSeo(localSeo);

      // 2. Publish and create snapshot
      const res = await PagesApiClient.publishPage(pageId, releaseNotes.trim() || undefined);
      if (onPublishSuccess) {
        onPublishSuccess(res);
      }
      setReleaseNotes('');
      await loadVersions();
    } catch (err) {
      console.error('Failed to publish page:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRollback = async (versionId: string) => {
    setIsRollingBack(versionId);
    try {
      const restored = await PagesApiClient.rollbackPage(pageId, versionId);
      if (onRollbackSuccess) {
        onRollbackSuccess(restored);
      }
      onClose();
    } catch (err) {
      console.error('Rollback failed:', err);
    } finally {
      setIsRollingBack(null);
    }
  };

  const handleSeoChange = (key: keyof PageSeoMetadata, val: string) => {
    const next = { ...localSeo, [key]: val };
    setLocalSeo(next);
    onUpdateSeo(next);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-neutral-800 bg-slate-50/80 dark:bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Publish & Deploy Storefront</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    pageStatus === 'PUBLISHED'
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {pageStatus === 'PUBLISHED' ? 'LIVE ONLINE' : 'DRAFT'}
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                Deploy immutable production snapshots & configure SEO metadata.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0c0d12]">
          <button
            onClick={() => setActiveTab('publish')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'publish'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Publish Storefront</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Version History ({versions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'seo'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>SEO & Social Preview</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: PUBLISH */}
          {activeTab === 'publish' && (
            <div className="space-y-5">
              {/* Public URL Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">Public Storefront URL</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Ready for visitors</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 font-mono text-xs text-blue-600 dark:text-blue-400 truncate select-all">
                    {publicUrl}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 text-xs font-medium"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                    {copiedUrl ? 'Copied' : 'Copy'}
                  </Button>
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-xs font-medium text-slate-700 dark:text-neutral-300 transition-colors h-8"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Live</span>
                  </a>
                </div>
              </div>

              {/* Release Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
                  Version Release Notes (Optional)
                </label>
                <Input
                  value={releaseNotes}
                  onChange={(e) => setReleaseNotes(e.target.value)}
                  placeholder="e.g. Updated hero headline, changed primary button style, new pricing package..."
                  className="text-xs"
                />
                <p className="text-[11px] text-slate-400">
                  Notes are stored with the immutable version snapshot for future auditing and 1-click rollbacks.
                </p>
              </div>

              {/* Snapshot Info Card */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="leading-relaxed text-[11px]">
                  Publishing converts your current draft into a production version snapshot. Visitors navigating to{' '}
                  <span className="font-mono font-bold">/p/{pageSlug}</span> will immediately see the updated storefront.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VERSION HISTORY & ROLLBACK */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 dark:text-neutral-400">
                Snapshots are automatically created each time you publish. You can restore your page draft to any previous state at any time.
              </div>

              {isLoadingVersions ? (
                <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span>Loading snapshots...</span>
                </div>
              ) : versions.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-neutral-800 text-center text-xs text-slate-400">
                  No published snapshots found yet. Click &quot;Publish Storefront&quot; to create your first version snapshot.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {versions.map((ver, idx) => (
                    <div
                      key={ver.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 flex items-center justify-between hover:border-blue-400/50 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono">
                            v{ver.versionNumber || versions.length - idx}
                          </span>
                          <span className="text-xs font-semibold text-slate-900 dark:text-white">
                            {ver.notes || 'Production release'}
                          </span>
                          {idx === 0 && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                              CURRENT LIVE
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(ver.createdAt).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            {ver.blocks?.length || 0} sections
                          </span>
                          {ver.publishedBy && <span>By {ver.publishedBy}</span>}
                        </div>
                      </div>

                      <div>
                        {idx !== 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isRollingBack === ver.id}
                            onClick={() => handleRollback(ver.id)}
                            className="text-xs h-7 px-2.5 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 dark:hover:bg-amber-950/40"
                            title="Rollback page draft to this exact version"
                          >
                            {isRollingBack === ver.id ? (
                              <Loader2 className="w-3 h-3 animate-spin mr-1" />
                            ) : (
                              <RotateCcw className="w-3 h-3 mr-1" />
                            )}
                            Rollback
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SEO & SOCIAL PREVIEW */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              {/* Form Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                    Meta Title (Browser Tab & Search Title)
                  </label>
                  <Input
                    value={localSeo.metaTitle || ''}
                    onChange={(e) => handleSeoChange('metaTitle', e.target.value)}
                    placeholder="e.g. Alex Travis — Creative Direction & Strategy"
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                    Meta Description (SERP Summary)
                  </label>
                  <textarea
                    value={localSeo.metaDescription || ''}
                    onChange={(e) => handleSeoChange('metaDescription', e.target.value)}
                    rows={2}
                    placeholder="Brief description for search engines and social cards (150-160 characters recommended)..."
                    className="w-full text-xs rounded-md border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                    Open Graph (OG) Image URL
                  </label>
                  <Input
                    value={localSeo.ogImage || ''}
                    onChange={(e) => handleSeoChange('ogImage', e.target.value)}
                    placeholder="https://example.com/social-preview.jpg"
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                    Keywords (Comma-separated)
                  </label>
                  <Input
                    value={localSeo.keywords || ''}
                    onChange={(e) => handleSeoChange('keywords', e.target.value)}
                    placeholder="design, portfolio, branding, creative direction"
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Live Google Search Preview */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Google Search Snippet Preview
                </div>
                <div className="font-sans">
                  <div className="text-[12px] text-slate-600 dark:text-neutral-400 flex items-center gap-1">
                    <span>{origin.replace(/https?:\/\//, '')}</span>
                    <span>› p › {pageSlug}</span>
                  </div>
                  <div className="text-base font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    {localSeo.metaTitle || pageTitle}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {localSeo.metaDescription || 'No description provided. Search engines will generate a snippet from your page content.'}
                  </div>
                </div>
              </div>

              {/* Live Social Share Card Preview */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                  <Share2 className="w-3 h-3" />
                  <span>Social Media Card Preview (Facebook, Twitter, LinkedIn)</span>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-neutral-800 overflow-hidden bg-slate-50 dark:bg-neutral-950 max-w-sm">
                  {localSeo.ogImage ? (
                    <img src={localSeo.ogImage} alt="OG Preview" className="w-full h-36 object-cover" />
                  ) : (
                    <div className="w-full h-28 bg-slate-200 dark:bg-neutral-800 flex items-center justify-center text-slate-400 text-xs font-medium">
                      No OG Image specified
                    </div>
                  )}
                  <div className="p-3">
                    <div className="text-[10px] font-mono uppercase text-slate-400">
                      {origin.replace(/https?:\/\//, '')}
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {localSeo.metaTitle || pageTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-1">
                      {localSeo.metaDescription || 'High converting storefront landing page.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 dark:border-neutral-800 bg-slate-50/80 dark:bg-neutral-950/80">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>

          {activeTab === 'publish' && (
            <Button
              type="button"
              variant="default"
              size="sm"
              disabled={isPublishing}
              onClick={handlePublish}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  <span>Deploying...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-3.5 h-3.5 mr-1.5" />
                  <span>Publish Now</span>
                </>
              )}
            </Button>
          )}

          {activeTab === 'seo' && (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => {
                onUpdateSeo(localSeo);
                onClose();
              }}
              className="text-xs font-semibold"
            >
              Save SEO Settings
            </Button>
          )}

          {activeTab === 'history' && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadVersions}
              className="text-xs"
            >
              Refresh
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
