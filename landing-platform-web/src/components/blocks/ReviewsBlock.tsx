'use client';
import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { BlockStyles } from '../../../../shared/types';

export interface ReviewsBlockProps {
  styles?: BlockStyles;
}

export function ReviewsBlock({ styles }: ReviewsBlockProps) {
  const reviews = [
    {
      name: 'Raditya Pratama',
      store: 'Kopi Nusantara Collective',
      feedback: 'Checkout conversion spiked from 1.4% to 3.8% in week one. The 1-page form connected directly to Xendit QRIS eliminated our previous cart abandonment.',
      verified: true,
      rating: 5,
    },
    {
      name: 'Nadia Salsabila',
      store: 'Lumina Studio Gear',
      feedback: 'Meta CAPI server-side event deduplication solved our iOS ad reporting issues. Every single purchase event now synchronizes into Meta Events Manager without gaps.',
      verified: true,
      rating: 5,
    },
    {
      name: 'Hendra Wijaya',
      store: 'Vanguard Hardware Co.',
      feedback: 'The static HTML export produces clean, unbloated boilerplate. We uploaded it directly to our edge CDN and transactions continue routing into our Xendit account flawlessly.',
      verified: true,
      rating: 5,
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
  const cardBg = styles?.backgroundColor ? (isDarkBg ? '#0c0d12' : '#ffffff') : '#0a0b0f';
  const cardBorder = isDarkBg ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';

  return (
    <section className={`py-8 px-4 max-w-6xl mx-auto space-y-6 ${fontClass}`}>
      <div className="text-center space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: headingColor }}>
          Verified Merchant Evaluations
        </h2>
        <p className="text-xs" style={{ color: subtextColor }}>
          Independent merchants scaling automated direct-to-consumer funnels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviews.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border p-5 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition-shadow"
            style={{
              backgroundColor: cardBg,
              color: headingColor,
              borderColor: cardBorder,
            }}
          >
            <div className="space-y-3">
              <div className="flex gap-1">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400/90 text-amber-400/90" />
                ))}
              </div>
              <p className="text-xs opacity-85 leading-relaxed">
                &ldquo;{item.feedback}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-neutral-800/80 flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-xs">{item.name}</div>
                <div className="text-[11px] opacity-60">{item.store}</div>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
