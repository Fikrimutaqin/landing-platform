'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

import { NavbarBlock } from '@/components/blocks/NavbarBlock';
import { HeroBlock } from '@/components/blocks/HeroBlock';
import { ProductSpotlightBlock } from '@/components/blocks/ProductSpotlightBlock';
import { ImageBlock } from '@/components/blocks/ImageBlock';
import { ContainerBlock } from '@/components/blocks/ContainerBlock';
import { CheckoutFormBlock } from '@/components/blocks/CheckoutFormBlock';
import { ReviewsBlock } from '@/components/blocks/ReviewsBlock';
import { TimerBlock } from '@/components/blocks/TimerBlock';
import { FaqBlock } from '@/components/blocks/FaqBlock';
import { FooterBlock } from '@/components/blocks/FooterBlock';

import { SortableBlockWrapper } from '@/components/builder/SortableBlockWrapper';
import { ElementorSidebar, BlockItem } from '@/components/builder/ElementorSidebar';
import { BlockLibraryModal } from '@/components/builder/BlockLibraryModal';
import { BreadcrumbBar } from '@/components/builder/BreadcrumbBar';
import { PageSettingsModal } from '@/components/builder/PageSettingsModal';
import { PageSwitcherDropdown } from '@/components/builder/PageSwitcherDropdown';
import { SaveStatusBadge } from '@/components/builder/SaveStatusBadge';
import { NewPageModal } from '@/components/builder/NewPageModal';
import { PublishModal } from '@/components/builder/PublishModal';
import { usePersistence } from '@/hooks/usePersistence';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { StylesPanel } from '@/components/builder/StylesPanel';
import { ImageSourcePicker } from '@/components/builder/ImageSourcePicker';
import { IconPicker, DynamicIcon } from '@/components/builder/IconPicker';
import { ALEX_TRAVIS_TEMPLATE } from '@/components/templates/alex-travis-template';
import {
  AlexNavbarSection,
  AlexHeroSection,
  AlexStatsSection,
  AlexPerformanceSection,
  AlexServicesSection,
  AlexProcessSection,
  AlexTrustSection,
  AlexPortfolioSection,
  AlexPricingSection,
  AlexTestimonialSection,
  AlexArticlesSection,
  AlexFaqSection,
  AlexGuaranteesSection,
  AlexFooterSection,
} from '@/components/templates/alex-travis/AlexSections';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  BlockType,
  BlockStyles,
  ContainerLayout,
  ShadcnComponentType,
  ShadcnComponentInstance,
  ElementStyles,
  StyleClass,
  DesignTokens,
  MasterComponent,
  MasterComponentCategory,
  PageSeoMetadata,
} from '../../../shared/types';
import { DEFAULT_DESIGN_TOKENS, INITIAL_STYLE_CLASSES } from '@/lib/design-tokens';
import { DesignTokensModal } from '@/components/builder/DesignTokensModal';
import { EnhancedFlexGridControls } from '@/components/builder/EnhancedFlexGridControls';
import { ComponentsApiClient } from '@/lib/components-api-client';
import { ComponentInstanceEngine } from '@/lib/component-instance-engine';
import { MasterComponentsModal } from '@/components/builder/MasterComponentsModal';
import { CreateMasterComponentModal } from '@/components/builder/CreateMasterComponentModal';
import {
  Layers,
  Settings,
  ShoppingBag,
  Download,
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  Check,
  Key,
  Plus,
  Palette,
  Type,
  Layout,
  LayoutTemplate,
  Sliders,
  Box,
  Trash2,
  Columns,
  LayoutGrid,
  Compass,
  ArrowLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  PlusCircle,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRight,
  PanelRightClose,
  PanelRightOpen,
  Pencil,
  Undo2,
  Redo2,
  Globe,
  ExternalLink,
  FileText,
  Component as ComponentIcon,
  Unlink,
  Rocket,
} from 'lucide-react';

function TemplateColorPicker({
  label,
  value,
  fallback,
  onChange,
  defaultPlaceholder,
  presets = ['#ff2d9b', '#ff7a2f', '#ffd21f', '#d9ff1a', '#10b981', '#3b82f6', '#161616', '#ffffff'],
}: {
  label: string;
  value?: string;
  fallback?: string;
  onChange: (val: string) => void;
  defaultPlaceholder?: string;
  presets?: string[];
}) {
  const displayPlaceholder = defaultPlaceholder || (fallback ? `${fallback} (default)` : 'e.g. #ff2d9b or #10b981');
  const pickerColor = value?.startsWith('#')
    ? value
    : (fallback?.startsWith('#') ? fallback : '#ff2d9b');

  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-medium text-slate-700 dark:text-neutral-300">{label}</label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[10px] text-slate-400 hover:text-red-500 hover:underline"
          >
            Reset
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative w-7 h-7 rounded-lg border border-slate-200 dark:border-neutral-800 overflow-hidden shrink-0 shadow-xs">
          <input
            type="color"
            value={pickerColor}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
            title="Pick a color"
          />
        </div>
        <Input
          value={value || ''}
          placeholder={displayPlaceholder}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-xs flex-1 h-7"
        />
      </div>
      {presets && (
        <div className="flex flex-wrap items-center gap-1 pt-0.5">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className="w-4 h-4 rounded border border-slate-300 dark:border-neutral-700 hover:scale-110 transition-transform shrink-0"
              style={{ backgroundColor: preset }}
              title={preset}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const createUniqueId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

export default function PlatformDashboard() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'builder' | 'settings' | 'orders'>('builder');

  // Builder viewport mode
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Editable Page Name
  const [pageName, setPageName] = useState('Storefront Page');
  const [isEditingPageName, setIsEditingPageName] = useState(false);
  const [isPageSettingsOpen, setIsPageSettingsOpen] = useState(false);
  const [pageSlug, setPageSlug] = useState('home');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Sidebar Visibility State (Hide / Show)
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  // Sidebar & Layout State (Zero Modal Popups)
  const [sidebarTab, setSidebarTab] = useState<'shadcn' | 'navigator'>('shadcn');
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [insertTargetIndex, setInsertTargetIndex] = useState<number | null>(null);
  const [isShadcnModalOpen, setIsShadcnModalOpen] = useState(false);
  const [targetColumnIndex, setTargetColumnIndex] = useState<number>(0);

  // Inspector tab
  const [inspectorTab, setInspectorTab] = useState<'layout' | 'content' | 'styles'>('layout');
  const [elementInspectorTab, setElementInspectorTab] = useState<'styles' | 'content'>('styles');

  // Pure Container-based block tree composed of ShadCN UI components
  const [blocks, setBlocks] = useState<BlockItem[]>([]);

  // Selected block for right inspector
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  // Global Design Tokens & Reusable Style Classes (Webflow Class Selector System)
  const [designTokens, setDesignTokens] = useState<DesignTokens>(DEFAULT_DESIGN_TOKENS);
  const [styleClasses, setStyleClasses] = useState<StyleClass[]>(INITIAL_STYLE_CLASSES);
  const [isDesignTokensModalOpen, setIsDesignTokensModalOpen] = useState(false);
  const [targetClassName, setTargetClassName] = useState<string | null>(null);
  const [isEditingSharedClass, setIsEditingSharedClass] = useState(false);

  // Milestone 5: Reusable Master Components & Symbols System
  const [masterComponents, setMasterComponents] = useState<MasterComponent[]>([]);
  const [isMasterComponentsModalOpen, setIsMasterComponentsModalOpen] = useState(false);
  const [isCreateMasterModalOpen, setIsCreateMasterModalOpen] = useState(false);
  const [createMasterTarget, setCreateMasterTarget] = useState<{
    type: 'block' | 'component';
    target: any;
    name: string;
  } | null>(null);

  // Load project master components on mount
  React.useEffect(() => {
    ComponentsApiClient.getProjectComponents('proj_default')
      .then((comps) => setMasterComponents(comps))
      .catch((err) => console.warn('Could not load master components:', err));
  }, []);

  // Milestone 4: Multi-Page Project Persistence & Debounced Autosave
  const [isNewPageModalOpen, setIsNewPageModalOpen] = useState(false);

  // Milestone 6: Publishing & Live Storefront Metadata
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [seoMetadata, setSeoMetadata] = useState<PageSeoMetadata>({
    metaTitle: '',
    metaDescription: '',
    ogImage: '',
    favicon: '',
    keywords: '',
  });

  const persistence = usePersistence({
    initialPageId: 'page_home',
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
  });

  const currentPageSummary = persistence.pages.find((p) => p.id === persistence.currentPageId);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<BlockItem[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const isHistoryAction = React.useRef(false);
  const initialMount = React.useRef(false);

  // Record history snapshot whenever blocks change
  React.useEffect(() => {
    if (!initialMount.current) {
      initialMount.current = true;
      setHistory([JSON.parse(JSON.stringify(blocks))]);
      setHistoryIndex(0);
      return;
    }
    if (isHistoryAction.current) return;
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      const next = [...sliced, JSON.parse(JSON.stringify(blocks))];
      return next.slice(-40);
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 39));
  }, [blocks]);

  const undo = () => {
    if (historyIndex > 0) {
      isHistoryAction.current = true;
      const target = history[historyIndex - 1];
      setBlocks(JSON.parse(JSON.stringify(target)));
      setHistoryIndex(historyIndex - 1);
      setTimeout(() => {
        isHistoryAction.current = false;
      }, 50);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      isHistoryAction.current = true;
      const target = history[historyIndex + 1];
      setBlocks(JSON.parse(JSON.stringify(target)));
      setHistoryIndex(historyIndex + 1);
      setTimeout(() => {
        isHistoryAction.current = false;
      }, 50);
    }
  };

  // Keyboard shortcuts (Cmd/Ctrl + B to toggle left sidebar, Cmd+Z for undo, Cmd+Shift+Z for redo)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setShowLeftSidebar((prev) => !prev);
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        persistence.saveNow();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // DnD Sensors setup
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // 1. Reordering Section Blocks
    const isSectionActive = blocks.some((b) => b.id === activeId);
    const isSectionOver = blocks.some((b) => b.id === overId);

    if (isSectionActive && isSectionOver) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === activeId);
        const newIndex = items.findIndex((i) => i.id === overId);
        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
      return;
    }

    // 2. Reordering or Moving Components inside/between columns
    if (activeId.startsWith('comp_')) {
      setBlocks((prevBlocks) => {
        let sourceBlockId: string | null = null;
        let sourceColIdx = -1;
        let sourceCompIdx = -1;
        let movedComp: ShadcnComponentInstance | null = null;

        for (const b of prevBlocks) {
          if (b.type === 'CONTAINER' && (b as any).columnsContent) {
            (b as any).columnsContent.forEach((col: any, cIdx: number) => {
              const foundIdx = (col.components || []).findIndex((c: any) => c.id === activeId);
              if (foundIdx !== -1) {
                sourceBlockId = b.id;
                sourceColIdx = cIdx;
                sourceCompIdx = foundIdx;
                movedComp = col.components[foundIdx];
              }
            });
          }
        }

        if (!movedComp || !sourceBlockId || sourceColIdx === -1) return prevBlocks;

        let targetBlockId: string | null = null;
        let targetColIdx = -1;
        let targetCompIdx = -1;

        if (overId.startsWith('comp_')) {
          for (const b of prevBlocks) {
            if (b.type === 'CONTAINER' && (b as any).columnsContent) {
              (b as any).columnsContent.forEach((col: any, cIdx: number) => {
                const foundIdx = (col.components || []).findIndex((c: any) => c.id === overId);
                if (foundIdx !== -1) {
                  targetBlockId = b.id;
                  targetColIdx = cIdx;
                  targetCompIdx = foundIdx;
                }
              });
            }
          }
        } else if (overId.startsWith('col_drop_')) {
          const parts = overId.split('_');
          const colIdxStr = parts[parts.length - 1];
          const bId = parts.slice(2, parts.length - 1).join('_');
          targetBlockId = bId;
          targetColIdx = parseInt(colIdxStr, 10);
          targetCompIdx = 9999;
        }

        if (!targetBlockId || targetColIdx === -1) return prevBlocks;

        return prevBlocks.map((b) => {
          if (b.type !== 'CONTAINER') return b;
          const c = b as any;
          const newCols = (c.columnsContent || []).map((col: any, cIdx: number) => {
            const isSource = b.id === sourceBlockId && cIdx === sourceColIdx;
            const isTarget = b.id === targetBlockId && cIdx === targetColIdx;

            if (isSource && isTarget) {
              const nextComps = arrayMove(col.components || [], sourceCompIdx, targetCompIdx);
              return { ...col, components: nextComps };
            } else if (isSource) {
              const nextComps = (col.components || []).filter((_: any, idx: number) => idx !== sourceCompIdx);
              return { ...col, components: nextComps };
            } else if (isTarget) {
              const nextComps = [...(col.components || [])];
              const insertAt = Math.min(Math.max(0, targetCompIdx), nextComps.length);
              nextComps.splice(insertAt, 0, movedComp!);
              return { ...col, components: nextComps };
            }
            return col;
          });
          return { ...b, columnsContent: newCols };
        });
      });
    }
  };

  // Duplicate any component inside its container column
  const duplicateComponent = (compId: string) => {
    let duplicatedId: string | null = null;
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.type !== 'CONTAINER') return b;
        const c = b as any;
        const newCols = (c.columnsContent || []).map((col: any) => {
          const idx = (col.components || []).findIndex((item: any) => item.id === compId);
          if (idx !== -1) {
            const original = col.components[idx];
            const cloned: ShadcnComponentInstance = JSON.parse(JSON.stringify(original));
            duplicatedId = `comp_${original.type.toLowerCase()}_${Date.now()}`;
            cloned.id = duplicatedId;
            const renewIds = (children?: ShadcnComponentInstance[]) => {
              if (!children) return;
              children.forEach((ch) => {
                ch.id = `comp_${ch.type.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
                renewIds(ch.children);
              });
            };
            renewIds(cloned.children);

            const nextComps = [...col.components];
            nextComps.splice(idx + 1, 0, cloned);
            return { ...col, components: nextComps };
          }
          return col;
        });
        return { ...b, columnsContent: newCols };
      })
    );
    if (duplicatedId) {
      setSelectedComponentId(duplicatedId);
    }
  };

  // Move component up or down within its column
  const moveComponentUpDown = (compId: string, direction: 'up' | 'down') => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.type !== 'CONTAINER') return b;
        const c = b as any;
        const newCols = (c.columnsContent || []).map((col: any) => {
          const comps = col.components || [];
          const idx = comps.findIndex((item: any) => item.id === compId);
          if (idx === -1) return col;
          const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
          if (targetIdx < 0 || targetIdx >= comps.length) return col;
          const nextComps = [...comps];
          const [moved] = nextComps.splice(idx, 1);
          nextComps.splice(targetIdx, 0, moved);
          return { ...col, components: nextComps };
        });
        return { ...b, columnsContent: newCols };
      })
    );
  };

  // Handle drops from sidebar onto canvas columns
  const handleDropFromSidebar = (
    colIndex: number,
    payload: any,
    insertIndex?: number,
    targetBlockId?: string
  ) => {
    if (!payload) return;

    if (payload.type === 'SHADCN_ELEMENT') {
      const bId = targetBlockId || selectedBlockId || (blocks.length > 0 ? blocks[0].id : null);
      if (!bId) {
        handleAddShadcnComponent(payload.elementType, payload.defaultProps);
        return;
      }

      const newCompId = `comp_${payload.elementType.toLowerCase()}_${Date.now()}`;
      const initialChildren: ShadcnComponentInstance[] | undefined =
        payload.elementType === 'Card'
          ? [
            { id: `comp_typography_${Date.now()}_1`, type: 'Typography', props: { variant: 'h4', text: 'Card Title' } },
            { id: `comp_label_${Date.now()}_2`, type: 'Label', props: { text: 'Card description or subtitle text goes here' } },
            { id: `comp_button_${Date.now()}_3`, type: 'Button', props: { text: 'Action Button', variant: 'default' } },
          ]
          : undefined;

      const newComp: ShadcnComponentInstance = {
        id: newCompId,
        type: payload.elementType,
        props: payload.defaultProps || {},
        ...(initialChildren ? { children: initialChildren } : {}),
      };

      setBlocks((prev) =>
        prev.map((b) => {
          if (b.id !== bId || b.type !== 'CONTAINER') return b;
          const c = b as any;
          const newCols = [...(c.columnsContent || [])];
          if (!newCols[colIndex]) return b;
          const comps = [...(newCols[colIndex].components || [])];
          if (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= comps.length) {
            comps.splice(insertIndex, 0, newComp);
          } else {
            comps.push(newComp);
          }
          newCols[colIndex] = { ...newCols[colIndex], components: comps };
          return { ...b, columnsContent: newCols };
        })
      );
      setSelectedBlockId(bId);
      setSelectedComponentId(newCompId);
      setShowRightSidebar(true);
    } else if (payload.type === 'LAYOUT_SECTION') {
      handleInsertLayoutSection(payload.layoutType);
    } else if (payload.type === 'ALEX_SECTION') {
      handleInsertAlexSection(payload.sectionKey);
    }
  };

  // Block management actions
  const moveBlockUp = (index: number) => {
    if (index > 0) {
      setBlocks((items) => arrayMove(items, index, index - 1));
    }
  };

  const moveBlockDown = (index: number) => {
    if (index < blocks.length - 1) {
      setBlocks((items) => arrayMove(items, index, index + 1));
    }
  };

  const duplicateBlock = (index: number) => {
    const original = blocks[index];
    const newId = `blk_${original.type.toLowerCase()}_${Date.now()}`;
    const clone: BlockItem = JSON.parse(JSON.stringify(original));
    clone.id = newId;
    const nextBlocks = [...blocks];
    nextBlocks.splice(index + 1, 0, clone);
    setBlocks(nextBlocks);
    setSelectedBlockId(newId);
  };

  const deleteBlock = (index: number) => {
    const toDeleteId = blocks[index].id;
    const nextBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(nextBlocks);
    if (selectedBlockId === toDeleteId) {
      setSelectedBlockId(nextBlocks[0]?.id || null);
    }
    if (selectedComponentId) {
      setSelectedComponentId(null);
    }
  };

  const openInsertModalAt = (targetIndex: number | null) => {
    setInsertTargetIndex(targetIndex);
    setIsSectionModalOpen(true);
  };

  const handleLoadAlexTravisTemplate = () => {
    const cloned = JSON.parse(JSON.stringify(ALEX_TRAVIS_TEMPLATE));
    setBlocks(cloned);
    setSelectedBlockId(cloned[0]?.id || null);
    setSelectedComponentId(null);
  };

  const handleClearCanvas = () => {
    setBlocks([]);
    setSelectedBlockId(null);
    setSelectedComponentId(null);
  };

  // Milestone 5: Master Components / Symbols Action Handlers
  const handleCreateMasterComponent = async (
    name: string,
    description: string,
    category: MasterComponentCategory
  ) => {
    if (!createMasterTarget) return;

    try {
      const isBlock = createMasterTarget.type === 'block';
      const newMaster = await ComponentsApiClient.createMasterComponent({
        projectId: 'proj_default',
        name,
        description,
        category,
        rootType: isBlock ? 'block' : 'component',
        blockData: isBlock ? createMasterTarget.target : undefined,
        componentData: isBlock ? undefined : createMasterTarget.target,
      });

      setMasterComponents((prev) => [newMaster, ...prev.filter((c) => c.id !== newMaster.id)]);

      // Mark the active item on canvas as an instance of this new master
      if (isBlock) {
        setBlocks((prev) =>
          prev.map((b) =>
            b.id === createMasterTarget.target.id
              ? {
                ...b,
                isMasterInstance: true,
                masterComponentId: newMaster.id,
                content: { ...(b.content || {}), masterName: newMaster.name },
              }
              : b
          )
        );
      } else {
        const markInTree = (list: ShadcnComponentInstance[]): ShadcnComponentInstance[] => {
          return list.map((item) => {
            if (item.id === createMasterTarget.target.id) {
              return { ...item, isMasterInstance: true, masterComponentId: newMaster.id };
            }
            if (item.children) {
              return { ...item, children: markInTree(item.children) };
            }
            return item;
          });
        };

        setBlocks((prev) =>
          prev.map((b) => {
            if (b.type === 'CONTAINER') {
              const c = b as any;
              return {
                ...c,
                columnsContent: (c.columnsContent || []).map((col: any) => ({
                  ...col,
                  components: markInTree(col.components || []),
                })),
              };
            }
            return b;
          })
        );
      }
    } catch (err) {
      console.error('Failed to create master component:', err);
    }
  };

  const handleDeleteMasterComponent = async (id: string) => {
    try {
      await ComponentsApiClient.deleteMasterComponent(id);
      setMasterComponents((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Failed to delete master component:', err);
    }
  };

  const handleInsertMasterComponent = (master: MasterComponent) => {
    if (master.rootType === 'block' && master.blockData) {
      const newBlock = ComponentInstanceEngine.instantiateMasterBlock(master);
      setBlocks((prev) => {
        if (selectedBlockId) {
          const idx = prev.findIndex((b) => b.id === selectedBlockId);
          if (idx !== -1) {
            const next = [...prev];
            next.splice(idx + 1, 0, newBlock);
            return next;
          }
        }
        return [...prev, newBlock];
      });
      setSelectedBlockId(newBlock.id);
      setSelectedComponentId(null);
      setIsMasterComponentsModalOpen(false);
    } else if (master.componentData) {
      const newComp = ComponentInstanceEngine.instantiateMasterComponent(master);
      if (activeBlock && activeBlock.type === 'CONTAINER') {
        setBlocks((prev) =>
          prev.map((b) => {
            if (b.id !== activeBlock.id) return b;
            const container = b as any;
            const cols = [...(container.columnsContent || [])];
            const colIdx = targetColumnIndex < cols.length ? targetColumnIndex : 0;
            if (cols[colIdx]) {
              cols[colIdx] = {
                ...cols[colIdx],
                components: [...(cols[colIdx].components || []), newComp],
              };
            }
            return { ...b, columnsContent: cols };
          })
        );
        setSelectedComponentId(newComp.id);
      } else {
        const newContainer: BlockItem = {
          id: `blk_container_${Date.now()}`,
          type: 'CONTAINER',
          content: { label: `${master.name} Section`, masterName: master.name },
          styles: { fontFamily: 'sans' },
          layout: { display: 'flex', flexDirection: 'row', justify: 'center', align: 'center', columns: 1, gap: 'md' },
          columnsContent: [
            {
              id: `col_1`,
              name: 'Column 1',
              components: [newComp],
            },
          ],
        } as any;
        setBlocks((prev) => [...prev, newContainer]);
        setSelectedBlockId(newContainer.id);
        setSelectedComponentId(newComp.id);
      }
      setIsMasterComponentsModalOpen(false);
    }
  };

  const handleDetachBlockInstance = (blockId: string) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;
        return ComponentInstanceEngine.detachBlockInstance(b);
      })
    );
  };

  const handleDetachComponentInstance = (compId: string) => {
    const detachInTree = (list: ShadcnComponentInstance[]): ShadcnComponentInstance[] => {
      return list.map((item) => {
        if (item.id === compId) {
          return ComponentInstanceEngine.detachComponentInstance(item);
        }
        if (item.children) {
          return { ...item, children: detachInTree(item.children) };
        }
        return item;
      });
    };

    setBlocks((prev) =>
      prev.map((b) => {
        if (b.type === 'CONTAINER') {
          const c = b as any;
          return {
            ...c,
            columnsContent: (c.columnsContent || []).map((col: any) => ({
              ...col,
              components: detachInTree(col.components || []),
            })),
          };
        }
        return b;
      })
    );
  };

  const handleInsertSection = (templateKey: string = 'flex_row') => {
    if (templateKey === 'alex_travis_full') {
      handleLoadAlexTravisTemplate();
      setIsSectionModalOpen(false);
      return;
    }
    const newId = `blk_container_${Date.now()}`;
    let label = 'Container Section';
    let layout: ContainerLayout = {
      display: 'flex',
      flexDirection: 'row',
      justify: 'between',
      align: 'center',
      columns: 2,
      gap: 'md',
    };
    let columnsContent: any[] = [];
    const defaultStyles: BlockStyles = {
      fontFamily: 'sans',
    };

    if (templateKey === 'flex_row') {
      label = 'Flex Row Container (2-Col)';
      layout = { display: 'flex', flexDirection: 'row', justify: 'between', align: 'center', columns: 2, gap: 'md' };
      columnsContent = [
        {
          id: `col_${Date.now()}_1`,
          name: 'Column 1 (Left Content)',
          components: [
            { id: `comp_${Date.now()}_1`, type: 'Typography', props: { variant: 'h3', text: 'Flex Column 1' } },
          ],
        },
        {
          id: `col_${Date.now()}_2`,
          name: 'Column 2 (Right Action)',
          components: [
            { id: `comp_${Date.now()}_2`, type: 'Button', props: { label: 'Action Button', variant: 'default' } },
          ],
        },
      ];
    } else if (templateKey === 'flex_col') {
      label = 'Flex Column Stack';
      layout = { display: 'flex', flexDirection: 'col', justify: 'center', align: 'stretch', columns: 1, gap: 'md' };
      columnsContent = [
        {
          id: `col_${Date.now()}_1`,
          name: 'Main Column',
          components: [
            { id: `comp_${Date.now()}_1`, type: 'Typography', props: { variant: 'h2', text: 'Vertical Stack Section' } },
            { id: `comp_${Date.now()}_2`, type: 'Typography', props: { variant: 'p', text: 'Stack components vertically with consistent gap spacing.' } },
          ],
        },
      ];
    } else if (templateKey === 'grid_2') {
      label = 'Grid (2-Columns)';
      layout = { display: 'grid', columns: 2, gap: 'md', align: 'start', flexDirection: 'row', justify: 'start' };
      columnsContent = [
        {
          id: `col_${Date.now()}_1`,
          name: 'Grid Column 1',
          components: [
            { id: `comp_${Date.now()}_1`, type: 'Card', props: { title: 'Feature 01', description: 'Grid cell description.' } },
          ],
        },
        {
          id: `col_${Date.now()}_2`,
          name: 'Grid Column 2',
          components: [
            { id: `comp_${Date.now()}_2`, type: 'Card', props: { title: 'Feature 02', description: 'Grid cell description.' } },
          ],
        },
      ];
    } else if (templateKey === 'grid_3') {
      label = 'Grid (3-Columns)';
      layout = { display: 'grid', columns: 3, gap: 'md', align: 'start', flexDirection: 'row', justify: 'start' };
      columnsContent = [
        { id: `col_${Date.now()}_1`, name: 'Col 1', components: [{ id: `comp_${Date.now()}_1`, type: 'Card', props: { title: 'Card 1' } }] },
        { id: `col_${Date.now()}_2`, name: 'Col 2', components: [{ id: `comp_${Date.now()}_2`, type: 'Card', props: { title: 'Card 2' } }] },
        { id: `col_${Date.now()}_3`, name: 'Col 3', components: [{ id: `comp_${Date.now()}_3`, type: 'Card', props: { title: 'Card 3' } }] },
      ];
    } else if (templateKey === 'navbar') {
      label = 'Navbar (2-Col Flex)';
      layout = { display: 'flex', flexDirection: 'row', justify: 'between', align: 'center', columns: 2, gap: 'md' };
      columnsContent = [
        {
          id: `col_${Date.now()}_1`,
          name: 'Column 1 (Name Web / Logo)',
          components: [
            { id: `comp_${Date.now()}_1`, type: 'Avatar', props: { name: 'ApexFlow Lab', initials: 'AF' } },
            { id: `comp_${Date.now()}_2`, type: 'Typography', props: { variant: 'h3', text: 'ApexFlow' } },
            { id: `comp_${Date.now()}_3`, type: 'Badge', props: { label: 'Official Batch 04', variant: 'success' } },
          ],
        },
        {
          id: `col_${Date.now()}_2`,
          name: 'Column 2 (Label Menu & CTA)',
          components: [
            { id: `comp_${Date.now()}_4`, type: 'NavigationMenu', props: { links: ['Overview', 'Specs', 'Checkout', 'FAQ'] } },
            { id: `comp_${Date.now()}_5`, type: 'Button', props: { label: 'Pre-Order Now', variant: 'default' } },
          ],
        },
      ];
    } else if (templateKey === 'hero') {
      label = 'Hero Section (ShadCN Flex)';
      layout = { display: 'flex', flexDirection: 'row', justify: 'between', align: 'center', columns: 2, gap: 'lg' };
      columnsContent = [
        {
          id: `col_${Date.now()}_1`,
          name: 'Column 1 (Headline & CTA)',
          columnWidth: '1/2',
          components: [
            { id: `comp_${Date.now()}_1`, type: 'Badge', props: { label: '2026 Merchant Infrastructure' } },
            { id: `comp_${Date.now()}_2`, type: 'Typography', props: { variant: 'h1', text: 'High-velocity commerce funnels for modern independent merchants.' } },
            { id: `comp_${Date.now()}_3`, type: 'Typography', props: { variant: 'lead', text: 'Single-page conversion architecture engineered for zero drop-off.' } },
            { id: `comp_${Date.now()}_4`, type: 'ButtonGroup', props: { options: ['Direct Order Now', 'View Specs'] } },
          ],
        },
        {
          id: `col_${Date.now()}_2`,
          name: 'Column 2 (Hardware Media Visual)',
          columnWidth: '1/2',
          components: [
            { id: `comp_${Date.now()}_5`, type: 'AspectRatio', props: { ratio: '16:9', imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80' } },
          ],
        },
      ];
    } else if (templateKey === 'showcase') {
      label = 'Showcase Section (ShadCN Grid)';
      layout = { display: 'grid', columns: 2, gap: 'lg', align: 'start', flexDirection: 'row', justify: 'start' };
      columnsContent = [
        {
          id: `col_${Date.now()}_1`,
          name: 'Column 1 (Questionnaire & Specs)',
          components: [
            { id: `comp_${Date.now()}_1`, type: 'Marker', props: { text: 'Direct Factory Allocation Active', color: 'emerald' } },
            { id: `comp_${Date.now()}_2`, type: 'QuestionnaireNew', props: { question: 'Which switch damping configuration do you require?', options: [{ label: 'Linear Silent', tag: 'Quiet' }, { label: 'Tactile Holy Panda', tag: 'Pop' }] } },
            { id: `comp_${Date.now()}_3`, type: 'Attachment', props: { fileName: 'acoustic_specsheet_rev2.pdf', fileSize: '2.8 MB' } },
          ],
        },
        {
          id: `col_${Date.now()}_2`,
          name: 'Column 2 (Metrics & Settlement Log)',
          components: [
            { id: `comp_${Date.now()}_4`, type: 'Chart', props: { title: 'Direct Checkout Volume', trend: '+34.2% Growth' } },
            { id: `comp_${Date.now()}_5`, type: 'Progress', props: { label: 'Batch Allocation Progress', value: 84 } },
            { id: `comp_${Date.now()}_6`, type: 'Toast', props: { title: 'Automated Settlement', description: 'Order #98214 confirmed via QRIS 24/7.' } },
          ],
        },
      ];
    } else if (templateKey === 'checkout') {
      label = '1-Page Checkout (ShadCN Form)';
      layout = { display: 'flex', flexDirection: 'col', justify: 'center', align: 'stretch', columns: 1, gap: 'md' };
      columnsContent = [
        {
          id: `col_${Date.now()}_1`,
          name: 'Payment & Delivery Column',
          components: [
            { id: `comp_${Date.now()}_1`, type: 'Typography', props: { variant: 'h2', text: 'Express Payment & Shipping' } },
            { id: `comp_${Date.now()}_2`, type: 'Field', props: { label: 'Customer Full Name', placeholder: 'e.g. Budi Santoso', required: true } },
            { id: `comp_${Date.now()}_3`, type: 'Field', props: { label: 'WhatsApp / Phone Number', placeholder: '081288991122', required: true } },
            { id: `comp_${Date.now()}_4`, type: 'NativeSelect', props: { label: 'Direct Payment Channel', options: ['QRIS Instant', 'BCA Virtual Account', 'Mandiri Virtual Account'] } },
            { id: `comp_${Date.now()}_5`, type: 'Button', props: { label: 'Complete Order & Settle Payment', variant: 'default' } },
          ],
        },
      ];
    } else if (templateKey === 'faq') {
      label = 'FAQ Accordion (ShadCN)';
      layout = { display: 'flex', flexDirection: 'col', justify: 'center', align: 'stretch', columns: 1, gap: 'md' };
      columnsContent = [
        {
          id: `col_${Date.now()}_1`,
          name: 'FAQ Column',
          components: [
            { id: `comp_${Date.now()}_1`, type: 'Typography', props: { variant: 'h2', text: 'Frequently Asked Questions' } },
            { id: `comp_${Date.now()}_2`, type: 'Accordion', props: { items: [{ q: 'How does direct settlement work?', a: 'Directly routes to your merchant account with zero platform delay.' }] } },
          ],
        },
      ];
    } else if (templateKey === 'footer') {
      label = 'Footer & Trust (ShadCN)';
      layout = { display: 'flex', flexDirection: 'row', justify: 'between', align: 'center', columns: 2, gap: 'md' };
      columnsContent = [
        { id: `col_${Date.now()}_1`, name: 'Col 1', components: [{ id: `comp_${Date.now()}_1`, type: 'Typography', props: { variant: 'p', text: 'ApexFlow Platform © 2026' } }] },
        { id: `col_${Date.now()}_2`, name: 'Col 2', components: [{ id: `comp_${Date.now()}_2`, type: 'Badge', props: { label: 'AES-256 Encrypted' } }] },
      ];
    }

    const newBlock: BlockItem = {
      id: newId,
      type: 'CONTAINER',
      content: { label },
      styles: defaultStyles,
      layout,
      columnsContent,
    };

    if (insertTargetIndex === null || insertTargetIndex >= blocks.length) {
      setBlocks((prev) => [...prev, newBlock]);
    } else {
      const nextBlocks = [...blocks];
      nextBlocks.splice(insertTargetIndex, 0, newBlock);
      setBlocks(nextBlocks);
    }

    setSelectedBlockId(newId);
  };

  // Insert standard layout section from AddElementsPanel
  const handleInsertLayoutSection = (layoutType: 'container' | 'grid-2' | 'grid-3' | 'grid-4' | 'flex-row') => {
    if (layoutType === 'container') {
      handleInsertSection('blank');
    } else if (layoutType === 'grid-2') {
      handleInsertSection('grid_2');
    } else if (layoutType === 'grid-3') {
      handleInsertSection('grid_3');
    } else if (layoutType === 'flex-row') {
      handleInsertSection('flex_row');
    } else if (layoutType === 'grid-4') {
      const newId = `blk_grid4_${Date.now()}`;
      const newBlock: BlockItem = {
        id: newId,
        type: 'CONTAINER',
        content: { label: 'Grid (4-Columns)' },
        styles: { fontFamily: 'sans' },
        layout: { display: 'grid', columns: 4, gap: 'md', align: 'start', flexDirection: 'row', justify: 'start' },
        columnsContent: [
          { id: `col_${Date.now()}_1`, name: 'Col 1', components: [] },
          { id: `col_${Date.now()}_2`, name: 'Col 2', components: [] },
          { id: `col_${Date.now()}_3`, name: 'Col 3', components: [] },
          { id: `col_${Date.now()}_4`, name: 'Col 4', components: [] },
        ],
      };
      if (insertTargetIndex === null || insertTargetIndex >= blocks.length) {
        setBlocks((prev) => [...prev, newBlock]);
      } else {
        const nextBlocks = [...blocks];
        nextBlocks.splice(insertTargetIndex, 0, newBlock);
        setBlocks(nextBlocks);
      }
      setSelectedBlockId(newId);
    }
  };

  // Insert Alex Travis bespoke section from AddElementsPanel
  const handleInsertAlexSection = (sectionKey: string) => {
    const normalizedKey = sectionKey === 'testimonials' ? 'testimonial' : sectionKey === 'case-studies' ? 'portfolio' : sectionKey;
    const match = ALEX_TRAVIS_TEMPLATE.find((b) => b.content?.alexSection === normalizedKey);
    if (match) {
      const newBlock: BlockItem = JSON.parse(JSON.stringify(match));
      newBlock.id = `blk_${normalizedKey}_${Date.now()}`;
      if (insertTargetIndex === null || insertTargetIndex >= blocks.length) {
        setBlocks((prev) => [...prev, newBlock]);
      } else {
        const nextBlocks = [...blocks];
        nextBlocks.splice(insertTargetIndex, 0, newBlock);
        setBlocks(nextBlocks);
      }
      setSelectedBlockId(newBlock.id);
    }
  };

  // Find currently active block
  const activeBlock = blocks.find((b) => b.id === selectedBlockId) || blocks[0];

  // Add ShadCN component to a column
  const handleAddShadcnComponent = (type: ShadcnComponentType, defaultProps: Record<string, any>) => {
    const initialChildren: ShadcnComponentInstance[] | undefined =
      type === 'Card'
        ? [
          {
            id: `comp_typography_${Date.now()}_1`,
            type: 'Typography',
            props: { variant: 'h4', text: 'Card Title' },
          },
          {
            id: `comp_label_${Date.now()}_2`,
            type: 'Label',
            props: { text: 'Card description or subtitle text goes here' },
          },
          {
            id: `comp_button_${Date.now()}_3`,
            type: 'Button',
            props: { text: 'Action Button', variant: 'default' },
          },
        ]
        : undefined;

    const newComp: ShadcnComponentInstance = {
      id: `comp_${type.toLowerCase()}_${Date.now()}`,
      type,
      props: defaultProps,
      ...(initialChildren ? { children: initialChildren } : {}),
    };

    if (!activeBlock) {
      const newContainer: BlockItem = {
        id: `blk_container_${Date.now()}`,
        type: 'CONTAINER',
        content: { label: `${type} Section` },
        styles: { fontFamily: 'sans' },
        layout: { display: 'flex', flexDirection: 'row', justify: 'center', align: 'center', columns: 1, gap: 'md' },
        columnsContent: [
          {
            id: `col_1`,
            name: 'Column 1',
            components: [newComp],
          },
        ],
      } as any;
      setBlocks([newContainer]);
      setSelectedBlockId(newContainer.id);
      setSelectedComponentId(newComp.id);
      return;
    }

    if (activeBlock.type === 'CONTAINER') {
      setBlocks((prev) =>
        prev.map((b) => {
          if (b.id !== activeBlock.id) return b;
          const container = b as any;
          const cols = [...(container.columnsContent || [])];
          const colIdx = targetColumnIndex < cols.length ? targetColumnIndex : 0;
          if (cols[colIdx]) {
            cols[colIdx] = {
              ...cols[colIdx],
              components: [...cols[colIdx].components, newComp],
            };
          }
          return { ...b, columnsContent: cols };
        }),
      );
      setSelectedComponentId(newComp.id);
    } else {
      // If current block is not a container, create a container with this component!
      const newContainer: BlockItem = {
        id: `blk_container_${Date.now()}`,
        type: 'CONTAINER',
        content: { label: `${type} Section` },
        styles: { fontFamily: 'sans' },
        layout: { display: 'flex', flexDirection: 'row', justify: 'center', align: 'center', columns: 1, gap: 'md' },
        columnsContent: [
          {
            id: `col_1`,
            components: [newComp],
          },
        ],
      } as any;
      setBlocks((prev) => [...prev, newContainer]);
      setSelectedBlockId(newContainer.id);
      setSelectedComponentId(newComp.id);
    }
  };

  // Update section / container layout with responsive breakpoint awareness
  const updateContainerLayout = (
    field: string,
    value: any,
    targetViewport: 'desktop' | 'tablet' | 'mobile' = viewport,
  ) => {
    if (!activeBlock) return;
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== activeBlock.id) return b;
        const current = b as any;
        const currentLayout = current.layout || {
          display: 'flex',
          flexDirection: 'row',
          justify: 'between',
          align: 'center',
          columns: 2,
          gap: 'md',
          maxWidth: 'boxed',
          contentPosition: 'center',
        };

        if (targetViewport === 'tablet') {
          return {
            ...b,
            layout: {
              ...currentLayout,
              tablet: {
                ...(currentLayout.tablet || {}),
                [field]: value,
              },
            },
          };
        } else if (targetViewport === 'mobile') {
          return {
            ...b,
            layout: {
              ...currentLayout,
              mobile: {
                ...(currentLayout.mobile || {}),
                [field]: value,
              },
            },
          };
        } else {
          return {
            ...b,
            layout: {
              ...currentLayout,
              [field]: value,
            },
          };
        }
      }),
    );
  };

  const resetContainerLayoutBreakpoint = (targetViewport: 'tablet' | 'mobile') => {
    if (!activeBlock) return;
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== activeBlock.id) return b;
        const current = b as any;
        const nextLayout = { ...(current.layout || {}) };
        if (targetViewport === 'tablet') {
          delete nextLayout.tablet;
        } else if (targetViewport === 'mobile') {
          delete nextLayout.mobile;
        }
        return {
          ...b,
          layout: nextLayout,
        };
      }),
    );
  };

  const addColumnToContainer = () => {
    if (!activeBlock || activeBlock.type !== 'CONTAINER') return;
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== activeBlock.id) return b;
        const current = b as any;
        const cols = [...(current.columnsContent || [])];
        cols.push({
          id: `col_${Date.now()}`,
          components: [
            {
              id: `comp_${Date.now()}`,
              type: 'Typography',
              props: { variant: 'p', text: 'New Column Content' },
            },
          ],
        });
        return {
          ...b,
          columnsContent: cols,
          layout: {
            ...current.layout,
            columns: Math.min(4, cols.length) as any,
          },
        };
      }),
    );
  };

  const removeColumnFromContainer = (idx: number) => {
    if (!activeBlock || activeBlock.type !== 'CONTAINER') return;
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== activeBlock.id) return b;
        const current = b as any;
        if (current.columnsContent.length <= 1) return b;
        const cols = current.columnsContent.filter((_: any, i: number) => i !== idx);
        return {
          ...b,
          columnsContent: cols,
          layout: {
            ...current.layout,
            columns: Math.min(4, cols.length) as any,
          },
        };
      }),
    );
  };

  const updateActiveContent = (field: string, value: any) => {
    if (!activeBlock) return;
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === activeBlock.id
          ? { ...b, content: { ...b.content, [field]: value } }
          : b,
      ),
    );
  };

  // Selected component recursive lookup
  const { component: selectedComponent, parentComponent: selectedParentComponent } = (() => {
    if (!selectedComponentId) return { component: null, parentComponent: null };

    const search = (
      comps: ShadcnComponentInstance[],
      parent: ShadcnComponentInstance | null,
    ): { component: ShadcnComponentInstance | null; parentComponent: ShadcnComponentInstance | null } | null => {
      for (const c of comps) {
        if (c.id === selectedComponentId) {
          return { component: c, parentComponent: parent };
        }
        if (c.children && c.children.length > 0) {
          const found = search(c.children, c);
          if (found) return found;
        }
      }
      return null;
    };

    for (const b of blocks) {
      if (b.type === 'CONTAINER') {
        const c = b as any;
        for (const col of c.columnsContent || []) {
          const found = search(col.components || [], null);
          if (found) return found;
        }
      }
    }
    return { component: null, parentComponent: null };
  })();

  const updateComponentProp = (compId: string, propKey: string, value: any) => {
    const updateTree = (list: ShadcnComponentInstance[]): ShadcnComponentInstance[] => {
      return list.map((comp) => {
        if (comp.id === compId) {
          return {
            ...comp,
            props: {
              ...comp.props,
              [propKey]: value,
            },
          };
        }
        if (comp.children && comp.children.length > 0) {
          return {
            ...comp,
            children: updateTree(comp.children),
          };
        }
        return comp;
      });
    };

    setBlocks((prev) =>
      prev.map((b) => {
        if (b.type !== 'CONTAINER') return b;
        const c = b as any;
        const newCols = (c.columnsContent || []).map((col: any) => ({
          ...col,
          components: updateTree(col.components || []),
        }));
        return { ...b, columnsContent: newCols };
      }),
    );
  };

  const updateComponentStyle = (
    compId: string,
    styleKey: keyof ElementStyles,
    value: any,
    targetViewport: 'desktop' | 'tablet' | 'mobile' = viewport,
  ) => {
    const updateTree = (list: ShadcnComponentInstance[]): ShadcnComponentInstance[] => {
      return list.map((comp) => {
        if (comp.id === compId) {
          const currentStyles = comp.styles || {};
          if (targetViewport === 'tablet') {
            return {
              ...comp,
              styles: {
                ...currentStyles,
                tablet: {
                  ...(currentStyles.tablet || {}),
                  [styleKey]: value,
                },
              },
            };
          } else if (targetViewport === 'mobile') {
            return {
              ...comp,
              styles: {
                ...currentStyles,
                mobile: {
                  ...(currentStyles.mobile || {}),
                  [styleKey]: value,
                },
              },
            };
          } else {
            return {
              ...comp,
              styles: {
                ...currentStyles,
                [styleKey]: value,
              },
            };
          }
        }
        if (comp.children && comp.children.length > 0) {
          return {
            ...comp,
            children: updateTree(comp.children),
          };
        }
        return comp;
      });
    };

    setBlocks((prev) =>
      prev.map((b) => {
        if (b.type !== 'CONTAINER') return b;
        const c = b as any;
        const newCols = (c.columnsContent || []).map((col: any) => ({
          ...col,
          components: updateTree(col.components || []),
        }));
        return { ...b, columnsContent: newCols };
      }),
    );
  };

  const resetComponentStyleBreakpoint = (compId: string, targetViewport: 'tablet' | 'mobile') => {
    const updateTree = (list: ShadcnComponentInstance[]): ShadcnComponentInstance[] => {
      return list.map((comp) => {
        if (comp.id === compId) {
          const nextStyles = { ...(comp.styles || {}) };
          if (targetViewport === 'tablet') {
            delete nextStyles.tablet;
          } else if (targetViewport === 'mobile') {
            delete nextStyles.mobile;
          }
          return {
            ...comp,
            styles: nextStyles,
          };
        }
        if (comp.children && comp.children.length > 0) {
          return {
            ...comp,
            children: updateTree(comp.children),
          };
        }
        return comp;
      });
    };

    setBlocks((prev) =>
      prev.map((b) => {
        if (b.type !== 'CONTAINER') return b;
        const c = b as any;
        const newCols = (c.columnsContent || []).map((col: any) => ({
          ...col,
          components: updateTree(col.components || []),
        }));
        return { ...b, columnsContent: newCols };
      }),
    );
  };

  const deleteComponentFromContainer = (compId: string) => {
    const deleteFromTree = (list: ShadcnComponentInstance[]): ShadcnComponentInstance[] => {
      return list
        .filter((comp) => comp.id !== compId)
        .map((comp) => {
          if (comp.children && comp.children.length > 0) {
            return {
              ...comp,
              children: deleteFromTree(comp.children),
            };
          }
          return comp;
        });
    };

    setBlocks((prev) =>
      prev.map((b) => {
        if (b.type !== 'CONTAINER') return b;
        const c = b as any;
        const newCols = (c.columnsContent || []).map((col: any) => ({
          ...col,
          components: deleteFromTree(col.components || []),
        }));
        return { ...b, columnsContent: newCols };
      }),
    );
    if (selectedComponentId === compId) setSelectedComponentId(null);
  };

  // Webflow Class Selector System & Design Token Handlers
  const updateComponentClassNames = (compId: string, updater: (current: string[]) => string[]) => {
    const updateTree = (list: ShadcnComponentInstance[]): ShadcnComponentInstance[] => {
      return list.map((comp) => {
        if (comp.id === compId) {
          const current = comp.classNames || [];
          return {
            ...comp,
            classNames: updater(current),
          };
        }
        if (comp.children && comp.children.length > 0) {
          return {
            ...comp,
            children: updateTree(comp.children),
          };
        }
        return comp;
      });
    };

    setBlocks((prev) =>
      prev.map((b) => {
        if (b.type !== 'CONTAINER') return b;
        const c = b as any;
        const newCols = (c.columnsContent || []).map((col: any) => ({
          ...col,
          components: updateTree(col.components || []),
        }));
        return { ...b, columnsContent: newCols };
      }),
    );
  };

  const updateBlockClassNames = (blockId: string, updater: (current: string[]) => string[]) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;
        const current = b.styles?.classNames || [];
        return {
          ...b,
          styles: {
            ...(b.styles || {}),
            classNames: updater(current),
          },
        };
      }),
    );
  };

  const handleCreateClass = (rawName: string, targetCompId?: string) => {
    const cleanName = rawName.replace(/^\.+/, '').trim().toLowerCase().replace(/\s+/g, '-');
    if (!cleanName) return;
    if (!styleClasses.some((c) => c.name === cleanName)) {
      const newClass: StyleClass = {
        id: createUniqueId('cls'),
        name: cleanName,
        styles: {},
      };
      setStyleClasses((prev) => [...prev, newClass]);
    }
    if (targetCompId) {
      updateComponentClassNames(targetCompId, (cur) => (cur.includes(cleanName) ? cur : [...cur, cleanName]));
    }
    setTargetClassName(cleanName);
    setIsEditingSharedClass(true);
  };

  const handleSharedClassStyleChange = (styleKey: string, value: any) => {
    if (!targetClassName) return;
    setStyleClasses((prev) =>
      prev.map((cls) => {
        if (cls.name === targetClassName) {
          return {
            ...cls,
            styles: {
              ...cls.styles,
              [styleKey]: value,
            },
          };
        }
        return cls;
      }),
    );
  };

  const addChildComponentToParent = (parentId: string, childType: ShadcnComponentType, defaultProps: Record<string, any>) => {
    const newChild: ShadcnComponentInstance = {
      id: createUniqueId(`comp_${childType.toLowerCase()}`),
      type: childType,
      props: defaultProps,
    };

    const addTree = (list: ShadcnComponentInstance[]): ShadcnComponentInstance[] => {
      return list.map((comp) => {
        if (comp.id === parentId) {
          return {
            ...comp,
            children: [...(comp.children || []), newChild],
          };
        }
        if (comp.children && comp.children.length > 0) {
          return {
            ...comp,
            children: addTree(comp.children),
          };
        }
        return comp;
      });
    };

    setBlocks((prev) =>
      prev.map((b) => {
        if (b.type !== 'CONTAINER') return b;
        const c = b as any;
        const newCols = (c.columnsContent || []).map((col: any) => ({
          ...col,
          components: addTree(col.components || []),
        }));
        return { ...b, columnsContent: newCols };
      }),
    );
    setSelectedComponentId(newChild.id);
  };

  const moveChildComponent = (parentId: string, fromIndex: number, toIndex: number) => {
    const moveTree = (list: ShadcnComponentInstance[]): ShadcnComponentInstance[] => {
      return list.map((comp) => {
        if (comp.id === parentId && comp.children) {
          const nextChildren = [...comp.children];
          if (fromIndex < 0 || fromIndex >= nextChildren.length || toIndex < 0 || toIndex >= nextChildren.length) {
            return comp;
          }
          const [moved] = nextChildren.splice(fromIndex, 1);
          nextChildren.splice(toIndex, 0, moved);
          return {
            ...comp,
            children: nextChildren,
          };
        }
        if (comp.children && comp.children.length > 0) {
          return {
            ...comp,
            children: moveTree(comp.children),
          };
        }
        return comp;
      });
    };

    setBlocks((prev) =>
      prev.map((b) => {
        if (b.type !== 'CONTAINER') return b;
        const c = b as any;
        const newCols = (c.columnsContent || []).map((col: any) => ({
          ...col,
          components: moveTree(col.components || []),
        }));
        return { ...b, columnsContent: newCols };
      }),
    );
  };

  const updateActiveStyle = (
    field: keyof BlockStyles,
    value: any,
    targetViewport: 'desktop' | 'tablet' | 'mobile' = viewport,
  ) => {
    if (!activeBlock) return;
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== activeBlock.id) return b;
        const currentStyles = b.styles || {};
        if (targetViewport === 'tablet') {
          return {
            ...b,
            styles: {
              ...currentStyles,
              tablet: {
                ...(currentStyles.tablet || {}),
                [field]: value,
              },
            },
          };
        } else if (targetViewport === 'mobile') {
          return {
            ...b,
            styles: {
              ...currentStyles,
              mobile: {
                ...(currentStyles.mobile || {}),
                [field]: value,
              },
            },
          };
        } else {
          return {
            ...b,
            styles: {
              ...currentStyles,
              [field]: value,
            },
          };
        }
      }),
    );
  };

  const resetActiveStyleBreakpoint = (targetViewport: 'tablet' | 'mobile') => {
    if (!activeBlock) return;
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== activeBlock.id) return b;
        const nextStyles = { ...(b.styles || {}) };
        if (targetViewport === 'tablet') {
          delete nextStyles.tablet;
        } else if (targetViewport === 'mobile') {
          delete nextStyles.mobile;
        }
        return {
          ...b,
          styles: nextStyles,
        };
      }),
    );
  };

  // BYOK Settings State
  const [settings, setSettings] = useState({
    xenditSecretKey: 'xnd_production_sec_99182301928374',
    xenditPublicKey: 'xnd_public_8819230192',
    xenditWebhookToken: 'wh_auth_token_77192384',
    fbPixelId: '109823471928374',
    fbCapiToken: 'EAAQ8819230192837491028374',
    ga4MeasurementId: 'G-X129849201',
    customDomain: 'checkout.merchant-brand.com',
  });

  const [exportedNotice, setExportedNotice] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([
    {
      id: 'ORD-98214',
      customer: 'Alex Pratama',
      phone: '081288991122',
      product: 'Studio Mechanical Keyboard Kit (Edition 01)',
      amount: 1450000,
      method: 'QRIS (Xendit)',
      status: 'PAID',
      date: '12 min ago',
    },
    {
      id: 'ORD-98213',
      customer: 'Siti Rahmawati',
      phone: '085711223344',
      product: 'Studio Mechanical Keyboard Kit (Edition 01)',
      amount: 1450000,
      method: 'BCA Virtual Account',
      status: 'PENDING',
      date: '38 min ago',
    },
  ]);

  const handleExport = () => {
    setExportedNotice(true);
    setTimeout(() => setExportedNotice(false), 3500);
  };

  // Render individual block instance
  const renderBlockInstance = (block: BlockItem) => {
    // 1. Alex Travis bespoke high-fidelity sections matching design mockup
    if (block.content?.alexSection) {
      const isSelected = selectedBlockId === block.id && !isPreviewMode;
      const onSelect = () => {
        if (!isPreviewMode) {
          setSelectedBlockId(block.id);
          setSelectedComponentId(null);
          setInspectorTab('content');
          setShowRightSidebar(true);
        }
      };

      const onUpdateContent = (field: string, value: any) => {
        setBlocks((prev) =>
          prev.map((b) =>
            b.id === block.id
              ? { ...b, content: { ...b.content, [field]: value } }
              : b
          )
        );
      };

      switch (block.content.alexSection) {
        case 'navbar':
          return <AlexNavbarSection block={block} isPreviewMode={isPreviewMode} onUpdateContent={onUpdateContent} onSelect={onSelect} isSelected={isSelected} viewport={viewport} />;
        case 'hero':
          return <AlexHeroSection block={block} isPreviewMode={isPreviewMode} onUpdateContent={onUpdateContent} onSelect={onSelect} isSelected={isSelected} viewport={viewport} />;
        case 'stats':
          return <AlexStatsSection block={block} isPreviewMode={isPreviewMode} onUpdateContent={onUpdateContent} onSelect={onSelect} isSelected={isSelected} viewport={viewport} />;
        case 'performance':
          return <AlexPerformanceSection block={block} isPreviewMode={isPreviewMode} onUpdateContent={onUpdateContent} onSelect={onSelect} isSelected={isSelected} viewport={viewport} />;
        case 'services':
          return <AlexServicesSection block={block} isPreviewMode={isPreviewMode} onUpdateContent={onUpdateContent} onSelect={onSelect} isSelected={isSelected} viewport={viewport} />;
        case 'process':
          return <AlexProcessSection block={block} isPreviewMode={isPreviewMode} onUpdateContent={onUpdateContent} onSelect={onSelect} isSelected={isSelected} viewport={viewport} />;
        case 'trust':
          return <AlexTrustSection block={block} isPreviewMode={isPreviewMode} onUpdateContent={onUpdateContent} onSelect={onSelect} isSelected={isSelected} viewport={viewport} />;
        case 'portfolio':
          return <AlexPortfolioSection block={block} isPreviewMode={isPreviewMode} onUpdateContent={onUpdateContent} onSelect={onSelect} isSelected={isSelected} viewport={viewport} />;
        case 'pricing':
          return <AlexPricingSection block={block} isPreviewMode={isPreviewMode} onUpdateContent={onUpdateContent} onSelect={onSelect} isSelected={isSelected} viewport={viewport} />;
        case 'testimonial':
          return <AlexTestimonialSection block={block} isPreviewMode={isPreviewMode} onUpdateContent={onUpdateContent} onSelect={onSelect} isSelected={isSelected} viewport={viewport} />;
        case 'articles':
          return <AlexArticlesSection block={block} isPreviewMode={isPreviewMode} onUpdateContent={onUpdateContent} onSelect={onSelect} isSelected={isSelected} viewport={viewport} />;
        case 'faq':
          return <AlexFaqSection block={block} isPreviewMode={isPreviewMode} onUpdateContent={onUpdateContent} onSelect={onSelect} isSelected={isSelected} viewport={viewport} />;
        case 'guarantees':
          return <AlexGuaranteesSection block={block} isPreviewMode={isPreviewMode} onUpdateContent={onUpdateContent} onSelect={onSelect} isSelected={isSelected} viewport={viewport} />;
        case 'footer':
          return <AlexFooterSection block={block} isPreviewMode={isPreviewMode} onUpdateContent={onUpdateContent} onSelect={onSelect} isSelected={isSelected} viewport={viewport} />;
        default:
          break;
      }
    }

    switch (block.type) {
      case 'CONTAINER':
        const container = block as any;
        return (
          <ContainerBlock
            blockId={block.id}
            layout={container.layout}
            columnsContent={container.columnsContent}
            styles={block.styles}
            styleClasses={styleClasses}
            tokens={designTokens}
            label={block.content?.label}
            viewport={viewport}
            isPreviewMode={isPreviewMode}
            selectedComponentId={isPreviewMode ? null : selectedComponentId}
            onSelectComponent={(compId) => {
              if (!isPreviewMode) {
                setSelectedBlockId(block.id);
                setSelectedComponentId(compId);
                setElementInspectorTab('styles');
                setShowRightSidebar(true);
              }
            }}
            onAddComponentToColumn={(colIdx) => {
              setSelectedBlockId(block.id);
              setTargetColumnIndex(colIdx);
              setSidebarTab('shadcn');
            }}
            onDuplicateComponent={duplicateComponent}
            onMoveComponentUpDown={moveComponentUpDown}
            onDropElementFromSidebar={(colIdx, payload, insertIdx) =>
              handleDropFromSidebar(colIdx, payload, insertIdx, block.id)
            }
            onAddChildComponent={(parentId, childType, defaultProps) => {
              setSelectedBlockId(block.id);
              addChildComponentToParent(parentId, childType, defaultProps);
            }}
            onMoveChildComponent={(parentId, fromIndex, toIndex) => {
              setSelectedBlockId(block.id);
              moveChildComponent(parentId, fromIndex, toIndex);
            }}
            onDeleteChildComponent={(parentId, childId) => {
              deleteComponentFromContainer(childId);
            }}
            onUpdateChildProps={(childId, newProps) => {
              for (const [k, v] of Object.entries(newProps)) {
                updateComponentProp(childId, k, v);
              }
            }}
            onUpdateLayout={(partial) => {
              setSelectedBlockId(block.id);
              for (const [k, v] of Object.entries(partial)) {
                updateContainerLayout(k as any, v);
              }
            }}
            onAddColumn={() => {
              setSelectedBlockId(block.id);
              addColumnToContainer();
            }}
            onDeleteColumn={(colIdx) => {
              setSelectedBlockId(block.id);
              removeColumnFromContainer(colIdx);
            }}
            onDeleteComponent={(compId) => {
              deleteComponentFromContainer(compId);
            }}
            onUpdateComponentProps={(compId, newProps) => {
              for (const [k, v] of Object.entries(newProps)) {
                updateComponentProp(compId, k, v);
              }
            }}
          />
        );
      case 'NAVBAR':
        return (
          <NavbarBlock
            brandName={block.content.brandName}
            brandLogoUrl={block.content.brandLogoUrl}
            positionMode={block.content.positionMode || 'sticky'}
            navLinks={block.content.navLinks}
            ctaText={block.content.ctaText}
            styles={block.styles}
            onCtaClick={() => {
              const el = document.getElementById('checkout-target');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        );
      case 'HERO':
        return (
          <HeroBlock
            headline={block.content.headline}
            subheadline={block.content.subheadline}
            badgeText={block.content.badgeText}
            ctaText={block.content.ctaText}
            styles={block.styles}
            layout={block.layout}
            viewport={viewport}
            onCtaClick={() => {
              const el = document.getElementById('checkout-target');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        );
      case 'IMAGE':
        return (
          <ImageBlock
            imageUrl={block.content.imageUrl}
            altText={block.content.altText}
            caption={block.content.caption}
            aspectRatio={block.content.aspectRatio}
            styles={block.styles}
          />
        );
      case 'TIMER':
        return (
          <TimerBlock
            urgencyText={block.content.urgencyText}
            styles={block.styles}
          />
        );
      case 'PRODUCT_SPOTLIGHT':
        return (
          <ProductSpotlightBlock
            title={block.content.productTitle}
            price={block.content.productPrice}
            compareAtPrice={block.content.compareAtPrice}
            inventoryBadgeText={block.content.inventoryBadge}
            description={block.content.description}
            styles={block.styles}
            layout={block.layout}
            viewport={viewport}
            features={[
              'Integrated 1-Page Express Checkout with Xendit VA & QRIS',
              'Server-Side Meta Conversions API (CAPI) with 100% Event Deduplication',
              'Direct Payouts: Zero Platform Transaction Fees (Funds Go Direct to Merchant)',
              '1-Click Export: Standalone Zero-Dependency HTML/CSS/JS Package',
            ]}
          />
        );
      case 'CHECKOUT_FORM':
        return (
          <div id="checkout-target">
            <CheckoutFormBlock
              productTitle={block.content.formTitle || 'Storefront Product'}
              amount={1450000}
              styles={block.styles}
              onCheckoutSuccess={(newOrder) => {
                setOrders((prev) => [
                  {
                    id: newOrder.orderId,
                    customer: 'New Customer',
                    phone: '08123456789',
                    product: 'Landing Page Checkout',
                    amount: 1450000,
                    method: 'QRIS / VA Xendit',
                    status: 'PENDING',
                    date: 'Just now',
                  },
                  ...prev,
                ]);
              }}
            />
          </div>
        );
      case 'REVIEWS':
        return <ReviewsBlock styles={block.styles} />;
      case 'FAQ':
        return <FaqBlock styles={block.styles} />;
      case 'FOOTER':
        return <FooterBlock styles={block.styles} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-slate-100 dark:bg-[#08090c] text-slate-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-blue-100 dark:selection:bg-neutral-800 overflow-hidden">
      {/* Precision Top Navigation Bar (Fixed at top of screen) */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-neutral-900 bg-white/95 dark:bg-[#08090c]/95 backdrop-blur-md px-4 lg:px-4 h-14 shrink-0 flex items-center justify-between select-none">
        {/* Left Section: Brand / Page Switcher & Global Libraries */}
        <div className="flex items-center gap-3">
          {/* Segmented Control Navigation */}
          <nav className="hidden md:flex items-center bg-slate-100 dark:bg-neutral-900/90 rounded-lg border border-slate-200 dark:border-neutral-800/80 p-0.5">
            <button
              onClick={() => setActiveTab('builder')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${activeTab === 'builder'
                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Page Builder
            </button>
          </nav>

          <span className="text-slate-300 dark:text-neutral-700 hidden md:inline">/</span>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-neutral-400">
            {isEditingPageName ? (
              <input
                type="text"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                onBlur={() => setIsEditingPageName(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') {
                    setIsEditingPageName(false);
                  }
                }}
                autoFocus
                placeholder="Page Name..."
                className="h-7 px-2.5 py-0.5 text-xs font-semibold rounded-md border border-blue-500 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-44"
              />
            ) : (
              <div className="flex items-center gap-1">
                {/* Multi-Page Switcher Dropdown */}
                <PageSwitcherDropdown
                  currentPageId={persistence.currentPageId}
                  pages={persistence.pages}
                  onSelectPage={persistence.switchPage}
                  onOpenNewPageModal={() => setIsNewPageModalOpen(true)}
                  onOpenPageSettings={() => setIsPageSettingsOpen(true)}
                  onDuplicatePage={persistence.duplicatePage}
                  onDeletePage={persistence.deletePage}
                />

                <button
                  type="button"
                  onClick={() => setIsEditingPageName(true)}
                  className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
                  title="Rename current page"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPageSettingsOpen(true)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Page Settings & SEO"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="h-4 w-px bg-slate-200 dark:bg-neutral-800 mx-1 hidden sm:block" />

            {/* Global Design Tokens & Components Group */}
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-neutral-900/90 rounded-md p-0.5 border border-slate-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setIsDesignTokensModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-slate-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-neutral-800 transition-all cursor-pointer"
                title="Global Design Tokens & Theme Presets (Colors, Fonts, Radius)"
              >
                <Palette className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Tokens</span>
              </button>
              <button
                type="button"
                onClick={() => setIsMasterComponentsModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-slate-700 dark:text-neutral-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white dark:hover:bg-neutral-800 transition-all cursor-pointer"
                title="Reusable Master Components & Symbols Library"
              >
                <ComponentIcon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Symbols</span>
                {masterComponents.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold">
                    {masterComponents.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: Viewport, Panels, Preview, & Single Unified Save */}
        <div className="flex items-center gap-2.5">
          {activeTab === 'builder' && (
            <>
              {/* Group 1: History (Undo / Redo) */}
              <div className="flex items-center bg-slate-100 dark:bg-neutral-900/90 rounded-md p-0.5 border border-slate-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="p-1.5 rounded transition-colors text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Undo (Cmd+Z)"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-1.5 rounded transition-colors text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Redo (Cmd+Shift+Z / Cmd+Y)"
                >
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Group 2: Viewport Breakpoints */}
              <div className="hidden md:flex items-center bg-slate-100 dark:bg-neutral-900/90 rounded-md p-0.5 border border-slate-200 dark:border-neutral-800">
                <button
                  onClick={() => setViewport('desktop')}
                  className={`p-1.5 rounded transition-colors ${viewport === 'desktop'
                    ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-neutral-500 hover:text-slate-800 dark:hover:text-neutral-300'
                    }`}
                  title="Desktop Preview"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewport('tablet')}
                  className={`p-1.5 rounded transition-colors ${viewport === 'tablet'
                    ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-neutral-500 hover:text-slate-800 dark:hover:text-neutral-300'
                    }`}
                  title="Tablet (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewport('mobile')}
                  className={`p-1.5 rounded transition-colors ${viewport === 'mobile'
                    ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-neutral-500 hover:text-slate-800 dark:hover:text-neutral-300'
                    }`}
                  title="Mobile (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Group 3: Sidebars Visibility */}
              <div className="hidden sm:flex items-center bg-slate-100 dark:bg-neutral-900/90 rounded-md p-0.5 border border-slate-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowLeftSidebar(!showLeftSidebar)}
                  className={`p-1.5 rounded transition-colors flex items-center justify-center ${showLeftSidebar
                    ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 dark:text-neutral-500 hover:text-slate-800 dark:hover:text-neutral-300'
                    }`}
                  title={showLeftSidebar ? 'Hide Left Sidebar (Components & Tree) [Cmd+B]' : 'Show Left Sidebar (Components & Tree) [Cmd+B]'}
                >
                  <PanelLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowRightSidebar(!showRightSidebar)}
                  className={`p-1.5 rounded transition-colors flex items-center justify-center ${showRightSidebar
                    ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 dark:text-neutral-500 hover:text-slate-800 dark:hover:text-neutral-300'
                    }`}
                  title={showRightSidebar ? 'Hide Right Inspector' : 'Show Right Inspector'}
                >
                  <PanelRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="h-4 w-px bg-slate-200 dark:bg-neutral-800 hidden sm:block" />

              {/* Group 4: Theme, Preview, & Clear Canvas */}
              <div className="flex items-center gap-1.5">
                <ThemeToggle />

                <button
                  type="button"
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all border cursor-pointer ${isPreviewMode
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800'
                    }`}
                  title={isPreviewMode ? 'Exit Interactive Preview Mode' : 'Enter Interactive Preview Mode'}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">{isPreviewMode ? 'Exit' : 'Preview'}</span>
                </button>

                {blocks.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearCanvas}
                    className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-md hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    title="Clear canvas to empty state"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="h-4 w-px bg-slate-200 dark:bg-neutral-800 hidden sm:block" />

              {/* Group 5: Autosave Indicator & Export */}
              <div className="flex items-center gap-2">
                <SaveStatusBadge
                  status={persistence.saveStatus}
                  lastSavedAt={persistence.lastSavedAt}
                  onSaveManual={persistence.saveNow}
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="h-8 text-xs font-medium px-2.5"
                  title="Export standalone HTML/CSS & JS boilerplate"
                >
                  <Download className="w-3.5 h-3.5 mr-1 text-slate-500 dark:text-neutral-400" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </>
          )}


          {/* Milestone 6: Publish Storefront Button */}
          <Button
            size="sm"
            onClick={() => setIsPublishModalOpen(true)}
            className="h-8 text-xs font-semibold px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs hover:shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-1.5"
            title="Publish & deploy storefront to live public URL"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Publish</span>
            {currentPageSummary?.status === 'PUBLISHED' && (
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse ml-0.5" title="Live storefront is published" />
            )}
          </Button>
        </div>
      </header>

      {/* Export notification banner */}
      {exportedNotice && (
        <div className="bg-slate-100 dark:bg-neutral-900 border-b border-slate-200 dark:border-neutral-800 px-4 py-2 text-center text-xs font-medium text-slate-700 dark:text-neutral-200 flex items-center justify-center gap-2 shrink-0">
          <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Standalone boilerplate bundle ready: index.html, style.css, and Xendit checkout.js generated.</span>
        </div>
      )}

      {/* Main Workspace Layout with Pinned Sidebars and Independently Scrolling Canvas */}
      <main className="flex-1 flex overflow-hidden relative min-h-0">
        {activeTab === 'builder' && (
          <div className="flex-1 flex w-full h-full overflow-hidden min-h-0">
            {/* Left Sidebar (STICKY IN PLACE WITH 2 TABS: SHADCN (64) | NAVIGATOR) */}
            {!isPreviewMode && showLeftSidebar && (
              <ElementorSidebar
                blocks={blocks}
                selectedBlockId={selectedBlockId}
                selectedComponentId={selectedComponentId}
                activeSidebarTab={sidebarTab}
                onSidebarTabChange={setSidebarTab}
                targetColumnIndex={targetColumnIndex}
                onSelectBlock={(id) => {
                  setSelectedBlockId(id);
                  setSelectedComponentId(null);
                  setShowRightSidebar(true);
                }}
                onSelectComponent={(componentId, blockId) => {
                  setSelectedBlockId(blockId);
                  setSelectedComponentId(componentId);
                  setShowRightSidebar(true);
                }}
                onAddBlock={(type) => handleInsertSection(type)}
                onAddShadcnToActiveSection={(type, defaultProps) => {
                  handleAddShadcnComponent(type, defaultProps);
                  setShowRightSidebar(true);
                }}
                onAddLayoutSection={handleInsertLayoutSection}
                onInsertAlexSection={handleInsertAlexSection}
                onOpenTemplateLibrary={() => setIsSectionModalOpen(true)}
                onMoveUp={moveBlockUp}
                onMoveDown={moveBlockDown}
                onDuplicate={duplicateBlock}
                onDelete={deleteBlock}
                onDeleteComponent={(compId) => deleteComponentFromContainer(compId)}
                onClose={() => setShowLeftSidebar(false)}
              />
            )}

            {/* Center Canvas Area with Bottom Breadcrumb Bar */}
            <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden relative">
              {/* Center Canvas: Independently Scrolling Canvas */}
              <div className="flex-1 bg-slate-100/90 dark:bg-[#090a0e] p-4 md:p-8 overflow-y-auto flex justify-center items-start min-h-0 relative">
                {/* Page Switching Loading Overlay */}
                {persistence.isLoadingPage && (
                  <div className="absolute inset-0 z-50 bg-white/80 dark:bg-[#090a0e]/85 backdrop-blur-xs flex flex-col items-center justify-center gap-3 select-none">
                    <div className="w-9 h-9 rounded-full border-3 border-blue-500 border-t-transparent animate-spin shadow-md" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-neutral-200">
                      Loading page draft...
                    </span>
                  </div>
                )}

                {/* Save Error Banner */}
                {persistence.saveError && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 bg-red-500/90 text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                    <span>Autosave failed: {persistence.saveError}</span>
                    <button
                      type="button"
                      onClick={persistence.saveNow}
                      className="underline font-bold text-white hover:text-red-100 cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Floating button to restore Left Sidebar if hidden */}
                {!isPreviewMode && !showLeftSidebar && (
                  <button
                    type="button"
                    onClick={() => setShowLeftSidebar(true)}
                    className="absolute left-3 top-4 z-40 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-slate-200/90 dark:border-neutral-800 shadow-md hover:bg-slate-50 dark:hover:bg-neutral-800 text-xs font-medium text-slate-700 dark:text-neutral-300 transition-all hover:scale-105 select-none"
                    title="Show Left Sidebar (Components & Tree) [Cmd+B]"
                  >
                    <PanelLeftOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="hidden sm:inline text-[11px]">Components</span>
                  </button>
                )}

                {/* Floating button to restore Right Sidebar if hidden */}
                {!isPreviewMode && !showRightSidebar && (
                  <button
                    type="button"
                    onClick={() => setShowRightSidebar(true)}
                    className="absolute right-3 top-4 z-40 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-slate-200/90 dark:border-neutral-800 shadow-md hover:bg-slate-50 dark:hover:bg-neutral-800 text-xs font-medium text-slate-700 dark:text-neutral-300 transition-all hover:scale-105 select-none"
                    title="Show Right Inspector"
                  >
                    <span className="hidden sm:inline text-[11px]">Inspector</span>
                    <PanelRightOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </button>
                )}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    try {
                      const raw = e.dataTransfer.getData('application/json');
                      if (raw) {
                        const payload = JSON.parse(raw);
                        if (payload.type === 'LAYOUT_SECTION') {
                          handleInsertLayoutSection(payload.layoutType);
                        } else if (payload.type === 'ALEX_SECTION') {
                          handleInsertAlexSection(payload.sectionKey);
                        } else if (payload.type === 'SHADCN_ELEMENT') {
                          handleAddShadcnComponent(payload.elementType, payload.defaultProps);
                        }
                      }
                    } catch (err) {
                      console.error('Canvas drop error:', err);
                    }
                  }}
                  className={`transition-all duration-200 w-full h-fit self-start ${viewport === 'mobile'
                    ? 'max-w-97.5 border border-slate-300 dark:border-neutral-800 rounded-3xl p-4 shadow-2xl bg-white dark:bg-[#08090c] mb-12'
                    : viewport === 'tablet'
                      ? 'max-w-3xl border border-slate-300 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl bg-white dark:bg-[#08090c] mb-12'
                      : 'max-w-6xl bg-white dark:bg-[#0c0d12] border border-slate-200/80 dark:border-neutral-800/80 rounded-3xl shadow-2xl mb-12 p-2 sm:p-4'
                    } rounded-3xl ${isPreviewMode ? 'overflow-hidden' : 'overflow-visible pt-5'}`}
                >
                  {blocks.length === 0 ? (
                    /* High-Craft Empty State Canvas */
                    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl border-2 border-dashed border-slate-300 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/70 shadow-lg dark:shadow-2xl space-y-5 my-0">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center justify-center shadow-inner">
                        <Box className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="space-y-1.5 max-w-md">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                          Your Page Canvas is Empty
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 leading-relaxed">
                          Start building your page by adding a container section below, or load a pre-built portfolio template.
                        </p>
                      </div>

                      {/* Featured Full Design Template Card */}
                      <div className="w-full max-w-lg p-5 rounded-2xl bg-slate-50/90 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-left transition-all hover:border-slate-300 dark:hover:border-neutral-700">
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 text-[10px] font-semibold uppercase tracking-wider">
                            <LayoutTemplate className="w-3 h-3 text-slate-600 dark:text-neutral-400" />
                            Starter Template
                          </div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">
                            Alex Travis • Designer &amp; SaaS Portfolio
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-neutral-400">
                            14 editable sections: Hero, Metrics, Performance Ring, Services, Portfolio, Pricing &amp; Footer.
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleLoadAlexTravisTemplate}
                          className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-900 font-medium shadow-sm shrink-0 text-xs px-4 py-2"
                        >
                          <LayoutTemplate className="w-3.5 h-3.5 mr-1.5" />
                          Load Template
                        </Button>
                      </div>

                      {/* Quick-Start Section Preset Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg pt-2">
                        <button
                          type="button"
                          onClick={() => handleInsertSection('navbar')}
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/80 dark:bg-neutral-900/60 hover:bg-slate-100 dark:hover:bg-neutral-800 hover:border-blue-500/60 text-left transition-all group"
                        >
                          <Compass className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                          <div>
                            <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300">
                              + Navbar Section
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-neutral-400">
                              2-Column Flex: Name Web &amp; Menu
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInsertSection('hero')}
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/80 dark:bg-neutral-900/60 hover:bg-slate-100 dark:hover:bg-neutral-800 hover:border-blue-500/60 text-left transition-all group"
                        >
                          <Layout className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                          <div>
                            <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300">
                              + Hero Section
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-neutral-400">
                              Flex Headline, CTA &amp; Media
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInsertSection('flex_row')}
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/80 dark:bg-neutral-900/60 hover:bg-slate-100 dark:hover:bg-neutral-800 hover:border-blue-500/60 text-left transition-all group"
                        >
                          <Columns className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                          <div>
                            <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300">
                              + Blank Flex Container
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-neutral-400">
                              Customizable 2-Column Row
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInsertSection('grid_2')}
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/80 dark:bg-neutral-900/60 hover:bg-slate-100 dark:hover:bg-neutral-800 hover:border-blue-500/60 text-left transition-all group"
                        >
                          <LayoutGrid className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <div>
                            <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300">
                              + Blank Grid Container
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-neutral-400">
                              2-Column CSS Grid
                            </div>
                          </div>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => openInsertModalAt(null)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Browse All Section Templates</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <DndContext
                        id="canvas-dnd-context"
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={blocks.map((b) => b.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className={isPreviewMode ? 'space-y-0' : 'space-y-6 pt-2'}>
                            {blocks.map((block, index) => (
                              <SortableBlockWrapper
                                key={block.id}
                                id={block.id}
                                type={block.type}
                                index={index}
                                totalBlocks={blocks.length}
                                isSelected={selectedBlockId === block.id}
                                isPreviewMode={isPreviewMode}
                                isMasterInstance={Boolean((block as any).isMasterInstance)}
                                masterName={(block as any).content?.masterName}
                                onSelect={() => {
                                  setSelectedBlockId(block.id);
                                  setSelectedComponentId(null);
                                  setShowRightSidebar(true);
                                }}
                                onMoveUp={() => moveBlockUp(index)}
                                onMoveDown={() => moveBlockDown(index)}
                                onDuplicate={() => duplicateBlock(index)}
                                onDelete={() => deleteBlock(index)}
                                onInsertBelow={() => openInsertModalAt(index + 1)}
                              >
                                {renderBlockInstance(block)}
                              </SortableBlockWrapper>
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>

                      {/* Elementor-style Big Bottom "+ Add New Section" Box */}
                      {!isPreviewMode && (
                        <div
                          onClick={() => openInsertModalAt(blocks.length)}
                          className="mt-8 border-2 border-dashed border-slate-300 dark:border-neutral-800 hover:border-blue-500/80 bg-white/60 dark:bg-neutral-950/60 hover:bg-slate-50 dark:hover:bg-neutral-900/40 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group"
                        >
                          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-2">
                            <Plus className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-semibold text-slate-800 dark:text-neutral-300 group-hover:text-blue-600 dark:group-hover:text-white">
                            Add Section
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                            Insert a Flexbox or Grid container to arrange blocks and elements
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Interactive Breadcrumb Bar (Webflow Style) */}
              {!isPreviewMode && (
                <BreadcrumbBar
                  blocks={blocks}
                  selectedBlockId={selectedBlockId}
                  selectedComponentId={selectedComponentId}
                  onSelectBlock={(id) => {
                    setSelectedBlockId(id);
                    setSelectedComponentId(null);
                  }}
                  onSelectComponent={(compId, blockId) => {
                    setSelectedBlockId(blockId);
                    setSelectedComponentId(compId);
                  }}
                  onDeselectAll={() => {
                    setSelectedBlockId(null);
                    setSelectedComponentId(null);
                  }}
                />
              )}
            </div>

            {/* Right Sidebar: Dynamic Block & Element Inspector (STICKY IN PLACE) */}
            {!isPreviewMode && showRightSidebar && (
              selectedComponent ? (
                <aside className="w-80 border-l border-slate-200 dark:border-neutral-900 bg-white dark:bg-[#08090c] p-4 overflow-y-auto h-full sticky top-0 shrink-0 z-30 space-y-4 hidden lg:block select-none">
                  {/* Element Inspector Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-neutral-900">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedComponentId(selectedParentComponent ? selectedParentComponent.id : null)}
                        className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors"
                        title={selectedParentComponent ? `Back to ${selectedParentComponent.type}` : 'Back to Section Inspector'}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                          <Box className="w-3 h-3" />
                          {selectedParentComponent ? (
                            <span className="flex items-center gap-1">
                              <button
                                onClick={() => setSelectedComponentId(selectedParentComponent.id)}
                                className="hover:underline text-blue-600 dark:text-blue-400"
                              >
                                {selectedParentComponent.type}
                              </button>
                              <ChevronRight className="w-2.5 h-2.5 text-slate-400" />
                              <span>Child Element</span>
                            </span>
                          ) : (
                            <span>Element</span>
                          )}
                        </div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white capitalize flex items-center gap-1.5">
                          <span>{selectedComponent.type}</span>
                          {selectedComponent.isMasterInstance && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              ❖ Symbol
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {selectedComponent.isMasterInstance ? (
                        <button
                          type="button"
                          onClick={() => handleDetachComponentInstance(selectedComponent.id)}
                          className="px-2 py-1 text-[10px] font-medium rounded border border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Detach from Master Symbol to make independent"
                        >
                          <Unlink className="w-3 h-3" />
                          Detach
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setCreateMasterTarget({
                              type: 'component',
                              target: selectedComponent,
                              name: selectedComponent.type,
                            });
                            setIsCreateMasterModalOpen(true);
                          }}
                          className="px-2 py-1 text-[10px] font-medium rounded border border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Save as Reusable Master Component / Symbol"
                        >
                          <ComponentIcon className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          Make Symbol
                        </button>
                      )}

                      <div className="flex bg-slate-100 dark:bg-neutral-900 p-0.5 rounded-md border border-slate-200 dark:border-neutral-800">
                        <button
                          onClick={() => setElementInspectorTab('styles')}
                          className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${elementInspectorTab === 'styles'
                            ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200'
                            }`}
                        >
                          Styles
                        </button>
                        <button
                          onClick={() => setElementInspectorTab('content')}
                          className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${elementInspectorTab === 'content'
                            ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200'
                            }`}
                        >
                          Content
                        </button>
                      </div>

                      <button
                        onClick={() => deleteComponentFromContainer(selectedComponent.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete Element"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowRightSidebar(false)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors ml-0.5"
                        title="Hide Inspector Sidebar"
                      >
                        <PanelRightClose className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Linked Symbol Banner */}
                  {selectedComponent.isMasterInstance && (
                    <div className="p-2.5 rounded-lg bg-linear-to-r from-purple-500/10 to-indigo-500/10 border border-purple-200 dark:border-purple-900/50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-purple-800 dark:text-purple-300">
                        <ComponentIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-semibold text-[11px]">Linked Master Symbol</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDetachComponentInstance(selectedComponent.id)}
                        className="text-[10px] text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5 cursor-pointer font-medium"
                      >
                        <Unlink className="w-3 h-3" />
                        Detach (Unlink)
                      </button>
                    </div>
                  )}

                  {/* 1. Element Styles Tab */}
                  {elementInspectorTab === 'styles' && (
                    <StylesPanel
                      styles={
                        isEditingSharedClass && targetClassName
                          ? styleClasses.find((c) => c.name === targetClassName)?.styles || {}
                          : selectedComponent.styles || {}
                      }
                      onChange={(key, val) => {
                        if (isEditingSharedClass && targetClassName) {
                          handleSharedClassStyleChange(key, val);
                        } else {
                          updateComponentStyle(selectedComponent.id, key as any, val, viewport);
                        }
                      }}
                      isElement={true}
                      viewport={viewport}
                      onViewportChange={setViewport}
                      onResetBreakpoint={(vp) => resetComponentStyleBreakpoint(selectedComponent.id, vp)}
                      classNames={selectedComponent.classNames || []}
                      styleClasses={styleClasses}
                      tokens={designTokens}
                      onAddClass={(cls) =>
                        updateComponentClassNames(selectedComponent.id, (current) =>
                          current.includes(cls) ? current : [...current, cls],
                        )
                      }
                      onRemoveClass={(cls) =>
                        updateComponentClassNames(selectedComponent.id, (current) =>
                          current.filter((c) => c !== cls),
                        )
                      }
                      onCreateClass={(cls) => handleCreateClass(cls, selectedComponent.id)}
                      targetClassName={targetClassName}
                      onSelectTargetClass={(name) => setTargetClassName(name)}
                      isEditingSharedClass={isEditingSharedClass}
                      onToggleEditSharedClass={(enabled) => setIsEditingSharedClass(enabled)}
                      onOpenTokensModal={() => setIsDesignTokensModalOpen(true)}
                    />
                  )}

                  {/* 2. Element Content Tab */}
                  {elementInspectorTab === 'content' && (
                    <div className="space-y-4 text-xs">
                      {/* Text / Typography */}
                      {('text' in (selectedComponent.props || {}) || selectedComponent.type === 'Typography') && (
                        <div>
                          <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Text Content</label>
                          <textarea
                            value={selectedComponent.props?.text ?? ''}
                            onChange={(e) => updateComponentProp(selectedComponent.id, 'text', e.target.value)}
                            rows={3}
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      )}

                      {'label' in (selectedComponent.props || {}) && (
                        <div>
                          <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Label</label>
                          <Input
                            value={selectedComponent.props?.label ?? ''}
                            onChange={(e) => updateComponentProp(selectedComponent.id, 'label', e.target.value)}
                          />
                        </div>
                      )}

                      {'title' in (selectedComponent.props || {}) && (
                        <div>
                          <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Title</label>
                          <Input
                            value={selectedComponent.props?.title ?? ''}
                            onChange={(e) => updateComponentProp(selectedComponent.id, 'title', e.target.value)}
                          />
                        </div>
                      )}

                      {'description' in (selectedComponent.props || {}) && (
                        <div>
                          <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Description</label>
                          <Input
                            value={selectedComponent.props?.description ?? ''}
                            onChange={(e) => updateComponentProp(selectedComponent.id, 'description', e.target.value)}
                          />
                        </div>
                      )}

                      {'placeholder' in (selectedComponent.props || {}) && (
                        <div>
                          <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Placeholder</label>
                          <Input
                            value={selectedComponent.props?.placeholder ?? ''}
                            onChange={(e) => updateComponentProp(selectedComponent.id, 'placeholder', e.target.value)}
                          />
                        </div>
                      )}

                      {/* Image source controls (URL or Device upload) */}
                      {('src' in (selectedComponent.props || {}) || selectedComponent.type === 'Avatar') && (
                        <ImageSourcePicker
                          label="Avatar / Image Source"
                          value={selectedComponent.props?.src ?? ''}
                          onChange={(val) => updateComponentProp(selectedComponent.id, 'src', val)}
                          placeholder="Enter image URL or choose file from device..."
                        />
                      )}

                      {('imageUrl' in (selectedComponent.props || {}) || selectedComponent.type === 'AspectRatio') && (
                        <ImageSourcePicker
                          label="Image Source"
                          value={selectedComponent.props?.imageUrl ?? ''}
                          onChange={(val) => updateComponentProp(selectedComponent.id, 'imageUrl', val)}
                          placeholder="Enter image URL or choose file from device..."
                        />
                      )}

                      {'imgUrl' in (selectedComponent.props || {}) && (
                        <ImageSourcePicker
                          label="Image Source"
                          value={selectedComponent.props?.imgUrl ?? ''}
                          onChange={(val) => updateComponentProp(selectedComponent.id, 'imgUrl', val)}
                          placeholder="Enter image URL or choose file from device..."
                        />
                      )}

                      {'href' in (selectedComponent.props || {}) && (
                        <div>
                          <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Link URL (href)</label>
                          <Input
                            value={selectedComponent.props?.href ?? ''}
                            onChange={(e) => updateComponentProp(selectedComponent.id, 'href', e.target.value)}
                            placeholder="https://..."
                          />
                        </div>
                      )}

                      {('icon' in (selectedComponent.props || {}) || ['Item', 'Button', 'Badge', 'Alert', 'Message'].includes(selectedComponent.type)) && (
                        <IconPicker
                          label="Component Icon"
                          value={selectedComponent.props?.icon || ''}
                          onChange={(val) => updateComponentProp(selectedComponent.id, 'icon', val)}
                        />
                      )}

                      {/* Variant selector */}
                      {'variant' in (selectedComponent.props || {}) && (
                        <div>
                          <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Variant</label>
                          <select
                            value={selectedComponent.props?.variant || 'default'}
                            onChange={(e) => updateComponentProp(selectedComponent.id, 'variant', e.target.value)}
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white"
                          >
                            <option value="default">Default</option>
                            <option value="outline">Outline</option>
                            <option value="secondary">Secondary</option>
                            <option value="ghost">Ghost</option>
                            <option value="destructive">Destructive</option>
                            <option value="link">Link</option>
                            <option value="h1">H1 Heading</option>
                            <option value="h2">H2 Heading</option>
                            <option value="h3">H3 Heading</option>
                            <option value="h4">H4 Heading</option>
                            <option value="p">Paragraph</option>
                            <option value="lead">Lead</option>
                            <option value="muted">Muted</option>
                          </select>
                        </div>
                      )}

                      {/* Nested Children Stack Manager for Card */}
                      {selectedComponent.type === 'Card' && (
                        <div className="pt-3 border-t border-slate-200 dark:border-neutral-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800 dark:text-neutral-200 text-xs">
                              Card Inner Stack ({selectedComponent.children?.length || 0})
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            {(selectedComponent.children || []).map((child, idx) => (
                              <div
                                key={child.id}
                                className="flex items-center justify-between p-2 rounded-md bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 group hover:border-blue-400 transition-colors"
                              >
                                <button
                                  type="button"
                                  onClick={() => setSelectedComponentId(child.id)}
                                  className="flex items-center gap-2 text-left truncate flex-1 hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                  <Badge variant="neutral" className="text-[10px] py-0 px-1.5 bg-white dark:bg-neutral-800 font-mono">
                                    {child.type}
                                  </Badge>
                                  <span className="text-[11px] text-slate-600 dark:text-neutral-300 truncate">
                                    {child.props?.text || child.props?.label || child.props?.title || child.type}
                                  </span>
                                </button>

                                <div className="flex items-center gap-0.5 shrink-0">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => moveChildComponent(selectedComponent.id, idx, idx - 1)}
                                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20 hover:bg-slate-200 dark:hover:bg-neutral-800"
                                    title="Move Up"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === (selectedComponent.children || []).length - 1}
                                    onClick={() => moveChildComponent(selectedComponent.id, idx, idx + 1)}
                                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20 hover:bg-slate-200 dark:hover:bg-neutral-800"
                                    title="Move Down"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteComponentFromContainer(child.id)}
                                    className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                    title="Delete Element"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}

                            {(!selectedComponent.children || selectedComponent.children.length === 0) && (
                              <div className="p-3 text-center border border-dashed border-slate-200 dark:border-neutral-800 rounded-md text-[11px] text-slate-400">
                                Card stack is empty. Add elements below.
                              </div>
                            )}
                          </div>

                          <div className="pt-2">
                            <label className="block text-[11px] text-slate-500 dark:text-neutral-400 mb-1.5 font-medium">
                              Add element to Card:
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                              {[
                                { type: 'Label' as const, label: '+ Label', props: { text: 'New Label' } },
                                { type: 'Button' as const, label: '+ Button', props: { text: 'New Button', variant: 'default' } },
                                { type: 'Typography' as const, label: '+ Heading', props: { variant: 'h4', text: 'New Heading' } },
                                { type: 'Input' as const, label: '+ Input', props: { placeholder: 'Enter text...' } },
                                { type: 'Badge' as const, label: '+ Badge', props: { text: 'New Badge', variant: 'secondary' } },
                                { type: 'Separator' as const, label: '+ Divider', props: { orientation: 'horizontal' } },
                              ].map((item) => (
                                <button
                                  key={item.type}
                                  type="button"
                                  onClick={() => addChildComponentToParent(selectedComponent.id, item.type, item.props)}
                                  className="px-2 py-1.5 text-[11px] font-medium rounded border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-400 text-slate-700 dark:text-neutral-300 transition-colors text-left"
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 text-[11px] text-slate-500 dark:text-neutral-400">
                        Component ID: <span className="font-mono text-slate-700 dark:text-neutral-300">{selectedComponent.id}</span>
                      </div>
                    </div>
                  )}
                </aside>
              ) : activeBlock ? (
                <aside className="w-80 border-l border-slate-200 dark:border-neutral-900 bg-white dark:bg-[#08090c] p-4 overflow-y-auto h-full sticky top-0 shrink-0 z-30 space-y-4 hidden lg:block select-none">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-neutral-900">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                        Inspector
                      </div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white capitalize mt-0.5 flex items-center gap-1.5">
                        <span>
                          {activeBlock.content?.alexSection
                            ? `Alex Travis • ${activeBlock.content.alexSection}`
                            : activeBlock.type === 'CONTAINER'
                              ? 'Flex / Grid Section'
                              : activeBlock.type.replace(/_/g, ' ')}
                        </span>
                        {(activeBlock as any).isMasterInstance && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            ❖ Symbol
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {(activeBlock as any).isMasterInstance ? (
                        <button
                          type="button"
                          onClick={() => handleDetachBlockInstance(activeBlock.id)}
                          className="px-2 py-1 text-[10px] font-medium rounded border border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Detach section from Master Symbol to make independent"
                        >
                          <Unlink className="w-3 h-3" />
                          Detach
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setCreateMasterTarget({
                              type: 'block',
                              target: activeBlock,
                              name: activeBlock.content?.label || activeBlock.type.replace(/_/g, ' '),
                            });
                            setIsCreateMasterModalOpen(true);
                          }}
                          className="px-2 py-1 text-[10px] font-medium rounded border border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Save section as Master Component / Symbol"
                        >
                          <ComponentIcon className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          Make Symbol
                        </button>
                      )}

                      {/* Inspector Mode Switcher */}
                      <div className="flex bg-slate-100 dark:bg-neutral-900 p-0.5 rounded-md border border-slate-200 dark:border-neutral-800">
                        <button
                          onClick={() => setInspectorTab('layout')}
                          className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${inspectorTab === 'layout'
                            ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200'
                            }`}
                        >
                          Layout
                        </button>
                        <button
                          onClick={() => setInspectorTab('content')}
                          className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${inspectorTab === 'content'
                            ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200'
                            }`}
                        >
                          Content
                        </button>
                        <button
                          onClick={() => setInspectorTab('styles')}
                          className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${inspectorTab === 'styles'
                            ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200'
                            }`}
                        >
                          Styles
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowRightSidebar(false)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors ml-0.5"
                        title="Hide Inspector Sidebar"
                      >
                        <PanelRightClose className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Linked Master Symbol Section Banner */}
                  {(activeBlock as any).isMasterInstance && (
                    <div className="p-2.5 rounded-lg bg-linear-to-r from-purple-500/10 to-indigo-500/10 border border-purple-200 dark:border-purple-900/50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-purple-800 dark:text-purple-300">
                        <ComponentIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-semibold text-[11px]">Linked Master Symbol Section</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDetachBlockInstance(activeBlock.id)}
                        className="text-[10px] text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5 cursor-pointer font-medium"
                      >
                        <Unlink className="w-3 h-3" />
                        Detach (Unlink)
                      </button>
                    </div>
                  )}

                  {/* =================================================== */}
                  {/* 1. LAYOUT TAB (RESPONSIVE FLEX / GRID SETTINGS)     */}
                  {/* =================================================== */}
                  {inspectorTab === 'layout' && (() => {
                    const blockLayout = (activeBlock as any).layout || {};
                    const blockStyles = (activeBlock as any).styles || {};
                    const isTabletView = viewport === 'tablet';
                    const isMobileView = viewport === 'mobile';

                    const effectiveLayout = isMobileView
                      ? { ...blockLayout, ...(blockLayout.tablet || {}), ...(blockLayout.mobile || {}) }
                      : isTabletView
                        ? { ...blockLayout, ...(blockLayout.tablet || {}) }
                        : blockLayout;

                    const effectiveStyles = isMobileView
                      ? { ...blockStyles, ...(blockStyles.tablet || {}), ...(blockStyles.mobile || {}) }
                      : isTabletView
                        ? { ...blockStyles, ...(blockStyles.tablet || {}) }
                        : blockStyles;

                    const hasTabletOverride = Boolean(blockLayout.tablet && Object.keys(blockLayout.tablet).length > 0);
                    const hasMobileOverride = Boolean(blockLayout.mobile && Object.keys(blockLayout.mobile).length > 0);
                    const isOverrideActive = isMobileView ? hasMobileOverride : isTabletView ? hasTabletOverride : false;

                    return (
                      <div className="space-y-4 text-xs">
                        {/* Responsive Device Switcher Header */}
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-semibold text-slate-700 dark:text-neutral-200">Responsive Layout:</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                                {viewport}
                              </span>
                            </div>
                            {isOverrideActive && (
                              <button
                                type="button"
                                onClick={() => resetContainerLayoutBreakpoint(viewport as 'tablet' | 'mobile')}
                                className="text-[10px] text-amber-600 hover:text-amber-700 dark:text-amber-400 hover:underline font-medium"
                                title="Reset custom overrides for this device"
                              >
                                Reset to {isMobileView && hasTabletOverride ? 'Tablet' : 'Desktop'}
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-1 bg-slate-200/70 dark:bg-neutral-950 p-1 rounded-lg">
                            <button
                              type="button"
                              onClick={() => setViewport('desktop')}
                              className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 text-[11px] font-medium transition-all ${viewport === 'desktop'
                                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                              <Monitor className="w-3.5 h-3.5" />
                              <span>Desktop</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setViewport('tablet')}
                              className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 text-[11px] font-medium transition-all ${viewport === 'tablet'
                                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                              <Tablet className="w-3.5 h-3.5" />
                              <span>Tablet</span>
                              {hasTabletOverride && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Custom tablet layout" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => setViewport('mobile')}
                              className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 text-[11px] font-medium transition-all ${viewport === 'mobile'
                                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                              <Smartphone className="w-3.5 h-3.5" />
                              <span>Mobile</span>
                              {hasMobileOverride && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Custom mobile layout" />}
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-neutral-400 leading-tight">
                            {viewport === 'desktop'
                              ? 'Base layout: applies to all screen sizes unless overridden.'
                              : viewport === 'tablet'
                                ? hasTabletOverride
                                  ? '✓ Custom layout active for Tablet (768px).'
                                  : 'Inheriting from Desktop. Modify below to override for Tablet.'
                                : hasMobileOverride
                                  ? '✓ Custom layout active for Mobile (375px).'
                                  : 'Inheriting from Tablet / Desktop. Modify below to override for Mobile.'}
                          </p>
                        </div>

                        {/* Enhanced Flexbox & CSS Grid Visual Controls */}
                        <EnhancedFlexGridControls
                          layout={effectiveLayout}
                          viewport={viewport}
                          onChange={(field, val) => updateContainerLayout(field, val, viewport)}
                          onResetBreakpoint={resetContainerLayoutBreakpoint}
                        />

                        {/* Section Spacing (Padding & Margin) */}
                        <div className="pt-2 border-t border-slate-200 dark:border-neutral-900 space-y-3">
                          {/* Internal Padding */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-slate-700 dark:text-neutral-300 font-medium">Internal Padding ({viewport})</label>
                              {effectiveStyles.padding && (
                                <button
                                  type="button"
                                  onClick={() => updateActiveStyle('padding', undefined, viewport)}
                                  className="text-[10px] text-blue-500 hover:underline"
                                >
                                  Default
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-4 gap-1">
                              {[
                                { id: 'none', label: '0px' },
                                { id: 'xs', label: '8px' },
                                { id: 'sm', label: '16px' },
                                { id: 'md', label: '32px' },
                                { id: 'lg', label: '48px' },
                                { id: 'xl', label: '64px' },
                                { id: '2xl', label: '96px' },
                              ].map((p) => {
                                const active = effectiveStyles.padding === p.id;
                                return (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => updateActiveStyle('padding', p.id, viewport)}
                                    className={`py-1 text-[11px] rounded-lg border text-center font-medium transition-colors ${active
                                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-white font-semibold'
                                      : 'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400'
                                      }`}
                                  >
                                    {p.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Outer Margin */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-slate-700 dark:text-neutral-300 font-medium">Outer Margin ({viewport})</label>
                              {effectiveStyles.margin && (
                                <button
                                  type="button"
                                  onClick={() => updateActiveStyle('margin', undefined, viewport)}
                                  className="text-[10px] text-blue-500 hover:underline"
                                >
                                  Default
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-4 gap-1">
                              {[
                                { id: 'none', label: '0px' },
                                { id: 'xs', label: '4px' },
                                { id: 'sm', label: '8px' },
                                { id: 'md', label: '16px' },
                                { id: 'lg', label: '24px' },
                                { id: 'xl', label: '40px' },
                              ].map((m) => {
                                const active = (effectiveStyles.margin || 'none') === m.id;
                                return (
                                  <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => updateActiveStyle('margin', m.id, viewport)}
                                    className={`py-1 text-[11px] rounded-lg border text-center font-medium transition-colors ${active
                                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-white font-semibold'
                                      : 'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400'
                                      }`}
                                  >
                                    {m.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Section Width & Position */}
                        <div className="pt-2 border-t border-slate-200 dark:border-neutral-900 space-y-3">
                          <div>
                            <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1.5">Section Width ({viewport})</label>
                            <div className="grid grid-cols-4 gap-1">
                              {[
                                { id: 'boxed', label: 'Boxed' },
                                { id: 'compact', label: 'Compact' },
                                { id: 'narrow', label: 'Narrow' },
                                { id: 'full', label: 'Full' },
                              ].map((w) => (
                                <button
                                  key={w.id}
                                  type="button"
                                  onClick={() => updateContainerLayout('maxWidth', w.id, viewport)}
                                  className={`py-1.5 rounded-lg border text-center font-medium transition-colors ${(effectiveLayout.maxWidth || 'boxed') === w.id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-white font-semibold'
                                    : 'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400'
                                    }`}
                                >
                                  {w.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1.5">Content Position ({viewport})</label>
                            <div className="grid grid-cols-3 gap-1">
                              {[
                                { id: 'left', label: 'Left' },
                                { id: 'center', label: 'Center' },
                                { id: 'right', label: 'Right' },
                              ].map((pos) => (
                                <button
                                  key={pos.id}
                                  type="button"
                                  onClick={() => updateContainerLayout('contentPosition', pos.id, viewport)}
                                  className={`py-1.5 rounded-lg border text-center font-medium transition-colors ${(effectiveLayout.contentPosition || 'center') === pos.id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-white font-semibold'
                                    : 'border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400'
                                    }`}
                                >
                                  {pos.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Column management (for nested container widgets) */}
                        {activeBlock.type === 'CONTAINER' && (
                          <div className="pt-3 border-t border-slate-200 dark:border-neutral-900 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-800 dark:text-neutral-200">Columns ({(activeBlock as any).columnsContent?.length || 2})</span>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={addColumnToContainer}
                                className="h-7 text-[11px]"
                              >
                                + Add Column
                              </Button>
                            </div>

                            <div className="space-y-1.5">
                              {((activeBlock as any).columnsContent || []).map((col: any, idx: number) => (
                                <div
                                  key={col.id || idx}
                                  className="flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-neutral-800/80 bg-slate-50/80 dark:bg-neutral-900/60 text-[11px]"
                                >
                                  <span className="text-slate-700 dark:text-neutral-300 font-medium">Column {idx + 1} ({col.components?.length || 0} items)</span>
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setTargetColumnIndex(idx);
                                        setSidebarTab('shadcn');
                                      }}
                                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
                                    >
                                      + Widget
                                    </button>
                                    {((activeBlock as any).columnsContent?.length || 0) > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeColumnFromContainer(idx)}
                                        className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 ml-1.5"
                                      >
                                        Delete
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* =================================================== */}
                  {/* 2. CONTENT TAB                                      */}
                  {/* =================================================== */}
                  {inspectorTab === 'content' && (
                    <div className="space-y-4 text-xs">
                      {/* Alex Travis Bespoke Section Content Inspector */}
                      {activeBlock.content?.alexSection ? (
                        <div className="space-y-4 text-left">
                          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                            Editing <strong className="uppercase">{activeBlock.content.alexSection}</strong> section from Alex Travis design template.
                            <div className="text-[10px] text-slate-500 dark:text-neutral-400 mt-0.5">
                              Tip: You can also click directly on texts in the canvas to edit them inline!
                            </div>
                          </div>

                          {/* 1. NAVBAR */}
                          {activeBlock.content.alexSection === 'navbar' && (
                            <>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Brand Name</label>
                                <Input
                                  value={activeBlock.content.brandName || ''}
                                  onChange={(e) => updateActiveContent('brandName', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Logo Initials (Yellow Badge)</label>
                                <Input
                                  value={activeBlock.content.logoInitials || ''}
                                  onChange={(e) => updateActiveContent('logoInitials', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">CTA Button Text</label>
                                <Input
                                  value={activeBlock.content.ctaText || ''}
                                  onChange={(e) => updateActiveContent('ctaText', e.target.value)}
                                />
                              </div>
                              <TemplateColorPicker
                                label="CTA Button Background Color"
                                value={activeBlock.content.ctaBgColor || ''}
                                onChange={(val) => updateActiveContent('ctaBgColor', val)}
                              />
                              <TemplateColorPicker
                                label="CTA Button Text Color"
                                value={activeBlock.content.ctaTextColor || ''}
                                onChange={(val) => updateActiveContent('ctaTextColor', val)}
                                defaultPlaceholder="#ffffff"
                              />

                              {/* Cart / Action Icon & Badge */}
                              <div className="p-3 rounded-lg border border-slate-200 dark:border-neutral-800 space-y-2.5">
                                <div className="text-[11px] font-bold text-slate-700 dark:text-neutral-200">Cart / Action Button</div>
                                <IconPicker
                                  label="Icon"
                                  value={activeBlock.content.actionIcon || 'ShoppingCart'}
                                  onChange={(val) => updateActiveContent('actionIcon', val)}
                                />
                                <div>
                                  <label className="block text-[11px] text-slate-600 dark:text-neutral-400 mb-1">Badge Count</label>
                                  <Input
                                    value={activeBlock.content.cartBadgeCount ?? '0'}
                                    onChange={(e) => updateActiveContent('cartBadgeCount', e.target.value)}
                                    placeholder="e.g. 0 or 3"
                                  />
                                </div>
                              </div>

                              {/* Nav Menu Links Manager */}
                              <div className="p-3 rounded-lg border border-slate-200 dark:border-neutral-800 space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <div className="text-[11px] font-bold text-slate-700 dark:text-neutral-200">Menu Navigation Links</div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    type="button"
                                    onClick={() => {
                                      const current = activeBlock.content.navLinks || [
                                        { label: 'About', href: '#about' },
                                        { label: 'Project', href: '#projects' },
                                        { label: 'Pricing', href: '#pricing' },
                                        { label: 'Store', href: '#store' },
                                      ];
                                      updateActiveContent('navLinks', [...current, { label: 'New Link', href: '#' }]);
                                    }}
                                    className="h-6 px-2 text-[10px] text-blue-600 hover:text-blue-700"
                                  >
                                    <Plus className="w-3 h-3 mr-1" /> Add Link
                                  </Button>
                                </div>

                                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                  {(activeBlock.content.navLinks || [
                                    { label: 'About', href: '#about' },
                                    { label: 'Project', href: '#projects' },
                                    { label: 'Pricing', href: '#pricing' },
                                    { label: 'Store', href: '#store' },
                                  ]).map((link: any, li: number) => (
                                    <div key={li} className="p-2 rounded border border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/60 space-y-1.5">
                                      <div className="flex items-center gap-1.5">
                                        <Input
                                          value={link.label || ''}
                                          onChange={(e) => {
                                            const current = [
                                              ...(activeBlock.content.navLinks || [
                                                { label: 'About', href: '#about' },
                                                { label: 'Project', href: '#projects' },
                                                { label: 'Pricing', href: '#pricing' },
                                                { label: 'Store', href: '#store' },
                                              ]),
                                            ];
                                            current[li] = { ...current[li], label: e.target.value };
                                            updateActiveContent('navLinks', current);
                                          }}
                                          placeholder="Label"
                                          className="h-7 text-xs flex-1"
                                        />
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          type="button"
                                          onClick={() => {
                                            const current = [
                                              ...(activeBlock.content.navLinks || [
                                                { label: 'About', href: '#about' },
                                                { label: 'Project', href: '#projects' },
                                                { label: 'Pricing', href: '#pricing' },
                                                { label: 'Store', href: '#store' },
                                              ]),
                                            ];
                                            current.splice(li, 1);
                                            updateActiveContent('navLinks', current);
                                          }}
                                          className="h-7 w-7 p-0 text-slate-400 hover:text-red-500"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                      <Input
                                        value={link.href || ''}
                                        onChange={(e) => {
                                          const current = [
                                            ...(activeBlock.content.navLinks || [
                                              { label: 'About', href: '#about' },
                                              { label: 'Project', href: '#projects' },
                                              { label: 'Pricing', href: '#pricing' },
                                              { label: 'Store', href: '#store' },
                                            ]),
                                          ];
                                          current[li] = { ...current[li], href: e.target.value };
                                          updateActiveContent('navLinks', current);
                                        }}
                                        placeholder="Href (e.g. #about)"
                                        className="h-6 text-[11px] font-mono"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Pages Dropdown Links Manager */}
                              <div className="p-3 rounded-lg border border-slate-200 dark:border-neutral-800 space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <div className="text-[11px] font-bold text-slate-700 dark:text-neutral-200">Pages Dropdown Menu Items</div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    type="button"
                                    onClick={() => {
                                      const current = activeBlock.content.pagesLinks || [
                                        { label: 'Services', href: '#services' },
                                        { label: 'Reviews', href: '#testimonials' },
                                        { label: 'FAQ', href: '#faq' },
                                      ];
                                      updateActiveContent('pagesLinks', [...current, { label: 'New Item', href: '#' }]);
                                    }}
                                    className="h-6 px-2 text-[10px] text-blue-600 hover:text-blue-700"
                                  >
                                    <Plus className="w-3 h-3 mr-1" /> Add Item
                                  </Button>
                                </div>

                                <div>
                                  <label className="block text-[11px] text-slate-600 dark:text-neutral-400 mb-1">Dropdown Trigger Label</label>
                                  <Input
                                    value={activeBlock.content.dropdownLabel || 'Pages'}
                                    onChange={(e) => updateActiveContent('dropdownLabel', e.target.value)}
                                    placeholder="e.g. Pages"
                                    className="h-7 text-xs"
                                  />
                                </div>

                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                  {(activeBlock.content.pagesLinks || [
                                    { label: 'Services', href: '#services' },
                                    { label: 'Reviews', href: '#testimonials' },
                                    { label: 'FAQ', href: '#faq' },
                                  ]).map((pLink: any, pi: number) => (
                                    <div key={pi} className="p-2 rounded border border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/60 space-y-1.5">
                                      <div className="flex items-center gap-1.5">
                                        <Input
                                          value={pLink.label || ''}
                                          onChange={(e) => {
                                            const current = [
                                              ...(activeBlock.content.pagesLinks || [
                                                { label: 'Services', href: '#services' },
                                                { label: 'Reviews', href: '#testimonials' },
                                                { label: 'FAQ', href: '#faq' },
                                              ]),
                                            ];
                                            current[pi] = { ...current[pi], label: e.target.value };
                                            updateActiveContent('pagesLinks', current);
                                          }}
                                          placeholder="Label"
                                          className="h-7 text-xs flex-1"
                                        />
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          type="button"
                                          onClick={() => {
                                            const current = [
                                              ...(activeBlock.content.pagesLinks || [
                                                { label: 'Services', href: '#services' },
                                                { label: 'Reviews', href: '#testimonials' },
                                                { label: 'FAQ', href: '#faq' },
                                              ]),
                                            ];
                                            current.splice(pi, 1);
                                            updateActiveContent('pagesLinks', current);
                                          }}
                                          className="h-7 w-7 p-0 text-slate-400 hover:text-red-500"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                      <Input
                                        value={pLink.href || ''}
                                        onChange={(e) => {
                                          const current = [
                                            ...(activeBlock.content.pagesLinks || [
                                              { label: 'Services', href: '#services' },
                                              { label: 'Reviews', href: '#testimonials' },
                                              { label: 'FAQ', href: '#faq' },
                                            ]),
                                          ];
                                          current[pi] = { ...current[pi], href: e.target.value };
                                          updateActiveContent('pagesLinks', current);
                                        }}
                                        placeholder="Href (e.g. #services)"
                                        className="h-6 text-[11px] font-mono"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}

                          {/* 2. HERO */}
                          {activeBlock.content.alexSection === 'hero' && (
                            <>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Badge Pill Text</label>
                                <Input
                                  value={activeBlock.content.badgeText || ''}
                                  onChange={(e) => updateActiveContent('badgeText', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Headline (Dark Part)</label>
                                <Input
                                  value={activeBlock.content.headlineDark || activeBlock.content.headline || ''}
                                  onChange={(e) => updateActiveContent('headlineDark', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Headline (Gray Muted Part)</label>
                                <Input
                                  value={activeBlock.content.headlineMuted || ''}
                                  onChange={(e) => updateActiveContent('headlineMuted', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Subheadline</label>
                                <textarea
                                  value={activeBlock.content.subheadline || ''}
                                  onChange={(e) => updateActiveContent('subheadline', e.target.value)}
                                  rows={3}
                                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white"
                                />
                              </div>
                              <div className="p-3 rounded-lg border border-slate-200 dark:border-neutral-800 space-y-2">
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium">Primary CTA Button</label>
                                <Input
                                  value={activeBlock.content.primaryCta || ''}
                                  onChange={(e) => updateActiveContent('primaryCta', e.target.value)}
                                  placeholder="Button Text (e.g. Hire Me!)"
                                />
                                <TemplateColorPicker
                                  label="Primary Button Background Color"
                                  value={activeBlock.content.primaryCtaBg || ''}
                                  onChange={(val) => updateActiveContent('primaryCtaBg', val)}
                                />
                                <TemplateColorPicker
                                  label="Primary Button Text Color"
                                  value={activeBlock.content.primaryCtaColor || ''}
                                  onChange={(val) => updateActiveContent('primaryCtaColor', val)}
                                  defaultPlaceholder="#ffffff"
                                />
                              </div>
                              <div className="p-3 rounded-lg border border-slate-200 dark:border-neutral-800 space-y-2">
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium">Secondary CTA Button</label>
                                <Input
                                  value={activeBlock.content.secondaryCta || ''}
                                  onChange={(e) => updateActiveContent('secondaryCta', e.target.value)}
                                  placeholder="Button Text (e.g. See My Portfolio)"
                                />
                                <TemplateColorPicker
                                  label="Secondary Button Background Color"
                                  value={activeBlock.content.secondaryCtaBg || ''}
                                  onChange={(val) => updateActiveContent('secondaryCtaBg', val)}
                                  defaultPlaceholder="transparent or #ffffff"
                                />
                                <TemplateColorPicker
                                  label="Secondary Button Text Color"
                                  value={activeBlock.content.secondaryCtaColor || ''}
                                  onChange={(val) => updateActiveContent('secondaryCtaColor', val)}
                                  defaultPlaceholder="#111111"
                                />
                                <TemplateColorPicker
                                  label="Secondary Button Border Color"
                                  value={activeBlock.content.secondaryCtaBorder || ''}
                                  onChange={(val) => updateActiveContent('secondaryCtaBorder', val)}
                                  defaultPlaceholder="#ececec"
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Designer Name</label>
                                <Input
                                  value={activeBlock.content.designerName || ''}
                                  onChange={(e) => updateActiveContent('designerName', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Designer Title</label>
                                <Input
                                  value={activeBlock.content.designerTitle || ''}
                                  onChange={(e) => updateActiveContent('designerTitle', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Location Badge</label>
                                <Input
                                  value={activeBlock.content.designerLocation || ''}
                                  onChange={(e) => updateActiveContent('designerLocation', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Rating Text</label>
                                <Input
                                  value={activeBlock.content.rating || ''}
                                  onChange={(e) => updateActiveContent('rating', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Top Badge Pill</label>
                                <Input
                                  value={activeBlock.content.topBadge || ''}
                                  onChange={(e) => updateActiveContent('topBadge', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Growth ROI Pill</label>
                                <Input
                                  value={activeBlock.content.roiGrowth || ''}
                                  onChange={(e) => updateActiveContent('roiGrowth', e.target.value)}
                                />
                              </div>
                              <ImageSourcePicker
                                label="Profile Photo (Hero)"
                                value={activeBlock.content.avatarUrl || ''}
                                onChange={(val) => updateActiveContent('avatarUrl', val)}
                                placeholder="Enter photo URL or choose file from device..."
                              />
                            </>
                          )}

                          {/* 3. STATS */}
                          {activeBlock.content.alexSection === 'stats' && (
                            <div className="space-y-3">
                              {(activeBlock.content.stats || []).map((st: any, i: number) => (
                                <div key={i} className="p-2.5 rounded-lg border border-slate-200 dark:border-neutral-800 space-y-2">
                                  <div className="text-[11px] font-bold text-slate-500">Stat {i + 1}</div>
                                  <div>
                                    <label className="block text-[10px] text-slate-600 dark:text-neutral-400">Value (e.g. 99%)</label>
                                    <Input
                                      value={st.value || ''}
                                      onChange={(e) => {
                                        const newStats = [...(activeBlock.content.stats || [])];
                                        newStats[i] = { ...newStats[i], value: e.target.value };
                                        updateActiveContent('stats', newStats);
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-slate-600 dark:text-neutral-400">Label</label>
                                    <Input
                                      value={st.label || ''}
                                      onChange={(e) => {
                                        const newStats = [...(activeBlock.content.stats || [])];
                                        newStats[i] = { ...newStats[i], label: e.target.value };
                                        updateActiveContent('stats', newStats);
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 4. PERFORMANCE / ABOUT */}
                          {activeBlock.content.alexSection === 'performance' && (
                            <>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Performance Score (e.g. 98%)</label>
                                <Input
                                  value={activeBlock.content.score || ''}
                                  onChange={(e) => updateActiveContent('score', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Score Label</label>
                                <Input
                                  value={activeBlock.content.scoreLabel || ''}
                                  onChange={(e) => updateActiveContent('scoreLabel', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Headline (Dark Part)</label>
                                <Input
                                  value={activeBlock.content.headlineDark || ''}
                                  onChange={(e) => updateActiveContent('headlineDark', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Headline (Gray Muted Part)</label>
                                <Input
                                  value={activeBlock.content.headlineMuted || ''}
                                  onChange={(e) => updateActiveContent('headlineMuted', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Paragraph 1</label>
                                <textarea
                                  value={activeBlock.content.desc1 || ''}
                                  onChange={(e) => updateActiveContent('desc1', e.target.value)}
                                  rows={3}
                                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Paragraph 2</label>
                                <textarea
                                  value={activeBlock.content.desc2 || ''}
                                  onChange={(e) => updateActiveContent('desc2', e.target.value)}
                                  rows={3}
                                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">CTA Button Text</label>
                                <Input
                                  value={activeBlock.content.ctaText || ''}
                                  onChange={(e) => updateActiveContent('ctaText', e.target.value)}
                                />
                              </div>
                              <TemplateColorPicker
                                label="CTA Button Background Color"
                                value={activeBlock.content.ctaBgColor || ''}
                                onChange={(val) => updateActiveContent('ctaBgColor', val)}
                                defaultPlaceholder="#d9ff1a"
                              />
                              <TemplateColorPicker
                                label="CTA Button Text Color"
                                value={activeBlock.content.ctaTextColor || ''}
                                onChange={(val) => updateActiveContent('ctaTextColor', val)}
                                defaultPlaceholder="#111111"
                              />
                            </>
                          )}

                          {/* 5. TOOLS ROW (Trust) */}
                          {activeBlock.content.alexSection === 'trust' && (
                            <div className="space-y-3">
                              <div className="text-[11px] font-bold text-slate-700 dark:text-neutral-300">Tools & Proficiency</div>
                              {(activeBlock.content.tools || []).map((tool: any, i: number) => (
                                <div key={i} className="p-2.5 rounded-lg border border-slate-200 dark:border-neutral-800 space-y-2">
                                  <div>
                                    <label className="block text-[10px] text-slate-600 dark:text-neutral-400">Tool Name</label>
                                    <Input
                                      value={tool.name || ''}
                                      onChange={(e) => {
                                        const newTools = [...(activeBlock.content.tools || [])];
                                        newTools[i] = { ...newTools[i], name: e.target.value };
                                        updateActiveContent('tools', newTools);
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-slate-600 dark:text-neutral-400">Percentage (e.g. 46%)</label>
                                    <Input
                                      value={tool.percentage || ''}
                                      onChange={(e) => {
                                        const newTools = [...(activeBlock.content.tools || [])];
                                        newTools[i] = { ...newTools[i], percentage: e.target.value };
                                        updateActiveContent('tools', newTools);
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 6. SERVICES */}
                          {activeBlock.content.alexSection === 'services' && (
                            <>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Headline (Dark Part)</label>
                                <Input
                                  value={activeBlock.content.headlineDark || ''}
                                  onChange={(e) => updateActiveContent('headlineDark', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Headline (Muted Part)</label>
                                <Input
                                  value={activeBlock.content.headlineMuted || ''}
                                  onChange={(e) => updateActiveContent('headlineMuted', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Intro Description</label>
                                <textarea
                                  rows={2}
                                  value={activeBlock.content.intro || ''}
                                  onChange={(e) => updateActiveContent('intro', e.target.value)}
                                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white"
                                />
                              </div>
                              <div className="space-y-3 pt-2">
                                {(activeBlock.content.services || []).map((srv: any, i: number) => (
                                  <div key={i} className="p-2.5 rounded-lg border border-slate-200 dark:border-neutral-800 space-y-2">
                                    <div className="text-[11px] font-bold text-slate-500">Service {srv.number || `01.${i + 1}`}</div>
                                    <Input
                                      placeholder="Number"
                                      value={srv.number || ''}
                                      onChange={(e) => {
                                        const newSrv = [...(activeBlock.content.services || [])];
                                        newSrv[i] = { ...newSrv[i], number: e.target.value };
                                        updateActiveContent('services', newSrv);
                                      }}
                                    />
                                    <Input
                                      placeholder="Title"
                                      value={srv.title || ''}
                                      onChange={(e) => {
                                        const newSrv = [...(activeBlock.content.services || [])];
                                        newSrv[i] = { ...newSrv[i], title: e.target.value };
                                        updateActiveContent('services', newSrv);
                                      }}
                                    />
                                    <textarea
                                      rows={2}
                                      placeholder="Description"
                                      value={srv.desc || ''}
                                      onChange={(e) => {
                                        const newSrv = [...(activeBlock.content.services || [])];
                                        newSrv[i] = { ...newSrv[i], desc: e.target.value };
                                        updateActiveContent('services', newSrv);
                                      }}
                                      className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white"
                                    />
                                  </div>
                                ))}
                              </div>
                              <div className="p-3 rounded-lg border border-slate-200 dark:border-neutral-800 space-y-2 mt-2">
                                <div className="text-[11px] font-bold text-slate-700 dark:text-neutral-200">Featured Card (Right)</div>
                                <Input
                                  placeholder="Card Title"
                                  value={activeBlock.content.cardTitle || ''}
                                  onChange={(e) => updateActiveContent('cardTitle', e.target.value)}
                                />
                                <Input
                                  placeholder="Card Badge (e.g. Figma)"
                                  value={activeBlock.content.cardBadge || ''}
                                  onChange={(e) => updateActiveContent('cardBadge', e.target.value)}
                                />
                                <textarea
                                  rows={2}
                                  placeholder="Card Subtitle"
                                  value={activeBlock.content.cardSubtitle || ''}
                                  onChange={(e) => updateActiveContent('cardSubtitle', e.target.value)}
                                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white"
                                />
                                <div>
                                  <label className="block text-[11px] text-slate-600 dark:text-neutral-400 mb-1">Card CTA Button</label>
                                  <Input
                                    placeholder="CTA Text"
                                    value={activeBlock.content.cardCta || ''}
                                    onChange={(e) => updateActiveContent('cardCta', e.target.value)}
                                  />
                                </div>
                                <TemplateColorPicker
                                  label="Button Background Color"
                                  value={activeBlock.content.cardCtaBg || ''}
                                  onChange={(val) => updateActiveContent('cardCtaBg', val)}
                                />
                                <TemplateColorPicker
                                  label="Button Text Color"
                                  value={activeBlock.content.cardCtaColor || ''}
                                  onChange={(val) => updateActiveContent('cardCtaColor', val)}
                                  defaultPlaceholder="#ffffff"
                                />

                                {/* Feature Card Checklist Items */}
                                <div className="pt-2 border-t border-slate-200 dark:border-neutral-800 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="text-[11px] font-bold text-slate-700 dark:text-neutral-200">Card Features Checklist</div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      type="button"
                                      onClick={() => {
                                        const current = activeBlock.content.cardFeatures || [
                                          'User Flow Mapping',
                                          'Interactive Prototyping',
                                          'Cross-platform UI',
                                          'Token-based Handoff',
                                        ];
                                        updateActiveContent('cardFeatures', [...current, 'New Feature Item']);
                                      }}
                                      className="h-6 px-2 text-[10px] text-blue-600 hover:text-blue-700"
                                    >
                                      <Plus className="w-3 h-3 mr-1" /> Add
                                    </Button>
                                  </div>

                                  <IconPicker
                                    label="Bullet Icon"
                                    value={activeBlock.content.cardFeatureIcon || 'Check'}
                                    onChange={(val) => updateActiveContent('cardFeatureIcon', val)}
                                  />

                                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                    {(activeBlock.content.cardFeatures || [
                                      'User Flow Mapping',
                                      'Interactive Prototyping',
                                      'Cross-platform UI',
                                      'Token-based Handoff',
                                    ]).map((feat: string, fi: number) => (
                                      <div key={fi} className="flex items-center gap-1.5">
                                        <Input
                                          value={feat}
                                          onChange={(e) => {
                                            const current = [
                                              ...(activeBlock.content.cardFeatures || [
                                                'User Flow Mapping',
                                                'Interactive Prototyping',
                                                'Cross-platform UI',
                                                'Token-based Handoff',
                                              ]),
                                            ];
                                            current[fi] = e.target.value;
                                            updateActiveContent('cardFeatures', current);
                                          }}
                                          className="h-7 text-xs flex-1"
                                          placeholder={`Feature ${fi + 1}`}
                                        />
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          type="button"
                                          onClick={() => {
                                            const current = [
                                              ...(activeBlock.content.cardFeatures || [
                                                'User Flow Mapping',
                                                'Interactive Prototyping',
                                                'Cross-platform UI',
                                                'Token-based Handoff',
                                              ]),
                                            ];
                                            current.splice(fi, 1);
                                            updateActiveContent('cardFeatures', current);
                                          }}
                                          className="h-7 w-7 p-0 text-slate-400 hover:text-red-500"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}

                          {/* 7. TRUST BAR (Process) */}
                          {activeBlock.content.alexSection === 'process' && (
                            <>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Social Proof Title</label>
                                <Input
                                  value={activeBlock.content.proofTitle || ''}
                                  onChange={(e) => updateActiveContent('proofTitle', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Rating Line</label>
                                <Input
                                  value={activeBlock.content.proofRating || ''}
                                  onChange={(e) => updateActiveContent('proofRating', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Logos (Comma separated)</label>
                                <Input
                                  value={(activeBlock.content.logos || []).join(', ')}
                                  onChange={(e) => {
                                    const arr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                                    updateActiveContent('logos', arr);
                                  }}
                                />
                              </div>
                            </>
                          )}

                          {/* 8. PORTFOLIO */}
                          {activeBlock.content.alexSection === 'portfolio' && (
                            <>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Headline (Dark Part)</label>
                                <Input
                                  value={activeBlock.content.headlineDark || ''}
                                  onChange={(e) => updateActiveContent('headlineDark', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Headline (Muted Part)</label>
                                <Input
                                  value={activeBlock.content.headlineMuted || ''}
                                  onChange={(e) => updateActiveContent('headlineMuted', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">CTA Button Text</label>
                                <Input
                                  value={activeBlock.content.ctaText || ''}
                                  onChange={(e) => updateActiveContent('ctaText', e.target.value)}
                                  placeholder="View All Projects"
                                />
                              </div>
                              <TemplateColorPicker
                                label="CTA Button Background"
                                value={activeBlock.content.ctaBg || ''}
                                fallback={activeBlock.styles?.accentColor || '#161616'}
                                onChange={(val) => updateActiveContent('ctaBg', val)}
                              />
                              <TemplateColorPicker
                                label="CTA Button Text"
                                value={activeBlock.content.ctaColor || ''}
                                fallback="#ffffff"
                                onChange={(val) => updateActiveContent('ctaColor', val)}
                              />
                              <div className="space-y-3 pt-2">
                                {(activeBlock.content.projects || []).map((proj: any, i: number) => (
                                  <div key={i} className="p-2.5 rounded-lg border border-slate-200 dark:border-neutral-800 space-y-2">
                                    <div className="text-[11px] font-bold text-slate-500">Project {i + 1}</div>
                                    <Input
                                      placeholder="Title / Name"
                                      value={proj.name || proj.title || ''}
                                      onChange={(e) => {
                                        const newProj = [...(activeBlock.content.projects || [])];
                                        newProj[i] = { ...newProj[i], name: e.target.value };
                                        updateActiveContent('projects', newProj);
                                      }}
                                    />
                                    <Input
                                      placeholder="Year"
                                      value={proj.year || ''}
                                      onChange={(e) => {
                                        const newProj = [...(activeBlock.content.projects || [])];
                                        newProj[i] = { ...newProj[i], year: e.target.value };
                                        updateActiveContent('projects', newProj);
                                      }}
                                    />
                                    <Input
                                      placeholder="Tag (e.g. Fintech UI/UX)"
                                      value={proj.tag || ''}
                                      onChange={(e) => {
                                        const newProj = [...(activeBlock.content.projects || [])];
                                        newProj[i] = { ...newProj[i], tag: e.target.value };
                                        updateActiveContent('projects', newProj);
                                      }}
                                    />
                                    <Input
                                      placeholder="Hover Badge"
                                      value={proj.hoverBadge || ''}
                                      onChange={(e) => {
                                        const newProj = [...(activeBlock.content.projects || [])];
                                        newProj[i] = { ...newProj[i], hoverBadge: e.target.value };
                                        updateActiveContent('projects', newProj);
                                      }}
                                    />
                                    <ImageSourcePicker
                                      label="Project Image"
                                      value={proj.imgUrl || ''}
                                      onChange={(val) => {
                                        const newProj = [...(activeBlock.content.projects || [])];
                                        newProj[i] = { ...newProj[i], imgUrl: val };
                                        updateActiveContent('projects', newProj);
                                      }}
                                      placeholder="Image URL or upload from device..."
                                    />
                                  </div>
                                ))}
                              </div>
                            </>
                          )}

                          {/* 9. PRICING */}
                          {activeBlock.content.alexSection === 'pricing' && (
                            <>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Headline (Dark Part)</label>
                                <Input
                                  value={activeBlock.content.headlineDark || ''}
                                  onChange={(e) => updateActiveContent('headlineDark', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Headline (Muted Part)</label>
                                <Input
                                  value={activeBlock.content.headlineMuted || ''}
                                  onChange={(e) => updateActiveContent('headlineMuted', e.target.value)}
                                />
                              </div>
                              <div className="p-3 rounded-lg border border-slate-200 dark:border-neutral-800 space-y-2">
                                <div className="text-[11px] font-bold text-slate-700 dark:text-neutral-200">Basic Tier (White Card)</div>
                                <Input
                                  placeholder="Name"
                                  value={activeBlock.content.standard?.name || ''}
                                  onChange={(e) => updateActiveContent('standard', { ...activeBlock.content.standard, name: e.target.value })}
                                />
                                <Input
                                  placeholder="Price (e.g. $4,650)"
                                  value={activeBlock.content.standard?.price || ''}
                                  onChange={(e) => updateActiveContent('standard', { ...activeBlock.content.standard, price: e.target.value })}
                                />
                                <Input
                                  placeholder="Period (e.g. / month)"
                                  value={activeBlock.content.standard?.period || ''}
                                  onChange={(e) => updateActiveContent('standard', { ...activeBlock.content.standard, period: e.target.value })}
                                />
                                <Input
                                  placeholder="Badge"
                                  value={activeBlock.content.standard?.badge || ''}
                                  onChange={(e) => updateActiveContent('standard', { ...activeBlock.content.standard, badge: e.target.value })}
                                />
                                <Input
                                  placeholder="Sprint"
                                  value={activeBlock.content.standard?.sprint || ''}
                                  onChange={(e) => updateActiveContent('standard', { ...activeBlock.content.standard, sprint: e.target.value })}
                                />
                                <Input
                                  placeholder="CTA Text"
                                  value={activeBlock.content.standard?.cta || ''}
                                  onChange={(e) => updateActiveContent('standard', { ...activeBlock.content.standard, cta: e.target.value })}
                                />
                                <TemplateColorPicker
                                  label="CTA Button Background"
                                  value={activeBlock.content.standard?.ctaBg || ''}
                                  fallback={activeBlock.styles?.accentColor || '#ff2d9b'}
                                  onChange={(val) => updateActiveContent('standard', { ...activeBlock.content.standard, ctaBg: val })}
                                />
                                <TemplateColorPicker
                                  label="CTA Button Text"
                                  value={activeBlock.content.standard?.ctaColor || ''}
                                  fallback="#ffffff"
                                  onChange={(val) => updateActiveContent('standard', { ...activeBlock.content.standard, ctaColor: val })}
                                />
                                {/* Standard features manager */}
                                <div className="pt-2 border-t border-slate-200 dark:border-neutral-800 space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-600 dark:text-neutral-300">Features Checklist</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      type="button"
                                      onClick={() => {
                                        const current = activeBlock.content.standard?.features || [
                                          '1 active request at a time',
                                          'Fast 48-hour typical delivery',
                                          'Unlimited design revisions',
                                          'Figma source files & assets',
                                        ];
                                        updateActiveContent('standard', {
                                          ...activeBlock.content.standard,
                                          features: [...current, 'New included feature'],
                                        });
                                      }}
                                      className="h-5 px-1.5 text-[10px] text-blue-600"
                                    >
                                      <Plus className="w-2.5 h-2.5 mr-0.5" /> Add
                                    </Button>
                                  </div>
                                  {(activeBlock.content.standard?.features || [
                                    '1 active request at a time',
                                    'Fast 48-hour typical delivery',
                                    'Unlimited design revisions',
                                    'Figma source files & assets',
                                  ]).map((feat: string, fi: number) => (
                                    <div key={fi} className="flex items-center gap-1">
                                      <Input
                                        value={feat}
                                        onChange={(e) => {
                                          const current = [
                                            ...(activeBlock.content.standard?.features || [
                                              '1 active request at a time',
                                              'Fast 48-hour typical delivery',
                                              'Unlimited design revisions',
                                              'Figma source files & assets',
                                            ]),
                                          ];
                                          current[fi] = e.target.value;
                                          updateActiveContent('standard', { ...activeBlock.content.standard, features: current });
                                        }}
                                        className="h-6 text-[11px] flex-1"
                                      />
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        type="button"
                                        onClick={() => {
                                          const current = [
                                            ...(activeBlock.content.standard?.features || [
                                              '1 active request at a time',
                                              'Fast 48-hour typical delivery',
                                              'Unlimited design revisions',
                                              'Figma source files & assets',
                                            ]),
                                          ];
                                          current.splice(fi, 1);
                                          updateActiveContent('standard', { ...activeBlock.content.standard, features: current });
                                        }}
                                        className="h-6 w-6 p-0 text-slate-400 hover:text-red-500"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="p-3 rounded-lg border border-slate-200 dark:border-neutral-800 space-y-2">
                                <div className="text-[11px] font-bold text-slate-700 dark:text-neutral-200">Business Tier (Black Card)</div>
                                <Input
                                  placeholder="Name"
                                  value={activeBlock.content.enterprise?.name || ''}
                                  onChange={(e) => updateActiveContent('enterprise', { ...activeBlock.content.enterprise, name: e.target.value })}
                                />
                                <Input
                                  placeholder="Price (e.g. $2,940)"
                                  value={activeBlock.content.enterprise?.price || ''}
                                  onChange={(e) => updateActiveContent('enterprise', { ...activeBlock.content.enterprise, price: e.target.value })}
                                />
                                <Input
                                  placeholder="Period (e.g. / bi-weekly)"
                                  value={activeBlock.content.enterprise?.period || ''}
                                  onChange={(e) => updateActiveContent('enterprise', { ...activeBlock.content.enterprise, period: e.target.value })}
                                />
                                <Input
                                  placeholder="Badge"
                                  value={activeBlock.content.enterprise?.badge || ''}
                                  onChange={(e) => updateActiveContent('enterprise', { ...activeBlock.content.enterprise, badge: e.target.value })}
                                />
                                <Input
                                  placeholder="Sprint"
                                  value={activeBlock.content.enterprise?.sprint || ''}
                                  onChange={(e) => updateActiveContent('enterprise', { ...activeBlock.content.enterprise, sprint: e.target.value })}
                                />
                                <Input
                                  placeholder="CTA Text"
                                  value={activeBlock.content.enterprise?.cta || ''}
                                  onChange={(e) => updateActiveContent('enterprise', { ...activeBlock.content.enterprise, cta: e.target.value })}
                                />
                                <TemplateColorPicker
                                  label="CTA Button Background"
                                  value={activeBlock.content.enterprise?.ctaBg || ''}
                                  fallback={activeBlock.styles?.accentColor || '#d9ff1a'}
                                  onChange={(val) => updateActiveContent('enterprise', { ...activeBlock.content.enterprise, ctaBg: val })}
                                />
                                <TemplateColorPicker
                                  label="CTA Button Text"
                                  value={activeBlock.content.enterprise?.ctaColor || ''}
                                  fallback="#000000"
                                  onChange={(val) => updateActiveContent('enterprise', { ...activeBlock.content.enterprise, ctaColor: val })}
                                />
                                {/* Enterprise features manager */}
                                <div className="pt-2 border-t border-slate-200 dark:border-neutral-800 space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-600 dark:text-neutral-300">Features Checklist</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      type="button"
                                      onClick={() => {
                                        const current = activeBlock.content.enterprise?.features || [
                                          '2 active requests at a time',
                                          'Priority 24-hour delivery',
                                          'Dedicated Slack channel access',
                                          'Production Next.js / CSS code',
                                        ];
                                        updateActiveContent('enterprise', {
                                          ...activeBlock.content.enterprise,
                                          features: [...current, 'New included feature'],
                                        });
                                      }}
                                      className="h-5 px-1.5 text-[10px] text-blue-600"
                                    >
                                      <Plus className="w-2.5 h-2.5 mr-0.5" /> Add
                                    </Button>
                                  </div>
                                  {(activeBlock.content.enterprise?.features || [
                                    '2 active requests at a time',
                                    'Priority 24-hour delivery',
                                    'Dedicated Slack channel access',
                                    'Production Next.js / CSS code',
                                  ]).map((feat: string, fi: number) => (
                                    <div key={fi} className="flex items-center gap-1">
                                      <Input
                                        value={feat}
                                        onChange={(e) => {
                                          const current = [
                                            ...(activeBlock.content.enterprise?.features || [
                                              '2 active requests at a time',
                                              'Priority 24-hour delivery',
                                              'Dedicated Slack channel access',
                                              'Production Next.js / CSS code',
                                            ]),
                                          ];
                                          current[fi] = e.target.value;
                                          updateActiveContent('enterprise', { ...activeBlock.content.enterprise, features: current });
                                        }}
                                        className="h-6 text-[11px] flex-1"
                                      />
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        type="button"
                                        onClick={() => {
                                          const current = [
                                            ...(activeBlock.content.enterprise?.features || [
                                              '2 active requests at a time',
                                              'Priority 24-hour delivery',
                                              'Dedicated Slack channel access',
                                              'Production Next.js / CSS code',
                                            ]),
                                          ];
                                          current.splice(fi, 1);
                                          updateActiveContent('enterprise', { ...activeBlock.content.enterprise, features: current });
                                        }}
                                        className="h-6 w-6 p-0 text-slate-400 hover:text-red-500"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}

                          {/* 10. TESTIMONIAL */}
                          {activeBlock.content.alexSection === 'testimonial' && (
                            <>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Badge Text</label>
                                <Input
                                  value={activeBlock.content.badge || ''}
                                  onChange={(e) => updateActiveContent('badge', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Client Quote</label>
                                <textarea
                                  rows={4}
                                  value={activeBlock.content.quote || ''}
                                  onChange={(e) => updateActiveContent('quote', e.target.value)}
                                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Client Name</label>
                                <Input
                                  value={activeBlock.content.author || ''}
                                  onChange={(e) => updateActiveContent('author', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Client Role / Company</label>
                                <Input
                                  value={activeBlock.content.role || ''}
                                  onChange={(e) => updateActiveContent('role', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Company Logo Monogram</label>
                                <Input
                                  value={activeBlock.content.companyLogo || ''}
                                  onChange={(e) => updateActiveContent('companyLogo', e.target.value)}
                                />
                              </div>
                              <ImageSourcePicker
                                label="Client Photo"
                                value={activeBlock.content.avatarUrl || ''}
                                onChange={(val) => updateActiveContent('avatarUrl', val)}
                                placeholder="Enter photo URL or choose file from device..."
                              />
                            </>
                          )}

                          {/* 11. ARTICLES */}
                          {activeBlock.content.alexSection === 'articles' && (
                            <>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Headline (Dark Part)</label>
                                <Input
                                  value={activeBlock.content.headlineDark || ''}
                                  onChange={(e) => updateActiveContent('headlineDark', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Headline (Muted Part)</label>
                                <Input
                                  value={activeBlock.content.headlineMuted || ''}
                                  onChange={(e) => updateActiveContent('headlineMuted', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">CTA Button</label>
                                <Input
                                  value={activeBlock.content.ctaText || ''}
                                  onChange={(e) => updateActiveContent('ctaText', e.target.value)}
                                />
                              </div>
                              <TemplateColorPicker
                                label="CTA Button Background"
                                value={activeBlock.content.ctaBg || ''}
                                fallback={activeBlock.styles?.accentColor || '#161616'}
                                onChange={(val) => updateActiveContent('ctaBg', val)}
                              />
                              <TemplateColorPicker
                                label="CTA Button Text"
                                value={activeBlock.content.ctaColor || ''}
                                fallback="#ffffff"
                                onChange={(val) => updateActiveContent('ctaColor', val)}
                              />
                              <div className="p-3 rounded-lg border border-slate-200 dark:border-neutral-800 space-y-2">
                                <div className="text-[11px] font-bold text-slate-700 dark:text-neutral-200">Featured Article (Left Card)</div>
                                <Input
                                  placeholder="Title"
                                  value={activeBlock.content.featured?.title || ''}
                                  onChange={(e) => updateActiveContent('featured', { ...activeBlock.content.featured, title: e.target.value })}
                                />
                                <Input
                                  placeholder="Tag"
                                  value={activeBlock.content.featured?.tag || ''}
                                  onChange={(e) => updateActiveContent('featured', { ...activeBlock.content.featured, tag: e.target.value })}
                                />
                                <ImageSourcePicker
                                  label="Article Image"
                                  value={activeBlock.content.featured?.imgUrl || ''}
                                  onChange={(val) => updateActiveContent('featured', { ...activeBlock.content.featured, imgUrl: val })}
                                  placeholder="Image URL or upload from device..."
                                />
                              </div>
                            </>
                          )}

                          {/* 12. FAQ */}
                          {activeBlock.content.alexSection === 'faq' && (
                            <>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Headline (Dark Part)</label>
                                <Input
                                  value={activeBlock.content.headlineDark || ''}
                                  onChange={(e) => updateActiveContent('headlineDark', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Headline (Muted Part)</label>
                                <Input
                                  value={activeBlock.content.headlineMuted || ''}
                                  onChange={(e) => updateActiveContent('headlineMuted', e.target.value)}
                                />
                              </div>
                              <div className="space-y-3 pt-2">
                                {(activeBlock.content.faqs || []).map((f: any, i: number) => (
                                  <div key={i} className="p-2.5 rounded-lg border border-slate-200 dark:border-neutral-800 space-y-2">
                                    <div className="text-[11px] font-bold text-slate-500">FAQ Item {i + 1}</div>
                                    <Input
                                      placeholder="Question"
                                      value={f.question || ''}
                                      onChange={(e) => {
                                        const newFaqs = [...(activeBlock.content.faqs || [])];
                                        newFaqs[i] = { ...newFaqs[i], question: e.target.value };
                                        updateActiveContent('faqs', newFaqs);
                                      }}
                                    />
                                    <textarea
                                      rows={2}
                                      placeholder="Answer"
                                      value={f.answer || ''}
                                      onChange={(e) => {
                                        const newFaqs = [...(activeBlock.content.faqs || [])];
                                        newFaqs[i] = { ...newFaqs[i], answer: e.target.value };
                                        updateActiveContent('faqs', newFaqs);
                                      }}
                                      className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white"
                                    />
                                  </div>
                                ))}
                              </div>
                            </>
                          )}

                          {/* 13. SOCIALS (Guarantees) */}
                          {activeBlock.content.alexSection === 'guarantees' && (
                            <div className="space-y-3">
                              <div className="text-[11px] font-bold text-slate-700 dark:text-neutral-300">Social Links</div>
                              {(activeBlock.content.socials || []).map((s: any, i: number) => (
                                <div key={i} className="p-2.5 rounded-lg border border-slate-200 dark:border-neutral-800 space-y-2">
                                  <Input
                                    placeholder="Platform Name"
                                    value={s.name || ''}
                                    onChange={(e) => {
                                      const newSocials = [...(activeBlock.content.socials || [])];
                                      newSocials[i] = { ...newSocials[i], name: e.target.value };
                                      updateActiveContent('socials', newSocials);
                                    }}
                                  />
                                  <Input
                                    placeholder="URL"
                                    value={s.url || ''}
                                    onChange={(e) => {
                                      const newSocials = [...(activeBlock.content.socials || [])];
                                      newSocials[i] = { ...newSocials[i], url: e.target.value };
                                      updateActiveContent('socials', newSocials);
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 14. FOOTER */}
                          {activeBlock.content.alexSection === 'footer' && (
                            <>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Logo Initials</label>
                                <Input
                                  value={activeBlock.content.logoInitials || ''}
                                  onChange={(e) => updateActiveContent('logoInitials', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Badge Text</label>
                                <Input
                                  value={activeBlock.content.badge || ''}
                                  onChange={(e) => updateActiveContent('badge', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Pitch / About Text</label>
                                <textarea
                                  rows={2}
                                  value={activeBlock.content.text || ''}
                                  onChange={(e) => updateActiveContent('text', e.target.value)}
                                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">CTA Button Text</label>
                                <Input
                                  value={activeBlock.content.ctaText || ''}
                                  onChange={(e) => updateActiveContent('ctaText', e.target.value)}
                                />
                              </div>
                              <TemplateColorPicker
                                label="CTA Button Background"
                                value={activeBlock.content.ctaBgColor || ''}
                                fallback={activeBlock.styles?.accentColor || '#d9ff1a'}
                                onChange={(val) => updateActiveContent('ctaBgColor', val)}
                              />
                              <TemplateColorPicker
                                label="CTA Button Text"
                                value={activeBlock.content.ctaTextColor || ''}
                                fallback="#000000"
                                onChange={(val) => updateActiveContent('ctaTextColor', val)}
                              />
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Contact Email</label>
                                <Input
                                  value={activeBlock.content.email || ''}
                                  onChange={(e) => updateActiveContent('email', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Giant Watermark Text</label>
                                <Input
                                  value={activeBlock.content.watermark || ''}
                                  onChange={(e) => updateActiveContent('watermark', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Copyright Line</label>
                                <Input
                                  value={activeBlock.content.copyright || ''}
                                  onChange={(e) => updateActiveContent('copyright', e.target.value)}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      ) : activeBlock.type === 'CONTAINER' ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Section Label</label>
                            <Input
                              value={activeBlock.content?.label || 'Flex Container'}
                              onChange={(e) => updateActiveContent('label', e.target.value)}
                            />
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed">
                            This is a flexible Webflow/Elementor container. You can add any of the <strong>52+ ShadCN UI components</strong> into each column!
                          </p>
                        </div>
                      ) : null}

                      {/* NAVBAR controls */}
                      {activeBlock.type === 'NAVBAR' && (
                        <>
                          <div>
                            <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Brand Name</label>
                            <Input
                              value={activeBlock.content.brandName || ''}
                              onChange={(e) => updateActiveContent('brandName', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Position Mode</label>
                            <select
                              value={activeBlock.content.positionMode || 'sticky'}
                              onChange={(e) => updateActiveContent('positionMode', e.target.value)}
                              className="w-full h-8 rounded-lg border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 px-2.5 text-xs text-slate-900 dark:text-neutral-100"
                            >
                              <option value="sticky">Sticky (Sticks on scroll)</option>
                              <option value="fixed">Fixed (Floating on top)</option>
                              <option value="static">Static (Normal scroll)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">CTA Button Text</label>
                            <Input
                              value={activeBlock.content.ctaText || ''}
                              onChange={(e) => updateActiveContent('ctaText', e.target.value)}
                            />
                          </div>

                          {/* Nav Menu Links Manager for standard NAVBAR */}
                          <div className="p-3 rounded-lg border border-slate-200 dark:border-neutral-800 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <div className="text-[11px] font-bold text-slate-700 dark:text-neutral-200">Menu Navigation Links</div>
                              <Button
                                size="sm"
                                variant="ghost"
                                type="button"
                                onClick={() => {
                                  const current = activeBlock.content.navLinks || [
                                    { label: 'Overview', href: '#hero' },
                                    { label: 'Specs', href: '#spotlight' },
                                    { label: 'Reviews', href: '#reviews' },
                                    { label: 'FAQ', href: '#faq' },
                                  ];
                                  updateActiveContent('navLinks', [...current, { label: 'New Link', href: '#' }]);
                                }}
                                className="h-6 px-2 text-[10px] text-blue-600 hover:text-blue-700"
                              >
                                <Plus className="w-3 h-3 mr-1" /> Add Link
                              </Button>
                            </div>

                            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                              {(activeBlock.content.navLinks || [
                                { label: 'Overview', href: '#hero' },
                                { label: 'Specs', href: '#spotlight' },
                                { label: 'Reviews', href: '#reviews' },
                                { label: 'FAQ', href: '#faq' },
                              ]).map((link: any, li: number) => (
                                <div key={li} className="p-2 rounded border border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/60 space-y-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <Input
                                      value={link.label || ''}
                                      onChange={(e) => {
                                        const current = [
                                          ...(activeBlock.content.navLinks || [
                                            { label: 'Overview', href: '#hero' },
                                            { label: 'Specs', href: '#spotlight' },
                                            { label: 'Reviews', href: '#reviews' },
                                            { label: 'FAQ', href: '#faq' },
                                          ]),
                                        ];
                                        current[li] = { ...current[li], label: e.target.value };
                                        updateActiveContent('navLinks', current);
                                      }}
                                      placeholder="Label"
                                      className="h-7 text-xs flex-1"
                                    />
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      type="button"
                                      onClick={() => {
                                        const current = [
                                          ...(activeBlock.content.navLinks || [
                                            { label: 'Overview', href: '#hero' },
                                            { label: 'Specs', href: '#spotlight' },
                                            { label: 'Reviews', href: '#reviews' },
                                            { label: 'FAQ', href: '#faq' },
                                          ]),
                                        ];
                                        current.splice(li, 1);
                                        updateActiveContent('navLinks', current);
                                      }}
                                      className="h-7 w-7 p-0 text-slate-400 hover:text-red-500"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <Input
                                    value={link.href || ''}
                                    onChange={(e) => {
                                      const current = [
                                        ...(activeBlock.content.navLinks || [
                                          { label: 'Overview', href: '#hero' },
                                          { label: 'Specs', href: '#spotlight' },
                                          { label: 'Reviews', href: '#reviews' },
                                          { label: 'FAQ', href: '#faq' },
                                        ]),
                                      ];
                                      current[li] = { ...current[li], href: e.target.value };
                                      updateActiveContent('navLinks', current);
                                    }}
                                    placeholder="Href (e.g. #hero)"
                                    className="h-6 text-[11px] font-mono"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* HERO controls */}
                      {activeBlock.type === 'HERO' && (
                        <>
                          <div>
                            <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Badge Text</label>
                            <Input
                              value={activeBlock.content.badgeText || ''}
                              onChange={(e) => updateActiveContent('badgeText', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Headline Text</label>
                            <textarea
                              rows={3}
                              value={activeBlock.content.headline || ''}
                              onChange={(e) => updateActiveContent('headline', e.target.value)}
                              className="w-full rounded-lg border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/80 p-2.5 text-xs text-slate-900 dark:text-neutral-100"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Subheadline</label>
                            <textarea
                              rows={3}
                              value={activeBlock.content.subheadline || ''}
                              onChange={(e) => updateActiveContent('subheadline', e.target.value)}
                              className="w-full rounded-lg border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/80 p-2.5 text-xs text-slate-900 dark:text-neutral-100"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">CTA Button Text</label>
                            <Input
                              value={activeBlock.content.ctaText || ''}
                              onChange={(e) => updateActiveContent('ctaText', e.target.value)}
                            />
                          </div>
                        </>
                      )}

                      {/* IMAGE controls */}
                      {activeBlock.type === 'IMAGE' && (
                        <>
                          <div>
                            <ImageSourcePicker
                              label="Image Source"
                              value={activeBlock.content.imageUrl || ''}
                              onChange={(val) => updateActiveContent('imageUrl', val)}
                              placeholder="Image URL or upload from device..."
                            />
                          </div>
                          <div>
                            <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Caption</label>
                            <Input
                              value={activeBlock.content.caption || ''}
                              onChange={(e) => updateActiveContent('caption', e.target.value)}
                            />
                          </div>
                        </>
                      )}

                      {/* PRODUCT SPOTLIGHT controls */}
                      {activeBlock.type === 'PRODUCT_SPOTLIGHT' && (
                        <>
                          <div>
                            <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Product Title</label>
                            <Input
                              value={activeBlock.content.productTitle || ''}
                              onChange={(e) => updateActiveContent('productTitle', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-slate-700 dark:text-neutral-300 font-medium mb-1">Price (Rp)</label>
                            <Input
                              type="number"
                              value={activeBlock.content.productPrice || 0}
                              onChange={(e) => updateActiveContent('productPrice', Number(e.target.value))}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* =================================================== */}
                  {/* 3. STYLES TAB (FONTS, BG COLOR, BG IMAGE, ACCENT)   */}
                  {/* =================================================== */}
                  {inspectorTab === 'styles' && (
                    <StylesPanel
                      styles={
                        isEditingSharedClass && targetClassName
                          ? styleClasses.find((c) => c.name === targetClassName)?.styles || {}
                          : activeBlock.styles || {}
                      }
                      onChange={(key, val) => {
                        if (isEditingSharedClass && targetClassName) {
                          handleSharedClassStyleChange(key, val);
                        } else {
                          updateActiveStyle(key as any, val, viewport);
                        }
                      }}
                      isContainer={activeBlock.type === 'CONTAINER'}
                      viewport={viewport}
                      onViewportChange={setViewport}
                      onResetBreakpoint={(vp) => resetActiveStyleBreakpoint(vp)}
                      classNames={activeBlock.styles?.classNames || []}
                      styleClasses={styleClasses}
                      tokens={designTokens}
                      onAddClass={(cls) =>
                        updateBlockClassNames(activeBlock.id, (current) =>
                          current.includes(cls) ? current : [...current, cls],
                        )
                      }
                      onRemoveClass={(cls) =>
                        updateBlockClassNames(activeBlock.id, (current) =>
                          current.filter((c) => c !== cls),
                        )
                      }
                      onCreateClass={(cls) => handleCreateClass(cls)}
                      targetClassName={targetClassName}
                      onSelectTargetClass={(name) => setTargetClassName(name)}
                      isEditingSharedClass={isEditingSharedClass}
                      onToggleEditSharedClass={(enabled) => setIsEditingSharedClass(enabled)}
                      onOpenTokensModal={() => setIsDesignTokensModalOpen(true)}
                      defaultAccentColor={
                        activeBlock.content?.alexSection === 'hero'
                          ? '#ff2d9b'
                          : activeBlock.content?.alexSection === 'contact'
                            ? '#d9ff1a'
                            : activeBlock.content?.alexSection === 'pricing'
                              ? '#ff2d9b'
                              : '#ff2d9b'
                      }
                      defaultAccentGradient={
                        activeBlock.content?.alexSection === 'hero'
                          ? 'linear-gradient(to right, #ff2d9b, #ff7a2f, #ffd21f)'
                          : undefined
                      }
                    />
                  )}
                </aside>
              ) : (
                <aside className="w-80 border-l border-slate-200 dark:border-neutral-900 bg-white dark:bg-[#08090c] p-6 flex flex-col items-center justify-center text-center h-full sticky top-0 shrink-0 z-30 lg:flex select-none">
                  <button
                    type="button"
                    onClick={() => setShowRightSidebar(false)}
                    className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Hide Inspector Sidebar"
                  >
                    <PanelRightClose className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center justify-center mb-3 text-slate-400 dark:text-neutral-500 shadow-inner">
                    <Sliders className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-neutral-200">
                    No Section Selected
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-500 mt-1 max-w-50 leading-relaxed">
                    Add or select a container section to configure its layout, content, and styling.
                  </p>
                </aside>
              ))}


          </div>
        )}

        {/* Settings View */}
        {activeTab === 'settings' && (
          <div className="flex-1 p-6 md:p-10 max-w-4xl mx-auto overflow-y-auto h-full space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Merchant Gateway (BYOK) & Ad Tracking Integrations
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                Configure your payment credentials and tracking IDs. All secrets are encrypted at rest with AES-256-GCM.
              </p>
            </div>

            <Card className="border-slate-200 dark:border-neutral-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                    Payment Gateway Credential
                  </div>
                  <Badge variant="success">AES-256 Vault Active</Badge>
                </div>
                <CardTitle className="text-base mt-1">Xendit Bring-Your-Own-Key (BYOK)</CardTitle>
                <CardDescription>
                  Invoices, Virtual Accounts, and QRIS payments route directly to your personal merchant account.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-neutral-300 mb-1.5">
                    Xendit Secret API Key
                  </label>
                  <Input
                    type="password"
                    value={settings.xenditSecretKey}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, xenditSecretKey: e.target.value }))
                    }
                  />
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1">Encrypted on save before writing to PostgreSQL.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-neutral-300 mb-1.5">
                    Webhook Verification Token
                  </label>
                  <Input
                    value={settings.xenditWebhookToken}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, xenditWebhookToken: e.target.value }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-neutral-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                    Conversion Telemetry
                  </div>
                  <Badge variant="info">Dual-Layer CAPI</Badge>
                </div>
                <CardTitle className="text-base mt-1">Meta Pixel, CAPI & Google Analytics 4</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-neutral-300 mb-1.5">
                      Facebook Pixel ID
                    </label>
                    <Input
                      value={settings.fbPixelId}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, fbPixelId: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-neutral-300 mb-1.5">
                      GA4 Measurement ID
                    </label>
                    <Input
                      value={settings.ga4MeasurementId}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, ga4MeasurementId: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders View */}
        {activeTab === 'orders' && (
          <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto overflow-y-auto h-full space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Order Ledger</h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400">Incoming checkout settlements routed through Xendit.</p>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-400">Gross Settlement</div>
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white">
                  Rp {orders.reduce((acc, o) => acc + (o.status === 'PAID' ? o.amount : 0), 0).toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            <Card className="border-slate-200 dark:border-neutral-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-neutral-900/60 border-b border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5 pl-5">Order ID</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Item</th>
                      <th className="p-3.5">Total</th>
                      <th className="p-3.5">Settlement (Xendit)</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 pr-5">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-neutral-900">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-neutral-900/40 transition-colors">
                        <td className="p-3.5 pl-5 font-mono text-slate-700 dark:text-neutral-300 font-semibold">{ord.id}</td>
                        <td className="p-3.5">
                          <div className="font-medium text-slate-900 dark:text-white">{ord.customer}</div>
                          <div className="text-slate-500 dark:text-neutral-400 text-[11px]">{ord.phone}</div>
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-neutral-300 text-xs">{ord.product}</td>
                        <td className="p-3.5 font-mono font-semibold text-slate-900 dark:text-white">Rp {ord.amount.toLocaleString('id-ID')}</td>
                        <td className="p-3.5 text-slate-700 dark:text-neutral-300">{ord.method}</td>
                        <td className="p-3.5">
                          <Badge variant={ord.status === 'PAID' ? 'success' : 'warning'}>
                            {ord.status}
                          </Badge>
                        </td>
                        <td className="p-3.5 pr-5 text-slate-500 dark:text-neutral-400 font-mono text-[11px]">{ord.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Container Section Template Library Modal */}
      <BlockLibraryModal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        onSelectBlock={(templateKey) => {
          handleInsertSection(templateKey);
          setIsSectionModalOpen(false);
        }}
      />

      {/* Page Settings & SEO Modal */}
      <PageSettingsModal
        isOpen={isPageSettingsOpen}
        onClose={() => setIsPageSettingsOpen(false)}
        pageName={pageName}
        onPageNameChange={setPageName}
        pageSlug={pageSlug}
        onPageSlugChange={setPageSlug}
        metaTitle={metaTitle}
        onMetaTitleChange={setMetaTitle}
        metaDescription={metaDescription}
        onMetaDescriptionChange={setMetaDescription}
      />

      {/* Global Design Tokens & Theme Presets Modal */}
      <DesignTokensModal
        isOpen={isDesignTokensModalOpen}
        onClose={() => setIsDesignTokensModalOpen(false)}
        tokens={designTokens}
        onSaveTokens={(newTokens) => setDesignTokens(newTokens)}
      />

      {/* Milestone 4: New Page Creation Modal */}
      <NewPageModal
        isOpen={isNewPageModalOpen}
        onClose={() => setIsNewPageModalOpen(false)}
        onCreatePage={persistence.createNewPage}
        existingSlugs={persistence.pages.map((p) => p.slug)}
      />

      {/* Milestone 5: Reusable Master Components Library Modal */}
      <MasterComponentsModal
        isOpen={isMasterComponentsModalOpen}
        onClose={() => setIsMasterComponentsModalOpen(false)}
        components={masterComponents}
        onInsertComponent={handleInsertMasterComponent}
        onDeleteComponent={handleDeleteMasterComponent}
      />

      {/* Milestone 5: Create Master Component Dialog */}
      <CreateMasterComponentModal
        isOpen={isCreateMasterModalOpen}
        onClose={() => {
          setIsCreateMasterModalOpen(false);
          setCreateMasterTarget(null);
        }}
        targetName={createMasterTarget?.name || ''}
        targetType={createMasterTarget?.type || 'component'}
        onCreateMaster={handleCreateMasterComponent}
      />

      {/* Milestone 6: Publish Storefront & Version History Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        pageId={persistence.currentPageId}
        pageTitle={pageName}
        pageSlug={pageSlug}
        pageStatus={currentPageSummary?.status || 'DRAFT'}
        seoMetadata={seoMetadata}
        onUpdateSeo={(newSeo) => {
          setSeoMetadata(newSeo);
          if (newSeo.metaTitle) setMetaTitle(newSeo.metaTitle);
          if (newSeo.metaDescription) setMetaDescription(newSeo.metaDescription);
        }}
        onPublishSuccess={async () => {
          await persistence.refreshPagesList();
        }}
        onRollbackSuccess={async (restored) => {
          if (restored.blocks) setBlocks(restored.blocks);
          if (restored.tokens) setDesignTokens(restored.tokens);
          if (restored.styleClasses) setStyleClasses(restored.styleClasses);
          if (restored.seoMetadata) {
            setSeoMetadata(restored.seoMetadata);
            if (restored.seoMetadata.metaTitle) setMetaTitle(restored.seoMetadata.metaTitle);
            if (restored.seoMetadata.metaDescription) setMetaDescription(restored.seoMetadata.metaDescription);
          }
          await persistence.refreshPagesList();
        }}
      />
    </div>
  );
}
