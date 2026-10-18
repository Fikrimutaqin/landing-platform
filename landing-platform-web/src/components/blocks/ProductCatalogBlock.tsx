'use client';

import React, { useState, useEffect } from 'react';
import { Product, BlockStyles } from '../../../../shared/types';
import { ProductsStore } from '@/lib/products-store';
import { CartStore } from '@/lib/cart-store';
import { CartDrawer } from './CartDrawer';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  SlidersHorizontal,
  Star,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export interface ProductCatalogBlockProps {
  title?: string;
  subtitle?: string;
  checkoutPageUrl?: string;
  styles?: BlockStyles;
  showFilters?: boolean;
  showSearch?: boolean;
}

// Fallback curated starter products if merchant hasn't created any yet
const STARTER_CATALOG_PRODUCTS: Product[] = [
  {
    id: 'prod_smartwatch_ultra',
    organizationId: 'org_orderonline',
    name: 'Smart Watch Pro Titanium Ultra',
    slug: 'smart-watch-pro-titanium',
    description: 'Smartwatch flagship dengan sensor detak jantung, SpO2, layar AMOLED 1.96", dan baterai 14 hari.',
    type: 'PHYSICAL',
    price: 349000,
    originalPrice: 699000,
    sku: 'SW-TITAN-01',
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    category: 'Elektronik & Gadget',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_wireless_earbuds',
    organizationId: 'org_orderonline',
    name: 'Acoustic Pro ANC Wireless Earbuds',
    slug: 'acoustic-pro-anc-earbuds',
    description: 'Active Noise Cancelling 42dB, Hi-Res Audio, Bluetooth 5.4 dengan latency ultra rendah untuk gaming & musik.',
    type: 'PHYSICAL',
    price: 289000,
    originalPrice: 550000,
    sku: 'EP-ANC-02',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    category: 'Audio & Aksesoris',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_arabica_specialty',
    organizationId: 'org_orderonline',
    name: 'Specialty Arabica Gayo Coffee (250g)',
    slug: 'specialty-arabica-gayo-coffee',
    description: 'Biji kopi pilihan single origin Gayo Aceh, medium roast dengan cita rasa floral dan hints of brown sugar.',
    type: 'PHYSICAL',
    price: 125000,
    originalPrice: 175000,
    sku: 'KOP-GY-250',
    stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    category: 'Food & Beverage',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_digital_marketing_mastery',
    organizationId: 'org_orderonline',
    name: 'Masterclass E-Commerce & Ads Mastery',
    slug: 'masterclass-ecommerce-ads',
    description: 'Video course 24 modul lengkap, blueprint funnel omset 100jt, template copywriting & studi kasus nyata.',
    type: 'DIGITAL',
    price: 199000,
    originalPrice: 499000,
    sku: 'DIG-COURSE-01',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    category: 'Produk Digital',
    status: 'ACTIVE',
    digitalAttachment: {
      type: 'download_url',
      accessUrl: 'https://storage.googleapis.com/demo/blueprint-ecommerce.pdf',
      instructions: 'Blueprint E-Commerce Mastery 2026 (PDF & Video)',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function ProductCatalogBlock({
  title = 'Katalog Produk Pilihan',
  subtitle = 'Pilih produk favorit Anda dengan jaminan kualitas terbaik dan pengiriman cepat.',
  checkoutPageUrl = '/p/checkout-page',
  styles,
  showFilters = true,
  showSearch = true,
}: ProductCatalogBlockProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PHYSICAL' | 'DIGITAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  useEffect(() => {
    // Read from merchant products store
    const storeProducts = ProductsStore.getProducts();
    if (storeProducts && storeProducts.length > 0) {
      setProducts(storeProducts);
    } else {
      setProducts(STARTER_CATALOG_PRODUCTS);
    }

    // Cart counter listener
    setCartCount(CartStore.getItemCount());
    const unsub = CartStore.subscribe(() => {
      setCartCount(CartStore.getItemCount());
    });
    return () => unsub();
  }, []);

  const handleAddToCart = (product: Product) => {
    CartStore.addItem(product, 1);
    setAddedNotice(`"${product.name}" ditambahkan ke keranjang`);
    setIsCartOpen(true);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  // Filter and sort products
  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'PHYSICAL' && p.type !== 'PHYSICAL') return false;
    if (activeFilter === 'DIGITAL' && p.type !== 'DIGITAL') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
    return 0;
  });

  return (
    <section
      className="py-8 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative"
      style={{
        backgroundColor: styles?.backgroundColor || undefined,
        color: styles?.textColor || undefined,
      }}
    >
      {/* Toast Notification when adding product */}
      {addedNotice && (
        <div className="fixed top-6 right-6 z-50 p-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <Check className="w-4 h-4" />
          <span>{addedNotice}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <Badge
            variant="outline"
            className="mb-2 text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40"
          >
            Real E-Commerce Catalog
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1 max-w-xl">
            {subtitle}
          </p>
        </div>

        {/* Floating / Header Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-neutral-800 text-white text-xs font-semibold hover:bg-slate-800 shadow-md transition-all self-start md:self-auto cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-blue-400" />
          <span>Keranjang Belanja</span>
          {cartCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-blue-600 text-[10px] font-bold flex items-center justify-center font-mono animate-pulse">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      {(showFilters || showSearch) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8 p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800">
          {/* Tabs */}
          {showFilters && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-nowrap">
              <button
                type="button"
                onClick={() => setActiveFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  activeFilter === 'ALL'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 hover:bg-white dark:hover:bg-neutral-800'
                }`}
              >
                Semua ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('PHYSICAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  activeFilter === 'PHYSICAL'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 hover:bg-white dark:hover:bg-neutral-800'
                }`}
              >
                Produk Fisik ({products.filter((p) => p.type === 'PHYSICAL').length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('DIGITAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  activeFilter === 'DIGITAL'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 hover:bg-white dark:hover:bg-neutral-800'
                }`}
              >
                Produk Digital ({products.filter((p) => p.type === 'DIGITAL').length})
              </button>
            </div>
          )}

          {/* Search & Sort */}
          {showSearch && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk..."
                  className="pl-8 h-8 text-xs bg-white dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 w-full"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="h-8 text-xs px-2.5 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-slate-800 dark:text-neutral-200 cursor-pointer focus:outline-hidden shrink-0"
              >
                <option value="featured">Paling Populer</option>
                <option value="price-asc">Harga Terendah</option>
                <option value="price-desc">Harga Tertinggi</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Multi-Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {sortedProducts.map((product) => {
          const discountPercent =
            product.originalPrice && product.originalPrice > product.price
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : null;

          return (
            <div
              key={product.id}
              className="group rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Product Image & Badges */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-neutral-800">
                <img
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                  {product.type === 'DIGITAL' ? (
                    <Badge className="bg-cyan-600/90 hover:bg-cyan-600 text-white text-[10px] px-2 py-0.5 backdrop-blur-xs font-semibold shadow-xs">
                      Akses Instan
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-600/90 hover:bg-emerald-600 text-white text-[10px] px-2 py-0.5 backdrop-blur-xs font-semibold shadow-xs">
                      Stok Tersedia
                    </Badge>
                  )}

                  {discountPercent && (
                    <Badge className="bg-rose-600/90 hover:bg-rose-600 text-white text-[10px] px-2 py-0.5 backdrop-blur-xs font-bold shadow-xs">
                      Hemat {discountPercent}%
                    </Badge>
                  )}
                </div>
              </div>

              {/* Product Content Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-neutral-400">
                    <span className="font-medium">{product.category || 'Pilihan Toko'}</span>
                    <div className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>4.9</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-neutral-800 space-y-3">
                  {/* Price Tag */}
                  <div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[11px] font-mono text-slate-400 line-through mr-1.5">
                        Rp {product.originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                    <span className="text-base font-extrabold font-mono text-blue-600 dark:text-blue-400">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Beli Langsung (Links directly to checkout page with productId) */}
                    <Link
                      href={`${checkoutPageUrl}?productId=${product.id}`}
                      className="w-full"
                    >
                      <Button
                        size="sm"
                        className="w-full h-8 px-2 text-[11px] font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
                      >
                        Beli Langsung
                      </Button>
                    </Link>

                    {/* Tambah ke Keranjang */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToCart(product)}
                      className="w-full h-8 px-2 text-[11px] font-semibold text-slate-700 dark:text-neutral-200 border-slate-200 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 flex items-center justify-center gap-1"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>+ Keranjang</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        checkoutUrl={checkoutPageUrl}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </section>
  );
}
