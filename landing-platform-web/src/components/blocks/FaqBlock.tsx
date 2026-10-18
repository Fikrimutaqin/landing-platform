'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { BlockStyles } from '../../../../shared/types';

export interface FaqBlockProps {
  styles?: BlockStyles;
}

export function FaqBlock({ styles }: FaqBlockProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Bring-Your-Own-Key (BYOK) settlement operate?',
      a: 'You supply your personal Xendit Secret Key and Webhook Token in your store settings. Checkout orders generate invoices under your official Xendit account, and customer funds settle directly into your linked bank account with zero platform take-rate.',
    },
    {
      q: 'How does dual-layer tracking prevent ad-block drop-off?',
      a: 'The landing page dispatches client-side Pixel events in the browser and simultaneously triggers Meta Conversions API (CAPI) and Google Analytics 4 Measurement Protocol from the server. Both share an identical event_id for automatic deduplication.',
    },
    {
      q: 'Can pages be exported as standalone boilerplate packages?',
      a: 'Yes. The 1-Click Export feature generates a standalone ZIP archive containing minified index.html, style.css, and checkout.js. You can host it on any static web server (Netlify, Cloudflare Pages, VPS, or cPanel) while retaining full payment integration.',
    },
    {
      q: 'How are custom domains routed and secured?',
      a: 'You create a DNS CNAME record pointing to our edge gateway. SSL certificates are provisioned automatically via Let’s Encrypt within 60 seconds of DNS validation.',
    },
  ];

  const fontClass = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    space: 'font-mono tracking-tight',
    jakarta: 'font-sans',
  }[styles?.fontFamily || 'sans'];

  const isDarkBg =
    !styles?.backgroundColor ||
    styles?.backgroundColor?.includes('#0') ||
    styles?.backgroundColor?.includes('#1') ||
    styles?.backgroundColor?.includes('black') ||
    styles?.backgroundColor?.includes('neutral-9');

  const headingColor = styles?.textColor || (isDarkBg ? '#ffffff' : '#0f172a');
  const subtextColor = isDarkBg ? '#a1a1aa' : '#64748b';
  const itemBg = styles?.backgroundColor ? (isDarkBg ? '#0c0d12' : '#ffffff') : '#0a0b0f';
  const itemBorder = isDarkBg ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';

  return (
    <section className={`max-w-2xl mx-auto py-8 px-4 space-y-4 ${fontClass}`}>
      <div className="text-center space-y-1 mb-5">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: headingColor }}>
          Pertanyaan Umum (FAQ)
        </h2>
        <p className="text-xs" style={{ color: subtextColor }}>
          Informasi seputar cara pemesanan, pembayaran, dan pengiriman produk.
        </p>
      </div>

      <div className="space-y-2.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-xl border overflow-hidden transition-all shadow-xs"
              style={{
                backgroundColor: itemBg,
                color: headingColor,
                borderColor: itemBorder,
              }}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold hover:opacity-85 transition-opacity cursor-pointer"
              >
                <span className="pr-2">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 opacity-60 transition-transform shrink-0 ${isOpen ? 'rotate-180 opacity-100 text-blue-600' : ''}`}
                />
              </button>
              {isOpen && (
                <div
                  className="px-3.5 sm:px-4 pb-4 pt-1 text-xs opacity-85 leading-relaxed border-t"
                  style={{
                    borderColor: itemBorder,
                    backgroundColor: isDarkBg ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
