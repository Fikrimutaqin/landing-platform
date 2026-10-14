'use client';

import React from 'react';
import { ContainerLayout, ShadcnComponentInstance, BlockStyles } from '../../../../shared/types';
import { ShadcnRenderer } from '../shadcn-catalog/ShadcnRenderer';
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
  Sparkles,
  X,
} from 'lucide-react';

export interface ColumnData {
  id: string;
  name?: string;
  columnWidth?: string;
  components: ShadcnComponentInstance[];
}

export interface ContainerBlockProps {
  layout: ContainerLayout;
  columnsContent: ColumnData[];
  styles?: BlockStyles;
  label?: string;
  isPreviewMode?: boolean;
  selectedComponentId?: string | null;
  onSelectComponent?: (id: string) => void;
  onAddComponentToColumn?: (colIndex: number) => void;
  onUpdateLayout?: (layout: Partial<ContainerLayout>) => void;
  onAddColumn?: () => void;
  onDeleteColumn?: (colIndex: number) => void;
  onDeleteComponent?: (compId: string) => void;
  onUpdateComponentProps?: (compId: string, updatedProps: Record<string, any>) => void;
  onAddChildComponent?: (parentId: string, type: any, defaultProps: Record<string, any>) => void;
  onMoveChildComponent?: (parentId: string, fromIndex: number, toIndex: number) => void;
  onDeleteChildComponent?: (parentId: string, childId: string) => void;
  onUpdateChildProps?: (childId: string, updatedProps: Record<string, any>) => void;
}

export function ContainerBlock({
  layout,
  columnsContent,
  styles,
  label,
  isPreviewMode = false,
  selectedComponentId,
  onSelectComponent,
  onAddComponentToColumn,
  onUpdateLayout,
  onAddColumn,
  onDeleteColumn,
  onDeleteComponent,
  onUpdateComponentProps,
  onAddChildComponent,
  onMoveChildComponent,
  onDeleteChildComponent,
  onUpdateChildProps,
}: ContainerBlockProps) {
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
  }[layout.gap || 'md'];

  const justifyClass = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  }[layout.justify || 'between'];

  const alignClass = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }[layout.align || 'center'];

  const isGrid = layout.display === 'grid';
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
  }[layout.columns || 2];

  const layoutContainerClass = isGrid
    ? `grid ${gridColsClass} ${gapClass} ${alignClass}`
    : `flex ${layout.flexDirection === 'col' ? 'flex-col' : 'flex-col md:flex-row'} ${justifyClass} ${alignClass} ${gapClass}`;

  const hasBgImage = Boolean(styles?.backgroundImage);

  const sectionBorderRadiusClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  }[styles?.borderRadius || '2xl'] || 'rounded-2xl';

  const sectionPaddingClass = styles?.padding ? {
    none: 'p-0',
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-12',
    xl: 'p-10 sm:p-16',
    '2xl': 'p-12 sm:p-20',
  }[styles.padding] : (
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
  const sectionMarginClass = (styles?.margin && sectionMarginMap[styles.margin]) || '';

  const sectionShadowMap: Record<string, string> = {
    none: 'shadow-none',
    sm: 'shadow-sm dark:shadow-[0_2px_8px_rgba(0,0,0,0.5)]',
    md: 'shadow-md dark:shadow-[0_4px_16px_rgba(0,0,0,0.65)]',
    lg: 'shadow-lg dark:shadow-[0_10px_30px_rgba(0,0,0,0.8)]',
    xl: 'shadow-xl dark:shadow-[0_20px_45px_rgba(0,0,0,0.9)]',
    '2xl': 'shadow-2xl dark:shadow-[0_25px_65px_rgba(0,0,0,0.95)]',
  };
  const sectionShadowClass = (styles?.shadow && sectionShadowMap[styles.shadow]) || 'shadow-sm dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]';

  const sectionStyle: React.CSSProperties = {
    backgroundColor: styles?.backgroundColor || '#090a0f',
    color: styles?.textColor || '#ffffff',
    ...(styles?.borderWidth !== undefined
      ? {
          borderWidth: `${styles.borderWidth}px`,
          borderStyle: styles.borderStyle || 'solid',
          borderColor: styles.borderColor || 'rgba(150, 150, 150, 0.4)',
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
        <div className="relative z-20 mb-4 pb-2.5 border-b border-neutral-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-950 border border-blue-800 text-blue-300">
            {label || (isGrid ? `GRID (${layout.columns} COL)` : `FLEX (${layout.flexDirection?.toUpperCase() || 'ROW'})`)}
          </span>
          <span className="text-[11px] text-neutral-400 font-medium">
            {isGrid ? "CSS Grid Layout" : "Flexbox Flow Engine"}
          </span>
        </div>

        {/* Quick layout switcher */}
        {onUpdateLayout && (
          <div className="flex items-center gap-1 bg-neutral-950/80 border border-neutral-800/80 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateLayout({ display: 'flex', flexDirection: 'row' });
              }}
              className={`px-2 py-1 text-[10px] font-medium rounded ${
                !isGrid && layout.flexDirection !== 'col'
                  ? "bg-blue-600 text-white font-bold"
                  : "text-neutral-400 hover:text-white"
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
                  : "text-neutral-400 hover:text-white"
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
                  : "text-neutral-400 hover:text-white"
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
                  : "text-neutral-400 hover:text-white"
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
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-md border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
          >
            <Plus className="w-3 h-3 text-emerald-400" />
            <span>Add Column</span>
          </button>
        )}
      </div>
      )}

      {/* Main Flex / Grid Columns */}
      <div className={`relative z-10 w-full ${layoutContainerClass}`}>
        {columnsContent.map((col, colIdx) => (
          <div
            key={col.id || colIdx}
            className={`relative rounded-xl transition-colors flex flex-col gap-3 min-w-0 ${
              isPreviewMode
                ? "p-0 border-0 bg-transparent"
                : "border border-dashed border-neutral-800/80 p-3 sm:p-4 bg-neutral-950/20 hover:border-neutral-700/80"
            } ${
              col.columnWidth === '1/2' ? 'md:w-1/2' : col.columnWidth === '1/3' ? 'md:w-1/3' : 'flex-1'
            }`}
          >
            {/* Column Label / Header */}
            {!isPreviewMode && (
              <div className="flex items-center justify-between pb-1.5 border-b border-neutral-900/60 text-[10px] font-mono text-neutral-500">
              <span className="font-semibold text-neutral-400">
                {col.name || (colIdx === 0 ? "Column 1 (Name Web / Logo)" : colIdx === 1 ? "Column 2 (Label Menu & CTA)" : `Column ${colIdx + 1}`)}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400">
                  {col.columnWidth || "flex-1"}
                </span>
                {onDeleteColumn && columnsContent.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteColumn(colIdx);
                    }}
                    className="p-1 hover:text-red-400 text-neutral-600 transition-colors"
                    title="Delete column"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>
            )}

            {/* Render nested ShadCN components */}
            <div className="flex flex-col gap-2.5">
              {col.components.map((comp) => (
                <div key={comp.id} className="relative group/compitem">
                  <ShadcnRenderer
                    component={comp}
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
                  {!isPreviewMode && onDeleteComponent && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteComponent(comp.id);
                      }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-900/80 hover:bg-red-700 text-white flex items-center justify-center opacity-0 group-hover/compitem:opacity-100 transition-opacity z-30 text-[9px]"
                      title="Remove component"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* In-column Add Component trigger */}
            {!isPreviewMode && onAddComponentToColumn && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddComponentToColumn(colIdx);
                }}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-dashed border-neutral-800 hover:border-blue-500/60 bg-neutral-950/40 hover:bg-neutral-900/60 text-[11px] font-medium text-neutral-400 hover:text-blue-300 transition-all active:scale-95"
              >
                <Plus className="w-3 h-3 text-blue-400" />
                <span>Add ShadCN Component ({col.components.length})</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
