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
    const defaultProjectId = 'proj_default';
    const homePage: PageDocument = {
      schemaVersion: 1,
      id: 'page_home',
      projectId: defaultProjectId,
      title: 'Storefront Home',
      slug: 'home',
      status: 'PUBLISHED',
      blocks: [],
      seoMetadata: {
        metaTitle: 'Alex Travis — Personal Portfolio & Creative Direction',
        metaDescription: 'High-performance visual portfolio and creative direction services.',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const pricingPage: PageDocument = {
      schemaVersion: 1,
      id: 'page_pricing',
      projectId: defaultProjectId,
      title: 'Pricing & Packages',
      slug: 'pricing',
      status: 'DRAFT',
      blocks: [],
      seoMetadata: {
        metaTitle: 'Pricing & Packages — Alex Travis',
        metaDescription: 'Transparent pricing packages for brands and creators.',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const checkoutPage: PageDocument = {
      schemaVersion: 1,
      id: 'page_checkout',
      projectId: defaultProjectId,
      title: 'Order Checkout',
      slug: 'checkout',
      status: 'DRAFT',
      blocks: [],
      seoMetadata: {
        metaTitle: 'Complete Your Order',
        metaDescription: 'Secure 1-click checkout powered by Xendit.',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.pagesStore.set(homePage.id, homePage);
    this.pagesStore.set(pricingPage.id, pricingPage);
    this.pagesStore.set(checkoutPage.id, checkoutPage);

    this.versionsStore.set(homePage.id, [
      {
        id: 'ver_init_home_v1',
        pageId: homePage.id,
        versionNumber: 1,
        title: homePage.title,
        slug: homePage.slug,
        blocks: [],
        seoMetadata: homePage.seoMetadata,
        publishedBy: 'System Seed',
        notes: 'Initial production baseline v1',
        createdAt: new Date().toISOString(),
      },
    ]);
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
    const page = this.getPageById(id);

    const updated: PageDocument = {
      ...page,
      title: dto.title !== undefined ? dto.title : page.title,
      slug: dto.slug !== undefined ? dto.slug : page.slug,
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
    const page = this.getPageById(id);
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
    this.getPageById(pageId); // Validates existence
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
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const page = Array.from(this.pagesStore.values()).find(
      (p) => p.slug === cleanSlug && p.status === 'PUBLISHED',
    );

    if (!page) {
      throw new NotFoundException(`Published page with slug '${cleanSlug}' not found.`);
    }

    const versions = this.versionsStore.get(page.id) || [];
    const latestVersion = versions[0];

    return {
      id: page.id,
      projectId: page.projectId,
      title: page.title,
      slug: page.slug,
      status: 'PUBLISHED',
      blocks: latestVersion?.blocks || page.blocks,
      tokens: latestVersion?.tokens || page.tokens,
      styleClasses: latestVersion?.styleClasses || page.styleClasses,
      seoMetadata: latestVersion?.seoMetadata || page.seoMetadata,
      versionNumber: latestVersion?.versionNumber || 1,
      publishedAt: page.publishedAt || page.updatedAt || new Date().toISOString(),
    };
  }
}
