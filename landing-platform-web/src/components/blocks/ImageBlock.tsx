'use client';
import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { BlockStyles } from '../../../../shared/types';

export interface ImageBlockProps {
  imageUrl?: string;
  altText?: string;
  caption?: string;
  aspectRatio?: '16:9' | '4:3' | '21:9' | 'auto';
  fullWidth?: boolean;
  styles?: BlockStyles;
}

export function ImageBlock({
  imageUrl = 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1600&q=80',
  altText = 'Precision Mechanical Keyboard Hardware',
  caption = 'Anodized CNC Aluminum Case & PBT Dye-Sub Keycaps',
  aspectRatio = '16:9',
  fullWidth = false,
  styles,
}: ImageBlockProps) {
  const [imgError, setImgError] = useState(false);

  const aspectClasses = {
    '16:9': 'aspect-[16/9]',
    '4:3': 'aspect-[4/3]',
    '21:9': 'aspect-[21/9]',
    'auto': 'aspect-auto',
  }[aspectRatio] || 'aspect-[16/9]';

  const fontStyle = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    space: 'font-mono tracking-tight',
    jakarta: 'font-sans',
  }[styles?.fontFamily || 'sans'];

  return (
    <figure
      className={`relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-[0_1px_3px_0_rgba(0,0,0,0.5)] ${
        fullWidth ? 'w-full' : 'max-w-4xl mx-auto'
      } ${fontStyle}`}
      style={{
        backgroundColor: styles?.backgroundColor,
        color: styles?.textColor,
      }}
    >
      <div className={`relative w-full overflow-hidden bg-neutral-900 ${aspectClasses}`}>
        {imgError || !imageUrl ? (
          <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center p-6 text-neutral-400 border border-dashed border-neutral-800">
            <ImageIcon className="w-10 h-10 mb-2 stroke-1 text-neutral-400" />
            <span className="text-xs font-mono">No Image Attached / Invalid URL</span>
            <span className="text-[11px] text-neutral-400 mt-1">Configure Image URL in Inspector</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={altText}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.01]"
            loading="lazy"
          />
        )}
      </div>

      {caption && (
        <figcaption className="p-3.5 border-t border-neutral-900 bg-neutral-950/90 text-center text-xs text-neutral-400 font-medium">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
