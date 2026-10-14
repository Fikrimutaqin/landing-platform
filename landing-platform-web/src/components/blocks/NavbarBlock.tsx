'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { ArrowRight, Menu, X, ShoppingCart } from 'lucide-react';
import { BlockStyles } from '../../../../shared/types';

export interface NavbarBlockProps {
  brandName?: string;
  brandLogoUrl?: string;
  positionMode?: 'sticky' | 'fixed' | 'static';
  navLinks?: Array<{ label: string; href: string }>;
  ctaText?: string;
  onCtaClick?: () => void;
  styles?: BlockStyles;
}

export function NavbarBlock({
  brandName = 'Vanguard Studio',
  brandLogoUrl = '',
  positionMode = 'sticky',
  navLinks = [
    { label: 'Overview', href: '#hero' },
    { label: 'Specs', href: '#spotlight' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'FAQ', href: '#faq' },
  ],
  ctaText = 'Order Now',
  onCtaClick,
  styles,
}: NavbarBlockProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fontClass = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    space: 'font-mono tracking-tight',
    jakarta: 'font-sans',
  }[styles?.fontFamily || 'sans'];

  const positionClasses = {
    sticky: 'sticky top-0 z-30',
    fixed: 'fixed top-0 left-0 right-0 z-40',
    static: 'relative',
  }[positionMode] || 'sticky top-0 z-30';

  const scrollToCheckout = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      const el = document.getElementById('checkout-target');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`w-full border-b border-neutral-800/80 backdrop-blur-md transition-all ${positionClasses} ${fontClass}`}
      style={{
        backgroundColor: styles?.backgroundColor || 'rgba(9, 10, 15, 0.85)',
        color: styles?.textColor || '#ffffff',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Logo / Text */}
        <div className="flex items-center gap-2.5">
          {brandLogoUrl ? (
            <img src={brandLogoUrl} alt={brandName} className="h-6 w-auto object-contain" />
          ) : (
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm"
              style={{
                backgroundColor: styles?.accentColor || '#10b981',
                color: '#ffffff',
              }}
            >
              {brandName.substring(0, 2).toUpperCase()}
            </div>
          )}
          <span className="font-bold text-sm tracking-tight tracking-wide">{brandName}</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium opacity-80">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="hover:opacity-100 hover:text-white transition-opacity"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            size="sm"
            variant="default"
            onClick={scrollToCheckout}
            className="h-8 px-4 text-xs font-semibold"
            style={{
              backgroundColor: styles?.accentColor,
              color: styles?.accentColor ? '#ffffff' : undefined,
            }}
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-70" />
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-neutral-800 bg-[#090a0f] px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2 text-xs font-medium">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-neutral-300 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <Button
            size="sm"
            onClick={scrollToCheckout}
            className="w-full h-9 text-xs font-semibold justify-center"
            style={{
              backgroundColor: styles?.accentColor,
              color: styles?.accentColor ? '#ffffff' : undefined,
            }}
          >
            {ctaText}
          </Button>
        </div>
      )}
    </nav>
  );
}
