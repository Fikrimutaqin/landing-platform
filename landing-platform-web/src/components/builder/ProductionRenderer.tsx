'use client';

import React, { useState } from 'react';
import {
  DesignTokens,
  StyleClass,
  BlockType,
} from '../../../../shared/types';
import {
  AlexNavbarSection,
  AlexHeroSection,
  AlexStatsSection,
  AlexPerformanceSection,
  AlexServicesSection,
  AlexProcessSection,
  AlexTrustSection,
  AlexPortfolioSection,
  AlexPricingSection,
  AlexTestimonialSection,
  AlexArticlesSection,
  AlexFaqSection,
  AlexGuaranteesSection,
  AlexFooterSection,
} from '../templates/alex-travis/AlexSections';
import { ContainerBlock } from '../blocks/ContainerBlock';
import { NavbarBlock } from '../blocks/NavbarBlock';
import { HeroBlock } from '../blocks/HeroBlock';
import { ProductSpotlightBlock } from '../blocks/ProductSpotlightBlock';
import { ReviewsBlock } from '../blocks/ReviewsBlock';
import { FaqBlock } from '../blocks/FaqBlock';
import { FooterBlock } from '../blocks/FooterBlock';
import { CheckoutFormBlock } from '../blocks/CheckoutFormBlock';

interface ProductionRendererProps {
  blocks: any[];
  tokens?: DesignTokens;
  styleClasses?: StyleClass[];
  viewport?: 'desktop' | 'tablet' | 'mobile';
}

export function ProductionRenderer({
  blocks = [],
  tokens,
  styleClasses = [],
  viewport = 'desktop',
}: ProductionRendererProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Generate dynamic CSS variables for Design Tokens
  const tokenCssVars = tokens
    ? `
      :root {
        --primary-color: ${tokens.colors.primary};
        --secondary-color: ${tokens.colors.secondary};
        --accent-color: ${tokens.colors.accent};
        --bg-color: ${tokens.colors.background};
        --surface-color: ${tokens.colors.surface};
        --muted-color: ${tokens.colors.muted};
        --border-color: ${tokens.colors.border};
        --font-heading: ${tokens.fonts?.heading || 'sans'};
        --font-body: ${tokens.fonts?.body || 'sans'};
        --border-radius: ${tokens.borderRadius || 'xl'};
      }
    `
    : '';

  // Generate custom CSS rules for Reusable Style Classes
  const customClassesCss = (styleClasses || [])
    .map((cls) => {
      const declarations: string[] = [];
      if (cls.styles.textColor) declarations.push(`color: ${cls.styles.textColor};`);
      if (cls.styles.backgroundColor) declarations.push(`background-color: ${cls.styles.backgroundColor};`);
      if (cls.styles.fontSize) {
        const sizeMap: Record<string, string> = {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
        };
        declarations.push(`font-size: ${sizeMap[cls.styles.fontSize] || cls.styles.fontSize};`);
      }
      if (cls.styles.fontWeight) declarations.push(`font-weight: ${cls.styles.fontWeight};`);
      if (cls.styles.textAlign) declarations.push(`text-align: ${cls.styles.textAlign};`);
      if (cls.styles.borderRadius) {
        const radiusMap: Record<string, string> = {
          none: '0px',
          sm: '0.125rem',
          md: '0.375rem',
          lg: '0.5rem',
          xl: '0.75rem',
          '2xl': '1rem',
          full: '9999px',
        };
        declarations.push(`border-radius: ${radiusMap[cls.styles.borderRadius] || cls.styles.borderRadius};`);
      }
      return `.${cls.name} { ${declarations.join(' ')} }`;
    })
    .join('\n');

  const renderBlock = (block: any) => {
    // 1. Alex Travis sections
    if (block.content?.alexSection) {
      const commonProps = {
        block,
        isPreviewMode: true,
        isSelected: false,
        viewport,
        onSelect: () => {},
        onUpdateContent: () => {},
      };

      switch (block.content.alexSection) {
        case 'navbar':
          return <AlexNavbarSection key={block.id} {...commonProps} />;
        case 'hero':
          return <AlexHeroSection key={block.id} {...commonProps} />;
        case 'stats':
          return <AlexStatsSection key={block.id} {...commonProps} />;
        case 'performance':
          return <AlexPerformanceSection key={block.id} {...commonProps} />;
        case 'services':
          return <AlexServicesSection key={block.id} {...commonProps} />;
        case 'process':
          return <AlexProcessSection key={block.id} {...commonProps} />;
        case 'trust':
          return <AlexTrustSection key={block.id} {...commonProps} />;
        case 'portfolio':
          return <AlexPortfolioSection key={block.id} {...commonProps} />;
        case 'pricing':
          return <AlexPricingSection key={block.id} {...commonProps} />;
        case 'testimonial':
          return <AlexTestimonialSection key={block.id} {...commonProps} />;
        case 'articles':
          return <AlexArticlesSection key={block.id} {...commonProps} />;
        case 'faq':
          return <AlexFaqSection key={block.id} {...commonProps} />;
        case 'guarantees':
          return <AlexGuaranteesSection key={block.id} {...commonProps} />;
        case 'footer':
          return <AlexFooterSection key={block.id} {...commonProps} />;
        default:
          break;
      }
    }

    // 2. Pure Container Flex/Grid Blocks
    if (block.type === 'CONTAINER') {
      return (
        <ContainerBlock
          key={block.id}
          blockId={block.id}
          layout={block.layout || { display: 'flex', flexDirection: 'row', justify: 'between', align: 'center', columns: 1 }}
          columnsContent={block.columnsContent || []}
          styles={block.styles}
          styleClasses={styleClasses}
          tokens={tokens}
          label={block.content?.label}
          viewport={viewport}
          isPreviewMode={true}
          selectedComponentId={null}
        />
      );
    }

    // 3. Legacy Standard Funnel Blocks
    switch (block.type as BlockType) {
      case 'NAVBAR':
        return <NavbarBlock key={block.id} styles={block.styles} />;
      case 'HERO':
        return (
          <HeroBlock
            key={block.id}
            headline={block.content?.headline || block.content?.title || 'High-velocity commerce funnels.'}
            subheadline={block.content?.subheadline || block.content?.subtitle || ''}
            badgeText={block.content?.badgeText}
            ctaText={block.content?.ctaText || 'Direct Order'}
            styles={block.styles}
            layout={block.layout}
            viewport={viewport}
          />
        );
      case 'PRODUCT_SPOTLIGHT':
        return (
          <ProductSpotlightBlock
            key={block.id}
            title={block.content?.productTitle || block.content?.title || 'Product Spotlight'}
            price={block.content?.productPrice ?? block.content?.price ?? 1450000}
            compareAtPrice={block.content?.compareAtPrice}
            inventoryBadgeText={block.content?.inventoryBadge}
            description={block.content?.description || ''}
            styles={block.styles}
            layout={block.layout}
            viewport={viewport}
            features={block.content?.features || [
              'Integrated 1-Page Express Checkout with Xendit VA & QRIS',
              'Server-Side Meta Conversions API (CAPI) with 100% Event Deduplication',
              'Direct Payouts: Zero Platform Transaction Fees (Funds Go Direct to Merchant)',
              '1-Click Export: Standalone Zero-Dependency HTML/CSS/JS Package',
            ]}
          />
        );
      case 'REVIEWS':
        return <ReviewsBlock key={block.id} styles={block.styles} />;
      case 'FAQ':
        return <FaqBlock key={block.id} styles={block.styles} />;
      case 'FOOTER':
        return <FooterBlock key={block.id} styles={block.styles} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#08090c] text-slate-900 dark:text-neutral-100 overflow-x-hidden font-sans antialiased selection:bg-blue-100 dark:selection:bg-neutral-800">
      {/* Injected Token CSS Variables & Class Rules */}
      <style dangerouslySetInnerHTML={{ __html: `${tokenCssVars}\n${customClassesCss}` }} />

      {/* Render Document Block Stream */}
      <div className="w-full space-y-0">
        {blocks.map((block) => renderBlock(block))}
      </div>

      {/* Checkout Modal Overlay if triggered */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-neutral-800 shadow-2xl p-6">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              ✕
            </button>
            <CheckoutFormBlock
              onCheckoutSuccess={() => {
                setIsCheckoutOpen(false);
                alert('Order received successfully! Redirecting...');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
