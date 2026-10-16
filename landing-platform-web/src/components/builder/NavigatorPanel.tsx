'use client';

import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Layers,
  Box,
  LayoutGrid,
  Columns,
  Type,
  Square,
  Sparkles,
  Image as ImageIcon,
  MousePointerClick,
  CreditCard,
  HelpCircle,
  Folder,
  Trash2,
  Copy,
  ChevronUp,
  Eye,
  EyeOff,
  Component,
} from 'lucide-react';
import { BlockItem } from './ElementorSidebar';
import { ShadcnComponentInstance, ShadcnComponentType } from '../../../../shared/types';

interface NavigatorPanelProps {
  blocks: BlockItem[];
  selectedBlockId: string | null;
  selectedComponentId: string | null;
  onSelectBlock: (id: string) => void;
  onSelectComponent: (componentId: string, blockId: string) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  onDuplicateBlock?: (index: number) => void;
  onDeleteBlock?: (index: number) => void;
  onDeleteComponent?: (componentId: string) => void;
}

export function NavigatorPanel({
  blocks,
  selectedBlockId,
  selectedComponentId,
  onSelectBlock,
  onSelectComponent,
  onMoveUp,
  onMoveDown,
  onDuplicateBlock,
  onDeleteBlock,
  onDeleteComponent,
}: NavigatorPanelProps) {
  // Store collapsed node IDs (by default sections are expanded)
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  const toggleCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getSectionIcon = (block: BlockItem) => {
    if (block.content?.alexSection) {
      switch (block.content.alexSection) {
        case 'hero':
          return <Sparkles className="w-3.5 h-3.5 text-pink-500" />;
        case 'navbar':
          return <Folder className="w-3.5 h-3.5 text-blue-500" />;
        case 'pricing':
          return <CreditCard className="w-3.5 h-3.5 text-emerald-500" />;
        case 'faq':
          return <HelpCircle className="w-3.5 h-3.5 text-amber-500" />;
        case 'services':
        case 'case-studies':
        case 'articles':
          return <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" />;
        default:
          return <Box className="w-3.5 h-3.5 text-purple-500" />;
      }
    }
    if (block.type === 'CONTAINER') {
      const isGrid = block.layout?.display === 'grid';
      return isGrid ? (
        <LayoutGrid className="w-3.5 h-3.5 text-blue-500" />
      ) : (
        <Columns className="w-3.5 h-3.5 text-cyan-500" />
      );
    }
    return <Box className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400" />;
  };

  const getComponentIcon = (type: ShadcnComponentType) => {
    switch (type) {
      case 'Typography':
        return <Type className="w-3 h-3 text-amber-500" />;
      case 'Button':
      case 'ButtonGroup':
        return <MousePointerClick className="w-3 h-3 text-emerald-500" />;
      case 'Card':
        return <Square className="w-3 h-3 text-blue-500" />;
      case 'AspectRatio':
        return <ImageIcon className="w-3 h-3 text-purple-500" />;
      case 'Badge':
        return <Sparkles className="w-3 h-3 text-pink-500" />;
      default:
        return <Component className="w-3 h-3 text-slate-400 dark:text-neutral-500" />;
    }
  };

  const formatBlockTitle = (block: BlockItem) => {
    if (block.content?.label) return block.content.label;
    if (block.content?.alexSection) {
      const name = block.content.alexSection;
      return `Alex ${name.charAt(0).toUpperCase() + name.slice(1)}`;
    }
    if (block.type === 'CONTAINER') {
      const isGrid = block.layout?.display === 'grid';
      return isGrid ? `Grid (${block.layout?.columns || 2} Cols)` : `Flex (${block.layout?.flexDirection || 'row'})`;
    }
    return block.type
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Render nested components recursively
  const renderComponentTree = (
    component: ShadcnComponentInstance,
    blockId: string,
    depth: number = 2
  ) => {
    const isSelected = selectedComponentId === component.id;
    const hasChildren = component.children && component.children.length > 0;
    const isCollapsed = Boolean(collapsedNodes[component.id]);

    const displayLabel =
      component.props?.text?.slice(0, 24) ||
      component.props?.label ||
      component.props?.title ||
      component.type;

    return (
      <div key={component.id} className="relative">
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectComponent(component.id, blockId);
          }}
          className={`flex items-center justify-between py-1 px-2 rounded-md text-[11px] cursor-pointer transition-colors group ${
            isSelected
              ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 font-medium ring-1 ring-blue-500/30'
              : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100/80 dark:hover:bg-neutral-800/60 hover:text-slate-900 dark:hover:text-neutral-200'
          }`}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleCollapse(component.id, e)}
                className="p-0.5 hover:text-slate-900 dark:hover:text-white"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-2.5 h-2.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                )}
              </button>
            ) : (
              <span className="w-3 h-3 inline-block shrink-0" />
            )}
            <span className="shrink-0">{getComponentIcon(component.type)}</span>
            <span className="truncate">{displayLabel}</span>
          </div>

          {onDeleteComponent && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteComponent(component.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-500 transition-opacity"
              title="Delete element"
            >
              <Trash2 className="w-2.5 h-2.5" />
            </button>
          )}
        </div>

        {hasChildren && !isCollapsed && (
          <div>
            {component.children!.map((child) =>
              renderComponentTree(child, blockId, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full space-y-2 select-none">
      {/* Header Info */}
      <div className="px-3 pt-2 pb-1 flex items-center justify-between border-b border-slate-200/80 dark:border-neutral-900/80 shrink-0">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-[11px] font-semibold text-slate-800 dark:text-neutral-200">
            Navigator / Layers
          </span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400">
          {blocks.length} {blocks.length === 1 ? 'Section' : 'Sections'}
        </span>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {/* Document Root node (Body) */}
        <div className="flex items-center gap-1.5 py-1 px-2 rounded-md text-[11px] text-slate-500 dark:text-neutral-400 font-medium">
          <Folder className="w-3 h-3 text-slate-400" />
          <span>Body (Page Canvas)</span>
        </div>

        {blocks.length === 0 ? (
          <div className="p-4 text-center rounded-lg border border-dashed border-slate-200 dark:border-neutral-800 my-2 text-xs text-slate-400 dark:text-neutral-500">
            No sections added. Add sections to see document structure.
          </div>
        ) : (
          blocks.map((block, index) => {
            const isSelected = selectedBlockId === block.id && !selectedComponentId;
            const isCollapsed = Boolean(collapsedNodes[block.id]);
            const columns = block.columnsContent || [];
            const hasColumns = columns.length > 0;
            const totalComponents = columns.reduce(
              (acc: number, c: any) => acc + (c.components?.length || 0),
              0
            );

            return (
              <div key={block.id} className="space-y-0.5">
                {/* Section Row */}
                <div
                  onClick={() => onSelectBlock(block.id)}
                  className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-xs cursor-pointer transition-colors group ${
                    isSelected
                      ? 'bg-blue-500 text-white font-medium shadow-xs'
                      : 'text-slate-800 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-900'
                  }`}
                  style={{ paddingLeft: '16px' }}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    {hasColumns ? (
                      <button
                        type="button"
                        onClick={(e) => toggleCollapse(block.id, e)}
                        className="p-0.5 text-current hover:opacity-80"
                      >
                        {isCollapsed ? (
                          <ChevronRight className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                    ) : (
                      <span className="w-3.5 h-3.5 inline-block shrink-0" />
                    )}
                    <span className="shrink-0">{getSectionIcon(block)}</span>
                    <span className="truncate">{formatBlockTitle(block)}</span>
                    {totalComponents > 0 && (
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400'
                        }`}
                      >
                        {totalComponents}
                      </span>
                    )}
                  </div>

                  {/* Actions on hover */}
                  <div
                    className={`flex items-center gap-0.5 ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    } transition-opacity`}
                  >
                    {onMoveUp && (
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveUp(index);
                        }}
                        className="p-0.5 hover:opacity-80 disabled:opacity-20"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                    )}
                    {onMoveDown && (
                      <button
                        type="button"
                        disabled={index === blocks.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveDown(index);
                        }}
                        className="p-0.5 hover:opacity-80 disabled:opacity-20"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    )}
                    {onDuplicateBlock && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateBlock(index);
                        }}
                        className="p-0.5 hover:opacity-80"
                        title="Duplicate Section"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                    {onDeleteBlock && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteBlock(index);
                        }}
                        className="p-0.5 hover:opacity-80 hover:text-rose-400"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Columns & Nested Components */}
                {!isCollapsed && hasColumns && (
                  <div className="space-y-0.5 relative before:absolute before:left-5 before:top-1 before:bottom-1 before:w-px before:bg-slate-200 dark:before:bg-neutral-800">
                    {columns.map((col: any, colIdx: number) => {
                      const colComponents = col.components || [];
                      const colKey = `${block.id}-col-${colIdx}`;
                      const isColCollapsed = Boolean(collapsedNodes[colKey]);

                      return (
                        <div key={col.id || colIdx} className="space-y-0.5">
                          {/* Column Header */}
                          <div
                            onClick={(e) => toggleCollapse(colKey, e)}
                            className="flex items-center justify-between py-0.5 px-2 rounded text-[10px] text-slate-500 dark:text-neutral-400 hover:bg-slate-100/50 dark:hover:bg-neutral-900/50 cursor-pointer"
                            style={{ paddingLeft: '28px' }}
                          >
                            <div className="flex items-center gap-1">
                              {colComponents.length > 0 && (
                                <span className="p-0.5">
                                  {isColCollapsed ? (
                                    <ChevronRight className="w-2.5 h-2.5" />
                                  ) : (
                                    <ChevronDown className="w-2.5 h-2.5" />
                                  )}
                                </span>
                              )}
                              <Columns className="w-2.5 h-2.5 text-slate-400" />
                              <span>Column {colIdx + 1}</span>
                            </div>
                            <span className="text-[9px] font-mono opacity-60">
                              {colComponents.length} items
                            </span>
                          </div>

                          {/* Components inside column */}
                          {!isColCollapsed && (
                            <div className="space-y-0.5">
                              {colComponents.map((comp: ShadcnComponentInstance) =>
                                renderComponentTree(comp, block.id, 2.5)
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
