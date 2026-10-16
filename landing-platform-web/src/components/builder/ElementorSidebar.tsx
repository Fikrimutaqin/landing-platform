'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  PanelLeftClose,
  Component,
} from 'lucide-react';
import { BlockType, ShadcnComponentType } from '../../../../shared/types';
import { NavigatorPanel } from './NavigatorPanel';
import { AddElementsPanel } from './AddElementsPanel';

export interface BlockItem {
  id: string;
  type: BlockType;
  content: any;
  styles: any;
  layout?: any;
  columnsContent?: any[];
  masterComponentId?: string;
  isMasterInstance?: boolean;
  overrides?: Record<string, any>;
}

interface ElementorSidebarProps {
  blocks: BlockItem[];
  selectedBlockId: string | null;
  selectedComponentId?: string | null;
  activeSidebarTab?: 'shadcn' | 'navigator' | 'add';
  onSidebarTabChange?: (tab: 'shadcn' | 'navigator') => void;
  targetColumnIndex?: number;
  onSelectBlock: (id: string) => void;
  onSelectComponent?: (componentId: string, blockId: string) => void;
  onAddBlock: (templateKey: string) => void;
  onAddShadcnToActiveSection?: (type: ShadcnComponentType, defaultProps: Record<string, any>) => void;
  onAddLayoutSection?: (layoutType: 'container' | 'grid-2' | 'grid-3' | 'grid-4' | 'flex-row') => void;
  onOpenTemplateLibrary?: () => void;
  onInsertAlexSection?: (sectionKey: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDuplicate: (index: number) => void;
  onDelete: (index: number) => void;
  onDeleteComponent?: (componentId: string) => void;
  onClose?: () => void;
}

export function ElementorSidebar({
  blocks,
  selectedBlockId,
  selectedComponentId = null,
  activeSidebarTab,
  onSidebarTabChange,
  targetColumnIndex = 0,
  onSelectBlock,
  onSelectComponent,
  onAddBlock,
  onAddShadcnToActiveSection,
  onAddLayoutSection,
  onOpenTemplateLibrary,
  onInsertAlexSection,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onDeleteComponent,
  onClose,
}: ElementorSidebarProps) {
  const [localTab, setLocalTab] = useState<'shadcn' | 'navigator'>('shadcn');
  const currentTab =
    activeSidebarTab === 'navigator'
      ? 'navigator'
      : activeSidebarTab === 'add' || activeSidebarTab === 'shadcn'
      ? 'shadcn'
      : localTab;

  const setTab = (t: 'shadcn' | 'navigator') => {
    setLocalTab(t);
    if (onSidebarTabChange) onSidebarTabChange(t);
  };

  return (
    <aside className="w-80 border-r border-slate-200 dark:border-neutral-900 bg-white dark:bg-[#08090c] text-slate-800 dark:text-neutral-100 flex flex-col h-full sticky top-0 shrink-0 z-30 select-none transition-colors duration-200">
      {/* 2-Tab Segmented Control: Add Elements | Navigator + Close button */}
      <div className="flex items-center border-b border-slate-200 dark:border-neutral-900 bg-slate-100/80 dark:bg-neutral-950 p-1 shrink-0 gap-1">
        <div className="flex-1 flex gap-1">
          <button
            type="button"
            onClick={() => setTab('shadcn')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium rounded-md transition-colors ${
              currentTab === 'shadcn'
                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <span>Add Elements</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('navigator')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium rounded-md transition-colors ${
              currentTab === 'navigator'
                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Navigator ({blocks.length})</span>
          </button>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-neutral-800 transition-colors"
            title="Hide Left Sidebar"
          >
            <PanelLeftClose className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Tab 1: Add Elements (Structure, Core widgets, 60+ shadcn items, Prebuilt sections) */}
      {currentTab === 'shadcn' && (
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <AddElementsPanel
            targetColumnIndex={targetColumnIndex}
            onAddLayoutSection={(layoutType) => {
              if (onAddLayoutSection) {
                onAddLayoutSection(layoutType);
              } else {
                onAddBlock(layoutType === 'container' ? 'CONTAINER' : 'CONTAINER');
              }
            }}
            onAddShadcnComponent={(type, defaultProps) => {
              if (onAddShadcnToActiveSection) {
                onAddShadcnToActiveSection(type, defaultProps);
              }
            }}
            onOpenTemplateLibrary={onOpenTemplateLibrary}
            onInsertAlexSection={(sectionKey) => {
              if (onInsertAlexSection) {
                onInsertAlexSection(sectionKey);
              } else {
                onAddBlock(`ALEX_${sectionKey.toUpperCase()}`);
              }
            }}
          />
        </div>
      )}

      {/* Tab 2: Navigator / Layers Tree */}
      {currentTab === 'navigator' && (
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <NavigatorPanel
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            selectedComponentId={selectedComponentId}
            onSelectBlock={onSelectBlock}
            onSelectComponent={(compId, bId) => {
              if (onSelectComponent) {
                onSelectComponent(compId, bId);
              }
            }}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onDuplicateBlock={onDuplicate}
            onDeleteBlock={onDelete}
            onDeleteComponent={onDeleteComponent}
          />
        </div>
      )}
    </aside>
  );
}
