'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PageSummary, PageDocument, SaveStatus, DesignTokens, StyleClass, PageSeoMetadata } from '../../../shared/types';
import { PagesApiClient } from '../lib/api-client';
import { ALEX_TRAVIS_TEMPLATE } from '../components/templates/alex-travis-template';

interface UsePersistenceProps {
  initialPageId?: string;
  blocks: any[];
  setBlocks: (blocks: any[]) => void;
  designTokens: DesignTokens;
  setDesignTokens: (tokens: DesignTokens) => void;
  styleClasses: StyleClass[];
  setStyleClasses: (classes: StyleClass[]) => void;
  pageName: string;
  setPageName: (name: string) => void;
  pageSlug: string;
  setPageSlug: (slug: string) => void;
  metaTitle: string;
  setMetaTitle: (title: string) => void;
  metaDescription: string;
  setMetaDescription: (desc: string) => void;
  seoMetadata?: PageSeoMetadata;
  setSeoMetadata?: (seo: PageSeoMetadata) => void;
}

export function usePersistence({
  initialPageId = 'page_home',
  blocks,
  setBlocks,
  designTokens,
  setDesignTokens,
  styleClasses,
  setStyleClasses,
  pageName,
  setPageName,
  pageSlug,
  setPageSlug,
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  seoMetadata,
  setSeoMetadata,
}: UsePersistenceProps) {
  const [currentPageId, setCurrentPageId] = useState<string>(initialPageId);
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isInitialLoad = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSwitchingRef = useRef(false);

  // 1. Initial load of pages list
  const refreshPagesList = useCallback(async () => {
    try {
      const list = await PagesApiClient.getProjectPages('proj_default');
      setPages(list);
    } catch (e) {
      console.warn('Failed to load project pages:', e);
    }
  }, []);

  useEffect(() => {
    refreshPagesList();
  }, [refreshPagesList]);

  // 2. Perform Save
  const performSave = useCallback(
    async (targetId = currentPageId) => {
      setSaveStatus('saving');
      setSaveError(null);
      try {
        await PagesApiClient.saveDraft(targetId, {
          title: pageName,
          slug: pageSlug,
          blocks,
          tokens: designTokens,
          styleClasses,
          seoMetadata: {
            metaTitle,
            metaDescription,
            favicon: seoMetadata?.favicon,
            ogImage: seoMetadata?.ogImage,
            canonicalUrl: seoMetadata?.canonicalUrl,
            keywords: seoMetadata?.keywords,
            facebookPixelId: seoMetadata?.facebookPixelId,
            tiktokPixelId: seoMetadata?.tiktokPixelId,
            googleAnalyticsId: seoMetadata?.googleAnalyticsId,
            customHeadScripts: seoMetadata?.customHeadScripts,
            customBodyScripts: seoMetadata?.customBodyScripts,
          },
        });
        setSaveStatus('saved');
        setLastSavedAt(new Date());
        refreshPagesList();
      } catch (err: any) {
        console.error('Autosave failed:', err);
        setSaveStatus('error');
        setSaveError(err.message || 'Save failed');
      }
    },
    [currentPageId, pageName, pageSlug, blocks, designTokens, styleClasses, metaTitle, metaDescription, seoMetadata, refreshPagesList],
  );

  // 3. Debounced Autosave Trigger
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    if (isSwitchingRef.current) return;

    setSaveStatus('unsaved');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      performSave();
    }, 1500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [blocks, designTokens, styleClasses, pageName, pageSlug, metaTitle, metaDescription, seoMetadata, performSave]);

  // 4. Switch Page
  const switchPage = async (targetPageId: string) => {
    if (targetPageId === currentPageId) return;

    // Save pending changes on current page before switching
    if (saveStatus === 'unsaved') {
      await performSave(currentPageId);
    }

    isSwitchingRef.current = true;
    setIsLoadingPage(true);

    try {
      const doc = await PagesApiClient.getPage(targetPageId);
      setCurrentPageId(doc.id);
      setPageName(doc.title || 'Untitled Page');
      setPageSlug(doc.slug || 'page');
      setMetaTitle(doc.seoMetadata?.metaTitle || '');
      setMetaDescription(doc.seoMetadata?.metaDescription || '');
      if (setSeoMetadata && doc.seoMetadata) {
        setSeoMetadata(doc.seoMetadata);
      }

      if (Array.isArray(doc.blocks) && doc.blocks.length > 0) {
        setBlocks(doc.blocks);
      } else if (doc.slug === 'home' && blocks.length > 0) {
        // preserve current home blocks if empty on server
      } else {
        setBlocks([]);
      }

      if (doc.tokens) {
        setDesignTokens(doc.tokens);
      }
      if (doc.styleClasses && doc.styleClasses.length > 0) {
        setStyleClasses(doc.styleClasses);
      }

      setSaveStatus('saved');
      setLastSavedAt(new Date());
    } catch (e) {
      console.error('Failed to switch page:', e);
    } finally {
      setIsLoadingPage(false);
      setTimeout(() => {
        isSwitchingRef.current = false;
      }, 100);
    }
  };

  // 5. Create New Page
  const createNewPage = async (title: string, slug: string, templateKey: string) => {
    try {
      const newPage = await PagesApiClient.createPage('proj_default', title, slug, templateKey);
      await refreshPagesList();

      // If template was selected, seed blocks
      if (templateKey === 'alex_full') {
        const cloned = JSON.parse(JSON.stringify(ALEX_TRAVIS_TEMPLATE));
        newPage.blocks = cloned;
        await PagesApiClient.saveDraft(newPage.id, { blocks: cloned });
      }

      await switchPage(newPage.id);
    } catch (e) {
      console.error('Failed to create page:', e);
    }
  };

  // 6. Duplicate Page
  const duplicatePage = async (pageId: string) => {
    try {
      const dup = await PagesApiClient.duplicatePage(pageId);
      await refreshPagesList();
      await switchPage(dup.id);
    } catch (e) {
      console.error('Failed to duplicate page:', e);
    }
  };

  // 7. Delete Page
  const deletePage = async (pageId: string) => {
    try {
      await PagesApiClient.deletePage(pageId);
      await refreshPagesList();
      if (currentPageId === pageId) {
        await switchPage('page_home');
      }
    } catch (e) {
      console.error('Failed to delete page:', e);
    }
  };

  return {
    currentPageId,
    pages,
    saveStatus,
    lastSavedAt,
    isLoadingPage,
    saveError,
    saveNow: () => performSave(currentPageId),
    switchPage,
    createNewPage,
    duplicatePage,
    deletePage,
    refreshPagesList,
  };
}
