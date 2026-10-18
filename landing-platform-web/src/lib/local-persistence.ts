import { PageDocument, PageSummary } from '../../../shared/types';
import { validatePageDocument } from './document-validator';

const LOCAL_STORAGE_PREFIX = 'lp_page_draft_';
const LOCAL_STORAGE_INDEX = 'lp_pages_index';

export class LocalPersistence {
  static getIndex(): PageSummary[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_INDEX);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveDraft(pageId: string, doc: Partial<PageDocument>): void {
    if (typeof window === 'undefined') return;
    try {
      const existing = this.loadDraft(pageId);
      const merged = { ...existing, ...doc, id: pageId, updatedAt: new Date().toISOString() };
      const { repairedDoc } = validatePageDocument(merged, pageId);

      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${pageId}`, JSON.stringify(repairedDoc));

      // Update index
      const index = this.getIndex();
      const existingIdx = index.findIndex((p) => p.id === pageId);
      const summary: PageSummary = {
        id: pageId,
        projectId: repairedDoc.projectId || 'proj_default',
        title: repairedDoc.title || 'Untitled Page',
        slug: repairedDoc.slug || 'page',
        status: repairedDoc.status || 'DRAFT',
        isDefault: repairedDoc.slug === 'home',
        blockCount: Array.isArray(repairedDoc.blocks) ? repairedDoc.blocks.length : 0,
        updatedAt: repairedDoc.updatedAt || new Date().toISOString(),
      };

      if (existingIdx >= 0) {
        index[existingIdx] = summary;
      } else {
        index.push(summary);
      }
      localStorage.setItem(LOCAL_STORAGE_INDEX, JSON.stringify(index));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  static loadDraft(pageId: string): PageDocument | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${pageId}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const { repairedDoc } = validatePageDocument(parsed, pageId);
      return repairedDoc;
    } catch {
      return null;
    }
  }

  static deleteDraft(pageId: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}${pageId}`);
      const index = this.getIndex().filter((p) => p.id !== pageId);
      localStorage.setItem(LOCAL_STORAGE_INDEX, JSON.stringify(index));
    } catch (e) {
      console.warn('LocalStorage delete failed:', e);
    }
  }

  static clearAll(): void {
    if (typeof window === 'undefined') return;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith(LOCAL_STORAGE_PREFIX) || key === LOCAL_STORAGE_INDEX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('LocalStorage clearAll failed:', e);
    }
  }
}
