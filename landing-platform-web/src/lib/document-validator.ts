import { PageDocument } from '../../../shared/types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  repairedDoc: PageDocument;
}

/**
 * Validates and repairs page document JSON trees against schemaVersion 1
 */
export function validatePageDocument(raw: any, fallbackId: string = 'page_home'): ValidationResult {
  const errors: string[] = [];

  if (!raw || typeof raw !== 'object') {
    errors.push('Document root must be a valid JSON object.');
    return {
      isValid: false,
      errors,
      repairedDoc: {
        schemaVersion: 1,
        id: fallbackId,
        projectId: 'proj_default',
        title: 'Recovered Page',
        slug: 'recovered',
        status: 'DRAFT',
        blocks: [],
        updatedAt: new Date().toISOString(),
      },
    };
  }

  // 1. Schema version
  const schemaVersion = typeof raw.schemaVersion === 'number' ? raw.schemaVersion : 1;
  if (!raw.schemaVersion) {
    errors.push('Missing schemaVersion. Defaulted to version 1.');
  }

  // 2. ID and Metadata
  const id = typeof raw.id === 'string' && raw.id.trim() ? raw.id : fallbackId;
  const projectId = typeof raw.projectId === 'string' && raw.projectId.trim() ? raw.projectId : 'proj_default';
  const title = typeof raw.title === 'string' && raw.title.trim() ? raw.title : 'Untitled Page';
  const slug = typeof raw.slug === 'string' && raw.slug.trim() ? raw.slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-') : 'page';
  const status = raw.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';

  // 3. Blocks integrity check
  const rawBlocks = Array.isArray(raw.blocks) ? raw.blocks : [];
  const seenIds = new Set<string>();
  const repairedBlocks: any[] = [];

  for (let i = 0; i < rawBlocks.length; i++) {
    const block = rawBlocks[i];
    if (!block || typeof block !== 'object') {
      errors.push(`Block at index ${i} was not an object and was removed.`);
      continue;
    }

    let blockId = block.id;
    if (!blockId || typeof blockId !== 'string') {
      blockId = `blk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      errors.push(`Block at index ${i} lacked a valid ID. Generated new ID: ${blockId}`);
    } else if (seenIds.has(blockId)) {
      blockId = `${blockId}_${Math.random().toString(36).substring(2, 5)}`;
      errors.push(`Duplicate block ID found. Reassigned to: ${blockId}`);
    }
    seenIds.add(blockId);

    const blockType = typeof block.type === 'string' ? block.type : 'CONTAINER';

    repairedBlocks.push({
      ...block,
      id: blockId,
      type: blockType,
      content: block.content && typeof block.content === 'object' ? block.content : {},
      styles: block.styles && typeof block.styles === 'object' ? block.styles : {},
    });
  }

  const repairedDoc: PageDocument = {
    schemaVersion,
    id,
    projectId,
    title,
    slug,
    status,
    blocks: repairedBlocks,
    tokens: raw.tokens && typeof raw.tokens === 'object' ? raw.tokens : undefined,
    styleClasses: Array.isArray(raw.styleClasses) ? raw.styleClasses : undefined,
    seoMetadata: raw.seoMetadata && typeof raw.seoMetadata === 'object' ? raw.seoMetadata : {},
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: raw.publishedAt,
  };

  return {
    isValid: errors.length === 0,
    errors,
    repairedDoc,
  };
}
