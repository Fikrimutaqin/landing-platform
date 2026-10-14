'use client';

import React, { useRef, useState } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, X } from 'lucide-react';
import { Input } from '../ui/input';

interface ImageSourcePickerProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  showPreview?: boolean;
}

export function ImageSourcePicker({
  label = 'Image Source',
  value = '',
  onChange,
  placeholder = 'Enter image URL or upload file...',
  showPreview = true,
}: ImageSourcePickerProps) {
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onChange(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        {label && <label className="font-medium text-slate-700 dark:text-neutral-300">{label}</label>}
        {/* Toggle between URL input and Device upload */}
        <div className="flex bg-slate-100 dark:bg-neutral-900 p-0.5 rounded-md border border-slate-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors flex items-center gap-1 ${
              mode === 'url'
                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
            }`}
          >
            <LinkIcon className="w-2.5 h-2.5" />
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors flex items-center gap-1 ${
              mode === 'upload'
                ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
            }`}
          >
            <Upload className="w-2.5 h-2.5" />
            Device
          </button>
        </div>
      </div>

      {/* Preview if image is present */}
      {showPreview && Boolean(value) && (
        <div className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/60 p-1.5 flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-200 dark:bg-neutral-800 shrink-0 border border-slate-200 dark:border-neutral-700 flex items-center justify-center">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <div className="text-[11px] font-medium text-slate-700 dark:text-neutral-200 truncate">
              {value.startsWith('data:') ? 'Image uploaded from device' : value}
            </div>
            <div className="text-[10px] text-slate-400 dark:text-neutral-500 truncate">
              {value.startsWith('data:') ? 'Local file (Base64)' : 'External link'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
            title="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Mode 1: URL input */}
      {mode === 'url' ? (
        <div className="flex items-center gap-1.5">
          <Input
            value={value.startsWith('data:') ? '' : value}
            placeholder={value.startsWith('data:') ? 'Uploaded from device (paste URL to replace)' : placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="text-xs h-8 bg-white dark:bg-neutral-900"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors shrink-0"
            title="Or upload file from device"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Mode 2: Device Upload */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-3 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 bg-slate-50/60 dark:bg-neutral-900/40'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <Upload className="w-4 h-4 text-slate-400 dark:text-neutral-500" />
            <span className="text-[11px] font-medium text-slate-700 dark:text-neutral-300">
              Click to choose from device
            </span>
            <span className="text-[10px] text-slate-400 dark:text-neutral-500">
              PNG, JPG, SVG, WebP up to 10MB
            </span>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
