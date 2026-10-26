import React from 'react';
import { Metadata } from 'next';
import { PublicStorefrontClient } from './PublicStorefrontClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export const instant = false;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function fetchPageData(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/public/pages/${slug}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cleanSlug = decodeURIComponent(slug || '').replace(/^\/+/, '').trim().toLowerCase();
  const page = await fetchPageData(cleanSlug);

  const title =
    page?.seoMetadata?.metaTitle ||
    page?.title ||
    (cleanSlug === 'home' || cleanSlug === '' ? 'Storefront Home' : `Halaman - ${cleanSlug}`);
  const description =
    page?.seoMetadata?.metaDescription ||
    'High-converting landing page crafted with Visual Funnel Platform.';
  const ogImage = page?.seoMetadata?.ogImage;

  return {
    title,
    description,
    keywords: page?.seoMetadata?.keywords,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    icons: page?.seoMetadata?.favicon ? { icon: page.seoMetadata.favicon } : undefined,
  };
}

export default async function PublicPage({ params }: Props) {
  const { slug } = await params;
  const cleanSlug = decodeURIComponent(slug || '').replace(/^\/+/, '').trim().toLowerCase();
  const initialData = await fetchPageData(cleanSlug);

  return <PublicStorefrontClient initialData={initialData} slug={cleanSlug} />;
}
