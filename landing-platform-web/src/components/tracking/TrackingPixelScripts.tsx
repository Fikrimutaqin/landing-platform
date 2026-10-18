'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';
import { PageSeoMetadata } from '../../../../shared/types';

interface TrackingPixelScriptsProps {
  seoMetadata?: PageSeoMetadata;
}

export function TrackingPixelScripts({ seoMetadata }: TrackingPixelScriptsProps) {
  const fbPixelId = seoMetadata?.facebookPixelId?.trim();
  const tiktokPixelId = seoMetadata?.tiktokPixelId?.trim();
  const gaId = seoMetadata?.googleAnalyticsId?.trim();

  // Trigger PageView tracking when page loads
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Trigger Facebook PageView
    if (fbPixelId && (window as any).fbq) {
      try {
        (window as any).fbq('track', 'PageView');
      } catch (err) {
        console.warn('FB Pixel PageView failed:', err);
      }
    }

    // Trigger TikTok PageView
    if (tiktokPixelId && (window as any).ttq) {
      try {
        (window as any).ttq.page();
      } catch (err) {
        console.warn('TikTok Pixel PageView failed:', err);
      }
    }

    // Trigger GA4 PageView
    if (gaId && (window as any).gtag) {
      try {
        (window as any).gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
        });
      } catch (err) {
        console.warn('GA4 PageView failed:', err);
      }
    }
  }, [fbPixelId, tiktokPixelId, gaId]);

  return (
    <>
      {/* 1. Facebook (Meta) Pixel */}
      {fbPixelId && (
        <Script
          id={`fb-pixel-${fbPixelId}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fbPixelId}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      {/* 2. TikTok Pixel */}
      {tiktokPixelId && (
        <Script
          id={`tiktok-pixel-${tiktokPixelId}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(a,c)};
                ttq.load('${tiktokPixelId}');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />
      )}

      {/* 3. Google Analytics (GA4) */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script
            id={`ga4-${gaId}`}
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}

      {/* 4. Custom Head Script (if provided) */}
      {seoMetadata?.customHeadScripts && (
        <Script
          id="custom-head-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: seoMetadata.customHeadScripts,
          }}
        />
      )}
    </>
  );
}
