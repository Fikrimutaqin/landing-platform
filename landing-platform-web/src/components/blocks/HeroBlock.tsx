'use client';
import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BlockStyles } from '../../../../shared/types';

export interface HeroBlockProps {
  headline: string;
  subheadline: string;
  badgeText?: string;
  ctaText: string;
  onCtaClick?: () => void;
  styles?: BlockStyles;
}

export function HeroBlock({
  headline = 'High-velocity commerce funnels for modern independent merchants.',
  subheadline = 'Single-page conversion architecture engineered for zero drop-off. Seamless Xendit automated settlements and dual-layer Meta CAPI tracking.',
  badgeText = '2026 Merchant Infrastructure',
  ctaText = 'Proceed to Direct Order',
  onCtaClick,
  styles,
}: HeroBlockProps) {
  const fontClass = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    space: 'font-mono tracking-tight',
    jakarta: 'font-sans',
  }[styles?.fontFamily || 'sans'];

  const hasBgImage = Boolean(styles?.backgroundImage);
  const overlayOpacity = styles?.backgroundOverlay ?? 0.75;

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-neutral-800/80 p-8 sm:p-14 text-center shadow-[0_1px_3px_0_rgba(0,0,0,0.5)] transition-all ${fontClass}`}
      style={{
        backgroundColor: styles?.backgroundColor || '#090a0f',
        color: styles?.textColor || '#ffffff',
      }}
    >
      {/* Background Image & Overlay */}
      {hasBgImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center z-0 scale-105 transition-transform duration-700"
            style={{ backgroundImage: `url(${styles?.backgroundImage})` }}
          />
          <div
            className="absolute inset-0 z-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
        </>
      )}

      {/* Subtle top hairline highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-700/50 to-transparent z-10" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {badgeText && (
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/80 text-[11px] font-medium tracking-wide"
            style={{ color: styles?.textColor || '#d4d4d8' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: styles?.accentColor || '#10b981' }}
            />
            <span>{badgeText}</span>
          </div>
        )}

        <h1
          className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12]"
          style={{ color: styles?.textColor || '#ffffff' }}
        >
          {headline}
        </h1>

        <p
          className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed opacity-85"
          style={{ color: styles?.textColor || '#e4e4e7' }}
        >
          {subheadline}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            variant="default"
            onClick={onCtaClick}
            className="w-full sm:w-auto h-11 px-7 font-semibold"
            style={{
              backgroundColor: styles?.accentColor,
              color: styles?.accentColor ? '#ffffff' : undefined,
            }}
          >
            {ctaText}
            <ArrowRight className="w-4 h-4 ml-1.5 opacity-60" />
          </Button>
        </div>

        <div className="pt-6 border-t border-neutral-900/80 flex flex-wrap items-center justify-center gap-6 text-xs font-normal opacity-70">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Xendit Bank-Grade Settlements</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero Platform Take-Rate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px]">99.98% SLA</span>
          </div>
        </div>
      </div>
    </section>
  );
}
