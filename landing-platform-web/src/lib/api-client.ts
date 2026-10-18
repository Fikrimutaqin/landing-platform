import {
  PageDocument,
  PageSummary,
  CreatePageDto,
  UpdatePageDraftDto,
} from '../../../shared/types';
import { LocalPersistence } from './local-persistence';
import { validatePageDocument } from './document-validator';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.message || `Request failed with status ${res.status}`);
    }

    const json = await res.json();
    return json.data as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export class PagesApiClient {
  /**
   * Fetch all pages belonging to project
   */
  static async getProjectPages(projectId: string = 'proj_default'): Promise<PageSummary[]> {
    try {
      const serverPages = await request<PageSummary[]>(`/projects/${projectId}/pages`);
      // Update local cache
      for (const p of serverPages) {
        const local = LocalPersistence.loadDraft(p.id);
        if (!local) {
          LocalPersistence.saveDraft(p.id, {
            id: p.id,
            projectId: p.projectId,
            title: p.title,
            slug: p.slug,
            status: p.status,
          });
        }
      }
      return serverPages;
    } catch (err) {
      console.warn('API getProjectPages unreachable, reading local storage:', err);
      const localList = LocalPersistence.getIndex();
      return localList;
    }
  }

  /**
   * Delete and clear all project pages
   */
  static async clearProjectPages(projectId: string = 'proj_default'): Promise<boolean> {
    try {
      await request(`/projects/${projectId}/pages`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API clearProjectPages unreachable, clearing locally:', err);
    }
    LocalPersistence.clearAll();
    return true;
  }

  /**
   * Fetch a full page document
   */
  static async getPage(pageId: string): Promise<PageDocument> {
    try {
      const serverDoc = await request<PageDocument>(`/pages/${pageId}`);
      const { repairedDoc } = validatePageDocument(serverDoc, pageId);
      LocalPersistence.saveDraft(pageId, repairedDoc);
      return repairedDoc;
    } catch (err) {
      console.warn(`API getPage (${pageId}) unreachable, reading local storage:`, err);
      const localDoc = LocalPersistence.loadDraft(pageId);
      if (localDoc) return localDoc;

      return {
        schemaVersion: 1,
        id: pageId,
        projectId: 'proj_default',
        title: 'Storefront Page',
        slug: 'home',
        status: 'DRAFT',
        blocks: [],
        updatedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Save or autosave page draft
   */
  static async saveDraft(pageId: string, draft: UpdatePageDraftDto): Promise<PageDocument> {
    // 1. Always save to local storage immediately for disaster recovery
    LocalPersistence.saveDraft(pageId, draft as any);

    // 2. Persist to API server
    try {
      const serverDoc = await request<PageDocument>(`/pages/${pageId}`, {
        method: 'PUT',
        body: JSON.stringify(draft),
      });
      const { repairedDoc } = validatePageDocument(serverDoc, pageId);
      return repairedDoc;
    } catch (err) {
      console.warn(`API saveDraft (${pageId}) offline, local draft preserved:`, err);
      const cached = LocalPersistence.loadDraft(pageId);
      if (cached) return cached;
      throw err;
    }
  }

  /**
   * Create new page in project
   */
  static async createPage(projectId: string, title: string, slug: string, templateKey?: string): Promise<PageDocument> {
    try {
      const created = await request<PageDocument>(`/projects/${projectId}/pages`, {
        method: 'POST',
        body: JSON.stringify({ projectId, title, slug, templateKey } as CreatePageDto),
      });
      LocalPersistence.saveDraft(created.id, created);
      return created;
    } catch (err) {
      console.warn('API createPage unreachable, creating locally:', err);
      const newId = `page_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const localNew: PageDocument = {
        schemaVersion: 1,
        id: newId,
        projectId,
        title,
        slug,
        status: 'DRAFT',
        blocks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      LocalPersistence.saveDraft(newId, localNew);
      return localNew;
    }
  }

  /**
   * Duplicate page
   */
  static async duplicatePage(pageId: string): Promise<PageDocument> {
    try {
      const duplicated = await request<PageDocument>(`/pages/${pageId}/duplicate`, {
        method: 'POST',
      });
      LocalPersistence.saveDraft(duplicated.id, duplicated);
      return duplicated;
    } catch (err) {
      console.warn('API duplicatePage unreachable, duplicating locally:', err);
      const source = LocalPersistence.loadDraft(pageId);
      const newId = `page_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const localDup: PageDocument = {
        ...(source || {
          schemaVersion: 1,
          id: pageId,
          projectId: 'proj_default',
          title: 'Page',
          slug: 'page',
          status: 'DRAFT',
          blocks: [],
        }),
        id: newId,
        title: `${source?.title || 'Page'} (Copy)`,
        slug: `${source?.slug || 'page'}-copy`,
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      LocalPersistence.saveDraft(newId, localDup);
      return localDup;
    }
  }

  /**
   * Delete page
   */
  static async deletePage(pageId: string): Promise<boolean> {
    try {
      await request<{ success: boolean }>(`/pages/${pageId}`, {
        method: 'DELETE',
      });
      LocalPersistence.deleteDraft(pageId);
      return true;
    } catch (err) {
      console.warn('API deletePage unreachable, deleting locally:', err);
      LocalPersistence.deleteDraft(pageId);
      return true;
    }
  }

  /**
   * Publish page to live URL and create an immutable version snapshot
   */
  static async publishPage(pageId: string, notes?: string): Promise<{ page: PageDocument; version: any }> {
    try {
      const res = await request<{ page: PageDocument; version: any }>(`/pages/${pageId}/publish`, {
        method: 'POST',
        body: JSON.stringify({ notes }),
      });
      const local = LocalPersistence.loadDraft(pageId);
      if (local) {
        LocalPersistence.saveDraft(pageId, {
          ...local,
          status: 'PUBLISHED',
          publishedAt: new Date().toISOString(),
        });
      }
      return res;
    } catch (err) {
      console.warn('API publishPage unreachable, publishing locally:', err);
      const local = LocalPersistence.loadDraft(pageId) || {
        schemaVersion: 1,
        id: pageId,
        projectId: 'proj_default',
        title: 'Untitled Page',
        slug: 'page',
        status: 'PUBLISHED' as const,
        blocks: [],
      };
      const updated = {
        ...local,
        status: 'PUBLISHED' as const,
        publishedAt: new Date().toISOString(),
      };
      LocalPersistence.saveDraft(pageId, updated);
      return {
        page: updated,
        version: {
          id: `ver_local_${Date.now()}`,
          pageId,
          versionNumber: 1,
          title: updated.title,
          slug: updated.slug,
          blocks: updated.blocks,
          notes: notes || 'Published locally',
          createdAt: new Date().toISOString(),
        },
      };
    }
  }

  /**
   * Get version history snapshots for a page
   */
  static async getPageVersions(pageId: string): Promise<any[]> {
    try {
      return await request<any[]>(`/pages/${pageId}/versions`);
    } catch (err) {
      console.warn('API getPageVersions unreachable, returning fallback version:', err);
      return [
        {
          id: `ver_local_1`,
          pageId,
          versionNumber: 1,
          title: 'Initial Version',
          slug: 'home',
          blocks: [],
          notes: 'Local fallback snapshot',
          createdAt: new Date().toISOString(),
        },
      ];
    }
  }

  /**
   * Rollback page draft to a previous version snapshot
   */
  static async rollbackPage(pageId: string, versionId: string): Promise<PageDocument> {
    try {
      const res = await request<PageDocument>(`/pages/${pageId}/rollback/${versionId}`, {
        method: 'POST',
      });
      LocalPersistence.saveDraft(pageId, res);
      return res;
    } catch (err) {
      console.warn('API rollbackPage unreachable, falling back:', err);
      const local = LocalPersistence.loadDraft(pageId);
      if (!local) throw new Error('Local draft not found for rollback');
      return local;
    }
  }

  /**
   * Fetch live public page for storefront visitor rendering
   */
  static async getPublicPage(slug: string): Promise<any> {
    const cleanSlug = slug.toLowerCase().replace(/^\/+/, '');
    try {
      const res = await request<any>(`/public/pages/${cleanSlug}`);
      if (res) return res;
    } catch (err) {
      console.warn(`API getPublicPage for slug '${cleanSlug}' unreachable, searching local persistence:`, err);
    }

    const allSummaries = LocalPersistence.getIndex();
    const match = allSummaries.find(
      (p) =>
        p.slug.toLowerCase().replace(/^\/+/, '') === cleanSlug ||
        p.id === cleanSlug ||
        p.id === `page_${cleanSlug.replace(/-/g, '_')}`
    );
    if (match) {
      const full = LocalPersistence.loadDraft(match.id);
      if (full) return full;
    }

    const direct =
      LocalPersistence.loadDraft(`page_${cleanSlug.replace(/-/g, '_')}`) ||
      LocalPersistence.loadDraft(cleanSlug);
    if (direct) return direct;

    throw new Error(`Halaman dengan slug '${cleanSlug}' belum dipublikasikan.`);
  }
}
