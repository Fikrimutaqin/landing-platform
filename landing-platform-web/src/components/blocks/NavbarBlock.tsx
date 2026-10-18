'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ArrowRight, Menu, X, ShoppingBag } from 'lucide-react';
import { BlockStyles } from '../../../../shared/types';
import { CartStore } from '@/lib/cart-store';
import { CartDrawer } from './CartDrawer';

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
  brandName = 'Official Brand Store',
  brandLogoUrl = '',
  positionMode = 'sticky',
  navLinks = [
    { label: 'Katalog', href: '#katalog' },
    { label: 'Ulasan', href: '#reviews' },
    { label: 'FAQ', href: '#faq' },
  ],
  ctaText = 'Keranjang Belanja',
  onCtaClick,
  styles,
}: NavbarBlockProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(CartStore.getItemCount());
    const unsub = CartStore.subscribe(() => {
      setCartCount(CartStore.getItemCount());
    });
    return () => unsub();
  }, []);

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

  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      setIsCartOpen(true);
    }
    setMobileMenuOpen(false);
  };

  const isDarkBg =
    styles?.backgroundColor?.includes('#0') ||
    styles?.backgroundColor?.includes('#1') ||
    styles?.backgroundColor?.includes('black') ||
    styles?.backgroundColor?.includes('neutral-9');

  const navBg = styles?.backgroundColor || (isDarkBg ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)');
  const textColor = styles?.textColor || (isDarkBg ? '#ffffff' : '#0f172a');
  const borderColor = isDarkBg ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';

  const activeNavLinks =
    navLinks && navLinks.length > 0
      ? navLinks
      : [
        { label: 'Katalog', href: '#katalog' },
        { label: 'Ulasan', href: '#reviews' },
        { label: 'FAQ', href: '#faq' },
      ];

  return (
    <>
      <nav
        className={`w-full border-b backdrop-blur-md transition-all ${positionClasses} ${fontClass}`}
        style={{
          backgroundColor: navBg,
          color: textColor,
          borderColor,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          {/* Brand Logo / Text */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {brandLogoUrl ? (
              <img src={brandLogoUrl} alt={brandName} className="h-7 w-auto object-contain" />
            ) : (
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs shrink-0"
                style={{
                  backgroundColor: styles?.accentColor || '#2563eb',
                  color: '#ffffff',
                }}
              >
                {brandName.substring(0, 2).toUpperCase()}
              </div>
            )}
            <span className="font-extrabold text-xs sm:text-base tracking-tight truncate max-w-32.5 sm:max-w-xs">
              {brandName}
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold opacity-85">
            {activeNavLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="hover:opacity-100 transition-opacity hover:text-blue-600 dark:hover:text-blue-400 py-1"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Cart Trigger Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 min-w-9.5 min-h-9.5 rounded-xl border border-slate-200 dark:border-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center px-1 font-mono shadow-xs animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Desktop CTA Button */}
            <div className="hidden sm:flex items-center">
              <Button
                size="sm"
                variant="default"
                onClick={handleCtaClick}
                className="h-8 px-3.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs flex items-center gap-1.5"
                style={{
                  backgroundColor: styles?.accentColor || undefined,
                }}
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-70" />
              </Button>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <div className="flex md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className={`p-2 min-w-9.5 min-h-9.5 rounded-xl border transition-all flex items-center justify-center focus:outline-hidden cursor-pointer ${mobileMenuOpen
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                    : 'border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800'
                  }`}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-t px-4 py-4 space-y-4 shadow-2xl relative z-30 animate-in slide-in-from-top-2 duration-200"
            style={{
              backgroundColor: navBg,
              color: textColor,
              borderColor,
            }}
          >
            {/* Nav links */}
            <div className="flex flex-col space-y-1">
              {activeNavLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-neutral-800/70 transition-colors flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                </a>
              ))}
            </div>

            {/* Mobile Primary CTA */}
            <Button
              size="sm"
              onClick={handleCtaClick}
              className="w-full h-10 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md flex items-center justify-center gap-2 cursor-pointer"
              style={{
                backgroundColor: styles?.accentColor || undefined,
              }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </nav>

      {/* Mobile Menu Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-25 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}
