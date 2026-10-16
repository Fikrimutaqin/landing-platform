'use client';
import React from 'react';
import { Check } from 'lucide-react';
import { BlockStyles, ContainerLayout } from '../../../../shared/types';

export interface ProductSpotlightProps {
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  inventoryBadgeText?: string;
  features: string[];
  styles?: BlockStyles;
  layout?: ContainerLayout;
  viewport?: 'desktop' | 'tablet' | 'mobile';
}

export function ProductSpotlightBlock({
  title = 'Studio Mechanical Keyboard Kit (Edition 01)',
  description = 'Anodized aluminum chassis, hot-swappable PCB, factory-lubricated switches, and custom sound-dampening acoustic foams.',
  price = 1450000,
  compareAtPrice = 1850000,
  inventoryBadgeText = 'Batch 04 — Only 12 Units Remaining',
  features = [
    'Integrated 1-Page Express Checkout with Xendit VA & QRIS',
    'Server-Side Meta Conversions API (CAPI) with 100% Event Deduplication',
    'Direct Payouts: Zero Platform Transaction Fees (Funds Go Direct to Merchant)',
    '1-Click Export: Standalone Zero-Dependency HTML/CSS/JS Package',
  ],
  styles,
  layout,
  viewport,
}: ProductSpotlightProps) {
  const isTablet = viewport === 'tablet';
  const isMobile = viewport === 'mobile';

  const activeReverse = (isMobile ? layout?.mobile?.reverse : isTablet ? layout?.tablet?.reverse : undefined) ?? layout?.reverse;
  const activeGap = (isMobile ? layout?.mobile?.gap : isTablet ? layout?.tablet?.gap : undefined) ?? layout?.gap;
  const activeMaxWidth = (isMobile ? layout?.mobile?.maxWidth : isTablet ? layout?.tablet?.maxWidth : undefined) ?? layout?.maxWidth;
  const activeContentPos = (isMobile ? layout?.mobile?.contentPosition : isTablet ? layout?.tablet?.contentPosition : undefined) ?? layout?.contentPosition;

  const gapClass = {
    none: 'gap-0',
    sm: 'gap-3',
    md: 'gap-8',
    lg: 'gap-12',
    xl: 'gap-16',
    '2xl': 'gap-20',
  }[activeGap || 'md'];

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

  const savings = compareAtPrice ? compareAtPrice - price : 0;
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
  const paddingClass = s.padding ? paddingMap[s.padding] : 'p-6 sm:p-10';

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
  const headlineSizeClass = s.headlineFontSize ? headlineSizeMap[s.headlineFontSize] : 'text-2xl sm:text-3xl';

  const fontSizeMap: Record<string, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };
  const fontSizeClass = s.fontSize ? fontSizeMap[s.fontSize] : 'text-sm';

  const hasBgImage = Boolean(s.backgroundImage);

  return (
    <section
      className={`relative overflow-hidden ${radiusClass} ${s.borderWidth === undefined ? 'border border-neutral-800/80' : ''} ${paddingClass} ${marginClass} ${shadowClass} ${fontClass}`}
      style={{
        backgroundColor: s.backgroundColor || '#0a0b0f',
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
      {hasBgImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center z-0 scale-105"
            style={{ backgroundImage: `url(${styles?.backgroundImage})` }}
          />
          <div
            className="absolute inset-0 z-0 bg-black"
            style={{ opacity: styles?.backgroundOverlay ?? 0.8 }}
          />
        </>
      )}

      <div className={`relative z-10 ${maxWidthClass} ${contentPosClass} grid md:grid-cols-12 ${gapClass} items-start`}>
        {/* Left: Product Overview */}
        <div className={`md:col-span-7 space-y-5 ${activeReverse ? 'order-2' : 'order-1'}`}>
          {inventoryBadgeText && (
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: styles?.accentColor || '#10b981' }}
              />
              <span className="text-[11px] font-mono uppercase tracking-wider opacity-75">
                {inventoryBadgeText}
              </span>
            </div>
          )}

          <h2 className={`${headlineSizeClass} font-bold tracking-tight`}>
            {title}
          </h2>

          <p className={`${fontSizeClass} leading-relaxed opacity-85`}>
            {description}
          </p>

          <div className="space-y-3 pt-2">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm opacity-90">
                <div className="w-4 h-4 rounded-full bg-neutral-900/80 border border-neutral-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Pricing Box */}
        <div className={`md:col-span-5 rounded-xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-sm p-6 space-y-4 ${activeReverse ? 'order-1' : 'order-2'}`}>
          <div className="text-[11px] font-semibold uppercase tracking-wider opacity-70">
            Direct Merchant Offer
          </div>

          <div className="space-y-1">
            {compareAtPrice && (
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-mono opacity-50 line-through">
                  Rp {compareAtPrice.toLocaleString('id-ID')}
                </span>
                <span
                  className="text-[11px] font-semibold font-mono"
                  style={{ color: styles?.accentColor || '#10b981' }}
                >
                  Save Rp {savings.toLocaleString('id-ID')}
                </span>
              </div>
            )}
            <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight">
              Rp {price.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] opacity-60">Instant automated invoice & fulfillment setup</p>
          </div>

          <div className="pt-3 border-t border-neutral-800/80 space-y-2 text-xs opacity-85">
            <div className="flex justify-between py-1">
              <span className="opacity-70">Fulfillment Method</span>
              <span className="font-medium">Direct API Dispatch</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="opacity-70">Payment Gateway</span>
              <span className="font-medium">Xendit Official</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="opacity-70">Ad Tracking</span>
              <span className="font-medium">Dual-Layer CAPI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
