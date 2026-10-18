'use client';

import { ArrowRight, Check, Camera, Link as LinkIcon, ShoppingCart, Menu, X } from 'lucide-react';
import { BlockItem } from '../../builder/ElementorSidebar';
import { DynamicIcon } from '../../builder/IconPicker';
import { ContainerLayout, BlockStyles } from '../../../../../shared/types';
import { useState, useRef } from 'react';

export interface AlexSectionProps {
  block: BlockItem;
  isPreviewMode?: boolean;
  onUpdateContent?: (key: string, value: any) => void;
  onSelect?: () => void;
  isSelected?: boolean;
  viewport?: 'desktop' | 'tablet' | 'mobile';
}

// Helper to resolve responsive spacing (padding & margin), borders, shadows, and background styles per section
export function resolveSectionStyles(
  styles?: BlockStyles,
  viewport?: 'desktop' | 'tablet' | 'mobile',
  defaultPaddingClass: string = 'py-16 md:py-24 px-6 sm:px-10'
) {
  const isTablet = viewport === 'tablet';
  const isMobile = viewport === 'mobile';
  const rawStyles = (styles || {}) as Record<string, any>;
  const activeOverrides = isMobile
    ? { ...(rawStyles.tablet || {}), ...(rawStyles.mobile || {}) }
    : isTablet
    ? { ...(rawStyles.tablet || {}) }
    : {};

  const activeStyles: BlockStyles = {
    ...rawStyles,
    ...activeOverrides,
  };

  const paddingMap: Record<string, string> = {
    none: 'p-0',
    xs: 'py-2 px-3 sm:px-4',
    sm: 'py-4 sm:py-6 px-4 sm:px-6',
    md: 'py-8 sm:py-12 px-6 sm:px-8',
    lg: 'py-12 sm:py-16 px-6 sm:px-10',
    xl: 'py-16 sm:py-24 px-6 sm:px-12',
    '2xl': 'py-20 sm:py-32 px-6 sm:px-16',
  };

  const marginMap: Record<string, string> = {
    none: 'my-0',
    xs: 'my-1',
    sm: 'my-2 sm:my-3',
    md: 'my-4 sm:my-6',
    lg: 'my-8 sm:my-10',
    xl: 'my-12 sm:my-16',
    '2xl': 'my-16 sm:my-20',
  };

  const radiusMap: Record<string, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-3xl',
  };

  const shadowMap: Record<string, string> = {
    none: 'shadow-none',
    sm: 'shadow-sm dark:shadow-[0_2px_8px_rgba(0,0,0,0.5)]',
    md: 'shadow-md dark:shadow-[0_4px_16px_rgba(0,0,0,0.65)]',
    lg: 'shadow-lg dark:shadow-[0_10px_30px_rgba(0,0,0,0.8)]',
    xl: 'shadow-xl dark:shadow-[0_20px_45px_rgba(0,0,0,0.9)]',
    '2xl': 'shadow-2xl dark:shadow-[0_25px_65px_rgba(0,0,0,0.95)]',
  };

  const fontMap: Record<string, string> = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    space: 'font-mono tracking-tight',
    jakarta: 'font-sans',
  };

  let paddingClass = defaultPaddingClass;
  if (activeStyles.padding && paddingMap[activeStyles.padding]) {
    paddingClass = paddingMap[activeStyles.padding];
  } else if (activeStyles.paddingY) {
    const pyMap: Record<string, string> = {
      none: 'py-0 px-6 sm:px-10',
      compact: 'py-6 sm:py-8 px-6 sm:px-10',
      normal: 'py-12 sm:py-16 px-6 sm:px-10',
      spacious: 'py-16 sm:py-24 px-6 sm:px-10',
    };
    paddingClass = pyMap[activeStyles.paddingY] || defaultPaddingClass;
  }

  const marginClass = (activeStyles.margin && marginMap[activeStyles.margin]) || '';
  const radiusClass = (activeStyles.borderRadius && radiusMap[activeStyles.borderRadius]) || '';
  const shadowClass = (activeStyles.shadow && shadowMap[activeStyles.shadow]) || '';
  const fontClass = fontMap[activeStyles.fontFamily || 'sans'] || 'font-sans';

  const sectionStyle: React.CSSProperties = {
    ...(activeStyles.backgroundColor ? { backgroundColor: activeStyles.backgroundColor } : {}),
    ...(activeStyles.textColor ? { color: activeStyles.textColor } : {}),
    ...(activeStyles.borderWidth !== undefined
      ? {
          borderWidth: `${activeStyles.borderWidth}px`,
          borderStyle: activeStyles.borderStyle || 'solid',
          borderColor: activeStyles.borderColor || 'rgba(150, 150, 150, 0.3)',
        }
      : activeStyles.borderColor
      ? {
          borderWidth: '1px',
          borderStyle: activeStyles.borderStyle || 'solid',
          borderColor: activeStyles.borderColor,
        }
      : {}),
    ...(activeStyles.opacity !== undefined ? { opacity: activeStyles.opacity / 100 } : {}),
  };

  const headlineSizeMap: Record<string, string> = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-4xl sm:text-5xl',
    '2xl': 'text-5xl sm:text-6xl',
    '3xl': 'text-6xl sm:text-7xl',
    '4xl': 'text-7xl sm:text-8xl',
  };

  const fontSizeMap: Record<string, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };

  const textAlignMap: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const headlineSizeClass = activeStyles.headlineFontSize ? headlineSizeMap[activeStyles.headlineFontSize] || '' : '';
  const fontSizeClass = activeStyles.fontSize ? fontSizeMap[activeStyles.fontSize] || '' : '';
  const textAlignClass = activeStyles.textAlign ? textAlignMap[activeStyles.textAlign] || '' : '';

  return {
    sectionStyle,
    activeStyles,
    sectionClasses: `${paddingClass} ${marginClass} ${radiusClass} ${shadowClass} ${fontClass} ${textAlignClass}`.trim(),
    headlineSizeClass,
    fontSizeClass,
    textAlignClass,
  };
}

// Helper to resolve responsive flex/grid layout and positioning per section
export function resolveSectionLayout(
  layout?: ContainerLayout,
  viewport?: 'desktop' | 'tablet' | 'mobile',
  defaults?: Partial<ContainerLayout> & {
    defaultDisplay?: 'flex' | 'grid';
    defaultFlexDirection?: 'row' | 'col';
    defaultJustify?: ContainerLayout['justify'];
    defaultAlign?: ContainerLayout['align'];
    defaultColumns?: ContainerLayout['columns'];
    defaultGap?: ContainerLayout['gap'];
    defaultMaxWidth?: ContainerLayout['maxWidth'];
    defaultContentPosition?: ContainerLayout['contentPosition'];
  }
) {
  const isTablet = viewport === 'tablet';
  const isMobile = viewport === 'mobile';

  const base: ContainerLayout = {
    display: defaults?.display ?? defaults?.defaultDisplay ?? 'flex',
    flexDirection: defaults?.flexDirection ?? defaults?.defaultFlexDirection ?? 'row',
    justify: defaults?.justify ?? defaults?.defaultJustify ?? 'between',
    align: defaults?.align ?? defaults?.defaultAlign ?? 'center',
    columns: defaults?.columns ?? defaults?.defaultColumns ?? 2,
    gap: defaults?.gap ?? defaults?.defaultGap ?? 'md',
    maxWidth: defaults?.maxWidth ?? defaults?.defaultMaxWidth ?? 'boxed',
    contentPosition: defaults?.contentPosition ?? defaults?.defaultContentPosition ?? 'center',
    ...(layout || {}),
  };

  const activeOverrides = isMobile
    ? { ...(layout?.tablet || {}), ...(layout?.mobile || {}) }
    : isTablet
    ? { ...(layout?.tablet || {}) }
    : {};

  const active = {
    ...base,
    ...activeOverrides,
  };

  const isGrid = active.display === 'grid';

  const gapMap: Record<string, string> = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-6',
    lg: 'gap-10 sm:gap-12',
    xl: 'gap-14 sm:gap-16',
    '2xl': 'gap-20 sm:gap-24',
  };

  const justifyMap: Record<string, string> = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const alignMap: Record<string, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const gridColsMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6',
    12: 'grid-cols-1 lg:grid-cols-12',
  };

  const singleGridColsMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
  };

  const activeGridColClass = viewport
    ? (active.columns === 12
        ? (isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-12')
        : (singleGridColsMap[active.columns || 2] || 'grid-cols-2'))
    : (gridColsMap[active.columns || 2] || 'grid-cols-1 md:grid-cols-2');

  const flexDirClass = viewport
    ? (active.flexDirection === 'col'
        ? (active.reverse ? 'flex-col-reverse' : 'flex-col')
        : (active.reverse ? 'flex-row-reverse' : 'flex-row'))
    : `${active.flexDirection === 'col' ? (active.reverse ? 'flex-col-reverse' : 'flex-col') : (active.reverse ? 'flex-row-reverse' : 'flex-row')} md:${
        layout?.tablet?.flexDirection === 'col' ? 'flex-col' : 'flex-row'
      } lg:${layout?.flexDirection === 'col' ? 'flex-col' : 'flex-row'}`;

  const maxWidthMap: Record<string, string> = {
    narrow: 'max-w-3xl',
    compact: 'max-w-5xl',
    boxed: 'max-w-300',
    full: 'w-full',
  };

  const contentPosMap: Record<string, string> = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  };

  const wrapperClass = `${maxWidthMap[active.maxWidth || 'boxed'] || 'max-w-300'} ${
    contentPosMap[active.contentPosition || 'center'] || 'mx-auto'
  } ${
    isGrid
      ? `grid ${activeGridColClass} ${gapMap[active.gap || 'md'] || 'gap-6'} ${
          alignMap[active.align || 'center'] || 'items-center'
        }`
      : `flex ${flexDirClass} ${justifyMap[active.justify || 'between'] || 'justify-between'} ${
          alignMap[active.align || 'center'] || 'items-center'
        } ${gapMap[active.gap || 'md'] || 'gap-6'}`
  }`;

  const baseReverse = Boolean(layout?.reverse);
  const tabletReverse = layout?.tablet?.reverse !== undefined ? Boolean(layout?.tablet?.reverse) : baseReverse;
  const mobileReverse = layout?.mobile?.reverse !== undefined ? Boolean(layout?.mobile?.reverse) : tabletReverse;

  const orderPrimary = viewport
    ? (active.reverse ? 'order-2' : 'order-1')
    : `${mobileReverse ? 'order-2' : 'order-1'} ${tabletReverse ? 'md:order-2' : 'md:order-1'} ${baseReverse ? 'lg:order-2' : 'lg:order-1'}`;

  const orderSecondary = viewport
    ? (active.reverse ? 'order-1' : 'order-2')
    : `${mobileReverse ? 'order-1' : 'order-2'} ${tabletReverse ? 'md:order-1' : 'md:order-2'} ${baseReverse ? 'lg:order-1' : 'lg:order-2'}`;

  return {
    isGrid,
    active,
    wrapperClass,
    maxWidthClass: maxWidthMap[active.maxWidth || 'boxed'] || 'max-w-300',
    contentPosClass: contentPosMap[active.contentPosition || 'center'] || 'mx-auto',
    orderPrimary,
    orderSecondary,
  };
}

// Robust inline editable text helper with hover indicator & instant click-to-edit
function InlineText({
  value,
  onSave,
  className = '',
  as: Component = 'span',
  placeholder = 'Type here...',
  disabled = false,
}: {
  value?: string;
  onSave?: (val: string) => void;
  className?: string;
  as?: any;
  placeholder?: string;
  disabled?: boolean;
}) {
  const displayVal = value !== undefined && value !== null ? value : '';

  if (disabled) {
    return <Component className={className}>{displayVal || placeholder}</Component>;
  }

  return (
    <Component
      contentEditable
      suppressContentEditableWarning
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && Component !== 'p' && Component !== 'textarea') {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const text = e.currentTarget.innerText.trim();
        if (text !== displayVal && onSave) {
          onSave(text);
        }
      }}
      className={`${className} outline-none hover:ring-1 hover:ring-blue-400/60 hover:bg-blue-50/20 dark:hover:bg-blue-900/20 focus:ring-2 focus:ring-blue-500 focus:bg-blue-50/40 dark:focus:bg-blue-900/40 rounded-xs px-0.5 transition-all cursor-text`}
      title="Click to edit text directly"
    >
      {displayVal || placeholder}
    </Component>
  );
}

// Inline editable image with instant 1-click file upload & URL replacement
function EditableImage({
  src,
  alt = 'Image',
  className = '',
  imgClassName = 'w-full h-full object-cover',
  onSave,
  disabled = false,
}: {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  onSave?: (newUrl: string) => void;
  disabled?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result && onSave) {
        onSave(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePromptUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newUrl = window.prompt('Enter Image URL (or upload from device):', src);
    if (newUrl && newUrl.trim() && onSave) {
      onSave(newUrl.trim());
    }
  };

  if (disabled) {
    return (
      <div className={className}>
        <img src={src} alt={alt} className={imgClassName} />
      </div>
    );
  }

  return (
    <div
      className={`relative group/editable-img ${className} hover:ring-2 hover:ring-blue-500/80 rounded-lg transition-all`}
      title="Hover to replace or upload image"
    >
      <img src={src} alt={alt} className={imgClassName} />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/editable-img:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 pointer-events-auto rounded-lg backdrop-blur-xs">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold shadow-lg flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
          title="Upload image from computer"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>
        <button
          type="button"
          onClick={handlePromptUrl}
          className="px-2.5 py-1.5 rounded-lg bg-white/95 hover:bg-white text-slate-800 text-[11px] font-medium shadow-lg flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
          title="Paste image URL"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>URL</span>
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 1. STICKY NAV
// -------------------------------------------------------------
export function AlexNavbarSection({ block, isPreviewMode, onUpdateContent, onSelect, isSelected, viewport }: AlexSectionProps) {
  const content = block.content || {};
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const layoutConfig = resolveSectionLayout(block.layout, viewport, {
    display: 'flex',
    flexDirection: 'row',
    justify: 'between',
    align: 'center',
    gap: 'none',
  });

  const navLinks = content.navLinks || [
    { label: 'About', href: '#about' },
    { label: 'Project', href: '#projects' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Store', href: '#store' },
  ];

  const pagesLinks = content.pagesLinks || [
    { label: 'Services', href: '#services' },
    { label: 'Reviews', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ];

  const updateNavLink = (index: number, key: 'label' | 'href', val: string) => {
    const updated = [...navLinks];
    updated[index] = { ...updated[index], [key]: val };
    onUpdateContent?.('navLinks', updated);
  };

  const updatePagesLink = (index: number, key: 'label' | 'href', val: string) => {
    const updated = [...pagesLinks];
    updated[index] = { ...updated[index], [key]: val };
    onUpdateContent?.('pagesLinks', updated);
  };

  const navBtnBg = content.ctaBgColor || block.styles?.accentColor;
  const navBtnColor = content.ctaTextColor || (navBtnBg ? '#ffffff' : undefined);
  const stylesConfig = resolveSectionStyles(block.styles, viewport, 'py-4 px-6 md:px-10');

  return (
    <header
      onClick={onSelect}
      style={stylesConfig.sectionStyle}
      className={`sticky top-0 z-40 w-full ${stylesConfig.sectionClasses} backdrop-blur-md border-b border-[#ececec] dark:border-neutral-800 transition-all ${block.styles?.backgroundColor ? '' : 'bg-white/95 dark:bg-[#0c0d12]/95'
        } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className={layoutConfig.wrapperClass}>
        {/* Logo mark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#d9ff1a] text-[#111] font-bold flex items-center justify-center text-xs shadow-sm">
            <InlineText
              value={content.logoInitials || 'AT'}
              onSave={(v) => onUpdateContent?.('logoInitials', v)}
              disabled={isPreviewMode}
            />
          </div>
          <span className="font-bold text-sm text-[#111] dark:text-white tracking-[-0.02em]">
            <InlineText
              value={content.brandName || 'Alex Travis'}
              onSave={(v) => onUpdateContent?.('brandName', v)}
              disabled={isPreviewMode}
            />
          </span>
        </div>

        {/* Links: Dynamic list from navLinks */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#555] dark:text-neutral-400">
          {navLinks.map((link: any, i: number) => (
            <a
              key={i}
              href={link.href || '#'}
              onClick={(e) => {
                if (!isPreviewMode) e.preventDefault();
              }}
              className="hover:text-[#111] dark:hover:text-white transition-colors"
            >
              <InlineText
                value={link.label}
                onSave={(v) => updateNavLink(i, 'label', v)}
                disabled={isPreviewMode}
              />
            </a>
          ))}

          {content.showPagesDropdown !== false && (
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="flex items-center gap-1 hover:text-[#111] dark:hover:text-white transition-colors"
              >
                <span>
                  <InlineText
                    value={content.dropdownLabel || 'Pages'}
                    onSave={(v) => onUpdateContent?.('dropdownLabel', v)}
                    disabled={isPreviewMode}
                  />
                </span> ▾
              </button>
              {dropdownOpen && (
                <div className="absolute top-full mt-2 left-0 w-36 bg-white dark:bg-[#161616] border border-[#ececec] dark:border-neutral-800 rounded-lg shadow-lg p-2 flex flex-col gap-1 text-xs z-50">
                  {pagesLinks.map((pLink: any, pi: number) => (
                    <a
                      key={pi}
                      href={pLink.href || '#'}
                      onClick={(e) => {
                        if (!isPreviewMode) e.preventDefault();
                      }}
                      className="p-1.5 hover:bg-slate-50 dark:hover:bg-neutral-800 rounded block text-left"
                    >
                      <InlineText
                        value={pLink.label}
                        onSave={(v) => updatePagesLink(pi, 'label', v)}
                        disabled={isPreviewMode}
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Action / Cart Icon + CTA button */}
        <div className="flex items-center gap-4">
          {content.showActionIcon !== false && (
            <button
              type="button"
              className="relative p-1.5 rounded-lg text-[#111] dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center"
              title="Action / Cart"
            >
              <DynamicIcon
                name={content.actionIcon || 'ShoppingCart'}
                className="w-4 h-4"
                fallback={<ShoppingCart className="w-4 h-4" />}
              />
              <span className="absolute -top-1 -right-1 text-[9px] bg-[#111] dark:bg-white text-white dark:text-[#111] px-1 rounded-full font-mono">
                <InlineText
                  value={content.cartBadgeCount ?? '0'}
                  onSave={(v) => onUpdateContent?.('cartBadgeCount', v)}
                  disabled={isPreviewMode}
                />
              </span>
            </button>
          )}

          <button
            type="button"
            style={{
              ...(navBtnBg ? { backgroundColor: navBtnBg, backgroundImage: 'none' } : {}),
              ...(navBtnColor ? { color: navBtnColor } : {}),
            }}
            className={`hidden sm:inline-flex px-5 py-2.5 rounded-lg font-medium text-xs transition-all shadow-sm ${navBtnBg ? 'hover:opacity-90' : 'bg-[#161616] text-white hover:bg-[#111]'
              }`}
          >
            <InlineText
              value={content.ctaText || 'Hire Me!'}
              onSave={(v) => onUpdateContent?.('ctaText', v)}
              disabled={isPreviewMode}
            />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-red-500" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#ececec] dark:border-neutral-800 px-6 py-4 space-y-3 bg-white/95 dark:bg-[#0c0d12]/95 backdrop-blur-md shadow-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1.5 text-xs font-semibold text-[#333] dark:text-neutral-200">
            {navLinks.map((link: any, i: number) => (
              <a
                key={i}
                href={link.href || '#'}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-40" />
              </a>
            ))}
            {content.showPagesDropdown !== false &&
              pagesLinks.map((pLink: any, pi: number) => (
                <a
                  key={pi}
                  href={pLink.href || '#'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-500 dark:text-neutral-400 transition-colors flex items-center justify-between"
                >
                  <span>{pLink.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-30" />
                </a>
              ))}
          </div>

          <button
            type="button"
            style={{
              ...(navBtnBg ? { backgroundColor: navBtnBg, backgroundImage: 'none' } : {}),
              ...(navBtnColor ? { color: navBtnColor } : {}),
            }}
            className={`w-full py-2.5 rounded-lg font-bold text-xs shadow-md ${navBtnBg ? 'hover:opacity-90 text-white' : 'bg-[#161616] text-white'
              }`}
          >
            <span>{content.ctaText || 'Hire Me!'}</span>
          </button>
        </div>
      )}
    </header>
  );
}

// -------------------------------------------------------------
// 2. HERO SECTION
// -------------------------------------------------------------
export function AlexHeroSection({ block, isPreviewMode, onUpdateContent, onSelect, isSelected, viewport }: AlexSectionProps) {
  const content = block.content || {};
  const primaryBg = content.primaryCtaBg || block.styles?.accentColor;
  const primaryColor = content.primaryCtaColor || (primaryBg ? '#ffffff' : undefined);
  const secondaryBg = content.secondaryCtaBg;
  const secondaryColor = content.secondaryCtaColor;
  const secondaryBorder = content.secondaryCtaBorder;

  const layoutConfig = resolveSectionLayout(block.layout, viewport, {
    display: block.layout?.display || 'grid',
    flexDirection: block.layout?.flexDirection || 'row',
    columns: block.layout?.columns || 12,
    gap: block.layout?.gap || 'lg',
    align: block.layout?.align || 'center',
  });

  const stylesConfig = resolveSectionStyles(block.styles, viewport, 'py-16 md:py-20 px-6 sm:px-10');

  return (
    <section
      onClick={onSelect}
      style={stylesConfig.sectionStyle}
      className={`relative ${stylesConfig.sectionClasses} transition-all ${block.styles?.backgroundColor ? '' : 'bg-white dark:bg-[#0c0d12]'
        } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className={layoutConfig.wrapperClass}>
        {/* Left Column */}
        <div className={`${layoutConfig.isGrid && layoutConfig.active.columns === 12 ? 'lg:col-span-7' : 'w-full'} ${layoutConfig.orderPrimary} space-y-6 ${stylesConfig.textAlignClass || 'text-left'}`}>
          {/* Lime pill "Hi, Alex Travis Here" */}
          <div
            style={{
              ...(content.badgeBg ? { backgroundColor: content.badgeBg, backgroundImage: 'none' } : {}),
              ...(content.badgeColor ? { color: content.badgeColor } : {}),
            }}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold text-xs tracking-tight shadow-xs ${content.badgeBg ? '' : 'bg-[#d9ff1a] text-[#111]'
              }`}
          >
            <span className="w-2 h-2 rounded-full bg-current"></span>
            <InlineText
              value={content.badgeText || 'Hi, Alex Travis Here'}
              onSave={(v) => onUpdateContent?.('badgeText', v)}
              disabled={isPreviewMode}
            />
          </div>

          {/* Two-Tone H1 */}
          <h1 className={`${stylesConfig.headlineSizeClass || 'text-4xl sm:text-5xl lg:text-6xl'} font-medium tracking-[-0.02em] leading-[1.08]`}>
            <span className="text-[#111] dark:text-white">
              <InlineText
                value={content.headlineDark || 'A creative product designer'}
                onSave={(v) => onUpdateContent?.('headlineDark', v)}
                disabled={isPreviewMode}
              />
            </span>{' '}
            <span className="text-[#b5b5b5] dark:text-neutral-500">
              <InlineText
                value={content.headlineMuted || 'with modern touch based in San Francisco.'}
                onSave={(v) => onUpdateContent?.('headlineMuted', v)}
                disabled={isPreviewMode}
              />
            </span>
          </h1>

          <p className={`${stylesConfig.fontSizeClass || 'text-base'} text-[#555] dark:text-neutral-400 leading-relaxed max-w-xl font-normal`}>
            <InlineText
              value={
                content.subheadline ||
                'Transforming ambitious ideas into clean, functional, and user-centric digital experiences with high attention to detail and conversion performance.'
              }
              onSave={(v) => onUpdateContent?.('subheadline', v)}
              disabled={isPreviewMode}
              as="span"
            />
          </p>

          {/* Gradient "Hire Me!" + Outlined "See My Portfolio" buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              style={{
                ...(primaryBg ? { backgroundColor: primaryBg, backgroundImage: 'none' } : {}),
                ...(primaryColor ? { color: primaryColor } : {}),
              }}
              className={`px-7 py-3 rounded-lg font-semibold text-sm shadow-md transition-transform active:scale-95 hover:opacity-95 flex items-center gap-2 ${primaryBg ? 'text-white' : 'text-white bg-linear-to-r from-[#ff2d9b] via-[#ff7a2f] to-[#ffd21f]'
                }`}
            >
              <InlineText
                value={content.primaryCta || 'Hire Me!'}
                onSave={(v) => onUpdateContent?.('primaryCta', v)}
                disabled={isPreviewMode}
              />
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              style={{
                ...(secondaryBg ? { backgroundColor: secondaryBg, backgroundImage: 'none' } : {}),
                ...(secondaryColor ? { color: secondaryColor } : {}),
                ...(secondaryBorder ? { borderColor: secondaryBorder } : {}),
              }}
              className={`px-7 py-3 rounded-lg font-medium text-sm transition-all border ${secondaryBg ? '' : 'text-[#111] dark:text-white border-[#ececec] dark:border-neutral-700 hover:border-[#111]'
                }`}
            >
              <InlineText
                value={content.secondaryCta || 'See My Portfolio'}
                onSave={(v) => onUpdateContent?.('secondaryCta', v)}
                disabled={isPreviewMode}
              />
            </button>
          </div>
        </div>

        {/* Right Column: Portrait Card with Available for work + NY badges & floating testimonials */}
        <div className={`${layoutConfig.isGrid && layoutConfig.active.columns === 12 ? 'lg:col-span-5' : 'w-full'} ${layoutConfig.orderSecondary} flex justify-center relative`}>
          <div className="relative w-full max-w-sm rounded-xl bg-white dark:bg-[#161616] border border-[#ececec] dark:border-neutral-800 p-4 shadow-xl">
            {/* Top Right Available for Work lime pill */}
            <div className="absolute -top-3 -right-3 z-20 px-3 py-1 rounded-full bg-[#d9ff1a] text-[#111] font-bold text-[11px] shadow-sm flex items-center gap-1">
              <span>★</span>
              <InlineText
                value={content.topBadge || 'Available for work'}
                onSave={(v) => onUpdateContent?.('topBadge', v)}
                disabled={isPreviewMode}
              />
            </div>

            {/* Profile Image */}
            <div className="relative overflow-hidden rounded-lg bg-linear-to-b from-indigo-100 to-indigo-50 dark:from-neutral-800 dark:to-neutral-900 aspect-4/5 flex items-end justify-center">
              <EditableImage
                src={
                  content.avatarUrl ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
                }
                alt="Alex Travis"
                className="w-full h-full"
                imgClassName="w-full h-full object-cover object-top"
                onSave={(newUrl) => onUpdateContent?.('avatarUrl', newUrl)}
                disabled={isPreviewMode}
              />
            </div>

            {/* Bottom Card Footer with NY, New York badge */}
            <div className="mt-3 pt-3 border-t border-[#ececec] dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-[#111] dark:text-white text-sm">
                  <InlineText
                    value={content.designerName || 'Alex Travis'}
                    onSave={(v) => onUpdateContent?.('designerName', v)}
                    disabled={isPreviewMode}
                  />
                </h4>
                <p className="text-[11px] text-[#b5b5b5]">
                  <InlineText
                    value={content.designerTitle || 'Principal Product Designer'}
                    onSave={(v) => onUpdateContent?.('designerTitle', v)}
                    disabled={isPreviewMode}
                  />
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f5f5f5] dark:bg-neutral-800 text-[#111] dark:text-neutral-200 border border-[#ececec] dark:border-neutral-700">
                <InlineText
                  value={content.designerLocation || 'NY, New York'}
                  onSave={(v) => onUpdateContent?.('designerLocation', v)}
                  disabled={isPreviewMode}
                />
              </span>
            </div>

            {/* Floating Card Left: 4.9 Rating */}
            <div className="absolute -bottom-4 -left-6 z-20 px-3 py-1.5 rounded-xl bg-white dark:bg-[#161616] border border-[#ececec] dark:border-neutral-800 shadow-lg flex items-center gap-1.5 text-xs">
              <span className="font-bold text-[#ff9800]">★</span>
              <span className="text-[#111] dark:text-white font-medium">
                <InlineText
                  value={content.rating || '4.9 (120+ reviews)'}
                  onSave={(v) => onUpdateContent?.('rating', v)}
                  disabled={isPreviewMode}
                />
              </span>
            </div>

            {/* Floating Card Right: Growth ROI */}
            <div className="absolute top-1/3 -right-6 z-20 px-3 py-1.5 rounded-xl bg-white dark:bg-[#161616] border border-[#ececec] dark:border-neutral-800 shadow-lg flex items-center gap-1.5 text-xs">
              <span className="font-bold bg-[#d9ff1a] text-[#111] px-1.5 py-0.5 rounded text-[10px]">
                <InlineText
                  value={content.roiGrowth || '+140% Avg. ROI'}
                  onSave={(v) => onUpdateContent?.('roiGrowth', v)}
                  disabled={isPreviewMode}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// 3. STATS ROW (4 columns, bordered: 90%, 200+, 2018, 80+)
// -------------------------------------------------------------
export function AlexStatsSection({ block, isPreviewMode, onUpdateContent, onSelect, isSelected, viewport }: AlexSectionProps) {
  const content = block.content || {};
  const stats = content.stats || [
    { value: '90%', label: 'Client Satisfaction' },
    { value: '200+', label: 'Projects Completed' },
    { value: '2018', label: 'Year Established' },
    { value: '80+', label: 'Global Clients' },
  ];

  const layoutConfig = resolveSectionLayout(block.layout, viewport, {
    defaultDisplay: 'grid',
    defaultColumns: 4,
    defaultGap: 'md',
    defaultMaxWidth: 'boxed',
  });

  const updateStatItem = (index: number, key: 'value' | 'label', val: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [key]: val };
    onUpdateContent?.('stats', newStats);
  };

  const stylesConfig = resolveSectionStyles(block.styles, viewport, 'py-10 px-6 sm:px-10');

  return (
    <section
      onClick={onSelect}
      style={stylesConfig.sectionStyle}
      className={`relative ${stylesConfig.sectionClasses} border-y border-[#ececec] dark:border-neutral-800 transition-all ${block.styles?.backgroundColor ? '' : 'bg-white dark:bg-[#0c0d12]'
        } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className={`${layoutConfig.wrapperClass} text-center divide-x-0 md:divide-x divide-[#ececec] dark:divide-neutral-800`}>
        {stats.map((st: any, i: number) => (
          <div key={i} className="px-4 space-y-1">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#111] dark:text-white tracking-[-0.02em]">
              <InlineText
                value={st.value}
                onSave={(v) => updateStatItem(i, 'value', v)}
                disabled={isPreviewMode}
              />
            </div>
            <div className="text-xs text-[#b5b5b5] font-medium">
              <InlineText
                value={st.label}
                onSave={(v) => updateStatItem(i, 'label', v)}
                disabled={isPreviewMode}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// 4. ABOUT (Ring Graphic & Lime "About Me" button)
// -------------------------------------------------------------
export function AlexPerformanceSection({ block, isPreviewMode, onUpdateContent, onSelect, isSelected, viewport }: AlexSectionProps) {
  const content = block.content || {};
  const ctaBg = content.ctaBgColor || block.styles?.accentColor;
  const ctaColor = content.ctaTextColor || (ctaBg ? '#ffffff' : undefined);

  const layoutConfig = resolveSectionLayout(block.layout, viewport, {
    defaultDisplay: 'grid',
    defaultColumns: 12,
    defaultGap: 'lg',
    defaultAlign: 'center',
    defaultMaxWidth: 'boxed',
  });

  const stylesConfig = resolveSectionStyles(block.styles, viewport, 'py-16 md:py-24 px-6 sm:px-10');

  return (
    <section
      onClick={onSelect}
      style={stylesConfig.sectionStyle}
      className={`relative ${stylesConfig.sectionClasses} transition-all ${block.styles?.backgroundColor ? '' : 'bg-white dark:bg-[#0c0d12]'
        } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className={layoutConfig.wrapperClass}>
        {/* Left: Ring Graphic with lime ring and orange segment + Tools Performance */}
        <div className={`${layoutConfig.isGrid ? 'lg:col-span-5' : 'flex-1'} ${layoutConfig.orderPrimary} flex justify-center`}>
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="64" stroke="#f1f1f1" strokeWidth="14" fill="transparent" />
              {/* Lime Segment */}
              <circle
                cx="80"
                cy="80"
                r="64"
                stroke="#d9ff1a"
                strokeWidth="14"
                strokeDasharray="301 402"
                strokeDashoffset="0"
                strokeLinecap="round"
                fill="transparent"
              />
              {/* Orange Segment */}
              <circle
                cx="80"
                cy="80"
                r="64"
                stroke="#ff7a2f"
                strokeWidth="14"
                strokeDasharray="100 402"
                strokeDashoffset="-301"
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Orbiting icon chips */}
            <div className="absolute top-2 right-4 w-7 h-7 rounded-full bg-white dark:bg-[#161616] border border-[#ececec] dark:border-neutral-800 text-[10px] font-bold flex items-center justify-center shadow-xs">F</div>
            <div className="absolute bottom-4 right-2 w-7 h-7 rounded-full bg-white dark:bg-[#161616] border border-[#ececec] dark:border-neutral-800 text-[10px] font-bold flex items-center justify-center shadow-xs">W</div>
            <div className="absolute bottom-6 left-2 w-7 h-7 rounded-full bg-white dark:bg-[#161616] border border-[#ececec] dark:border-neutral-800 text-[10px] font-bold flex items-center justify-center shadow-xs">AI</div>

            {/* Center: 98% Tools Performance */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <span className="text-3xl font-medium text-[#111] dark:text-white tracking-[-0.02em]">
                <InlineText
                  value={content.score || '98%'}
                  onSave={(v) => onUpdateContent?.('score', v)}
                  disabled={isPreviewMode}
                />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#b5b5b5] mt-0.5">
                <InlineText
                  value={content.scoreLabel || 'Tools Performance'}
                  onSave={(v) => onUpdateContent?.('scoreLabel', v)}
                  disabled={isPreviewMode}
                />
              </span>
            </div>
          </div>
        </div>

        {/* Right: Two-tone heading, paragraphs, and CTA button */}
        <div className={`${layoutConfig.isGrid ? 'lg:col-span-7' : 'flex-1'} ${layoutConfig.orderSecondary} space-y-6 ${stylesConfig.textAlignClass || 'text-left'}`}>
          <h2 className={`${stylesConfig.headlineSizeClass || 'text-3xl sm:text-4xl'} font-medium tracking-[-0.02em] leading-tight`}>
            <span className="text-[#111] dark:text-white">
              <InlineText
                value={content.headlineDark || 'Designing digital experiences'}
                onSave={(v) => onUpdateContent?.('headlineDark', v)}
                disabled={isPreviewMode}
              />
            </span>{' '}
            <span className="text-[#b5b5b5] dark:text-neutral-500">
              <InlineText
                value={content.headlineMuted || 'that balance beauty with business metrics.'}
                onSave={(v) => onUpdateContent?.('headlineMuted', v)}
                disabled={isPreviewMode}
              />
            </span>
          </h2>

          <p className={`${stylesConfig.fontSizeClass || 'text-sm sm:text-base'} text-[#555] dark:text-neutral-400 leading-relaxed font-normal`}>
            <InlineText
              value={
                content.desc1 ||
                'I am a senior product designer and design engineer with over 8 years of experience building scalable design systems and conversion-focused applications.'
              }
              onSave={(v) => onUpdateContent?.('desc1', v)}
              disabled={isPreviewMode}
              as="span"
            />
          </p>

          <p className={`${stylesConfig.fontSizeClass || 'text-sm sm:text-base'} text-[#555] dark:text-neutral-400 leading-relaxed font-normal`}>
            <InlineText
              value={
                content.desc2 ||
                'My approach pairs deep qualitative user research with rigorous front-end implementation, ensuring every prototype looks stunning and functions flawlessly in production.'
              }
              onSave={(v) => onUpdateContent?.('desc2', v)}
              disabled={isPreviewMode}
              as="span"
            />
          </p>

          <button
            type="button"
            style={{
              ...(ctaBg ? { backgroundColor: ctaBg, backgroundImage: 'none' } : {}),
              ...(ctaColor ? { color: ctaColor } : {}),
            }}
            className={`px-6 py-2.5 rounded-lg font-semibold text-xs transition-all shadow-xs ${ctaBg ? 'hover:opacity-90' : 'text-[#111] bg-[#d9ff1a] hover:opacity-90'
              }`}
          >
            <InlineText
              value={content.ctaText || 'About Me'}
              onSave={(v) => onUpdateContent?.('ctaText', v)}
              disabled={isPreviewMode}
            />
          </button>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// 5. TOOLS ROW (3 bordered cells: Webflow 46%, Figma 32%, ChatGPT 22%)
// -------------------------------------------------------------
export function AlexTrustSection({ block, isPreviewMode, onUpdateContent, onSelect, isSelected, viewport }: AlexSectionProps) {
  const content = block.content || {};
  const tools = content.tools || [
    { name: 'Webflow', percentage: '46%' },
    { name: 'Figma', percentage: '32%' },
    { name: 'ChatGPT', percentage: '22%' },
  ];

  const layoutConfig = resolveSectionLayout(block.layout, viewport, {
    defaultDisplay: 'grid',
    defaultColumns: 3,
    defaultGap: 'md',
    defaultMaxWidth: 'boxed',
  });

  const updateTool = (index: number, key: 'name' | 'percentage', val: string) => {
    const updated = [...tools];
    updated[index] = { ...updated[index], [key]: val };
    onUpdateContent?.('tools', updated);
  };

  const stylesConfig = resolveSectionStyles(block.styles, viewport, 'py-8 px-6 sm:px-10');

  return (
    <section
      onClick={onSelect}
      style={stylesConfig.sectionStyle}
      className={`relative ${stylesConfig.sectionClasses} border-y border-[#ececec] dark:border-neutral-800 transition-all ${block.styles?.backgroundColor ? '' : 'bg-white dark:bg-[#0c0d12]'
        } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className={`${layoutConfig.wrapperClass} md:divide-x divide-[#ececec] dark:divide-neutral-800`}>
        {tools.map((t: any, i: number) => {
          const numericWidth = parseInt(t.percentage, 10) || 30;
          return (
            <div key={i} className="px-6 space-y-2 text-left">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#111] dark:text-white">
                  <InlineText
                    value={t.name}
                    onSave={(v) => updateTool(i, 'name', v)}
                    disabled={isPreviewMode}
                  />
                </span>
                <span className="text-[#111] dark:text-white font-semibold">
                  <InlineText
                    value={t.percentage}
                    onSave={(v) => updateTool(i, 'percentage', v)}
                    disabled={isPreviewMode}
                  />
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#f0f0f0] dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#d9ff1a] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(5, numericWidth))}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// 6. SERVICES (Heading + Left list 01.1/01.2/01.3 + Right Figma card)
// -------------------------------------------------------------
export function AlexServicesSection({ block, isPreviewMode, onUpdateContent, onSelect, isSelected, viewport }: AlexSectionProps) {
  const content = block.content || {};
  const cardCtaBg = content.cardCtaBg || block.styles?.accentColor;
  const cardCtaColor = content.cardCtaColor || (cardCtaBg ? '#ffffff' : undefined);
  const services = content.services || [
    {
      number: '01.1',
      title: 'UI/UX Design',
      desc: 'User research, interactive wireframing, high-fidelity prototypes, and usability testing.',
    },
    {
      number: '01.2',
      title: 'Design Systems',
      desc: 'Component tokens, variable architecture, responsive layout rules, and documentation.',
    },
    {
      number: '01.3',
      title: 'Web Development',
      desc: 'Clean semantic HTML, modern CSS architecture, Next.js / Webflow, and micro-interactions.',
    },
  ];

  const layoutConfig = resolveSectionLayout(block.layout, viewport, {
    defaultDisplay: 'grid',
    defaultColumns: 12,
    defaultGap: 'lg',
    defaultMaxWidth: 'boxed',
  });

  const updateService = (index: number, key: string, val: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [key]: val };
    onUpdateContent?.('services', updated);
  };

  const cardFeatures: string[] = content.cardFeatures || [
    'User Flow Mapping',
    'Interactive Prototyping',
    'Cross-platform UI',
    'Token-based Handoff',
  ];

  const updateCardFeature = (index: number, val: string) => {
    const updated = [...cardFeatures];
    updated[index] = val;
    onUpdateContent?.('cardFeatures', updated);
  };

  const stylesConfig = resolveSectionStyles(block.styles, viewport, 'py-16 md:py-24 px-6 sm:px-10');

  return (
    <section
      onClick={onSelect}
      style={stylesConfig.sectionStyle}
      className={`relative ${stylesConfig.sectionClasses} transition-all ${block.styles?.backgroundColor ? '' : 'bg-white dark:bg-[#0c0d12]'
        } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className={`${layoutConfig.maxWidthClass} ${layoutConfig.contentPosClass} space-y-12`}>
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-end ${stylesConfig.textAlignClass || 'text-left'}`}>
          <div className="md:col-span-8">
            <h2 className={`${stylesConfig.headlineSizeClass || 'text-3xl sm:text-4xl'} font-medium tracking-[-0.02em]`}>
              <span className="text-[#111] dark:text-white">
                <InlineText
                  value={content.headlineDark || 'Comprehensive'}
                  onSave={(v) => onUpdateContent?.('headlineDark', v)}
                  disabled={isPreviewMode}
                />
              </span>{' '}
              <span className="text-[#b5b5b5] dark:text-neutral-500">
                <InlineText
                  value={content.headlineMuted || 'design & development services.'}
                  onSave={(v) => onUpdateContent?.('headlineMuted', v)}
                  disabled={isPreviewMode}
                />
              </span>
            </h2>
          </div>
          <div className={`md:col-span-4 ${stylesConfig.fontSizeClass || 'text-xs'} text-[#555] dark:text-neutral-400`}>
            <InlineText
              value={
                content.intro ||
                'From initial research and wireframes to production-grade component tokens and interactive websites.'
              }
              onSave={(v) => onUpdateContent?.('intro', v)}
              disabled={isPreviewMode}
              as="span"
            />
          </div>
        </div>

        <div className={layoutConfig.wrapperClass}>
          {/* Left list: 01.1 / 01.2 / 01.3 */}
          <div className={`${layoutConfig.isGrid ? 'lg:col-span-6' : 'flex-1'} ${layoutConfig.orderPrimary} space-y-4 text-left`}>
            {services.map((srv: any, i: number) => (
              <div
                key={i}
                className={`p-5 rounded-xl border bg-white dark:bg-[#161616] flex items-start gap-4 transition-all ${i === 0 ? 'border-[#111] dark:border-white shadow-sm' : 'border-[#ececec] dark:border-neutral-800'
                  }`}
              >
                <span className="text-xs font-bold text-[#111] dark:text-white bg-[#f5f5f5] dark:bg-neutral-800 px-2 py-1 rounded">
                  <InlineText
                    value={srv.number || `01.${i + 1}`}
                    onSave={(v) => updateService(i, 'number', v)}
                    disabled={isPreviewMode}
                  />
                </span>
                <div className="flex-1 space-y-1">
                  <h3 className="text-base font-medium text-[#111] dark:text-white">
                    <InlineText
                      value={srv.title}
                      onSave={(v) => updateService(i, 'title', v)}
                      disabled={isPreviewMode}
                    />
                  </h3>
                  <p className="text-xs text-[#555] dark:text-neutral-400">
                    <InlineText
                      value={srv.desc}
                      onSave={(v) => updateService(i, 'desc', v)}
                      disabled={isPreviewMode}
                      as="span"
                    />
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right card: UI/UX Design with lime Figma tag, 2-column feature list, gradient button */}
          <div className={`${layoutConfig.isGrid ? 'lg:col-span-6' : 'flex-1'} ${layoutConfig.orderSecondary} p-8 rounded-xl border border-[#ececec] dark:border-neutral-800 bg-white dark:bg-[#161616] shadow-md flex flex-col justify-between text-left`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-medium text-[#111] dark:text-white">
                  <InlineText
                    value={content.cardTitle || 'UI/UX Design'}
                    onSave={(v) => onUpdateContent?.('cardTitle', v)}
                    disabled={isPreviewMode}
                  />
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#d9ff1a] text-[#111]">
                  <InlineText
                    value={content.cardBadge || 'Figma'}
                    onSave={(v) => onUpdateContent?.('cardBadge', v)}
                    disabled={isPreviewMode}
                  />
                </span>
              </div>
              <p className="text-xs text-[#555] dark:text-neutral-400 mb-6">
                <InlineText
                  value={
                    content.cardSubtitle ||
                    'End-to-end design execution tailored for scalable venture-backed startups.'
                  }
                  onSave={(v) => onUpdateContent?.('cardSubtitle', v)}
                  disabled={isPreviewMode}
                  as="span"
                />
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6 text-xs text-[#111] dark:text-neutral-300">
                {cardFeatures.map((feat: string, i: number) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <DynamicIcon
                      name={content.cardFeatureIcon || 'Check'}
                      className="w-3.5 h-3.5 text-emerald-500 shrink-0"
                      fallback={<Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                    />
                    <InlineText
                      value={feat}
                      onSave={(v) => updateCardFeature(i, v)}
                      disabled={isPreviewMode}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              style={{
                ...(cardCtaBg ? { backgroundColor: cardCtaBg, backgroundImage: 'none' } : {}),
                ...(cardCtaColor ? { color: cardCtaColor } : {}),
              }}
              className={`w-full py-3 rounded-lg font-semibold text-xs shadow-md transition-all ${cardCtaBg ? 'hover:opacity-95' : 'text-white bg-linear-to-r from-[#ff2d9b] via-[#ff7a2f] to-[#ffd21f] hover:opacity-95'
                }`}
            >
              <InlineText
                value={content.cardCta || 'Start a Project'}
                onSave={(v) => onUpdateContent?.('cardCta', v)}
                disabled={isPreviewMode}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// 7. TRUST BAR (Avatars, "Trusted by 200+ clients worldwide", 4.8, 3x2 logo grid)
// -------------------------------------------------------------
export function AlexProcessSection({ block, isPreviewMode, onUpdateContent, onSelect, isSelected, viewport }: AlexSectionProps) {
  const content = block.content || {};
  const logos = content.logos || ['STRIPE', 'LINEAR', 'VERCEL', 'RAYCAST', 'SUPABASE', 'AIRBNB'];

  const layoutConfig = resolveSectionLayout(block.layout, viewport, {
    defaultDisplay: 'flex',
    defaultFlexDirection: 'row',
    defaultJustify: 'between',
    defaultAlign: 'center',
    defaultGap: 'lg',
    defaultMaxWidth: 'boxed',
  });

  const updateLogo = (index: number, val: string) => {
    const updated = [...logos];
    updated[index] = val;
    onUpdateContent?.('logos', updated);
  };

  const stylesConfig = resolveSectionStyles(block.styles, viewport, 'py-10 px-6 sm:px-10');

  return (
    <section
      onClick={onSelect}
      style={stylesConfig.sectionStyle}
      className={`relative ${stylesConfig.sectionClasses} border-y border-[#ececec] dark:border-neutral-800 transition-all ${block.styles?.backgroundColor ? '' : 'bg-[#fafafa] dark:bg-[#0e0f14]'
        } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className={layoutConfig.wrapperClass}>
        <div className={`flex items-center gap-4 ${layoutConfig.orderPrimary}`}>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-white bg-linear-to-r from-pink-300 to-rose-400"></div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-linear-to-r from-blue-300 to-indigo-400"></div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-linear-to-r from-amber-300 to-orange-400"></div>
          </div>
          <div className="text-left">
            <span className="block text-xs font-semibold text-[#111] dark:text-white">
              <InlineText
                value={content.proofTitle || 'Trusted by 200+ clients worldwide'}
                onSave={(v) => onUpdateContent?.('proofTitle', v)}
                disabled={isPreviewMode}
              />
            </span>
            <span className="text-[11px] text-[#555] dark:text-neutral-400">
              <InlineText
                value={content.proofRating || '★★★★★ 4.8 Rating'}
                onSave={(v) => onUpdateContent?.('proofRating', v)}
                disabled={isPreviewMode}
              />
            </span>
          </div>
        </div>

        <div className={`grid grid-cols-3 sm:grid-cols-6 gap-6 sm:gap-8 items-center text-xs font-bold text-[#b5b5b5] tracking-widest uppercase ${layoutConfig.orderSecondary}`}>
          {logos.map((logo: string, i: number) => (
            <span key={i}>
              <InlineText
                value={logo}
                onSave={(v) => updateLogo(i, v)}
                disabled={isPreviewMode}
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// 8. PROJECTS (Heading, "Projects 23' ↔ 25'" tabs, View All button, 3:4 ratio cards)
// -------------------------------------------------------------
export function AlexPortfolioSection({ block, isPreviewMode, onUpdateContent, onSelect, isSelected, viewport }: AlexSectionProps) {
  const content = block.content || {};
  const ctaBg = content.ctaBg || block.styles?.accentColor;
  const ctaColor = content.ctaColor;
  const projects = content.projects || [
    {
      name: 'Finova Mobile Banking',
      year: '2024',
      tag: 'Fintech UI/UX',
      imgUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Orbital DeFi Protocol',
      year: '2024',
      tag: 'Web3 Dashboard',
      hoverBadge: '+ View',
      imgUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Lumix Creative Canvas',
      year: '2023',
      tag: 'AI Studio System',
      imgUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const layoutConfig = resolveSectionLayout(block.layout, viewport, {
    defaultDisplay: 'grid',
    defaultColumns: 3,
    defaultGap: 'lg',
    defaultMaxWidth: 'boxed',
  });

  const updateProject = (index: number, key: string, val: string) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [key]: val };
    onUpdateContent?.('projects', updated);
  };

  const stylesConfig = resolveSectionStyles(block.styles, viewport, 'py-16 md:py-24 px-6 sm:px-10');

  return (
    <section
      onClick={onSelect}
      style={stylesConfig.sectionStyle}
      className={`relative ${stylesConfig.sectionClasses} transition-all ${block.styles?.backgroundColor ? '' : 'bg-white dark:bg-[#0c0d12]'
        } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className={`${layoutConfig.maxWidthClass} ${layoutConfig.contentPosClass} space-y-12`}>
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${stylesConfig.textAlignClass || 'text-left'}`}>
          <h2 className={`${stylesConfig.headlineSizeClass || 'text-3xl sm:text-4xl'} font-medium tracking-[-0.02em]`}>
            <span className="text-[#111] dark:text-white">
              <InlineText
                value={content.headlineDark || 'Selected'}
                onSave={(v) => onUpdateContent?.('headlineDark', v)}
                disabled={isPreviewMode}
              />
            </span>{' '}
            <span className="text-[#b5b5b5] dark:text-neutral-500">
              <InlineText
                value={content.headlineMuted || "Projects 23' ↔ 25'"}
                onSave={(v) => onUpdateContent?.('headlineMuted', v)}
                disabled={isPreviewMode}
              />
            </span>
          </h2>

          <div className="flex items-center gap-3">
            <div className="flex bg-[#f5f5f5] dark:bg-neutral-800 p-1 rounded-lg text-xs font-medium">
              <span className="px-3 py-1 bg-white dark:bg-neutral-900 rounded shadow-xs text-[#111] dark:text-white">All</span>
              <span className="px-3 py-1 text-[#555] dark:text-neutral-400">UI/UX</span>
              <span className="px-3 py-1 text-[#555] dark:text-neutral-400">Dev</span>
            </div>
            <button
              type="button"
              style={{
                ...(ctaBg ? { backgroundColor: ctaBg, backgroundImage: 'none' } : {}),
                ...(ctaColor ? { color: ctaColor } : {}),
              }}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all border ${ctaBg ? 'border-transparent text-white' : 'border-[#ececec] dark:border-neutral-700'
                }`}
            >
              <InlineText
                value={content.ctaText || 'View All'}
                onSave={(v) => onUpdateContent?.('ctaText', v)}
                disabled={isPreviewMode}
              />
            </button>
          </div>
        </div>

        <div className={layoutConfig.wrapperClass}>
          {projects.map((proj: any, i: number) => (
            <div key={i} className="space-y-3 text-left group">
              <div className="relative aspect-3/4 rounded-xl bg-linear-to-br from-[#f2f2f2] to-[#e5e5e5] dark:from-neutral-800 dark:to-neutral-900 overflow-hidden border border-[#ececec] dark:border-neutral-800">
                <EditableImage
                  src={proj.imgUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
                  alt={proj.name}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onSave={(newUrl) => updateProject(i, 'imgUrl', newUrl)}
                  disabled={isPreviewMode}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-white text-[#111] text-xs font-bold shadow-lg opacity-90 group-hover:scale-110 transition-transform pointer-events-auto z-10">
                  <InlineText
                    value={proj.hoverBadge || '+ View'}
                    onSave={(v) => updateProject(i, 'hoverBadge', v)}
                    disabled={isPreviewMode}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm text-[#111] dark:text-white">
                  <InlineText
                    value={proj.name || proj.title}
                    onSave={(v) => updateProject(i, 'name', v)}
                    disabled={isPreviewMode}
                  />
                </h3>
                <span className="text-xs text-[#b5b5b5]">
                  <InlineText
                    value={proj.year || '2024'}
                    onSave={(v) => updateProject(i, 'year', v)}
                    disabled={isPreviewMode}
                  />
                </span>
              </div>
              <span className="text-[11px] text-[#b5b5b5] block">
                <InlineText
                  value={proj.tag}
                  onSave={(v) => updateProject(i, 'tag', v)}
                  disabled={isPreviewMode}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// 9. PRICING (Basic $4,650 Light with gradient button & Business $2,940 Dark with white button + 3-column perks)
// -------------------------------------------------------------
export function AlexPricingSection({ block, isPreviewMode, onUpdateContent, onSelect, isSelected, viewport }: AlexSectionProps) {
  const content = block.content || {};
  const standard = content.standard || {
    name: 'Basic',
    price: '$4,650',
    period: '/ month',
    badge: 'Basic',
    sprint: 'MONTHLY SPRINT',
    desc: 'Ideal for fast-moving startups needing consistent design execution.',
    features: [
      '1 active request at a time',
      'Fast 48-hour typical delivery',
      'Unlimited design revisions',
      'Figma source files & assets',
    ],
    cta: 'Get Started',
  };

  const enterprise = content.enterprise || {
    name: 'Business',
    price: '$2,940',
    period: '/ bi-weekly',
    badge: 'Business',
    sprint: 'DEDICATED CAPACITY',
    desc: 'For established teams scaling multiple product features simultaneously.',
    features: [
      '2 active requests at a time',
      'Priority 24-hour delivery',
      'Dedicated Slack channel access',
      'Production Next.js / CSS code',
    ],
    cta: 'Get Started',
  };

  const perks = content.perks || [
    { title: 'No Lock-in', text: 'Pause or cancel your subscription anytime with zero friction.' },
    { title: 'Fast Turnaround', text: 'Consistent delivery updates delivered every 24 to 48 hours.' },
    { title: '100% IP Ownership', text: 'All designs, tokens, and code belong entirely to your company.' },
  ];

  const layoutConfig = resolveSectionLayout(block.layout, viewport, {
    defaultDisplay: 'grid',
    defaultColumns: 2,
    defaultGap: 'lg',
    defaultMaxWidth: 'boxed',
  });

  const updateStandard = (key: string, val: any) => {
    onUpdateContent?.('standard', { ...standard, [key]: val });
  };

  const updateEnterprise = (key: string, val: any) => {
    onUpdateContent?.('enterprise', { ...enterprise, [key]: val });
  };

  const updatePerk = (index: number, key: 'title' | 'text', val: string) => {
    const updated = [...perks];
    updated[index] = { ...updated[index], [key]: val };
    onUpdateContent?.('perks', updated);
  };

  const standardBtnBg = standard.ctaBg || content.standardCtaBg || block.styles?.accentColor;
  const standardBtnColor = standard.ctaColor || content.standardCtaColor || (standardBtnBg ? '#ffffff' : undefined);
  const enterpriseBtnBg = enterprise.ctaBg || content.enterpriseCtaBg;
  const enterpriseBtnColor = enterprise.ctaColor || content.enterpriseCtaColor;

  const stylesConfig = resolveSectionStyles(block.styles, viewport, 'py-16 md:py-24 px-6 sm:px-10');

  return (
    <section
      onClick={onSelect}
      style={stylesConfig.sectionStyle}
      className={`relative ${stylesConfig.sectionClasses} transition-all ${block.styles?.backgroundColor ? '' : 'bg-[#fafafa] dark:bg-[#0a0b10]'
        } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className={`${layoutConfig.maxWidthClass} ${layoutConfig.contentPosClass} space-y-12`}>
        <div className={stylesConfig.textAlignClass || 'text-center'}>
          <h2 className={`${stylesConfig.headlineSizeClass || 'text-3xl sm:text-4xl'} font-medium tracking-[-0.02em]`}>
            <span className="text-[#111] dark:text-white">
              <InlineText
                value={content.headlineDark || 'Flexible plans'}
                onSave={(v) => onUpdateContent?.('headlineDark', v)}
                disabled={isPreviewMode}
              />
            </span>{' '}
            <span className="text-[#b5b5b5] dark:text-neutral-500">
              <InlineText
                value={content.headlineMuted || 'tailored to your exact scale.'}
                onSave={(v) => onUpdateContent?.('headlineMuted', v)}
                disabled={isPreviewMode}
              />
            </span>
          </h2>
        </div>

        <div className={layoutConfig.wrapperClass}>
          {/* Basic Plan (Light with $4,650 and gradient button) */}
          <div className={`rounded-xl ${layoutConfig.orderPrimary} bg-white dark:bg-neutral-900 border border-[#ececec] dark:border-neutral-800 p-8 sm:p-10 shadow-md space-y-8 flex flex-col justify-between text-left`}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#d9ff1a] text-[#111]">
                  <InlineText
                    value={standard.badge || standard.name || 'Basic'}
                    onSave={(v) => updateStandard('badge', v)}
                    disabled={isPreviewMode}
                  />
                </span>
                <span className="text-xs text-[#b5b5b5] font-semibold tracking-wider uppercase">
                  <InlineText
                    value={standard.sprint || 'MONTHLY SPRINT'}
                    onSave={(v) => updateStandard('sprint', v)}
                    disabled={isPreviewMode}
                  />
                </span>
              </div>
              <div>
                <span className="text-4xl sm:text-5xl font-medium tracking-[-0.02em] text-[#111] dark:text-white">
                  <InlineText
                    value={standard.price || '$4,650'}
                    onSave={(v) => updateStandard('price', v)}
                    disabled={isPreviewMode}
                  />
                </span>
                <span className="text-xs text-[#b5b5b5] ml-1.5">
                  <InlineText
                    value={standard.period || '/ month'}
                    onSave={(v) => updateStandard('period', v)}
                    disabled={isPreviewMode}
                  />
                </span>
              </div>
              <p className="text-xs text-[#555] dark:text-neutral-400">
                <InlineText
                  value={standard.desc || 'Ideal for fast-moving startups needing consistent design execution.'}
                  onSave={(v) => updateStandard('desc', v)}
                  disabled={isPreviewMode}
                  as="span"
                />
              </p>
              <div className="space-y-2.5 pt-4 border-t border-[#ececec] dark:border-neutral-800 text-xs text-[#111] dark:text-neutral-300">
                {(standard.features || []).map((feat: string, i: number) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span>✓</span>
                    <InlineText
                      value={feat}
                      onSave={(v) => {
                        const newFeat = [...(standard.features || [])];
                        newFeat[i] = v;
                        updateStandard('features', newFeat);
                      }}
                      disabled={isPreviewMode}
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              style={{
                ...(standardBtnBg ? { backgroundColor: standardBtnBg, backgroundImage: 'none' } : {}),
                ...(standardBtnColor ? { color: standardBtnColor } : {}),
              }}
              className={`w-full py-3 rounded-lg font-semibold text-xs shadow-md transition-all ${standardBtnBg ? 'hover:opacity-95' : 'text-white bg-linear-to-r from-[#ff2d9b] via-[#ff7a2f] to-[#ffd21f] hover:opacity-95'
                }`}
            >
              <InlineText
                value={standard.cta || 'Get Started'}
                onSave={(v) => updateStandard('cta', v)}
                disabled={isPreviewMode}
              />
            </button>
          </div>

          {/* Business Plan (Dark #161616 with $2,940 and white button) */}
          <div className={`rounded-xl ${layoutConfig.orderSecondary} bg-[#161616] border border-neutral-800 p-8 sm:p-10 shadow-xl space-y-8 flex flex-col justify-between text-left text-white`}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#262626] text-white border border-[#333]">
                  <InlineText
                    value={enterprise.badge || enterprise.name || 'Business'}
                    onSave={(v) => updateEnterprise('badge', v)}
                    disabled={isPreviewMode}
                  />
                </span>
                <span className="text-xs text-neutral-400 font-semibold tracking-wider uppercase">
                  <InlineText
                    value={enterprise.sprint || 'DEDICATED CAPACITY'}
                    onSave={(v) => updateEnterprise('sprint', v)}
                    disabled={isPreviewMode}
                  />
                </span>
              </div>
              <div>
                <span className="text-4xl sm:text-5xl font-medium tracking-[-0.02em] text-white">
                  <InlineText
                    value={enterprise.price || '$2,940'}
                    onSave={(v) => updateEnterprise('price', v)}
                    disabled={isPreviewMode}
                  />
                </span>
                <span className="text-xs text-neutral-400 ml-1.5">
                  <InlineText
                    value={enterprise.period || '/ bi-weekly'}
                    onSave={(v) => updateEnterprise('period', v)}
                    disabled={isPreviewMode}
                  />
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                <InlineText
                  value={enterprise.desc || 'For established teams scaling multiple product features simultaneously.'}
                  onSave={(v) => updateEnterprise('desc', v)}
                  disabled={isPreviewMode}
                  as="span"
                />
              </p>
              <div className="space-y-2.5 pt-4 border-t border-neutral-800 text-xs text-neutral-300">
                {(enterprise.features || []).map((feat: string, i: number) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span>✓</span>
                    <InlineText
                      value={feat}
                      onSave={(v) => {
                        const newFeat = [...(enterprise.features || [])];
                        newFeat[i] = v;
                        updateEnterprise('features', newFeat);
                      }}
                      disabled={isPreviewMode}
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              style={{
                ...(enterpriseBtnBg ? { backgroundColor: enterpriseBtnBg, backgroundImage: 'none' } : {}),
                ...(enterpriseBtnColor ? { color: enterpriseBtnColor } : {}),
              }}
              className={`w-full py-3 rounded-lg font-semibold text-xs shadow-md transition-all ${enterpriseBtnBg ? 'hover:opacity-95' : 'text-[#111] bg-white hover:bg-neutral-100'
                }`}
            >
              <InlineText
                value={enterprise.cta || 'Get Started'}
                onSave={(v) => updateEnterprise('cta', v)}
                disabled={isPreviewMode}
              />
            </button>
          </div>
        </div>

        {/* 3-Column Perks Row below pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#ececec] dark:border-neutral-800 text-left">
          {perks.map((p: any, i: number) => (
            <div key={i}>
              <h4 className="text-sm font-medium text-[#111] dark:text-white">
                <InlineText
                  value={p.title}
                  onSave={(v) => updatePerk(i, 'title', v)}
                  disabled={isPreviewMode}
                />
              </h4>
              <p className="text-xs text-[#555] dark:text-neutral-400 mt-1">
                <InlineText
                  value={p.text}
                  onSave={(v) => updatePerk(i, 'text', v)}
                  disabled={isPreviewMode}
                  as="span"
                />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// 10. TESTIMONIALS (Tab names row + Photo left + Lime badge + Quote right)
// -------------------------------------------------------------
export function AlexTestimonialSection({ block, isPreviewMode, onUpdateContent, onSelect, isSelected, viewport }: AlexSectionProps) {
  const content = block.content || {};
  const tabs = content.tabs || ['Horizon AI', 'Linear Systems', 'Stripe Ecosystem', 'Raycast Labs'];

  const layoutConfig = resolveSectionLayout(block.layout, viewport, {
    defaultDisplay: 'grid',
    defaultColumns: 12,
    defaultGap: 'lg',
    defaultMaxWidth: 'boxed',
  });

  const updateTab = (index: number, val: string) => {
    const updated = [...tabs];
    updated[index] = val;
    onUpdateContent?.('tabs', updated);
  };

  const stylesConfig = resolveSectionStyles(block.styles, viewport, 'py-16 md:py-24 px-6 sm:px-10');

  return (
    <section
      onClick={onSelect}
      style={stylesConfig.sectionStyle}
      className={`relative ${stylesConfig.sectionClasses} transition-all ${block.styles?.backgroundColor ? '' : 'bg-white dark:bg-[#0c0d12]'
        } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className={`${layoutConfig.maxWidthClass} ${layoutConfig.contentPosClass} space-y-10`}>
        {/* Tab names row with active tab underlined */}
        <div className="flex items-center justify-center gap-8 border-b border-[#ececec] dark:border-neutral-800 pb-3 text-xs font-medium">
          {tabs.map((tab: string, i: number) => (
            <span
              key={i}
              className={
                i === 0
                  ? 'text-[#111] dark:text-white border-b-2 border-[#111] dark:border-white pb-3 -mb-3 font-semibold'
                  : 'text-[#b5b5b5]'
              }
            >
              <InlineText
                value={tab}
                onSave={(v) => updateTab(i, v)}
                disabled={isPreviewMode}
              />
            </span>
          ))}
        </div>

        <div className={`p-8 sm:p-12 rounded-xl bg-white dark:bg-[#161616] border border-[#ececec] dark:border-neutral-800 shadow-md ${layoutConfig.isGrid ? 'grid grid-cols-1 md:grid-cols-12' : `flex ${layoutConfig.active.flexDirection === 'col' ? (layoutConfig.active.reverse ? 'flex-col-reverse' : 'flex-col') : (layoutConfig.active.reverse ? 'flex-col md:flex-row-reverse' : 'flex-col md:flex-row')}`} gap-8 items-center text-left`}>
          <div className={`md:col-span-4 ${layoutConfig.orderPrimary} aspect-square rounded-lg overflow-hidden bg-slate-100`}>
            <EditableImage
              src={
                content.avatarUrl ||
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
              }
              alt="David Sterling"
              className="w-full h-full"
              imgClassName="w-full h-full object-cover"
              onSave={(newUrl) => onUpdateContent?.('avatarUrl', newUrl)}
              disabled={isPreviewMode}
            />
          </div>

          <div className={`md:col-span-8 ${layoutConfig.orderSecondary} space-y-4`}>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#d9ff1a] text-[#111]">
              <InlineText
                value={content.badge || 'Client Review'}
                onSave={(v) => onUpdateContent?.('badge', v)}
                disabled={isPreviewMode}
              />
            </span>
            <blockquote className={`${stylesConfig.headlineSizeClass || 'text-xl sm:text-2xl'} font-medium tracking-[-0.02em] text-[#111] dark:text-white leading-snug`}>
              <InlineText
                value={
                  content.quote ||
                  '“Alex completely transformed our product experience. Our conversion rate surged by 140% within 90 days after redesign. Highly recommended!”'
                }
                onSave={(v) => onUpdateContent?.('quote', v)}
                disabled={isPreviewMode}
                as="span"
              />
            </blockquote>
            <div className="flex items-center justify-between pt-4 border-t border-[#ececec] dark:border-neutral-800">
              <div>
                <span className="block font-bold text-xs text-[#111] dark:text-white">
                  <InlineText
                    value={content.author || 'David Sterling'}
                    onSave={(v) => onUpdateContent?.('author', v)}
                    disabled={isPreviewMode}
                  />
                </span>
                <span className="text-[11px] text-[#b5b5b5]">
                  <InlineText
                    value={content.role || 'VP of Product, Horizon AI'}
                    onSave={(v) => onUpdateContent?.('role', v)}
                    disabled={isPreviewMode}
                  />
                </span>
              </div>
              <span className="font-bold text-xs tracking-widest text-[#111] dark:text-white">
                <InlineText
                  value={content.companyLogo || 'HORIZON'}
                  onSave={(v) => onUpdateContent?.('companyLogo', v)}
                  disabled={isPreviewMode}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// 11. BLOG (Heading + Read All Blogs button + Tall image left + 3 post rows right)
// -------------------------------------------------------------
export function AlexArticlesSection({ block, isPreviewMode, onUpdateContent, onSelect, isSelected, viewport }: AlexSectionProps) {
  const content = block.content || {};
  const ctaBg = content.ctaBg || block.styles?.accentColor;
  const ctaColor = content.ctaColor;
  const featured = content.featured || {
    tag: 'Design Engineering',
    title: 'How to Build High-Converting SaaS Landing Pages in 2024',
    imgUrl: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=80',
  };

  const articles = content.articles || [
    { date: 'April 2024', title: 'The subtle art of micro-interactions in design systems', linkText: 'Read More →' },
    { date: 'March 2024', title: 'Why typography is 90% of your visual brand identity', linkText: 'Read More →' },
    { date: 'February 2024', title: 'Future of AI-assisted UI tools for solo agency founders', linkText: 'Read More →' },
  ];

  const layoutConfig = resolveSectionLayout(block.layout, viewport, {
    defaultDisplay: 'grid',
    defaultColumns: 12,
    defaultGap: 'lg',
    defaultMaxWidth: 'boxed',
  });

  const updateFeatured = (key: string, val: string) => {
    onUpdateContent?.('featured', { ...featured, [key]: val });
  };

  const updateArticle = (index: number, key: string, val: string) => {
    const updated = [...articles];
    updated[index] = { ...updated[index], [key]: val };
    onUpdateContent?.('articles', updated);
  };

  const stylesConfig = resolveSectionStyles(block.styles, viewport, 'py-16 md:py-24 px-6 sm:px-10');

  return (
    <section
      onClick={onSelect}
      style={stylesConfig.sectionStyle}
      className={`relative ${stylesConfig.sectionClasses} transition-all ${block.styles?.backgroundColor ? '' : 'bg-[#fafafa] dark:bg-[#0a0b10]'
        } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className={`${layoutConfig.maxWidthClass} ${layoutConfig.contentPosClass} space-y-10`}>
        <div className={`flex items-center justify-between ${stylesConfig.textAlignClass || 'text-left'}`}>
          <h2 className={`${stylesConfig.headlineSizeClass || 'text-3xl sm:text-4xl'} font-medium tracking-[-0.02em]`}>
            <span className="text-[#111] dark:text-white">
              <InlineText
                value={content.headlineDark || 'Latest thoughts'}
                onSave={(v) => onUpdateContent?.('headlineDark', v)}
                disabled={isPreviewMode}
              />
            </span>{' '}
            <span className="text-[#b5b5b5] dark:text-neutral-500">
              <InlineText
                value={content.headlineMuted || '& design insights.'}
                onSave={(v) => onUpdateContent?.('headlineMuted', v)}
                disabled={isPreviewMode}
              />
            </span>
          </h2>
          <button
            type="button"
            style={{
              ...(ctaBg ? { backgroundColor: ctaBg, backgroundImage: 'none' } : {}),
              ...(ctaColor ? { color: ctaColor } : {}),
            }}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all border ${ctaBg ? 'border-transparent text-white' : 'border-[#ececec] dark:border-neutral-700'
              }`}
          >
            <InlineText
              value={content.ctaText || 'Read All Blogs'}
              onSave={(v) => onUpdateContent?.('ctaText', v)}
              disabled={isPreviewMode}
            />
          </button>
        </div>

        <div className={layoutConfig.wrapperClass}>
          {/* Tall Image left */}
          <div className={`${layoutConfig.isGrid ? 'md:col-span-6' : 'flex-1'} ${layoutConfig.orderPrimary} relative rounded-xl overflow-hidden aspect-4/3 border border-[#ececec] dark:border-neutral-800`}>
            <EditableImage
              src={featured.imgUrl || 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=80'}
              alt={featured.title}
              className="w-full h-full"
              imgClassName="w-full h-full object-cover"
              onSave={(newUrl) => updateFeatured('imgUrl', newUrl)}
              disabled={isPreviewMode}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end text-left text-white pointer-events-none">
              <span className="self-start px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d9ff1a] text-[#111] mb-2 pointer-events-auto">
                <InlineText
                  value={featured.tag || 'Design Engineering'}
                  onSave={(v) => updateFeatured('tag', v)}
                  disabled={isPreviewMode}
                />
              </span>
              <h3 className="text-lg font-medium leading-tight pointer-events-auto">
                <InlineText
                  value={featured.title || 'How to Build High-Converting SaaS Landing Pages in 2024'}
                  onSave={(v) => updateFeatured('title', v)}
                  disabled={isPreviewMode}
                />
              </h3>
            </div>
          </div>

          {/* 3 post rows right */}
          <div className={`${layoutConfig.isGrid ? 'md:col-span-6' : 'flex-1'} ${layoutConfig.orderSecondary} flex flex-col justify-between gap-4 text-left`}>
            {articles.map((art: any, i: number) => (
              <div key={i} className="p-5 rounded-xl bg-white dark:bg-[#161616] border border-[#ececec] dark:border-neutral-800">
                <span className="text-[10px] text-[#b5b5b5]">
                  <InlineText
                    value={art.date}
                    onSave={(v) => updateArticle(i, 'date', v)}
                    disabled={isPreviewMode}
                  />
                </span>
                <h4 className="text-sm font-medium text-[#111] dark:text-white mt-1">
                  <InlineText
                    value={art.title}
                    onSave={(v) => updateArticle(i, 'title', v)}
                    disabled={isPreviewMode}
                  />
                </h4>
                <span className="text-xs font-semibold text-[#111] dark:text-white mt-2 block">
                  <InlineText
                    value={art.linkText || 'Read More →'}
                    onSave={(v) => updateArticle(i, 'linkText', v)}
                    disabled={isPreviewMode}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// 12. FAQ (4 accordion items using details/summary, first one open)
// -------------------------------------------------------------
export function AlexFaqSection({ block, isPreviewMode, onUpdateContent, onSelect, isSelected, viewport }: AlexSectionProps) {
  const content = block.content || {};
  const faqs = content.faqs || [
    {
      question: 'How quickly can we start on our first project?',
      answer:
        'Usually within 24 to 48 hours of onboarding. Once you subscribe, you receive access to your private Trello/Linear board to start requesting tasks immediately.',
    },
    {
      question: 'What does the typical turnaround time look like?',
      answer:
        'Most design requests and UI components are completed in 48 hours or less. Complex web apps or full landing pages are delivered in milestone-based sprints.',
    },
    {
      question: 'How does the monthly subscription work?',
      answer:
        'You pay a flat monthly fee with no hidden costs or long-term lock-in. You can pause or cancel your subscription at any time with a single click.',
    },
    {
      question: 'What tools and tech stack do you use?',
      answer:
        'Figma for UI/UX and design systems; Webflow and clean HTML5/CSS/JavaScript for responsive, performant websites.',
    },
  ];

  const layoutConfig = resolveSectionLayout(block.layout, viewport, {
    defaultDisplay: 'flex',
    defaultFlexDirection: 'col',
    defaultMaxWidth: 'compact',
    defaultGap: 'md',
  });

  const updateFaq = (index: number, key: 'question' | 'answer', val: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [key]: val };
    onUpdateContent?.('faqs', updated);
  };

  const stylesConfig = resolveSectionStyles(block.styles, viewport, 'py-16 md:py-24 px-6 sm:px-10');

  return (
    <section
      onClick={onSelect}
      style={stylesConfig.sectionStyle}
      className={`relative ${stylesConfig.sectionClasses} transition-all ${block.styles?.backgroundColor ? '' : 'bg-white dark:bg-[#0c0d12]'
        } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className={`${layoutConfig.maxWidthClass} ${layoutConfig.contentPosClass} space-y-10 ${stylesConfig.textAlignClass || 'text-center'}`}>
        <h2 className={`${stylesConfig.headlineSizeClass || 'text-3xl sm:text-4xl'} font-medium tracking-[-0.02em]`}>
          <span className="text-[#111] dark:text-white">
            <InlineText
              value={content.headlineDark || 'Frequently'}
              onSave={(v) => onUpdateContent?.('headlineDark', v)}
              disabled={isPreviewMode}
            />
          </span>{' '}
          <span className="text-[#b5b5b5] dark:text-neutral-500">
            <InlineText
              value={content.headlineMuted || 'asked questions.'}
              onSave={(v) => onUpdateContent?.('headlineMuted', v)}
              disabled={isPreviewMode}
            />
          </span>
        </h2>

        <div className="space-y-3 text-left">
          {faqs.map((f: any, i: number) => (
            <details
              key={i}
              className={`rounded-xl border p-5 bg-white dark:bg-[#161616] transition-all ${i === 0 ? 'border-[#111] dark:border-white' : 'border-[#ececec] dark:border-neutral-800'
                }`}
              open={i === 0}
            >
              <summary className="font-medium text-sm text-[#111] dark:text-white cursor-pointer flex justify-between items-center list-none">
                <span>
                  <InlineText
                    value={f.question}
                    onSave={(v) => updateFaq(i, 'question', v)}
                    disabled={isPreviewMode}
                  />
                </span>
                <span className="text-base text-[#b5b5b5]">▾</span>
              </summary>
              <p className="text-xs text-[#555] dark:text-neutral-400 mt-3 pt-3 border-t border-[#ececec] dark:border-neutral-800 leading-relaxed">
                <InlineText
                  value={f.answer}
                  onSave={(v) => updateFaq(i, 'answer', v)}
                  disabled={isPreviewMode}
                  as="span"
                />
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// 13. SOCIAL ROW (4 cells: Behance, Dribbble, LinkedIn, Instagram)
// -------------------------------------------------------------
export function AlexGuaranteesSection({ block, isPreviewMode, onUpdateContent, onSelect, isSelected, viewport }: AlexSectionProps) {
  const content = block.content || {};
  const socials = content.socials || [
    { name: 'Behance', url: 'https://behance.net' },
    { name: 'Dribbble', url: 'https://dribbble.com' },
    { name: 'LinkedIn', url: 'https://linkedin.com' },
    { name: 'Instagram', url: 'https://instagram.com' },
  ];

  const layoutConfig = resolveSectionLayout(block.layout, viewport, {
    defaultDisplay: 'grid',
    defaultColumns: 4,
    defaultMaxWidth: 'boxed',
    defaultGap: 'none',
  });

  const updateSocial = (index: number, val: string) => {
    const updated = [...socials];
    updated[index] = { ...updated[index], name: val };
    onUpdateContent?.('socials', updated);
  };

  const stylesConfig = resolveSectionStyles(block.styles, viewport, 'py-6 px-6 sm:px-10');

  return (
    <section
      onClick={onSelect}
      style={stylesConfig.sectionStyle}
      className={`relative ${stylesConfig.sectionClasses} border-y border-[#ececec] dark:border-neutral-800 transition-all ${block.styles?.backgroundColor ? '' : 'bg-white dark:bg-[#0c0d12]'
        } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className={`${layoutConfig.wrapperClass} divide-x divide-[#ececec] dark:divide-neutral-800 text-center`}>
        {socials.map((s: any, i: number) => (
          <a
            key={i}
            href={s.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!isPreviewMode) e.preventDefault();
            }}
            className="py-2 px-4 flex justify-between items-center text-xs font-medium text-[#111] dark:text-white hover:opacity-70 transition-opacity"
          >
            <span>
              <InlineText
                value={s.name}
                onSave={(v) => updateSocial(i, v)}
                disabled={isPreviewMode}
              />
            </span>
            <span>↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// 14. FOOTER (Dark #121212 with giant faded "Alex Travis.")
// -------------------------------------------------------------
export function AlexFooterSection({ block, isPreviewMode, onUpdateContent, onSelect, isSelected, viewport }: AlexSectionProps) {
  const content = block.content || {};
  const footerBtnBg = content.ctaBgColor || block.styles?.accentColor;
  const footerBtnColor = content.ctaTextColor || (footerBtnBg ? '#ffffff' : undefined);

  const layoutConfig = resolveSectionLayout(block.layout, viewport, {
    defaultDisplay: 'grid',
    defaultColumns: 12,
    defaultGap: 'xl',
    defaultMaxWidth: 'boxed',
  });

  const stylesConfig = resolveSectionStyles(block.styles, viewport, 'pt-20 pb-12 px-6 sm:px-10');

  return (
    <footer
      onClick={onSelect}
      style={stylesConfig.sectionStyle}
      className={`relative ${stylesConfig.sectionClasses} text-white overflow-hidden transition-all ${block.styles?.backgroundColor ? '' : 'bg-[#121212]'
        } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className={`${layoutConfig.maxWidthClass} ${layoutConfig.contentPosClass} space-y-16 relative z-10 text-left`}>
        <div className={layoutConfig.wrapperClass}>
          <div className={`${layoutConfig.isGrid ? 'md:col-span-6' : 'flex-1'} ${layoutConfig.orderPrimary} space-y-4`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#d9ff1a] text-[#111] font-bold flex items-center justify-center text-xs">
                <InlineText
                  value={content.logoInitials || 'AT'}
                  onSave={(v) => onUpdateContent?.('logoInitials', v)}
                  disabled={isPreviewMode}
                />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#d9ff1a] text-[#111]">
                <InlineText
                  value={content.badge || 'Available for work'}
                  onSave={(v) => onUpdateContent?.('badge', v)}
                  disabled={isPreviewMode}
                />
              </span>
            </div>

            <p className="text-xs text-[#999] max-w-sm font-normal leading-relaxed">
              <InlineText
                value={
                  content.text ||
                  'Have a project in mind or want to consult on design systems? Let’s create something extraordinary together.'
                }
                onSave={(v) => onUpdateContent?.('text', v)}
                disabled={isPreviewMode}
                as="span"
              />
            </p>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="button"
                style={{
                  ...(footerBtnBg ? { backgroundColor: footerBtnBg, backgroundImage: 'none' } : {}),
                  ...(footerBtnColor ? { color: footerBtnColor } : {}),
                }}
                className={`px-6 py-2.5 rounded-lg font-semibold text-xs shadow-md hover:opacity-95 transition-all ${footerBtnBg ? 'text-white' : 'text-white bg-linear-to-r from-[#ff2d9b] via-[#ff7a2f] to-[#ffd21f]'
                  }`}
              >
                <InlineText
                  value={content.ctaText || 'Hire Me!'}
                  onSave={(v) => onUpdateContent?.('ctaText', v)}
                  disabled={isPreviewMode}
                />
              </button>
              <a href={`mailto:${content.email || 'hello@alextravis.design'}`} className="text-xs text-[#aaa] underline">
                <InlineText
                  value={content.email || 'hello@alextravis.design'}
                  onSave={(v) => onUpdateContent?.('email', v)}
                  disabled={isPreviewMode}
                />
              </a>
            </div>
          </div>

          <div className={`${layoutConfig.isGrid ? 'md:col-span-6' : 'flex-1'} ${layoutConfig.orderSecondary} grid grid-cols-3 gap-8 text-xs`}>
            <div className="space-y-3">
              <span className="font-semibold text-[#b5b5b5] uppercase tracking-wider text-[11px]">Navigation</span>
              <ul className="space-y-2 text-[#999]">
                <li><a href="#about" className="hover:text-white">About</a></li>
                <li><a href="#projects" className="hover:text-white">Projects</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#store" className="hover:text-white">Store</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <span className="font-semibold text-[#b5b5b5] uppercase tracking-wider text-[11px]">Services</span>
              <ul className="space-y-2 text-[#999]">
                <li><a href="#services" className="hover:text-white">UI/UX Design</a></li>
                <li><a href="#services" className="hover:text-white">Design Systems</a></li>
                <li><a href="#services" className="hover:text-white">Web Engineering</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <span className="font-semibold text-[#b5b5b5] uppercase tracking-wider text-[11px]">Socials</span>
              <ul className="space-y-2 text-[#999]">
                <li><a href="https://dribbble.com" className="hover:text-white">Dribbble</a></li>
                <li><a href="https://behance.net" className="hover:text-white">Behance</a></li>
                <li><a href="https://linkedin.com" className="hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Giant Faded Watermark Title */}
        <div className="pt-8 border-t border-[#222] text-center overflow-hidden">
          <div className="text-5xl sm:text-7xl md:text-9xl font-bold text-[#1a1a1a] tracking-tight select-none leading-none">
            <InlineText
              value={content.watermark || 'Alex Travis.'}
              onSave={(v) => onUpdateContent?.('watermark', v)}
              disabled={isPreviewMode}
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#777] pt-4">
          <span>
            <InlineText
              value={content.copyright || '© 2025 Alex Travis. All rights reserved.'}
              onSave={(v) => onUpdateContent?.('copyright', v)}
              disabled={isPreviewMode}
            />
          </span>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-white">Privacy Policy</a>
            <a href="#terms" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
