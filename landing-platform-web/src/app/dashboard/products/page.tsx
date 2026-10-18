'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ProductsStore } from '@/lib/products-store';
import { Product, ProductType, CreateProductDto } from '../../../../../shared/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  ArrowRight,
} from 'lucide-react';

export default function ProductsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [filterType, setFilterType] = useState<'ALL' | 'DIGITAL' | 'PHYSICAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateProductDto>({
    name: '',
    description: '',
    type: 'PHYSICAL',
    price: 0,
    originalPrice: 0,
    sku: '',
    stock: 50,
    weight: 500,
    category: '',
    imageUrl: '',
    digitalAttachment: {
      type: 'download_url',
      accessUrl: '',
      instructions: '',
    },
  });

  // Auth protection
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  // Load products
  useEffect(() => {
    setProducts(ProductsStore.getProducts());
  }, []);

  const refreshProducts = () => {
    setProducts(ProductsStore.getProducts());
  };

  const handleOpenAddModal = (type: ProductType = 'PHYSICAL') => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      type,
      price: type === 'DIGITAL' ? 199000 : 250000,
      originalPrice: type === 'DIGITAL' ? 499000 : 350000,
      sku: type === 'DIGITAL' ? `DIG-${Math.floor(100 + Math.random() * 900)}` : `SKU-${Math.floor(100 + Math.random() * 900)}`,
      stock: type === 'PHYSICAL' ? 50 : undefined,
      weight: type === 'PHYSICAL' ? 500 : undefined,
      category: type === 'DIGITAL' ? 'E-Course & Modul Digital' : 'Aksesoris & Hardware',
      imageUrl: type === 'DIGITAL'
        ? 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
      digitalAttachment: {
        type: 'download_url',
        accessUrl: 'https://drive.google.com/drive/folders/demo-access-url',
        instructions: 'Link akses dikirim otomatis ke email & WhatsApp pembeli setelah pembayaran berhasil.',
      },
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      type: product.type,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      sku: product.sku || '',
      stock: product.stock,
      weight: product.weight,
      category: product.category || '',
      imageUrl: product.imageUrl || '',
      digitalAttachment: product.digitalAttachment || {
        type: 'download_url',
        accessUrl: '',
        instructions: '',
      },
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) {
      ProductsStore.deleteProduct(id);
      refreshProducts();
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    ProductsStore.saveProduct(formData, editingProduct?.id);
    setIsModalOpen(false);
    refreshProducts();
  };

  const filteredProducts = products.filter((p) => {
    if (filterType !== 'ALL' && p.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku?.toLowerCase().includes(q) || false;
      const matchCategory = p.category?.toLowerCase().includes(q) || false;
      return matchName || matchSku || matchCategory;
    }
    return true;
  });

  const totalDigitalCount = products.filter((p) => p.type === 'DIGITAL').length;
  const totalPhysicalCount = products.filter((p) => p.type === 'PHYSICAL').length;
  const totalCatalogValue = products.reduce((acc, p) => acc + (p.price * (p.stock || 1)), 0);

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-[#08090c] text-slate-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-blue-100 dark:selection:bg-neutral-800">
      <DashboardHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
        {/* Top Header & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Katalog Produk
            </h1>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              Kelola inventaris produk fisik dan digital untuk funnel penjualan Anda.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {products.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm('Hapus semua produk di katalog toko untuk memulai testing dari nol?')) {
                    ProductsStore.clearAll();
                    refreshProducts();
                  }
                }}
                className="h-8 text-xs font-medium text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Kosongkan Katalog</span>
              </Button>
            )}

            <Button
              size="sm"
              onClick={() => handleOpenAddModal('PHYSICAL')}
              className="h-8 px-3 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Produk</span>
            </Button>
          </div>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-xs border-slate-200 dark:border-neutral-800">
            <CardContent className="p-4 space-y-1">
              <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Total Produk</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {products.length}
              </div>
              <div className="text-[11px] text-slate-400 dark:text-neutral-500 font-mono pt-1">
                Katalog aktif
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-slate-200 dark:border-neutral-800">
            <CardContent className="p-4 space-y-1">
              <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Produk Digital</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {totalDigitalCount}
              </div>
              <div className="text-[11px] text-slate-400 dark:text-neutral-500 pt-1">
                Akses link otomatis
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-slate-200 dark:border-neutral-800">
            <CardContent className="p-4 space-y-1">
              <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Produk Fisik</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {totalPhysicalCount}
              </div>
              <div className="text-[11px] text-slate-400 dark:text-neutral-500 pt-1">
                Pengiriman kurir
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-slate-200 dark:border-neutral-800">
            <CardContent className="p-4 space-y-1">
              <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Total Nilai Inventaris</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-mono truncate">
                Rp {totalCatalogValue.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-slate-400 dark:text-neutral-500 pt-1">
                Estimasi valuasi stok
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900/90 p-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-xs">
          {/* Tabs Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-neutral-800 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${filterType === 'ALL'
                  ? 'bg-white dark:bg-neutral-950 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              Semua ({products.length})
            </button>
            <button
              onClick={() => setFilterType('DIGITAL')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${filterType === 'DIGITAL'
                  ? 'bg-white dark:bg-neutral-950 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              Produk Digital ({totalDigitalCount})
            </button>
            <button
              onClick={() => setFilterType('PHYSICAL')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${filterType === 'PHYSICAL'
                  ? 'bg-white dark:bg-neutral-950 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              Produk Fisik ({totalPhysicalCount})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk atau SKU..."
              className="pl-8 h-8 text-xs bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => {
            const isDigital = product.type === 'DIGITAL';
            const discountPercent = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="group rounded-2xl bg-white dark:bg-neutral-950/90 border border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Product Image & Minimal Badges */}
                <div className="relative h-44 w-full bg-slate-100 dark:bg-neutral-900 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

                  {/* Clean Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <Badge className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium border-none">
                      {isDigital ? 'Digital' : 'Fisik'}
                    </Badge>
                    {discountPercent > 0 && (
                      <Badge className="bg-rose-500/90 text-white text-[10px] font-semibold border-none">
                        -{discountPercent}%
                      </Badge>
                    )}
                  </div>

                  {/* SKU & Category on Image Bottom */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white/90">
                    <span className="font-mono bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs text-[10px]">
                      {product.sku || 'NO-SKU'}
                    </span>
                    <span className="truncate max-w-37.5 text-white/80 text-[11px]">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing Display */}
                  <div className="pt-2 border-t border-slate-100 dark:border-neutral-900 flex items-baseline gap-2">
                    <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-slate-400 line-through font-mono">
                        Rp {product.originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>

                  {/* Specifications */}
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-neutral-900/60 border border-slate-100 dark:border-neutral-800 text-[11px] space-y-1">
                    {isDigital ? (
                      <>
                        <div className="flex items-center justify-between text-slate-600 dark:text-neutral-300">
                          <span className="text-slate-500">Format:</span>
                          <span className="font-mono font-medium uppercase text-[10px]">
                            {product.digitalAttachment?.type?.replace('_', ' ') || 'DOWNLOAD URL'}
                          </span>
                        </div>
                        <div className="text-slate-400 truncate font-mono text-[10px]">
                          {product.digitalAttachment?.accessUrl || 'URL belum diisi'}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between text-slate-600 dark:text-neutral-300">
                          <span className="text-slate-500">Berat Kirim:</span>
                          <span className="font-mono font-medium">{product.weight || 0} g</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600 dark:text-neutral-300">
                          <span className="text-slate-500">Stok:</span>
                          <span className="font-mono font-medium text-slate-900 dark:text-white">
                            {product.stock || 0} unit
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-1 flex items-center gap-2">
                    <Link
                      href={`/builder?productId=${product.id}`}
                      className="flex-1"
                    >
                      <Button
                        size="sm"
                        className="w-full h-8 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <span>Buat Landing Page</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditModal(product)}
                      className="h-8 px-2.5 text-xs text-slate-600 dark:text-neutral-300 hover:text-slate-900"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      className="h-8 px-2.5 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-3">
            <Package className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Tidak ada produk yang cocok
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Coba sesuaikan kata kunci pencarian atau buat produk baru.
            </p>
            <Button
              size="sm"
              onClick={() => handleOpenAddModal('PHYSICAL')}
              className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white"
            >
              Tambah Produk
            </Button>
          </div>
        )}
      </main>

      {/* Modal Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-neutral-900 bg-slate-50/80 dark:bg-neutral-950/80">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                {editingProduct ? 'Edit Informasi Produk' : 'Tambah Produk Baru'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Product Type Segmented Control */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5">
                  Jenis Produk
                </label>
                <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 gap-1">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'PHYSICAL' })}
                    className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${formData.type === 'PHYSICAL'
                        ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                        : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900'
                      }`}
                  >
                    Produk Fisik
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'DIGITAL' })}
                    className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${formData.type === 'DIGITAL'
                        ? 'bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                        : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900'
                      }`}
                  >
                    Produk Digital
                  </button>
                </div>
              </div>

              {/* General Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                    Nama Produk *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Masterclass Funnel Conversion 2026"
                    required
                    className="h-8 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                      Harga Jual (Rp) *
                    </label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      placeholder="299000"
                      required
                      className="h-8 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                      Harga Coret (Rp)
                    </label>
                    <Input
                      type="number"
                      value={formData.originalPrice || ''}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      placeholder="750000"
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                      Kategori
                    </label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. E-Course, Hardware"
                      className="h-8 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                      Kode SKU
                    </label>
                    <Input
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="e.g. PRD-001"
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    placeholder="Deskripsi produk..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                    URL Foto Produk
                  </label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              {/* Physical Product Specific Fields */}
              {formData.type === 'PHYSICAL' && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 space-y-3">
                  <div className="text-[11px] font-semibold text-slate-800 dark:text-neutral-200">
                    Spesifikasi Fisik &amp; Logistik
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                        Berat Paket (gram) *
                      </label>
                      <Input
                        type="number"
                        value={formData.weight || 500}
                        onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                        placeholder="500"
                        required
                        className="h-8 text-xs font-mono bg-white dark:bg-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                        Jumlah Stok Tersedia *
                      </label>
                      <Input
                        type="number"
                        value={formData.stock || 50}
                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                        placeholder="50"
                        required
                        className="h-8 text-xs font-mono bg-white dark:bg-neutral-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Digital Product Specific Fields */}
              {formData.type === 'DIGITAL' && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 space-y-3">
                  <div className="text-[11px] font-semibold text-slate-800 dark:text-neutral-200">
                    Pengiriman Akses Digital
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                      Format Akses
                    </label>
                    <select
                      value={formData.digitalAttachment?.type || 'download_url'}
                      onChange={(e: any) =>
                        setFormData({
                          ...formData,
                          digitalAttachment: {
                            ...formData.digitalAttachment,
                            type: e.target.value,
                            accessUrl: formData.digitalAttachment?.accessUrl || '',
                          },
                        })
                      }
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white text-xs focus:outline-none"
                    >
                      <option value="download_url">Link Download File (Google Drive / S3 / ZIP)</option>
                      <option value="redirect_link">Portal Web LMS / Workspace Notion</option>
                      <option value="license_key">Kode Serial / Lisensi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                      URL Akses Konten *
                    </label>
                    <Input
                      value={formData.digitalAttachment?.accessUrl || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          digitalAttachment: {
                            ...formData.digitalAttachment,
                            type: formData.digitalAttachment?.type || 'download_url',
                            accessUrl: e.target.value,
                          },
                        })
                      }
                      placeholder="https://drive.google.com/..."
                      required
                      className="h-8 text-xs font-mono bg-white dark:bg-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                      Instruksi Akses Pembeli
                    </label>
                    <textarea
                      value={formData.digitalAttachment?.instructions || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          digitalAttachment: {
                            ...formData.digitalAttachment,
                            type: formData.digitalAttachment?.type || 'download_url',
                            accessUrl: formData.digitalAttachment?.accessUrl || '',
                            instructions: e.target.value,
                          },
                        })
                      }
                      rows={2}
                      placeholder="Petunjuk pembeli untuk mengakses materi..."
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-neutral-900">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 text-xs"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium"
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  {editingProduct ? 'Simpan Perubahan' : 'Simpan Produk'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
