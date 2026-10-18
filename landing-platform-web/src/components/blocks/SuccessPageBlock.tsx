'use client';

import React, { useState, useEffect } from 'react';
import { TransactionsStore } from '@/lib/transactions-store';
import { Transaction, BlockStyles } from '../../../../shared/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  CheckCircle2,
  Download,
  Truck,
  ExternalLink,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  Receipt,
  Clock,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export interface SuccessPageBlockProps {
  storePageUrl?: string;
  styles?: BlockStyles;
  customHeading?: string;
  customMessage?: string;
}

export function SuccessPageBlock({
  storePageUrl = '/p/sales-page',
  styles,
  customHeading,
  customMessage,
}: SuccessPageBlockProps) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check query parameter
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');

    if (orderId) {
      const tx = TransactionsStore.getTransactionById(orderId);
      if (tx) {
        setTransaction(tx);
        return;
      }
    }

    // 2. Fallback to latest transaction (prefer PAID, otherwise first available)
    const all = TransactionsStore.getTransactions();
    const latestPaid = all.find((t) => t.paymentStatus === 'PAID') || all[0];
    if (latestPaid) {
      setTransaction(latestPaid);
      return;
    }

    // 3. Illustrative default for canvas builder preview
    setTransaction({
      id: 'tx_sample_paid_preview',
      invoiceNumber: 'INV-20261019-7412',
      organizationId: 'org_orderonline',
      pageId: 'page_payment',
      productId: 'prod_preview',
      productName: 'Smart Watch Pro Titanium Ultra',
      productType: 'PHYSICAL',
      customerName: 'Budi Pratama',
      customerEmail: 'budi.pratama@gmail.com',
      customerPhone: '081234567890',
      quantity: 1,
      subtotal: 349000,
      discount: 0,
      shippingFee: 18000,
      totalAmount: 367000,
      paymentMethod: 'QRIS',
      paymentStatus: 'PAID',
      fulfillmentStatus: 'PROCESSING',
      paidAt: new Date().toISOString(),
      shippingAddress: {
        recipientName: 'Budi Pratama',
        phone: '081234567890',
        street: 'Jl. Sudirman Kav. 52 No. 18',
        subdistrict: 'Kebayoran Baru',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        postalCode: '12190',
        courier: 'JNE Express - Reguler (REG)',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }, []);

  if (!transaction) return null;

  const isDigital = transaction.productType === 'DIGITAL';
  const waMessage = `Halo Admin, saya sudah menyelesaikan pembayaran untuk invoice ${transaction.invoiceNumber} (${transaction.productName}) sejumlah Rp ${transaction.totalAmount.toLocaleString('id-ID')}. Mohon info proses selanjutnya, terima kasih!`;

  return (
    <div
      className="max-w-2xl mx-auto w-full py-6 sm:py-10 px-3 sm:px-4"
      style={{
        backgroundColor: styles?.backgroundColor || undefined,
        color: styles?.textColor || undefined,
      }}
    >
      <Card className="border-slate-200 dark:border-neutral-800 shadow-2xl overflow-hidden bg-white dark:bg-[#0c0d12]">
        {/* Success Celebration Header */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-900/60 p-5 sm:p-8 text-center space-y-3">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/80 border-2 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>

          <div className="space-y-1">
            <Badge className="bg-emerald-600 text-white text-[10px] px-2.5 py-0.5 font-bold uppercase tracking-wider mb-1">
              Pembayaran Terverifikasi (PAID)
            </Badge>
            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {customHeading || 'Terima Kasih! Pembayaran Sukses'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 max-w-md mx-auto">
              {customMessage || 'Pesanan Anda telah berhasil diverifikasi secara otomatis dan segera kami proses.'}
            </p>
          </div>
        </div>

        <CardContent className="p-4 sm:p-8 space-y-5 sm:space-y-6">
          {/* Official Invoice Ledger */}
          <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/40 p-4 sm:p-5 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300">
                  Rincian Transaksi
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                {transaction.invoiceNumber}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-neutral-400">
                <span>Nama Pelanggan:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {transaction.customerName}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-neutral-400">
                <span>Email / WhatsApp:</span>
                <span className="font-mono text-slate-900 dark:text-white">
                  {transaction.customerEmail} / {transaction.customerPhone}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-neutral-400">
                <span>Metode Pembayaran:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {transaction.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-neutral-400">
                <span>Waktu Pembayaran:</span>
                <span className="font-mono text-slate-900 dark:text-white">
                  {new Date(transaction.paidAt || transaction.updatedAt || Date.now()).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Line items table */}
            <div className="pt-3 border-t border-slate-200 dark:border-neutral-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {transaction.productName}
                  </span>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                    x{transaction.quantity}
                  </Badge>
                </div>
                <span className="font-mono font-medium text-slate-800 dark:text-neutral-200">
                  Rp {transaction.subtotal.toLocaleString('id-ID')}
                </span>
              </div>

              {transaction.shippingFee > 0 && (
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Ongkos Kirim ({transaction.shippingAddress?.courier || 'Ekspedisi'}):</span>
                  <span className="font-mono">Rp {transaction.shippingFee.toLocaleString('id-ID')}</span>
                </div>
              )}

              {transaction.discount > 0 && (
                <div className="flex justify-between items-center text-xs text-emerald-600">
                  <span>Diskon Promo:</span>
                  <span className="font-mono">- Rp {transaction.discount.toLocaleString('id-ID')}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 dark:border-neutral-800 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-900 dark:text-white">Total Lunas:</span>
                <span className="font-mono text-base font-extrabold text-blue-600 dark:text-blue-400">
                  Rp {transaction.totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Fulfillment Card: Digital or Physical */}
          {isDigital ? (
            <div className="p-5 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 space-y-3">
              <div className="flex items-center gap-2 text-cyan-800 dark:text-cyan-300 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span>Akses Produk Digital Anda Telah Terbuka</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                Terima kasih atas pembelian Anda! Silakan klik tombol di bawah untuk mengunduh materi dan modul digital Anda langsung.
              </p>
              <div className="pt-1">
                <a
                  href="https://drive.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full"
                >
                  <Button className="w-full h-11 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>Download Materi &amp; Buka Akses Sekarang</span>
                  </Button>
                </a>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-mono text-center">
                *Link download juga telah otomatis dikirimkan ke {transaction.customerEmail}
              </p>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-3">
              <div className="flex items-center gap-2 text-slate-800 dark:text-neutral-200 font-bold text-xs uppercase tracking-wider">
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                <span>Pengiriman Pesanan Fisik</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                Paket Anda sedang disiapkan di gudang kami untuk diserahkan ke pihak ekspedisi{' '}
                <strong className="text-slate-900 dark:text-white">
                  {transaction.shippingAddress?.courier || 'Kurir Ekspedisi'}
                </strong>.
              </p>
              <div className="p-3 bg-white dark:bg-neutral-950 rounded-xl border border-slate-200 dark:border-neutral-800 text-xs space-y-1">
                <div className="font-semibold text-slate-900 dark:text-white">
                  Alamat Pengiriman:
                </div>
                <div className="text-slate-600 dark:text-neutral-400 text-[11px] leading-relaxed">
                  {transaction.shippingAddress?.recipientName} ({transaction.shippingAddress?.phone})<br />
                  {transaction.shippingAddress?.street}, {transaction.shippingAddress?.subdistrict}, {transaction.shippingAddress?.city}, {transaction.shippingAddress?.postalCode}
                </div>
              </div>
            </div>
          )}

          {/* Dual Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* WhatsApp Confirmation Button */}
            <a
              href={`https://wa.me/6281234567890?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button
                variant="outline"
                className="w-full h-10 text-xs font-semibold border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Konfirmasi ke Customer Service (WhatsApp)</span>
              </Button>
            </a>

            {/* Back to Catalog / Store */}
            <Link href={storePageUrl} className="block w-full">
              <Button
                variant="ghost"
                className="w-full h-9 text-xs text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Toko</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
