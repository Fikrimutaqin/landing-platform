'use client';

import React from 'react';
import { ChevronRight, Folder, Box, Columns, Component } from 'lucide-react';
import { BlockItem } from './ElementorSidebar';
import { ShadcnComponentInstance } from '../../../../shared/types';

interface BreadcrumbBarProps {
  blocks: BlockItem[];
  selectedBlockId: string | null;
  selectedComponentId: string | null;
  onSelectBlock: (id: string) => void;
  onSelectComponent: (componentId: string, blockId: string) => void;
  onDeselectAll: () => void;
}

export function BreadcrumbBar({
  blocks,
  selectedBlockId,
  selectedComponentId,
  onSelectBlock,
  onSelectComponent,
  onDeselectAll,
}: BreadcrumbBarProps) {
  if (!selectedBlockId && !selectedComponentId) return null;

  const activeBlock = blocks.find((b) => b.id === selectedBlockId);
  if (!activeBlock) return null;

  const formatBlockName = (block: BlockItem) => {
    if (block.content?.label) return block.content.label;
    if (block.content?.alexSection) {
      const s = block.content.alexSection;
      return `Alex ${s.charAt(0).toUpperCase() + s.slice(1)}`;
    }
    if (block.type === 'CONTAINER') {
      return block.layout?.display === 'grid'
        ? `Grid (${block.layout?.columns || 2} Cols)`
        : `Flex (${block.layout?.flexDirection || 'row'})`;
    }
    return block.type
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Find component path if selectedComponentId is set
  const componentInfo: { name: string; columnIndex?: number } | null = (() => {
    if (!selectedComponentId || !activeBlock.columnsContent) return null;
    for (let colIdx = 0; colIdx < activeBlock.columnsContent.length; colIdx++) {
      const col = activeBlock.columnsContent[colIdx];
      const findInList = (list: ShadcnComponentInstance[]): { name: string; columnIndex?: number } | null => {
        for (const item of list) {
          if (item.id === selectedComponentId) {
            return {
              name: item.props?.label || item.props?.title || item.type,
              columnIndex: colIdx,
            };
          }
          if (item.children && item.children.length > 0) {
            const childResult = findInList(item.children);
            if (childResult) return childResult;
          }
        }
        return null;
      };
      const found = findInList(col.components || []);
      if (found) return found;
    }
    return null;
  })();

  return (
    <nav className="h-7 px-3 bg-white/95 dark:bg-[#08090c]/95 border-t border-slate-200 dark:border-neutral-900 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-neutral-400 select-none backdrop-blur-xs z-30 shrink-0">
      <button
        type="button"
        onClick={onDeselectAll}
        className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
        title="Deselect all (Focus Body)"
      >
        <Folder className="w-3 h-3 text-slate-400" />
        <span>Body</span>
      </button>

      <ChevronRight className="w-3 h-3 text-slate-300 dark:text-neutral-700" />

      <button
        type="button"
        onClick={() => onSelectBlock(activeBlock.id)}
        className={`flex items-center gap-1 font-medium transition-colors ${
          !selectedComponentId
            ? 'text-blue-600 dark:text-blue-400 font-semibold'
            : 'hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Box className="w-3 h-3" />
        <span className="truncate max-w-40">{formatBlockName(activeBlock)}</span>
      </button>

      {componentInfo?.columnIndex !== undefined && (
        <>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-neutral-700" />
          <span className="flex items-center gap-1 text-slate-400 dark:text-neutral-500">
            <Columns className="w-2.5 h-2.5" />
            <span>Col {componentInfo.columnIndex + 1}</span>
          </span>
        </>
      )}

      {selectedComponentId && componentInfo && (
        <>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-neutral-700" />
          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">
            <Component className="w-3 h-3" />
            <span className="truncate max-w-44">{componentInfo.name}</span>
          </span>
        </>
      )}
    </nav>
  );
}
