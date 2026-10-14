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

  return (
    <section className={`space-y-6 ${fontClass}`}>
      <div className="text-center space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Verified Merchant Evaluations
        </h2>
        <p className="text-xs text-neutral-400">
          Independent merchants scaling automated direct-to-consumer funnels.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {reviews.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-neutral-800/80 p-5 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
            style={{
              backgroundColor: styles?.backgroundColor || '#0a0b0f',
              color: styles?.textColor || '#ffffff',
            }}
          >
            <div className="space-y-3">
              <div className="flex gap-1">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400/90 text-amber-400/90" />
                ))}
              </div>
              <p className="text-xs opacity-85 leading-relaxed">
                "{item.feedback}"
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-900 flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-xs">{item.name}</div>
                <div className="text-[11px] opacity-60">{item.store}</div>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
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
