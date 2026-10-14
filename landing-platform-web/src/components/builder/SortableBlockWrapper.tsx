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
  Plus,
  Settings,
} from 'lucide-react';

interface SortableBlockWrapperProps {
  id: string;
  type: string;
  index: number;
  totalBlocks: number;
  isSelected: boolean;
  isPreviewMode: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onInsertBelow: () => void;
  children: React.ReactNode;
}

export function SortableBlockWrapper({
  id,
  type,
  index,
  totalBlocks,
  isSelected,
  isPreviewMode,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onInsertBelow,
  children,
}: SortableBlockWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);

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
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  const formatTypeName = (rawType: string) => {
    return rawType
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  if (isPreviewMode) {
    return <div className="w-full">{children}</div>;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group w-full transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Elementor-style Floating Control Bar */}
      {(isHovered || isSelected) && !isDragging && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-950/40 border border-blue-400/40 text-[11px] font-semibold tracking-wide select-none transition-all animate-in fade-in zoom-in-95 duration-100">
          {/* Drag Handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-blue-700 rounded-full text-blue-100 hover:text-white"
            title="Drag to reorder"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>

          {/* Block Label */}
          <span className="px-1.5 font-mono text-[10px] uppercase tracking-wider text-blue-100 font-bold border-r border-blue-400/30">
            {formatTypeName(type)}
          </span>

          {/* Move Up */}
          <button
            type="button"
            disabled={index === 0}
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            className="p-1 hover:bg-blue-700 disabled:opacity-30 disabled:hover:bg-transparent rounded-full"
            title="Move up"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          {/* Move Down */}
          <button
            type="button"
            disabled={index === totalBlocks - 1}
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            className="p-1 hover:bg-blue-700 disabled:opacity-30 disabled:hover:bg-transparent rounded-full"
            title="Move down"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1 hover:bg-blue-700 rounded-full"
            title="Duplicate section"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-rose-600 rounded-full"
            title="Delete section"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Elementor Section Outline Box */}
      <div
        className={`relative rounded-2xl transition-all ${
          isSelected
            ? 'ring-2 ring-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.5)]'
            : isHovered
            ? 'ring-1 ring-blue-500/50'
            : ''
        }`}
      >
        {children}
      </div>

      {/* Elementor-style "+ Add Section" Divider Below Block */}
      <div className="relative py-2 group/divider flex items-center justify-center opacity-0 group-hover:opacity-100 hover:!opacity-100 transition-opacity">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onInsertBelow();
          }}
          className="relative z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold shadow-md shadow-blue-900/30 transition-transform active:scale-95"
          title="Add block here"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Section</span>
        </button>
      </div>
    </div>
  );
}
