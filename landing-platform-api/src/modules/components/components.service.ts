import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

export type MasterComponentCategory = 'navigation' | 'hero' | 'cards' | 'cta' | 'footer' | 'general';

export interface MasterComponent {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  category: MasterComponentCategory;
  schemaVersion: number;
  rootType: 'block' | 'component';
  blockData?: any;
  componentData?: any;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

import {
  CreateMasterComponentDto,
  UpdateMasterComponentDto,
} from './dto/components.dto.js';

@Injectable()
export class ComponentsService {
  private componentsStore: Map<string, MasterComponent> = new Map();

  constructor() {
    this.seedInitialComponents();
  }

  private seedInitialComponents() {
    const defaultProjectId = 'proj_default';

    // 1. Master Symbol: Feature Card
    const featureCard: MasterComponent = {
      id: 'comp_master_feature_card',
      projectId: defaultProjectId,
      name: 'Modern SaaS Feature Card',
      description: 'Card with badge, heading, description, and action button.',
      category: 'cards',
      schemaVersion: 1,
      rootType: 'component',
      componentData: {
        id: 'tmpl_card_root',
        type: 'Card',
        props: {
          title: 'High-Performance Engine',
          description: 'Lightning fast client-side rendering with full SEO optimization.',
        },
        styles: {
          padding: 'lg',
          borderRadius: 'xl',
          shadow: 'md',
        },
        children: [
          {
            id: 'tmpl_card_badge',
            type: 'Badge',
            props: { label: 'New Feature', variant: 'secondary' },
            styles: { margin: 'xs' },
          },
          {
            id: 'tmpl_card_title',
            type: 'Typography',
            props: { text: 'Engineered for Conversion', variant: 'h3' },
            styles: { fontWeight: 'bold', fontSize: 'lg' },
          },
          {
            id: 'tmpl_card_desc',
            type: 'Typography',
            props: { text: 'Increase your sales funnel checkout rates by up to 34% with seamless checkout.', variant: 'p' },
            styles: { fontSize: 'sm', textColor: '#94a3b8' },
          },
          {
            id: 'tmpl_card_btn',
            type: 'Button',
            props: { label: 'Explore Docs', variant: 'outline' },
            styles: { margin: 'sm' },
          },
        ],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 2. Master Symbol: Global Hero CTA Section
    const heroSection: MasterComponent = {
      id: 'comp_master_hero_cta',
      projectId: defaultProjectId,
      name: 'High-Converting Hero CTA',
      description: 'Two-column container with headline, value proposition, and primary checkout button.',
      category: 'hero',
      schemaVersion: 1,
      rootType: 'block',
      blockData: {
        id: 'block_hero_master_inst',
        type: 'CONTAINER',
        order: 0,
        content: { label: 'Hero Master Section' },
        layout: {
          display: 'flex',
          flexDirection: 'row',
          justify: 'between',
          align: 'center',
          gap: 'lg',
          maxWidth: 'boxed',
        },
        styles: {
          padding: 'xl',
          backgroundColor: '#0c0d12',
          borderRadius: 'xl',
        },
        columnsContent: [
          {
            id: 'col_hero_1',
            columnWidth: '1/2',
            components: [
              {
                id: 'comp_hero_title',
                type: 'Typography',
                props: { text: 'Launch Your Next Big Idea in Minutes', variant: 'h1' },
                styles: { fontWeight: 'bold', fontSize: '3xl', textColor: '#ffffff' },
              },
              {
                id: 'comp_hero_desc',
                type: 'Typography',
                props: { text: 'Professional visual builder crafted for high-ticket funnels and e-commerce brands.', variant: 'p' },
                styles: { fontSize: 'base', textColor: '#94a3b8', margin: 'md' },
              },
              {
                id: 'comp_hero_cta',
                type: 'Button',
                props: { label: 'Start Free Trial →', variant: 'default' },
                styles: { padding: 'md', borderRadius: 'full', backgroundColor: '#3b82f6' },
              },
            ],
          },
        ],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.componentsStore.set(featureCard.id, featureCard);
    this.componentsStore.set(heroSection.id, heroSection);
  }

  getComponentsByProject(projectId: string): MasterComponent[] {
    const list: MasterComponent[] = [];
    for (const comp of this.componentsStore.values()) {
      if (comp.projectId === projectId || projectId === 'all') {
        list.push(comp);
      }
    }
    return list;
  }

  getComponentById(id: string): MasterComponent {
    const comp = this.componentsStore.get(id);
    if (!comp) {
      throw new NotFoundException(`Master component with id '${id}' not found.`);
    }
    return comp;
  }

  createMasterComponent(dto: CreateMasterComponentDto): MasterComponent {
    if (!dto.name || !dto.name.trim()) {
      throw new BadRequestException('Master component name is required.');
    }

    const newId = `comp_master_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const component: MasterComponent = {
      id: newId,
      projectId: dto.projectId || 'proj_default',
      name: dto.name.trim(),
      description: dto.description || '',
      category: dto.category || 'general',
      schemaVersion: 1,
      rootType: dto.rootType || 'component',
      blockData: dto.blockData,
      componentData: dto.componentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.componentsStore.set(newId, component);
    return component;
  }

  updateMasterComponent(id: string, dto: UpdateMasterComponentDto): MasterComponent {
    const comp = this.getComponentById(id);

    const updated: MasterComponent = {
      ...comp,
      name: dto.name !== undefined ? dto.name.trim() : comp.name,
      description: dto.description !== undefined ? dto.description : comp.description,
      category: dto.category !== undefined ? dto.category : comp.category,
      blockData: dto.blockData !== undefined ? dto.blockData : comp.blockData,
      componentData: dto.componentData !== undefined ? dto.componentData : comp.componentData,
      updatedAt: new Date().toISOString(),
    };

    this.componentsStore.set(id, updated);
    return updated;
  }

  deleteMasterComponent(id: string): { success: boolean; deletedId: string } {
    this.getComponentById(id);
    this.componentsStore.delete(id);
    return { success: true, deletedId: id };
  }
}
