'use client';
import React, { useState, useEffect } from 'react';
import { Shield, Lock, CreditCard } from 'lucide-react';
import { BlockStyles } from '../../../../shared/types';

export interface FooterBlockProps {
  styles?: BlockStyles;
}

export function FooterBlock({ styles }: FooterBlockProps) {
  const [year, setYear] = useState('2026');

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  const fontClass = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    space: 'font-mono tracking-tight',
    jakarta: 'font-sans',
  }[styles?.fontFamily || 'sans'];

  return (
    <footer
      className={`border-t border-neutral-900 pt-8 pb-14 text-center space-y-5 text-xs ${fontClass}`}
      style={{
        backgroundColor: styles?.backgroundColor,
        color: styles?.textColor || '#a1a1aa',
      }}
    >
      <div className="flex flex-wrap items-center justify-center gap-6 opacity-75">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          <span>Direct Merchant Settlement</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          <span>AES-256 Encrypted Credential Vault</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Xendit Official API Integration</span>
        </div>
      </div>

      <p className="max-w-md mx-auto text-[11px] opacity-50">
        FunnelCraft Commerce Engine • All rights reserved © {year}.
      </p>
    </footer>
  );
}
