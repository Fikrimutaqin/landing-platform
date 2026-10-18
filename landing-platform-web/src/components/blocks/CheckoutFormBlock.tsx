'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Lock,
  QrCode,
  Building,
  Truck,
  ArrowRight,
  ShieldCheck,
  Package,
  Sparkles,
  Tag,
  Check,
  ShoppingBag,
  Clock,
} from 'lucide-react';
import { BlockStyles, PaymentMethod } from '../../../../shared/types';
import { ProductsStore } from '@/lib/products-store';
import { TransactionsStore } from '@/lib/transactions-store';
import { CartStore, CartItem } from '@/lib/cart-store';

export interface CheckoutFormBlockProps {
  productId?: string;
  productTitle?: string;
  amount?: number;
  productType?: 'DIGITAL' | 'PHYSICAL';
  paymentPageUrl?: string;
  onCheckoutSuccess?: (order: any) => void;
  styles?: BlockStyles;
  pageId?: string;
}

interface CourierOption {
  id: string;
  name: string;
  service: string;
  fee: number;
  etd: string;
}

const COURIER_OPTIONS: CourierOption[] = [
  { id: 'jne_reg', name: 'JNE Express', service: 'Reguler (REG)', fee: 18000, etd: '2-3 hari' },
  { id: 'sicepat_best', name: 'SiCepat', service: 'BEST (Next Day)', fee: 24000, etd: '1-2 hari' },
  { id: 'jnt_ez', name: 'J&T Express', service: 'EZ Reguler', fee: 19000, etd: '2-3 hari' },
];

export function CheckoutFormBlock({
  productId,
  productTitle,
  amount,
  productType,
  paymentPageUrl = '/p/payment-instruction',
  onCheckoutSuccess,
  styles,
  pageId,
}: CheckoutFormBlockProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(productId);

  // Customer Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Physical Shipping State
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [subdistrict, setSubdistrict] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [selectedCourierId, setSelectedCourierId] = useState<string>('jne_reg');

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Payment Selection
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('QRIS');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check query params for productId
    const params = new URLSearchParams(window.location.search);
    const queryProdId = params.get('productId');
    if (queryProdId) {
      setSelectedProductId(queryProdId);
    }

    // Read cart items
    const items = CartStore.getItems();
    setCartItems(items);
  }, [productId]);

  // Determine active product / items
  const allProducts = typeof window !== 'undefined' ? ProductsStore.getProducts() : [];
  const linkedProduct = selectedProductId
    ? ProductsStore.getProductById(selectedProductId)
    : allProducts[0];

  const hasMultipleCartItems = cartItems.length > 0 && !selectedProductId;

  // Resolved titles & calculation
  const resolvedProductId = linkedProduct?.id || selectedProductId || 'prod_default';
  const resolvedProductTitle = linkedProduct?.name || productTitle || 'Paket Produk Pilihan';
  const resolvedType = linkedProduct?.type || productType || 'PHYSICAL';
  const resolvedAmount = hasMultipleCartItems
    ? CartStore.getSubtotal()
    : (linkedProduct?.price || amount || 299000);

  const containsPhysical = hasMultipleCartItems
    ? cartItems.some((i) => i.product.type === 'PHYSICAL')
    : resolvedType === 'PHYSICAL';

  const isDigital = !containsPhysical;

  const selectedCourier = COURIER_OPTIONS.find((c) => c.id === selectedCourierId) || COURIER_OPTIONS[0];
  const shippingFee = isDigital ? 0 : selectedCourier.fee;
  const grandTotal = Math.max(0, resolvedAmount + shippingFee - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'DISKON50') {
      setDiscountAmount(50000);
      setCouponApplied(true);
    } else if (code === 'HEMAT10') {
      const tenPercent = Math.round(resolvedAmount * 0.1);
      setDiscountAmount(tenPercent);
      setCouponApplied(true);
    } else if (code === 'ONGKIRFREE') {
      setDiscountAmount(shippingFee);
      setCouponApplied(true);
    } else {
      setCouponError('Kode kupon tidak valid atau sudah kedaluwarsa.');
      setCouponApplied(false);
      setDiscountAmount(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Mohon isi nama lengkap dan nomor WhatsApp Anda.');
      return;
    }

    setLoading(true);

    const eventId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `evt_${Date.now()}`;
    const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Client-side pixel trigger
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq(
        'track',
        'InitiateCheckout',
        {
          value: grandTotal,
          currency: 'IDR',
          content_name: hasMultipleCartItems ? `${cartItems.length} Produk Keranjang` : resolvedProductTitle,
        },
        { eventID: eventId }
      );
    }

    // Persist real transaction to TransactionsStore with PENDING status
    const newTx = TransactionsStore.createTransaction({
      invoiceNumber,
      organizationId: 'org_orderonline',
      pageId: pageId || (typeof window !== 'undefined' ? window.location.pathname : 'page_checkout'),
      productId: resolvedProductId,
      productName: hasMultipleCartItems
        ? cartItems.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')
        : resolvedProductTitle,
      productType: containsPhysical ? 'PHYSICAL' : 'DIGITAL',
      customerName: name,
      customerEmail: email || `${phone.replace(/\D/g, '')}@pelanggan.id`,
      customerPhone: phone,
      quantity: hasMultipleCartItems ? CartStore.getItemCount() : 1,
      subtotal: resolvedAmount,
      discount: discountAmount,
      shippingFee,
      totalAmount: grandTotal,
      paymentMethod: selectedPayment,
      paymentStatus: 'PENDING',
      fulfillmentStatus: isDigital ? 'PROCESSING' : 'UNFULFILLED',
      shippingAddress: containsPhysical
        ? {
            recipientName: name,
            phone,
            street: address || 'Alamat Penerima',
            subdistrict: subdistrict || 'Kecamatan',
            city: city || 'Kota/Kabupaten',
            province: 'Indonesia',
            postalCode: postalCode || '10110',
            courier: `${selectedCourier.name} - ${selectedCourier.service}`,
          }
        : undefined,
      digitalAccessDelivered: false,
      notes: isDigital
        ? 'Menunggu konfirmasi pembayaran untuk pengiriman akses digital otomatis.'
        : `Pengiriman via ${selectedCourier.name} (${selectedCourier.service}).`,
    });

    // Clear cart if items were purchased
    if (hasMultipleCartItems) {
      CartStore.clearCart();
    }

    if (onCheckoutSuccess) {
      onCheckoutSuccess(newTx);
    }

    // REDIRECT TO DEDICATED SEPARATE PAYMENT PAGE
    setTimeout(() => {
      setLoading(false);
      const targetUrl = `${paymentPageUrl}?orderId=${newTx.id}`;
      if (typeof window !== 'undefined') {
        window.location.href = targetUrl;
      }
    }, 400);
  };

  return (
    <div className="max-w-xl mx-auto w-full py-4 sm:py-8 px-3 sm:px-4 font-sans">
      <Card
        className="border-slate-200 dark:border-neutral-800 shadow-xl overflow-hidden bg-white dark:bg-[#0c0d12]"
        style={{
          backgroundColor: styles?.backgroundColor || undefined,
          color: styles?.textColor || undefined,
        }}
      >
        <CardHeader className="border-b border-slate-100 dark:border-neutral-900 p-4 sm:p-5 bg-slate-50/60 dark:bg-neutral-900/40">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-400 font-bold">
                  Step 2: Formulir Checkout
                </span>
                <Badge
                  variant="outline"
                  className={`text-[10px] px-2 py-0 border ${
                    isDigital
                      ? 'border-cyan-300 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40'
                      : 'border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40'
                  }`}
                >
                  {isDigital ? 'Produk Digital (Akses Instan)' : 'Produk Fisik (Kirim Ekspedisi)'}
                </Badge>
              </div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {hasMultipleCartItems ? `Checkout (${cartItems.length} Produk)` : resolvedProductTitle}
              </CardTitle>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-[11px] text-slate-600 dark:text-neutral-300 shadow-xs self-start sm:self-auto">
              <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Enkripsi 256-Bit</span>
            </div>
          </div>
          <CardDescription className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
            Lengkapi data diri dan pilihan pengiriman Anda di bawah ini.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Items Summary Accordion / List */}
            {hasMultipleCartItems && (
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/30 space-y-2">
                <div className="text-xs font-bold text-slate-800 dark:text-neutral-200 uppercase tracking-wider">
                  Produk yang Dibeli
                </div>
                <div className="divide-y divide-slate-200 dark:divide-neutral-800">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {item.product.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {item.quantity} x Rp {item.product.price.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-800 dark:text-white">
                        Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 1. DATA PELANGGAN */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-neutral-800">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center font-mono">
                  1
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Informasi Kontak Penerima
                </span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Pratama"
                    className="h-9 text-xs bg-slate-50/50 dark:bg-neutral-900/50 border-slate-200 dark:border-neutral-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                      Nomor WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0812xxxxxxxx"
                      className="h-9 text-xs bg-slate-50/50 dark:bg-neutral-900/50 border-slate-200 dark:border-neutral-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                      Alamat Email {isDigital && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      type="email"
                      required={isDigital}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="h-9 text-xs bg-slate-50/50 dark:bg-neutral-900/50 border-slate-200 dark:border-neutral-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PENGIRIMAN FISIK (JIKA ADA PRODUK FISIK) */}
            {containsPhysical && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-neutral-800">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center font-mono">
                    2
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Alamat Pengiriman &amp; Pilihan Kurir
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                      Alamat Lengkap (Jalan, No Rumah, RT/RW) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required={containsPhysical}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Contoh: Jl. Sudirman No. 45 Blok B, Kel. Karet"
                      className="h-9 text-xs bg-slate-50/50 dark:bg-neutral-900/50 border-slate-200 dark:border-neutral-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                        Kota / Kabupaten
                      </label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Jakarta Selatan"
                        className="h-9 text-xs bg-slate-50/50 dark:bg-neutral-900/50 border-slate-200 dark:border-neutral-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                        Kode Pos
                      </label>
                      <Input
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="12190"
                        className="h-9 text-xs bg-slate-50/50 dark:bg-neutral-900/50 border-slate-200 dark:border-neutral-800 font-mono"
                      />
                    </div>
                  </div>

                  {/* Pilihan Ekspedisi */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                      Pilihan Ekspedisi Kurir
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {COURIER_OPTIONS.map((c) => (
                        <label
                          key={c.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            selectedCourierId === c.id
                              ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-100 ring-1 ring-blue-500/20'
                              : 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 hover:border-slate-300 text-slate-700 dark:text-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="courier"
                              value={c.id}
                              checked={selectedCourierId === c.id}
                              onChange={() => setSelectedCourierId(c.id)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <div className="text-xs font-bold">{c.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                {c.service} ({c.etd})
                              </div>
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                            Rp {c.fee.toLocaleString('id-ID')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. METODE PEMBAYARAN */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-neutral-800">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center font-mono">
                  {containsPhysical ? '3' : '2'}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Pilih Metode Pembayaran
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedPayment('QRIS')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    selectedPayment === 'QRIS'
                      ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-600 ring-1 ring-blue-500/20'
                      : 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <QrCode className="w-5 h-5 text-blue-600" />
                    <Badge variant="outline" className="text-[9px] px-1 py-0 border-blue-300 text-blue-600">
                      Instan
                    </Badge>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">QRIS Dinamis</div>
                  <div className="text-[10px] text-slate-500">BCA, Livin, GoPay, OVO, ShopeePay</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPayment('BCA_VA')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    selectedPayment === 'BCA_VA'
                      ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-600 ring-1 ring-blue-500/20'
                      : 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Building className="w-5 h-5 text-indigo-600" />
                    <Badge variant="outline" className="text-[9px] px-1 py-0">
                      Otomatis
                    </Badge>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Virtual Account BCA</div>
                  <div className="text-[10px] text-slate-500">Transfer m-Banking &amp; ATM</div>
                </button>
              </div>
            </div>

            {/* 4. KUPON DISKON */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/40 dark:bg-neutral-900/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-500" />
                  <span>Punya Kode Kupon Promo?</span>
                </span>
                {couponApplied && (
                  <span className="text-[10px] text-emerald-600 font-bold font-mono">
                    ✓ Kupon Terpasang (-Rp {discountAmount.toLocaleString('id-ID')})
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Ketik kode kupon (e.g. HEMAT10, DISKON50)"
                  className="h-8 text-xs bg-white dark:bg-neutral-950 uppercase font-mono"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleApplyCoupon}
                  variant="outline"
                  className="h-8 text-xs font-semibold px-3 border-slate-300 dark:border-neutral-700"
                >
                  Terapkan
                </Button>
              </div>

              {couponError && (
                <p className="text-[10px] text-red-500 font-medium">{couponError}</p>
              )}
            </div>

            {/* 5. ORDER SUMMARY & SUBMIT */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/60 space-y-2.5">
              <div className="flex justify-between items-center text-xs text-slate-600 dark:text-neutral-400">
                <span>Subtotal Produk:</span>
                <span className="font-mono font-medium text-slate-900 dark:text-white">
                  Rp {resolvedAmount.toLocaleString('id-ID')}
                </span>
              </div>

              {containsPhysical && (
                <div className="flex justify-between items-center text-xs text-slate-600 dark:text-neutral-400">
                  <span>Ongkos Kirim ({selectedCourier.name}):</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-white">
                    Rp {shippingFee.toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-xs text-emerald-600">
                  <span>Potongan Diskon:</span>
                  <span className="font-mono font-bold">
                    - Rp {discountAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 dark:border-neutral-800 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-900 dark:text-white">Total Pembayaran:</span>
                <span className="font-mono text-base font-extrabold text-blue-600 dark:text-blue-400">
                  Rp {grandTotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Submit Action Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Menyiapkan Tagihan Pembayaran...</span>
                </>
              ) : (
                <>
                  <span>Lanjut ke Halaman Pembayaran</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Data pribadi Anda terjamin aman dan tidak akan disebarluaskan.</span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
