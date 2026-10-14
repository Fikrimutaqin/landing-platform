'use client';
import React from 'react';
import { Check } from 'lucide-react';
import { BlockStyles } from '../../../../shared/types';

export interface ProductSpotlightProps {
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  inventoryBadgeText?: string;
  features: string[];
  styles?: BlockStyles;
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
}: ProductSpotlightProps) {
  const savings = compareAtPrice ? compareAtPrice - price : 0;
  const fontClass = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    space: 'font-mono tracking-tight',
    jakarta: 'font-sans',
  }[styles?.fontFamily || 'sans'];

  const hasBgImage = Boolean(styles?.backgroundImage);

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-neutral-800/80 p-6 sm:p-10 shadow-[0_1px_3px_0_rgba(0,0,0,0.5)] ${fontClass}`}
      style={{
        backgroundColor: styles?.backgroundColor || '#0a0b0f',
        color: styles?.textColor || '#ffffff',
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

      <div className="relative z-10 grid md:grid-cols-12 gap-8 items-start">
        {/* Left: Product Overview */}
        <div className="md:col-span-7 space-y-5">
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

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {title}
          </h2>

          <p className="text-sm leading-relaxed opacity-85">
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
        <div className="md:col-span-5 rounded-xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-sm p-6 space-y-4">
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
