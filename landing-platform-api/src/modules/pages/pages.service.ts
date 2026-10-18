import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePageDto, UpdatePageDraftDto } from './dto/pages.dto.js';

export interface PageDocument {
  schemaVersion: number;
  id: string;
  projectId: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED';
  blocks: any[];
  tokens?: any;
  styleClasses?: any[];
  seoMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
    favicon?: string;
    ogImage?: string;
    canonicalUrl?: string;
    keywords?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface PageSummary {
  id: string;
  projectId: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED';
  isDefault?: boolean;
  blockCount?: number;
  updatedAt: string;
}

export interface PublishedPageVersion {
  id: string;
  pageId: string;
  versionNumber: number;
  title: string;
  slug: string;
  blocks: any[];
  tokens?: any;
  styleClasses?: any[];
  seoMetadata?: any;
  publishedBy?: string;
  notes?: string;
  createdAt: string;
}

@Injectable()
export class PagesService {
  // In-memory persistent registry for development & rapid reactivity
  private pagesStore: Map<string, PageDocument> = new Map();
  private versionsStore: Map<string, PublishedPageVersion[]> = new Map();

  constructor() {
    this.seedInitialPages();
  }

  private seedInitialPages() {
    // Zero dummy pages: clean starting state for end-to-end testing
  }

  clearAllPages(): boolean {
    this.pagesStore.clear();
    this.versionsStore.clear();
    return true;
  }

  getPagesByProject(projectId: string): PageSummary[] {
    const list: PageSummary[] = [];
    for (const page of this.pagesStore.values()) {
      if (page.projectId === projectId || projectId === 'all') {
        list.push({
          id: page.id,
          projectId: page.projectId,
          title: page.title,
          slug: page.slug,
          status: page.status,
          isDefault: page.slug === 'home',
          blockCount: Array.isArray(page.blocks) ? page.blocks.length : 0,
          updatedAt: page.updatedAt || new Date().toISOString(),
        });
      }
    }
    return list;
  }

  getPageById(id: string): PageDocument {
    const page = this.pagesStore.get(id);
    if (!page) {
      throw new NotFoundException(`Page with id '${id}' not found.`);
    }
    return page;
  }

  createPage(dto: CreatePageDto): PageDocument {
    const cleanSlug = dto.slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const existing = Array.from(this.pagesStore.values()).find(
      (p) => p.projectId === dto.projectId && p.slug === cleanSlug,
    );

    if (existing) {
      throw new BadRequestException(`A page with slug '${cleanSlug}' already exists in this project.`);
    }

    const newId = `page_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newPage: PageDocument = {
      schemaVersion: 1,
      id: newId,
      projectId: dto.projectId,
      title: dto.title.trim() || 'Untitled Page',
      slug: cleanSlug || 'page',
      status: 'DRAFT',
      blocks: [],
      seoMetadata: {
        metaTitle: dto.title,
        metaDescription: '',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.pagesStore.set(newId, newPage);
    return newPage;
  }

  updatePageDraft(id: string, dto: UpdatePageDraftDto): PageDocument {
    let page = this.pagesStore.get(id);

    if (!page) {
      page = {
        schemaVersion: 1,
        id,
        projectId: 'proj_default',
        title: dto.title || 'Storefront Page',
        slug: (dto.slug || id.replace('page_', '')).replace(/^\/+/, ''),
        status: 'DRAFT',
        blocks: dto.blocks || [],
        tokens: dto.tokens,
        styleClasses: dto.styleClasses,
        seoMetadata: dto.seoMetadata || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.pagesStore.set(id, page);
      return page;
    }

    const updated: PageDocument = {
      ...page,
      title: dto.title !== undefined ? dto.title : page.title,
      slug: dto.slug !== undefined ? dto.slug.replace(/^\/+/, '') : page.slug,
      blocks: dto.blocks !== undefined ? dto.blocks : page.blocks,
      tokens: dto.tokens !== undefined ? dto.tokens : page.tokens,
      styleClasses: dto.styleClasses !== undefined ? dto.styleClasses : page.styleClasses,
      seoMetadata: dto.seoMetadata !== undefined ? { ...page.seoMetadata, ...dto.seoMetadata } : page.seoMetadata,
      updatedAt: new Date().toISOString(),
    };

    this.pagesStore.set(id, updated);
    return updated;
  }

  duplicatePage(id: string): PageDocument {
    const source = this.getPageById(id);
    const newId = `page_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newSlug = `${source.slug}-copy-${Math.random().toString(36).substring(2, 5)}`;

    const duplicated: PageDocument = {
      ...JSON.parse(JSON.stringify(source)),
      id: newId,
      title: `${source.title} (Copy)`,
      slug: newSlug,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.pagesStore.set(newId, duplicated);
    return duplicated;
  }

  deletePage(id: string): { success: boolean; deletedId: string } {
    const page = this.getPageById(id);
    if (page.slug === 'home') {
      throw new BadRequestException(`Cannot delete the root home page.`);
    }
    this.pagesStore.delete(id);
    this.versionsStore.delete(id);
    return { success: true, deletedId: id };
  }

  publishPage(id: string, notes?: string, publishedBy?: string): { page: PageDocument; version: PublishedPageVersion } {
    let page = this.pagesStore.get(id);

    if (!page) {
      page = {
        schemaVersion: 1,
        id,
        projectId: 'proj_default',
        title: 'Storefront Page',
        slug: id.replace('page_', '').replace(/_/g, '-'),
        status: 'PUBLISHED',
        blocks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.pagesStore.set(id, page);
    }

    const existingVersions = this.versionsStore.get(id) || [];
    const versionNumber = (existingVersions[0]?.versionNumber || 0) + 1;

    const snapshot: PublishedPageVersion = {
      id: `ver_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      pageId: id,
      versionNumber,
      title: page.title,
      slug: page.slug,
      blocks: JSON.parse(JSON.stringify(page.blocks || [])),
      tokens: page.tokens ? JSON.parse(JSON.stringify(page.tokens)) : undefined,
      styleClasses: page.styleClasses ? JSON.parse(JSON.stringify(page.styleClasses)) : undefined,
      seoMetadata: page.seoMetadata ? JSON.parse(JSON.stringify(page.seoMetadata)) : undefined,
      publishedBy: publishedBy || 'Merchant Admin',
      notes: notes || `Production release v${versionNumber}`,
      createdAt: new Date().toISOString(),
    };

    this.versionsStore.set(id, [snapshot, ...existingVersions]);

    page.status = 'PUBLISHED';
    page.publishedAt = snapshot.createdAt;
    page.updatedAt = snapshot.createdAt;
    (page as any).activeVersionNumber = versionNumber;
    this.pagesStore.set(id, page);

    return { page, version: snapshot };
  }

  getPageVersions(pageId: string): PublishedPageVersion[] {
    const page = this.pagesStore.get(pageId);
    if (!page) return [];
    return this.versionsStore.get(pageId) || [];
  }

  rollbackPage(pageId: string, versionId: string): PageDocument {
    const page = this.getPageById(pageId);
    const versions = this.versionsStore.get(pageId) || [];
    const targetVersion = versions.find((v) => v.id === versionId);

    if (!targetVersion) {
      throw new NotFoundException(`Published version with id '${versionId}' not found for page '${pageId}'.`);
    }

    page.title = targetVersion.title;
    page.slug = targetVersion.slug;
    page.blocks = JSON.parse(JSON.stringify(targetVersion.blocks || []));
    page.tokens = targetVersion.tokens ? JSON.parse(JSON.stringify(targetVersion.tokens)) : page.tokens;
    page.styleClasses = targetVersion.styleClasses ? JSON.parse(JSON.stringify(targetVersion.styleClasses)) : page.styleClasses;
    page.seoMetadata = targetVersion.seoMetadata ? JSON.parse(JSON.stringify(targetVersion.seoMetadata)) : page.seoMetadata;
    page.updatedAt = new Date().toISOString();
    (page as any).activeVersionNumber = targetVersion.versionNumber;

    this.pagesStore.set(pageId, page);
    return page;
  }

  getPublicPageBySlug(slug: string): any {
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/^\/+/, '');
    const page = Array.from(this.pagesStore.values()).find(
      (p) =>
        (p.slug.toLowerCase().replace(/^\/+/, '') === cleanSlug) ||
        (p.id === `page_${cleanSlug.replace(/-/g, '_')}`) ||
        (p.id === cleanSlug),
    );

    if (!page) {
      throw new NotFoundException(`Published page with slug '${cleanSlug}' not found.`);
    }

    const versions = this.versionsStore.get(page.id) || [];
    const latestVersion = versions[0];

    return {
      id: page.id,
      projectId: page.projectId,
      title: latestVersion?.title || page.title,
      slug: latestVersion?.slug || page.slug,
      status: 'PUBLISHED',
      blocks: (latestVersion?.blocks && latestVersion.blocks.length > 0) ? latestVersion.blocks : page.blocks,
      tokens: latestVersion?.tokens || page.tokens,
      styleClasses: latestVersion?.styleClasses || page.styleClasses,
      seoMetadata: latestVersion?.seoMetadata || page.seoMetadata,
      versionNumber: latestVersion?.versionNumber || 1,
      publishedAt: page.publishedAt || page.updatedAt || new Date().toISOString(),
    };
  }
}
