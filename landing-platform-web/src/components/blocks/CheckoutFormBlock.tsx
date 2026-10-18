'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Lock,
  QrCode,
  Building,
  Wallet,
  Check,
  ExternalLink,
  Copy,
  Truck,
  ArrowRight,
  ShieldCheck,
  Download,
  Clock,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { BlockStyles, PaymentMethod } from '../../../../shared/types';
import { ProductsStore } from '@/lib/products-store';
import { TransactionsStore } from '@/lib/transactions-store';

export interface CheckoutFormBlockProps {
  productId?: string;
  productTitle?: string;
  amount?: number;
  productType?: 'DIGITAL' | 'PHYSICAL';
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
  onCheckoutSuccess,
  styles,
  pageId,
}: CheckoutFormBlockProps) {
  // Find linked product from store or props
  const allProducts = typeof window !== 'undefined' ? ProductsStore.getProducts() : [];
  const linkedProduct = productId ? ProductsStore.getProductById(productId) : allProducts[0];

  const resolvedProductId = linkedProduct?.id || productId || 'prod_default';
  const resolvedProductTitle = linkedProduct?.name || productTitle || 'Paket Produk Pilihan';
  const resolvedType = linkedProduct?.type || productType || 'PHYSICAL';
  const resolvedAmount = linkedProduct?.price || amount || 299000;
  const isDigital = resolvedType === 'DIGITAL';

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

  // Payment State
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('QRIS');
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState<any>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedCourier = COURIER_OPTIONS.find((c) => c.id === selectedCourierId) || COURIER_OPTIONS[0];
  const shippingFee = isDigital ? 0 : selectedCourier.fee;
  const grandTotal = resolvedAmount + shippingFee;

  const fontClass = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
    space: 'font-mono tracking-tight',
    jakarta: 'font-sans',
  }[styles?.fontFamily || 'sans'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          content_name: resolvedProductTitle,
        },
        { eventID: eventId }
      );
    }

    // Persist real transaction to TransactionsStore
    const newTx = TransactionsStore.createTransaction({
      invoiceNumber,
      organizationId: 'org_orderonline',
      pageId: pageId || (typeof window !== 'undefined' ? window.location.pathname : 'page_storefront'),
      productId: resolvedProductId,
      productName: resolvedProductTitle,
      productType: resolvedType,
      customerName: name,
      customerEmail: email || `${phone.replace(/\D/g, '')}@pelanggan.id`,
      customerPhone: phone,
      quantity: 1,
      subtotal: resolvedAmount,
      discount: 0,
      shippingFee,
      totalAmount: grandTotal,
      paymentMethod: selectedPayment,
      paymentStatus: 'PENDING',
      fulfillmentStatus: isDigital ? 'PROCESSING' : 'UNFULFILLED',
      shippingAddress: isDigital
        ? undefined
        : {
            recipientName: name,
            phone,
            street: address,
            subdistrict: subdistrict || 'Kecamatan',
            city: city || 'Kota/Kabupaten',
            province: 'Indonesia',
            postalCode: postalCode || '10110',
            courier: `${selectedCourier.name} - ${selectedCourier.service}`,
          },
      digitalAccessDelivered: false,
      notes: isDigital
        ? 'Menunggu verifikasi pembayaran untuk pengiriman akses digital otomatis.'
        : `Pengiriman via ${selectedCourier.name} (${selectedCourier.service}).`,
    });

    setTimeout(() => {
      setOrderCreated({
        id: newTx.id,
        invoiceNumber: newTx.invoiceNumber,
        totalAmount: grandTotal,
        paymentMethod: selectedPayment,
        virtualAccountInfo:
          selectedPayment !== 'QRIS' && selectedPayment !== 'EWALLET'
            ? {
                bankCode: selectedPayment.replace('_VA', ''),
                accountNumber: `8801${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                expirationDate: '23 Jam 59 Menit',
              }
            : null,
        qrisInfo:
          selectedPayment === 'QRIS'
            ? {
                qrString:
                  '00020101021226670014ID.LINKAJA.WWW01189360091800000000005204581253033605802ID5914XENDIT STORE6007JAKARTA61051295062190115ORD99120302000063041F83',
              }
            : null,
      });
      setLoading(false);
      if (onCheckoutSuccess) onCheckoutSuccess(newTx);
    }, 600);
  };

  const handleSimulatePaid = () => {
    if (!orderCreated?.id) return;
    
    // Update store to PAID
    TransactionsStore.updateStatus(orderCreated.id, 'PAID', isDigital ? 'COMPLETED' : 'UNFULFILLED');
    setIsPaid(true);

    // Trigger Meta Pixel Purchase Event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        value: grandTotal,
        currency: 'IDR',
        content_name: resolvedProductTitle,
      });
    }
  };

  const copyVA = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`max-w-xl mx-auto w-full ${fontClass}`}>
      <Card
        className="border-slate-200 dark:border-neutral-800 shadow-xl overflow-hidden"
        style={{
          backgroundColor: styles?.backgroundColor || undefined,
          color: styles?.textColor || undefined,
        }}
      >
        <CardHeader className="border-b border-slate-100 dark:border-neutral-900 pb-4 bg-slate-50/50 dark:bg-neutral-900/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-400 font-bold">
                  Express Checkout
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
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                {resolvedProductTitle}
              </CardTitle>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-[11px] text-slate-600 dark:text-neutral-300 shadow-xs">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>Enkripsi 256-Bit</span>
            </div>
          </div>
          <CardDescription className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
            Pembayaran langsung terverifikasi otomatis via Xendit QRIS &amp; Virtual Account.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {orderCreated ? (
            /* PAYMENT & INVOICE SETTLEMENT VIEW */
            <div className="space-y-6 text-center py-1">
              {!isPaid ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                    <Clock className="w-6 h-6 animate-pulse" />
                  </div>

                  <div className="space-y-1">
                    <Badge variant="outline" className="text-[10px] bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800 mb-1">
                      Menunggu Pembayaran
                    </Badge>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Tagihan Berhasil Dibuat
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 font-mono">
                      Invoice: <span className="font-bold text-slate-800 dark:text-white">{orderCreated.invoiceNumber}</span>
                    </p>
                  </div>

                  {/* Settlement Ledger Card */}
                  <div className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/60 p-4 text-left space-y-3">
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200 dark:border-neutral-800">
                      <span className="text-slate-600 dark:text-neutral-400">Total Tagihan:</span>
                      <span className="font-mono font-bold text-base text-blue-600 dark:text-blue-400">
                        Rp {orderCreated.totalAmount.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-600 dark:text-neutral-400">
                      <span>Metode Pembayaran:</span>
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {orderCreated.paymentMethod}
                      </span>
                    </div>

                    {/* QRIS Display */}
                    {orderCreated.paymentMethod === 'QRIS' && (
                      <div className="p-4 rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 flex flex-col items-center justify-center space-y-3">
                        <div className="w-44 h-44 bg-slate-100 dark:bg-neutral-900 rounded-lg border-2 border-dashed border-slate-300 dark:border-neutral-700 flex flex-col items-center justify-center p-3">
                          <QrCode className="w-28 h-28 text-slate-800 dark:text-white mb-1" />
                          <span className="text-[10px] font-mono text-slate-500">Scan via Semua E-Wallet / Mobile Banking</span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-neutral-400 text-center">
                          Buka aplikasi BCA, GoPay, OVO, ShopeePay, atau Livin Mandiri lalu scan kode QR di atas.
                        </div>
                      </div>
                    )}

                    {/* Virtual Account Display */}
                    {orderCreated.virtualAccountInfo && (
                      <div className="p-3.5 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500 dark:text-neutral-400 font-medium">
                            Nomor Virtual Account {orderCreated.virtualAccountInfo.bankCode}:
                          </span>
                          <button
                            type="button"
                            onClick={() => copyVA(orderCreated.virtualAccountInfo.accountNumber)}
                            className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Copy className="w-3 h-3" />
                            {copied ? 'Tersalin' : 'Salin Nomor'}
                          </button>
                        </div>
                        <div className="font-mono text-lg font-bold tracking-widest text-slate-900 dark:text-white">
                          {orderCreated.virtualAccountInfo.accountNumber}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Batas Pembayaran: {orderCreated.virtualAccountInfo.expirationDate}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Simulator Testing Button for Merchant */}
                  <div className="pt-2 border-t border-slate-200 dark:border-neutral-800 space-y-2">
                    <Button
                      type="button"
                      onClick={handleSimulatePaid}
                      className="w-full h-10 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Simulasikan Pembayaran Lunas (Demo / Testing)</span>
                    </Button>
                    <p className="text-[10px] text-slate-400">
                      Tombol simulasi ini akan mengupdate status transaksi menjadi <strong>PAID</strong> secara instan di sistem toko Anda.
                    </p>
                  </div>
                </>
              ) : (
                /* PAID SUCCESS & FULFILLMENT GATE */
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                    <Check className="w-7 h-7" />
                  </div>

                  <div className="space-y-1">
                    <Badge variant="outline" className="text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 mb-1">
                      Pembayaran Berhasil Terverifikasi
                    </Badge>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Terima Kasih Atas Pesanan Anda!
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">
                      Invoice <span className="font-mono font-semibold text-slate-800 dark:text-white">{orderCreated.invoiceNumber}</span> telah lunas tercatat di merchant portal.
                    </p>
                  </div>

                  {/* DIGITAL PRODUCT FULFILLMENT UNLOCK */}
                  {isDigital ? (
                    <div className="p-5 rounded-xl border border-cyan-200 dark:border-cyan-800/80 bg-cyan-50/70 dark:bg-cyan-950/30 text-left space-y-3 shadow-xs">
                      <div className="flex items-center gap-2 text-cyan-800 dark:text-cyan-300 font-semibold text-xs">
                        <Download className="w-4 h-4" />
                        <span>Akses Produk Digital Anda Telah Aktif:</span>
                      </div>
                      
                      <p className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed">
                        {linkedProduct?.digitalAttachment?.instructions ||
                          'Silakan unduh atau akses materi lengkap melalui tautan resmi di bawah ini menggunakan email Anda.'}
                      </p>

                      <a
                        href={linkedProduct?.digitalAttachment?.accessUrl || 'https://drive.google.com'}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka / Unduh Materi Digital Sekarang</span>
                      </a>
                    </div>
                  ) : (
                    /* PHYSICAL PRODUCT FULFILLMENT NOTICE */
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/60 text-left space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                        <Package className="w-4 h-4 text-blue-600" />
                        <span>Pesanan Siap Dikemas &amp; Dikirim</span>
                      </div>
                      <p className="text-slate-600 dark:text-neutral-400 leading-relaxed">
                        Kurir <strong>{selectedCourier.name} ({selectedCourier.service})</strong> akan memproses paket Anda. Nomor resi pengiriman akan diupdate oleh penjual dan diberitahukan ke WhatsApp <strong>{phone}</strong>.
                      </p>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setOrderCreated(null);
                        setIsPaid(false);
                      }}
                      className="text-xs h-8"
                    >
                      Buat Pesanan Baru
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* CHECKOUT FORM VIEW */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                {/* 1. Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="h-9 text-xs"
                  />
                </div>

                {/* 2. Phone & Email */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                      Nomor WhatsApp <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081234567890"
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                      Alamat Email {isDigital && <span className="text-rose-500">*</span>}
                    </label>
                    <Input
                      required={isDigital}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={isDigital ? 'Wajib untuk kirim link materi' : 'nama@email.com (opsional)'}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                {/* 3. PHYSICAL ONLY: Shipping Destination */}
                {!isDigital && (
                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-neutral-900">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-white">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Alamat Pengiriman &amp; Ekspedisi</span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-neutral-400 mb-1">
                        Alamat Lengkap (Jalan, RT/RW, No. Rumah) <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        required={!isDigital}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Jl. Merdeka No. 12, Kel. Menteng"
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                          Kecamatan
                        </label>
                        <Input
                          value={subdistrict}
                          onChange={(e) => setSubdistrict(e.target.value)}
                          placeholder="Menteng"
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                          Kota / Kab
                        </label>
                        <Input
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Jakarta Pusat"
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1">
                          Kode Pos
                        </label>
                        <Input
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="10310"
                          className="h-8 text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* Courier Selector */}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-neutral-400 mb-1.5">
                        Pilih Ekspedisi Kurir:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {COURIER_OPTIONS.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedCourierId(c.id)}
                            className={`p-2 rounded-lg border text-left transition-all ${
                              selectedCourierId === c.id
                                ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-1 ring-blue-600'
                                : 'border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 text-slate-700 dark:text-neutral-300'
                            }`}
                          >
                            <div className="text-xs font-bold">{c.name}</div>
                            <div className="text-[10px] text-slate-500 dark:text-neutral-400">{c.service}</div>
                            <div className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 mt-1">
                              Rp {c.fee.toLocaleString('id-ID')}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-neutral-900">
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300">
                  Metode Pembayaran (Xendit Direct Gateway)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPayment('QRIS')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                      selectedPayment === 'QRIS'
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-400'
                    }`}
                  >
                    <QrCode className="w-4 h-4 mb-1" />
                    <span className="text-xs font-bold">QRIS Instant</span>
                    <span className="text-[9px] opacity-75">BCA, GoPay, OVO</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPayment('BCA_VA')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                      selectedPayment === 'BCA_VA'
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-400'
                    }`}
                  >
                    <Building className="w-4 h-4 mb-1" />
                    <span className="text-xs font-bold">BCA VA</span>
                    <span className="text-[9px] opacity-75">Virtual Account</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPayment('MANDIRI_VA')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                      selectedPayment === 'MANDIRI_VA'
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-400'
                    }`}
                  >
                    <Wallet className="w-4 h-4 mb-1" />
                    <span className="text-xs font-bold">Mandiri VA</span>
                    <span className="text-[9px] opacity-75">Livin Mandiri</span>
                  </button>
                </div>
              </div>

              {/* Price Breakdown Ledger */}
              <div className="rounded-lg bg-slate-50 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 p-3 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-neutral-400">
                  <span>Harga Produk:</span>
                  <span className="font-mono">Rp {resolvedAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-neutral-400">
                  <span>Ongkos Kirim:</span>
                  <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                    {shippingFee === 0 ? 'GRATIS (Rp 0)' : `Rp ${shippingFee.toLocaleString('id-ID')}`}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-neutral-800 font-bold text-slate-900 dark:text-white">
                  <span>Total Pembayaran:</span>
                  <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
                    Rp {grandTotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Order CTA */}
              <div className="pt-1">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full h-11 text-xs font-bold justify-between px-5 bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-[0.99] transition-transform"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{loading ? 'Menghubungkan ke Gateway...' : 'Bayar Sekarang & Dapatkan Akses'}</span>
                  </span>
                  <span className="font-mono text-xs font-bold">
                    Rp {grandTotal.toLocaleString('id-ID')}
                  </span>
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
