'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Component,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { ShadcnComponentInstance } from '../../../../shared/types';

interface SortableComponentWrapperProps {
  id: string;
  component: ShadcnComponentInstance;
  index: number;
  totalCount: number;
  isSelected: boolean;
  isPreviewMode: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onDropFromSidebar?: (payload: any, insertIndex: number) => void;
  children: React.ReactNode;
}

export function SortableComponentWrapper({
  id,
  component,
  index,
  totalCount,
  isSelected,
  isPreviewMode,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onDropFromSidebar,
  children,
}: SortableComponentWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropTargetBefore, setIsDropTargetBefore] = useState(false);
  const [isDropTargetAfter, setIsDropTargetAfter] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 60 : isSelected ? 40 : isHovered ? 30 : 1,
  };

  const getElementLabel = () => {
    if (component.props?.label) return `${component.type}: "${component.props.label}"`;
    if (component.props?.title) return `${component.type}: "${component.props.title}"`;
    if (component.props?.variant) return `${component.type} (${component.props.variant})`;
    return component.type;
  };

  if (isPreviewMode) {
    return <div className="w-full">{children}</div>;
  }

  // HTML5 Drag & Drop handlers for dropping elements from AddElementsPanel
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    if (e.clientY < midY) {
      setIsDropTargetBefore(true);
      setIsDropTargetAfter(false);
    } else {
      setIsDropTargetBefore(false);
      setIsDropTargetAfter(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropTargetBefore(false);
    setIsDropTargetAfter(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const targetIdx = isDropTargetBefore ? index : index + 1;
    setIsDropTargetBefore(false);
    setIsDropTargetAfter(false);

    try {
      const raw = e.dataTransfer.getData('application/json');
      if (raw) {
        const payload = JSON.parse(raw);
        if (onDropFromSidebar) {
          onDropFromSidebar(payload, targetIdx);
        }
      }
    } catch (err) {
      console.error('Failed to parse dropped element:', err);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group/compitem w-full transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Visual Drop Line Indicator (Before) */}
      {isDropTargetBefore && (
        <div className="absolute -top-1.5 inset-x-0 h-1 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)] z-50 animate-pulse pointer-events-none flex items-center justify-center">
          <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold shadow">
            Insert Here
          </span>
        </div>
      )}

      {/* Webflow-Style Hover Boundary & Selection Overlay Box */}
      <div
        className={`relative rounded-xl transition-all ${
          isSelected
            ? component.isMasterInstance
              ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-white dark:ring-offset-[#08090c] shadow-lg shadow-purple-950/20'
              : 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-[#08090c] shadow-lg shadow-blue-950/20'
            : isHovered && !isDragging
            ? component.isMasterInstance
              ? 'ring-1 ring-purple-400/80 ring-offset-1 ring-offset-white dark:ring-offset-[#08090c]'
              : 'ring-1 ring-blue-400/70 ring-offset-1 ring-offset-white dark:ring-offset-[#08090c]'
            : ''
        }`}
      >
        {/* Webflow Element Tag Badge (Top-Left Pill on Hover or Selection) */}
        {(isSelected || isHovered) && !isDragging && (
          <div
            className={`absolute -top-3.5 left-2 z-40 flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-tight shadow-md select-none pointer-events-none transition-all ${
              component.isMasterInstance
                ? isSelected
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-900/90 text-purple-200 border border-purple-500/40'
                : isSelected
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-blue-300 dark:bg-neutral-800 dark:text-blue-300 border border-blue-500/30'
            }`}
          >
            <Component className="w-2.5 h-2.5" />
            <span className="truncate max-w-44">
              {component.isMasterInstance ? `❖ ${getElementLabel()}` : getElementLabel()}
            </span>
          </div>
        )}

        {/* Floating Quick Action Toolbar (Top-Right on Selection) */}
        {isSelected && !isDragging && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute -top-3.5 right-2 z-40 flex items-center gap-0.5 px-1 py-0.5 rounded-md bg-slate-900/95 dark:bg-[#0c0d14]/95 text-white border border-blue-500/50 shadow-xl backdrop-blur-xs text-[10px] select-none animate-in fade-in zoom-in-95 duration-100"
          >
            {/* Drag Handle */}
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-neutral-800 text-slate-300 hover:text-white rounded"
              title="Drag to reorder element"
            >
              <GripVertical className="w-3 h-3 text-blue-400" />
            </button>

            {/* Move Up */}
            <button
              type="button"
              disabled={index === 0}
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              className="p-1 hover:bg-neutral-800 disabled:opacity-20 text-slate-300 hover:text-white rounded"
              title="Move element up"
            >
              <ArrowUp className="w-3 h-3" />
            </button>

            {/* Move Down */}
            <button
              type="button"
              disabled={index === totalCount - 1}
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              className="p-1 hover:bg-neutral-800 disabled:opacity-20 text-slate-300 hover:text-white rounded"
              title="Move element down"
            >
              <ArrowDown className="w-3 h-3" />
            </button>

            {/* Duplicate */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              className="p-1 hover:bg-neutral-800 text-slate-300 hover:text-white rounded"
              title="Duplicate element"
            >
              <Copy className="w-3 h-3 text-cyan-400" />
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 hover:bg-red-950/80 text-slate-400 hover:text-red-400 rounded"
              title="Delete element"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Render child component content */}
        {children}
      </div>

      {/* Visual Drop Line Indicator (After) */}
      {isDropTargetAfter && (
        <div className="absolute -bottom-1.5 inset-x-0 h-1 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)] z-50 animate-pulse pointer-events-none flex items-center justify-center">
          <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold shadow">
            Insert Here
          </span>
        </div>
      )}
    </div>
  );
}
