'use client';

import React, { useState, useEffect } from 'react';
import { TransactionsStore } from '@/lib/transactions-store';
import { Transaction, BlockStyles } from '../../../../shared/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Clock,
  QrCode,
  Building,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';

export interface PaymentInstructionBlockProps {
  successPageUrl?: string;
  styles?: BlockStyles;
  customTitle?: string;
  customDescription?: string;
}

export function PaymentInstructionBlock({
  successPageUrl = '/p/thank-you-page',
  styles,
  customTitle,
  customDescription,
}: PaymentInstructionBlockProps) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(24 * 3600 - 120); // 23h 58m countdown
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Get orderId from query parameter
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');

    if (orderId) {
      const tx = TransactionsStore.getTransactionById(orderId);
      if (tx) {
        setTransaction(tx);
        return;
      }
    }

    // 2. Fallback to latest pending transaction
    const all = TransactionsStore.getTransactions();
    const latestPending = all.find((t) => t.paymentStatus === 'PENDING') || all[0];
    if (latestPending) {
      setTransaction(latestPending);
      return;
    }

    // 3. Illustrative default for canvas builder / direct preview
    setTransaction({
      id: 'tx_sample_preview',
      invoiceNumber: 'INV-20261019-8921',
      organizationId: 'org_orderonline',
      pageId: 'page_checkout',
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
      paymentStatus: 'PENDING',
      fulfillmentStatus: 'UNFULFILLED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSimulatePayment = () => {
    if (!transaction) return;
    setIsVerifying(true);

    // Update store
    TransactionsStore.updateStatus(
      transaction.id,
      'PAID',
      transaction.productType === 'DIGITAL' ? 'COMPLETED' : 'UNFULFILLED'
    );

    // Trigger Meta Pixel Purchase event if installed
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        value: transaction.totalAmount,
        currency: 'IDR',
        content_name: transaction.productName,
      });
    }

    setTimeout(() => {
      setIsVerifying(false);
      // Redirect to the dedicated Success Page!
      const target = `${successPageUrl}?orderId=${transaction.id}`;
      if (typeof window !== 'undefined') {
        window.location.href = target;
      }
    }, 700);
  };

  if (!transaction) return null;

  const vaNumber = `8801${(transaction.id.replace(/\D/g, '') || '9482104829').padEnd(10, '0').slice(0, 10)}`;

  return (
    <div
      className="max-w-xl mx-auto w-full py-4 sm:py-8 px-3 sm:px-4"
      style={{
        backgroundColor: styles?.backgroundColor || undefined,
        color: styles?.textColor || undefined,
      }}
    >
      <Card className="border-slate-200 dark:border-neutral-800 shadow-xl overflow-hidden bg-white dark:bg-[#0c0d12]">
        <CardHeader className="border-b border-slate-100 dark:border-neutral-900 p-4 sm:pb-5 bg-slate-50/60 dark:bg-neutral-900/40 text-center">
          {/* Urgency countdown indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold mx-auto mb-2 max-w-full">
            <Clock className="w-3.5 h-3.5 animate-pulse shrink-0" />
            <span className="truncate">Batas Waktu: {formatCountdown(timeLeft)}</span>
          </div>

          <CardTitle className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            {customTitle || 'Instruksi Pembayaran'}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
            {customDescription || 'Silakan selesaikan pembayaran agar pesanan Anda dapat segera kami proses.'}
          </CardDescription>

          <div className="pt-2 flex items-center justify-center gap-2">
            <span className="text-xs font-mono text-slate-400">Invoice:</span>
            <span className="font-mono text-xs font-bold text-slate-800 dark:text-neutral-200 bg-slate-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
              {transaction.invoiceNumber}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* Total Tagihan Banner */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-center space-y-1">
            <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
              Total Nominal yang Harus Dibayar:
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
              Rp {transaction.totalAmount.toLocaleString('id-ID')}
            </div>
            <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70 font-mono">
              *Pastikan nominal transfer sesuai persis hingga digit terakhir.
            </p>
          </div>

          {/* Payment Method Specific View */}
          {transaction.paymentMethod === 'QRIS' ? (
            <div className="space-y-4">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex flex-col items-center justify-center space-y-3 shadow-inner">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-blue-600" />
                  <span>QRIS Dinamis Nasional</span>
                </div>

                {/* QR Code Container */}
                <div className="p-3 sm:p-4 bg-white rounded-xl border-2 border-dashed border-slate-300 dark:border-neutral-600 shadow-sm flex flex-col items-center max-w-full">
                  <div className="w-40 h-40 sm:w-48 sm:h-48 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center p-2 relative">
                    <QrCode className="w-32 h-32 sm:w-40 sm:h-40 text-slate-900" />
                    <div className="absolute inset-x-2 bottom-1 text-center bg-white/90 py-0.5 rounded text-[9px] font-mono font-bold text-slate-600">
                      NMID: ID10202684920
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-xs font-semibold text-slate-800 dark:text-neutral-200">
                    Bisa di-scan menggunakan seluruh aplikasi pembayaran:
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                    BCA Mobile, Livin Mandiri, BRImo, GoPay, OVO, ShopeePay, DANA, AstraPay.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">
                      Virtual Account {transaction.paymentMethod.replace('_VA', '')}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    Verifikasi Otomatis
                  </Badge>
                </div>

                <div className="p-3 bg-white dark:bg-neutral-950 rounded-xl border border-slate-200 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono">
                      Nomor Virtual Account
                    </div>
                    <div className="font-mono text-lg font-extrabold text-slate-900 dark:text-white tracking-wider">
                      {vaNumber}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(vaNumber)}
                    className="h-8 text-xs font-semibold border-slate-200 dark:border-neutral-700 flex items-center gap-1.5"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed">
                  Transfer tepat melalui menu Transfer Virtual Account pada aplikasi Mobile Banking atau ATM bank Anda.
                </p>
              </div>
            </div>
          )}

          {/* Purchased Items Summary */}
          <div className="rounded-xl border border-slate-200 dark:border-neutral-800 p-3.5 bg-slate-50/50 dark:bg-neutral-900/30 space-y-2 text-xs">
            <div className="flex justify-between font-medium text-slate-600 dark:text-neutral-400">
              <span>Pesanan:</span>
              <span className="font-semibold text-slate-800 dark:text-white font-mono">
                {transaction.productName} (x{transaction.quantity})
              </span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-neutral-400">
              <span>Penerima:</span>
              <span className="text-slate-800 dark:text-white font-medium">
                {transaction.customerName} ({transaction.customerPhone})
              </span>
            </div>
            {transaction.productType === 'PHYSICAL' && transaction.shippingAddress?.courier && (
              <div className="flex justify-between text-slate-500 dark:text-neutral-400">
                <span>Ekspedisi:</span>
                <span className="text-slate-800 dark:text-white font-medium">
                  {transaction.shippingAddress.courier}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            {/* Interactive Test Sandbox Button */}
            <Button
              onClick={handleSimulatePayment}
              disabled={isVerifying}
              className="w-full h-11 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Pembayaran...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulasi Bayar Lunas (Konfirmasi Otomatis)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            {/* WhatsApp CS Link */}
            <a
              href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                `Halo Admin, saya ingin konfirmasi pembayaran untuk pesanan ${transaction.invoiceNumber} (${transaction.productName}) sejumlah Rp ${transaction.totalAmount.toLocaleString('id-ID')}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Butuh Bantuan? Hubungi CS WhatsApp</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
