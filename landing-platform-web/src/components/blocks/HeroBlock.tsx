'use client';
import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BlockStyles, ContainerLayout } from '../../../../shared/types';

export interface HeroBlockProps {
  headline: string;
  subheadline: string;
  badgeText?: string;
  ctaText: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  styles?: BlockStyles;
  layout?: ContainerLayout;
  viewport?: 'desktop' | 'tablet' | 'mobile';
}

export function HeroBlock({
  headline = 'High-velocity commerce funnels for modern independent merchants.',
  subheadline = 'Single-page conversion architecture engineered for zero drop-off. Seamless Xendit automated settlements and dual-layer Meta CAPI tracking.',
  badgeText = '2026 Merchant Infrastructure',
  ctaText = 'Proceed to Direct Order',
  ctaHref,
  onCtaClick,
  styles,
  layout,
  viewport,
}: HeroBlockProps) {
  const isTablet = viewport === 'tablet';
  const isMobile = viewport === 'mobile';

  const activeMaxWidth = (isMobile ? layout?.mobile?.maxWidth : isTablet ? layout?.tablet?.maxWidth : undefined) ?? layout?.maxWidth;
  const activeContentPos = (isMobile ? layout?.mobile?.contentPosition : isTablet ? layout?.tablet?.contentPosition : undefined) ?? layout?.contentPosition;

  const maxWidthClass = {
    narrow: 'max-w-xl',
    compact: 'max-w-3xl',
    boxed: 'max-w-5xl',
    full: 'w-full',
  }[activeMaxWidth || 'compact'];

  const contentPosClass = {
    left: 'mr-auto text-left',
    center: 'mx-auto text-center',
    right: 'ml-auto text-right',
  }[activeContentPos || 'center'];

  const rawStyles = (styles || {}) as Record<string, any>;
  const activeOverrides = isMobile
    ? { ...(rawStyles.tablet || {}), ...(rawStyles.mobile || {}) }
    : isTablet
      ? { ...(rawStyles.tablet || {}) }
      : {};
  const s = { ...rawStyles, ...activeOverrides };

  const paddingMap: Record<string, string> = {
    none: 'p-0',
    xs: 'py-2 px-3 sm:px-4',
    sm: 'py-4 sm:py-6 px-4 sm:px-6',
    md: 'p-6 sm:p-10',
    lg: 'p-8 sm:p-14',
    xl: 'p-12 sm:p-20',
    '2xl': 'p-16 sm:p-28',
  };
  const paddingClass = s.padding ? paddingMap[s.padding] : 'p-8 sm:p-14';

  const marginMap: Record<string, string> = {
    none: 'my-0',
    xs: 'my-1',
    sm: 'my-2 sm:my-3',
    md: 'my-4 sm:my-6',
    lg: 'my-8 sm:my-10',
    xl: 'my-12 sm:my-16',
    '2xl': 'my-16 sm:my-20',
  };
  const marginClass = s.margin ? marginMap[s.margin] : '';

  const radiusMap: Record<string, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-3xl',
  };
  const radiusClass = s.borderRadius ? radiusMap[s.borderRadius] : 'rounded-2xl';

  const shadowMap: Record<string, string> = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  };
  const shadowClass = s.shadow ? shadowMap[s.shadow] : 'shadow-[0_1px_3px_0_rgba(0,0,0,0.5)]';

  const fontMap: Record<string, string> = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    space: 'font-mono tracking-tight',
    jakarta: 'font-sans',
  };
  const fontClass = fontMap[s.fontFamily || 'sans'] || 'font-sans';

  const headlineSizeMap: Record<string, string> = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-4xl sm:text-5xl',
    '2xl': 'text-5xl sm:text-6xl',
    '3xl': 'text-6xl sm:text-7xl',
    '4xl': 'text-7xl sm:text-8xl',
  };
  const headlineSizeClass = s.headlineFontSize ? headlineSizeMap[s.headlineFontSize] : 'text-3xl sm:text-5xl lg:text-6xl';

  const fontSizeMap: Record<string, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };
  const fontSizeClass = s.fontSize ? fontSizeMap[s.fontSize] : 'text-sm sm:text-base';

  const hasBgImage = Boolean(s.backgroundImage);
  const overlayOpacity = s.backgroundOverlay ?? 0.75;

  return (
    <section
      className={`relative overflow-hidden ${radiusClass} ${s.borderWidth === undefined ? 'border border-neutral-800/80' : ''} ${paddingClass} ${marginClass} ${shadowClass} transition-all ${fontClass}`}
      style={{
        backgroundColor: s.backgroundColor || '#090a0f',
        color: s.textColor || '#ffffff',
        ...(s.borderWidth !== undefined
          ? {
            borderWidth: `${s.borderWidth}px`,
            borderStyle: s.borderStyle || 'solid',
            borderColor: s.borderColor || 'rgba(150, 150, 150, 0.3)',
          }
          : s.borderColor
            ? {
              borderWidth: '1px',
              borderStyle: s.borderStyle || 'solid',
              borderColor: s.borderColor,
            }
            : {}),
        ...(s.opacity !== undefined ? { opacity: s.opacity / 100 } : {}),
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
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-700/50 to-transparent z-10" />

      <div className={`relative z-10 ${maxWidthClass} ${contentPosClass} space-y-6`}>
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
          className={`${headlineSizeClass} font-bold tracking-tight leading-[1.12]`}
          style={{ color: styles?.textColor || '#ffffff' }}
        >
          {headline}
        </h1>

        <p
          className={`${fontSizeClass} max-w-2xl mx-auto leading-relaxed opacity-85`}
          style={{ color: styles?.textColor || '#e4e4e7' }}
        >
          {subheadline}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {ctaHref ? (
            <a href={ctaHref} className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="default"
                className="w-full sm:w-auto h-11 px-7 font-semibold"
                style={{
                  backgroundColor: styles?.accentColor,
                  color: styles?.accentColor ? '#ffffff' : undefined,
                }}
              >
                {ctaText}
                <ArrowRight className="w-4 h-4 ml-1.5 opacity-60" />
              </Button>
            </a>
          ) : (
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
          )}
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
