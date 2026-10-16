'use client';

import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {
  ContainerLayout,
  ShadcnComponentInstance,
  BlockStyles,
  StyleClass,
  DesignTokens,
} from '../../../../shared/types';
import { ShadcnRenderer } from '../shadcn-catalog/ShadcnRenderer';
import { SortableComponentWrapper } from '../builder/SortableComponentWrapper';
import { useTheme } from '../theme/ThemeProvider';
import {
  Plus,
  Trash2,
  Columns,
  Grid,
  Maximize2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowRight,
  X,
} from 'lucide-react';

export interface ColumnData {
  id: string;
  name?: string;
  columnWidth?: string;
  components: ShadcnComponentInstance[];
}

export interface ContainerBlockProps {
  blockId?: string;
  layout: ContainerLayout;
  columnsContent: ColumnData[];
  styles?: BlockStyles;
  label?: string;
  viewport?: 'desktop' | 'tablet' | 'mobile';
  styleClasses?: StyleClass[];
  tokens?: DesignTokens;
  isPreviewMode?: boolean;
  selectedComponentId?: string | null;
  onSelectComponent?: (id: string) => void;
  onAddComponentToColumn?: (colIndex: number) => void;
  onUpdateLayout?: (layout: Partial<ContainerLayout>) => void;
  onAddColumn?: () => void;
  onDeleteColumn?: (colIndex: number) => void;
  onDeleteComponent?: (compId: string) => void;
  onDuplicateComponent?: (compId: string) => void;
  onMoveComponentUpDown?: (compId: string, direction: 'up' | 'down') => void;
  onDropElementFromSidebar?: (colIndex: number, payload: any, insertIndex?: number) => void;
  onUpdateComponentProps?: (compId: string, updatedProps: Record<string, any>) => void;
  onAddChildComponent?: (parentId: string, type: any, defaultProps: Record<string, any>) => void;
  onMoveChildComponent?: (parentId: string, fromIndex: number, toIndex: number) => void;
  onDeleteChildComponent?: (parentId: string, childId: string) => void;
  onUpdateChildProps?: (childId: string, updatedProps: Record<string, any>) => void;
}

export function ContainerBlock({
  blockId,
  layout,
  columnsContent,
  styles,
  label,
  viewport,
  styleClasses = [],
  tokens,
  isPreviewMode = false,
  selectedComponentId,
  onSelectComponent,
  onAddComponentToColumn,
  onUpdateLayout,
  onAddColumn,
  onDeleteColumn,
  onDeleteComponent,
  onDuplicateComponent,
  onMoveComponentUpDown,
  onDropElementFromSidebar,
  onUpdateComponentProps,
  onAddChildComponent,
  onMoveChildComponent,
  onDeleteChildComponent,
  onUpdateChildProps,
}: ContainerBlockProps) {
  // Resolve effective layout for active viewport with mobile -> tablet -> desktop inheritance
  const isTablet = viewport === 'tablet';
  const isMobile = viewport === 'mobile';

  const activeDisplay = (isMobile ? layout.mobile?.display : isTablet ? layout.tablet?.display : undefined) ?? layout.display;
  const activeFlexDirection = (isMobile ? layout.mobile?.flexDirection : isTablet ? layout.tablet?.flexDirection : undefined) ?? layout.flexDirection;
  const activeReverse = (isMobile ? layout.mobile?.reverse : isTablet ? layout.tablet?.reverse : undefined) ?? layout.reverse;
  const activeJustify = (isMobile ? layout.mobile?.justify : isTablet ? layout.tablet?.justify : undefined) ?? layout.justify;
  const activeAlign = (isMobile ? layout.mobile?.align : isTablet ? layout.tablet?.align : undefined) ?? layout.align;
  const activeColumns = (isMobile ? layout.mobile?.columns : isTablet ? layout.tablet?.columns : undefined) ?? layout.columns;
  const activeGap = (isMobile ? layout.mobile?.gap : isTablet ? layout.tablet?.gap : undefined) ?? layout.gap;
  const activeMaxWidth = (isMobile ? layout.mobile?.maxWidth : isTablet ? layout.tablet?.maxWidth : undefined) ?? layout.maxWidth;
  const activeContentPos = (isMobile ? layout.mobile?.contentPosition : isTablet ? layout.tablet?.contentPosition : undefined) ?? layout.contentPosition;

  const fontClass = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    space: 'font-mono tracking-tight',
    jakarta: 'font-sans',
  }[styles?.fontFamily || 'sans'];

  const gapClass = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12 sm:gap-16',
  }[activeGap || 'md'];

  const justifyClass = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  }[activeJustify || 'between'];

  const alignClass = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }[activeAlign || 'center'];

  const isGrid = activeDisplay === 'grid';
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6',
    12: 'grid-cols-1 lg:grid-cols-12',
  }[activeColumns || 2];

  // In live viewport simulation or fallback to responsive classes
  const flexDirClass = viewport
    ? (activeFlexDirection === 'col'
        ? (activeReverse ? 'flex-col-reverse' : 'flex-col')
        : (activeReverse ? 'flex-row-reverse' : 'flex-row'))
    : `${(layout.mobile?.flexDirection ?? layout.tablet?.flexDirection ?? layout.flexDirection) === 'col' ? (activeReverse ? 'flex-col-reverse' : 'flex-col') : (activeReverse ? 'flex-row-reverse' : 'flex-row')} ${
        (layout.tablet?.flexDirection ?? layout.flexDirection) === 'col' ? 'md:flex-col' : 'md:flex-row'
      } ${layout.flexDirection === 'col' ? 'lg:flex-col' : 'lg:flex-row'}`;

  const maxWidthClass = {
    narrow: 'max-w-3xl',
    compact: 'max-w-5xl',
    boxed: 'max-w-7xl',
    full: 'w-full',
  }[activeMaxWidth || 'boxed'];

  const contentPosClass = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }[activeContentPos || 'center'];

  const layoutContainerClass = isGrid
    ? `grid ${gridColsClass} ${gapClass} ${alignClass}`
    : `flex ${flexDirClass} ${justifyClass} ${alignClass} ${gapClass}`;

  const hasBgImage = Boolean(styles?.backgroundImage);

  const activeBorderRadius = (isMobile ? styles?.mobile?.borderRadius : isTablet ? styles?.tablet?.borderRadius : undefined) ?? styles?.borderRadius;
  const activePadding = (isMobile ? styles?.mobile?.padding : isTablet ? styles?.tablet?.padding : undefined) ?? styles?.padding;
  const activeMargin = (isMobile ? styles?.mobile?.margin : isTablet ? styles?.tablet?.margin : undefined) ?? styles?.margin;

  const sectionBorderRadiusClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  }[activeBorderRadius || '2xl'] || 'rounded-2xl';

  const sectionPaddingClass = activePadding ? {
    none: 'p-0',
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-12',
    xl: 'p-10 sm:p-16',
    '2xl': 'p-12 sm:p-20',
  }[activePadding] : (
    styles?.paddingY === 'none' ? 'py-0 px-4 sm:px-7' :
    styles?.paddingY === 'compact' ? 'py-4 sm:py-6 px-4 sm:px-7' :
    styles?.paddingY === 'spacious' ? 'py-12 sm:py-20 px-4 sm:px-7' :
    'p-4 sm:p-7'
  );

  const sectionMarginMap: Record<string, string> = {
    none: 'my-0',
    xs: 'my-1',
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-6',
    xl: 'my-8',
    '2xl': 'my-12',
  };
  const sectionMarginClass = (activeMargin && sectionMarginMap[activeMargin]) || '';

  const sectionShadowMap: Record<string, string> = {
    none: 'shadow-none',
    sm: 'shadow-sm dark:shadow-[0_2px_8px_rgba(0,0,0,0.5)]',
    md: 'shadow-md dark:shadow-[0_4px_16px_rgba(0,0,0,0.65)]',
    lg: 'shadow-lg dark:shadow-[0_10px_30px_rgba(0,0,0,0.8)]',
    xl: 'shadow-xl dark:shadow-[0_20px_45px_rgba(0,0,0,0.9)]',
    '2xl': 'shadow-2xl dark:shadow-[0_25px_65px_rgba(0,0,0,0.95)]',
  };
  const sectionShadowClass = (styles?.shadow && sectionShadowMap[styles.shadow]) || 'shadow-sm dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]';

  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  // Determine effective background and text color adapting to light/dark mode
  const isDefaultDarkBg =
    !styles?.backgroundColor ||
    styles.backgroundColor === '#090a0f' ||
    styles.backgroundColor === '#0a0b0f' ||
    styles.backgroundColor === '#0c0d12' ||
    styles.backgroundColor === '#08090c' ||
    styles.backgroundColor === '#000000';

  const isDefaultLightBg =
    styles?.backgroundColor === '#ffffff' ||
    styles?.backgroundColor === '#fafafa' ||
    styles?.backgroundColor === '#f8fafc';

  let effectiveBgColor: string;
  let effectiveTextColor: string;

  if (styles?.backgroundColor === 'transparent') {
    effectiveBgColor = 'transparent';
  } else if (isLight) {
    // In light mode: default to bright white unless user explicitly picked a non-default color
    effectiveBgColor = isDefaultDarkBg ? '#ffffff' : (styles?.backgroundColor || '#ffffff');
  } else {
    // In dark mode: default to deep dark unless user explicitly picked a non-default color
    effectiveBgColor = isDefaultLightBg ? '#090a0f' : (styles?.backgroundColor || '#090a0f');
  }

  if (isLight) {
    effectiveTextColor =
      !styles?.textColor || styles.textColor === '#ffffff' || styles.textColor === '#fff'
        ? '#0f172a'
        : styles.textColor;
  } else {
    effectiveTextColor =
      !styles?.textColor ||
      styles.textColor === '#0f172a' ||
      styles.textColor === '#111827' ||
      styles.textColor === '#111111'
        ? '#ffffff'
        : styles.textColor;
  }

  const sectionStyle: React.CSSProperties = {
    backgroundColor: effectiveBgColor,
    color: effectiveTextColor,
    ...(styles?.borderWidth !== undefined
      ? {
          borderWidth: `${styles.borderWidth}px`,
          borderStyle: styles.borderStyle || 'solid',
          borderColor: styles.borderColor || (isLight ? 'rgba(203, 213, 225, 0.8)' : 'rgba(150, 150, 150, 0.4)'),
        }
      : {}),
    ...(styles?.borderColor && styles.borderWidth === undefined
      ? {
          borderWidth: '1px',
          borderColor: styles.borderColor,
          borderStyle: styles.borderStyle || 'solid',
        }
      : {}),
    ...(styles?.opacity !== undefined ? { opacity: styles.opacity / 100 } : {}),
  };

  return (
    <section
      className={`relative overflow-hidden transition-all group/container ${
        styles?.borderWidth === undefined ? 'border border-slate-200 dark:border-neutral-800/80' : ''
      } ${sectionBorderRadiusClass} ${sectionPaddingClass} ${sectionMarginClass} ${sectionShadowClass} ${fontClass}`}
      style={sectionStyle}
    >
      {/* Background image & overlay */}
      {hasBgImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center z-0 scale-105"
            style={{ backgroundImage: `url(${styles?.backgroundImage})` }}
          />
          <div
            className="absolute inset-0 z-0 bg-black"
            style={{ opacity: styles?.backgroundOverlay ?? 0.75 }}
          />
        </>
      )}

      {/* Elementor / Webflow Container Layout Badge Toolbar */}
      {!isPreviewMode && (
        <div className="relative z-20 mb-4 pb-2.5 border-b border-slate-200 dark:border-neutral-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
            {label || (isGrid ? `GRID (${layout.columns} COL)` : `FLEX (${layout.flexDirection?.toUpperCase() || 'ROW'})`)}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">
            {isGrid ? "CSS Grid Layout" : "Flexbox Flow Engine"}
          </span>
        </div>

        {/* Quick layout switcher */}
        {onUpdateLayout && (
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-neutral-950/80 border border-slate-200 dark:border-neutral-800/80 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateLayout({ display: 'flex', flexDirection: 'row' });
              }}
              className={`px-2 py-1 text-[10px] font-medium rounded ${
                !isGrid && layout.flexDirection !== 'col'
                  ? "bg-blue-600 text-white font-bold"
                  : "text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              Flex Row
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateLayout({ display: 'flex', flexDirection: 'col' });
              }}
              className={`px-2 py-1 text-[10px] font-medium rounded ${
                !isGrid && layout.flexDirection === 'col'
                  ? "bg-blue-600 text-white font-bold"
                  : "text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              Flex Col
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateLayout({ display: 'grid', columns: 2 });
              }}
              className={`px-2 py-1 text-[10px] font-medium rounded ${
                isGrid && layout.columns === 2
                  ? "bg-blue-600 text-white font-bold"
                  : "text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              Grid 2
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateLayout({ display: 'grid', columns: 3 });
              }}
              className={`px-2 py-1 text-[10px] font-medium rounded ${
                isGrid && layout.columns === 3
                  ? "bg-blue-600 text-white font-bold"
                  : "text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              Grid 3
            </button>
          </div>
        )}

        {/* Quick Add Column */}
        {onAddColumn && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddColumn();
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-md border border-slate-200 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-900/60 hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Plus className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
            <span>Add Column</span>
          </button>
        )}
      </div>
      )}

      {/* Main Flex / Grid Columns */}
      <div className={`relative z-10 ${maxWidthClass} ${contentPosClass} ${layoutContainerClass}`}>
        {columnsContent.map((col, colIdx) => (
          <DroppableColumn
            key={col.id || colIdx}
            col={col}
            colIdx={colIdx}
            blockId={blockId}
            isPreviewMode={isPreviewMode}
            selectedComponentId={selectedComponentId}
            viewport={viewport}
            styleClasses={styleClasses}
            tokens={tokens}
            activeReverse={activeReverse}
            columnsCount={columnsContent.length}
            onSelectComponent={onSelectComponent}
            onAddComponentToColumn={onAddComponentToColumn}
            onDeleteColumn={onDeleteColumn}
            onDeleteComponent={onDeleteComponent}
            onDuplicateComponent={onDuplicateComponent}
            onMoveComponentUpDown={onMoveComponentUpDown}
            onDropElementFromSidebar={onDropElementFromSidebar}
            onUpdateComponentProps={onUpdateComponentProps}
            onAddChildComponent={onAddChildComponent}
            onMoveChildComponent={onMoveChildComponent}
            onDeleteChildComponent={onDeleteChildComponent}
            onUpdateChildProps={onUpdateChildProps}
          />
        ))}
      </div>
    </section>
  );
}

interface DroppableColumnProps {
  col: ColumnData;
  colIdx: number;
  blockId?: string;
  isPreviewMode: boolean;
  selectedComponentId?: string | null;
  viewport?: 'desktop' | 'tablet' | 'mobile';
  styleClasses?: StyleClass[];
  tokens?: DesignTokens;
  activeReverse?: boolean;
  columnsCount: number;
  onSelectComponent?: (id: string) => void;
  onAddComponentToColumn?: (colIndex: number) => void;
  onDeleteColumn?: (colIndex: number) => void;
  onDeleteComponent?: (compId: string) => void;
  onDuplicateComponent?: (compId: string) => void;
  onMoveComponentUpDown?: (compId: string, direction: 'up' | 'down') => void;
  onDropElementFromSidebar?: (colIndex: number, payload: any, insertIndex?: number) => void;
  onUpdateComponentProps?: (compId: string, updatedProps: Record<string, any>) => void;
  onAddChildComponent?: (parentId: string, type: any, defaultProps: Record<string, any>) => void;
  onMoveChildComponent?: (parentId: string, fromIndex: number, toIndex: number) => void;
  onDeleteChildComponent?: (parentId: string, childId: string) => void;
  onUpdateChildProps?: (childId: string, updatedProps: Record<string, any>) => void;
}

function DroppableColumn({
  col,
  colIdx,
  blockId,
  isPreviewMode,
  selectedComponentId,
  viewport,
  styleClasses = [],
  tokens,
  activeReverse,
  columnsCount,
  onSelectComponent,
  onAddComponentToColumn,
  onDeleteColumn,
  onDeleteComponent,
  onDuplicateComponent,
  onMoveComponentUpDown,
  onDropElementFromSidebar,
  onUpdateComponentProps,
  onAddChildComponent,
  onMoveChildComponent,
  onDeleteChildComponent,
  onUpdateChildProps,
}: DroppableColumnProps) {
  const [isSidebarDragOver, setIsSidebarDragOver] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: `col_drop_${blockId || 'blk'}_${colIdx}`,
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsSidebarDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSidebarDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSidebarDragOver(false);
    try {
      const raw = e.dataTransfer.getData('application/json');
      if (raw) {
        const payload = JSON.parse(raw);
        if (onDropElementFromSidebar) {
          onDropElementFromSidebar(colIdx, payload);
        }
      }
    } catch (err) {
      console.error('Failed to parse dropped element into column:', err);
    }
  };

  const isHighlighted = !isPreviewMode && (isOver || isSidebarDragOver);

  return (
    <div
      ref={setNodeRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        order: activeReverse ? columnsCount - colIdx : colIdx + 1,
      }}
      className={`relative rounded-xl transition-all flex flex-col gap-3 min-w-0 ${
        isPreviewMode
          ? 'p-0 border-0 bg-transparent'
          : isHighlighted
          ? 'border-2 border-dashed border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.3)] ring-2 ring-blue-500/20'
          : 'border border-dashed border-slate-300 dark:border-neutral-800/80 p-3 sm:p-4 bg-slate-50/70 dark:bg-neutral-950/20 hover:border-slate-400 dark:hover:border-neutral-700/80'
      } ${
        col.columnWidth === '1/2' ? 'md:w-1/2' : col.columnWidth === '1/3' ? 'md:w-1/3' : 'flex-1'
      }`}
    >
      {/* Column Header */}
      {!isPreviewMode && (
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-neutral-900/60 text-[10px] font-mono text-slate-500 dark:text-neutral-500 select-none">
          <span className="font-semibold text-slate-700 dark:text-neutral-400">
            {col.name || (colIdx === 0 ? 'Column 1 (Name Web / Logo)' : colIdx === 1 ? 'Column 2 (Label Menu & CTA)' : `Column ${colIdx + 1}`)}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400">
              {col.columnWidth || 'flex-1'}
            </span>
            {onDeleteColumn && columnsCount > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteColumn(colIdx);
                }}
                className="p-1 hover:text-red-500 text-slate-400 dark:text-neutral-600 transition-colors cursor-pointer"
                title="Delete column"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Empty State Drop Zone */}
      {!isPreviewMode && (!col.components || col.components.length === 0) ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onAddComponentToColumn) onAddComponentToColumn(colIdx);
          }}
          className="py-8 px-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-neutral-800 hover:border-blue-500/80 bg-slate-100/70 dark:bg-neutral-900/30 hover:bg-blue-500/5 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all group/empty select-none"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover/empty:scale-110 transition-transform shadow-xs">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-neutral-300 group-hover/empty:text-blue-500 transition-colors">
              Drag elements here or click to add
            </div>
            <div className="text-[10px] text-slate-500 dark:text-neutral-500 mt-0.5">
              Drop buttons, typography, cards or forms
            </div>
          </div>
        </div>
      ) : (
        /* Render nested ShadCN components with Sortable Context */
        <SortableContext
          items={(col.components || []).map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2.5">
            {(col.components || []).map((comp, compIdx) => (
              <SortableComponentWrapper
                key={comp.id}
                id={comp.id}
                component={comp}
                index={compIdx}
                totalCount={col.components.length}
                isSelected={!isPreviewMode && selectedComponentId === comp.id}
                isPreviewMode={isPreviewMode}
                onSelect={() => onSelectComponent && onSelectComponent(comp.id)}
                onMoveUp={() => onMoveComponentUpDown && onMoveComponentUpDown(comp.id, 'up')}
                onMoveDown={() => onMoveComponentUpDown && onMoveComponentUpDown(comp.id, 'down')}
                onDuplicate={() => onDuplicateComponent && onDuplicateComponent(comp.id)}
                onDelete={() => onDeleteComponent && onDeleteComponent(comp.id)}
                onDropFromSidebar={(payload, targetIdx) =>
                  onDropElementFromSidebar && onDropElementFromSidebar(colIdx, payload, targetIdx)
                }
              >
                <ShadcnRenderer
                  component={comp}
                  viewport={viewport}
                  styleClasses={styleClasses}
                  tokens={tokens}
                  isSelected={!isPreviewMode && selectedComponentId === comp.id}
                  selectedComponentId={selectedComponentId}
                  isPreviewMode={isPreviewMode}
                  onSelect={() => onSelectComponent && onSelectComponent(comp.id)}
                  onSelectChild={(childId) => onSelectComponent && onSelectComponent(childId)}
                  onUpdateProps={(newProps) =>
                    onUpdateComponentProps && onUpdateComponentProps(comp.id, newProps)
                  }
                  onDelete={() => onDeleteComponent && onDeleteComponent(comp.id)}
                  onAddChild={onAddChildComponent}
                  onMoveChild={onMoveChildComponent}
                  onDeleteChild={onDeleteChildComponent}
                  onUpdateChildProps={onUpdateChildProps}
                />
              </SortableComponentWrapper>
            ))}
          </div>
        </SortableContext>
      )}

      {/* In-column Add Component trigger */}
      {!isPreviewMode && onAddComponentToColumn && col.components && col.components.length > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddComponentToColumn(colIdx);
          }}
          className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-dashed border-slate-300 dark:border-neutral-800 hover:border-blue-500/60 bg-white dark:bg-neutral-950/40 hover:bg-slate-50 dark:hover:bg-neutral-900/60 text-[11px] font-medium text-slate-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-300 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-3 h-3 text-blue-500 dark:text-blue-400" />
          <span>Add ShadCN Component ({col.components.length})</span>
        </button>
      )}
    </div>
  );
}
