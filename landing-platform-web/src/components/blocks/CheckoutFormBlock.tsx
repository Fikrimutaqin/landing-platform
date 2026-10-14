'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Lock, QrCode, Building, Wallet, Check, ExternalLink, Copy } from 'lucide-react';
import { BlockStyles } from '../../../../shared/types';

export interface CheckoutFormBlockProps {
  productId?: string;
  productTitle?: string;
  amount?: number;
  onCheckoutSuccess?: (order: any) => void;
  styles?: BlockStyles;
}

export function CheckoutFormBlock({
  productId = 'prod-101',
  productTitle = 'Studio Mechanical Keyboard Kit (Edition 01)',
  amount = 1450000,
  onCheckoutSuccess,
  styles,
}: CheckoutFormBlockProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'VA' | 'EWALLET'>('QRIS');
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState<any>(null);
  const [copied, setCopied] = useState(false);

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

    // Simulate order payload & tracking trigger
    const payload = {
      productId,
      productTitle,
      amount,
      customer: { name, phone, email, address },
      paymentMethod,
      trackingEventId: eventId,
    };

    // Client-side pixel trigger
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        value: amount,
        currency: 'IDR',
        content_name: productTitle,
      }, { eventID: eventId });
    }

    setTimeout(() => {
      const mockOrder = {
        orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'PENDING',
        totalAmount: amount,
        currency: 'IDR',
        paymentUrl: 'https://checkout.xendit.co/web/mock-invoice-session',
        virtualAccountInfo: paymentMethod === 'VA' ? {
          bankCode: 'BCA',
          accountNumber: '88012398471203',
          expirationDate: '24 Hours',
        } : null,
        qrisInfo: paymentMethod === 'QRIS' ? {
          qrString: '00020101021226670014ID.LINKAJA.WWW01189360091800000000005204581253033605802ID5914XENDIT STORE6007JAKARTA61051295062190115ORD99120302000063041F83',
        } : null,
      };

      setOrderCreated(mockOrder);
      setLoading(false);
      if (onCheckoutSuccess) onCheckoutSuccess(mockOrder);
    }, 1000);
  };

  const copyVA = () => {
    if (orderCreated?.virtualAccountInfo?.accountNumber) {
      navigator.clipboard.writeText(orderCreated.virtualAccountInfo.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`max-w-xl mx-auto ${fontClass}`}>
      <Card
        className="border-neutral-800 shadow-2xl"
        style={{
          backgroundColor: styles?.backgroundColor || '#090a0f',
          color: styles?.textColor || '#ffffff',
        }}
      >
        <CardHeader className="border-b border-neutral-900 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider opacity-60">
                Express Checkout
              </div>
              <CardTitle className="text-xl font-bold mt-1">Payment & Shipping</CardTitle>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-[11px] opacity-75">
              <Lock className="w-3 h-3" />
              <span>Xendit 256-bit SSL</span>
            </div>
          </div>
          <CardDescription className="text-xs opacity-75 mt-2">
            Order directly into merchant account without platform intermediary.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {orderCreated ? (
            <div className="space-y-6 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold">Invoice Generated Successfully</h3>
                <p className="text-xs opacity-75 font-mono">
                  Order ID: <span className="font-bold opacity-100">{orderCreated.orderId}</span>
                </p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 text-left space-y-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-neutral-800">
                  <span className="opacity-75">Total Settlement:</span>
                  <span className="font-mono font-bold text-base">
                    Rp {orderCreated.totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs opacity-75">
                  <span>Routing Provider:</span>
                  <span className="font-medium opacity-100">Xendit {paymentMethod}</span>
                </div>

                {orderCreated.virtualAccountInfo && (
                  <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] opacity-75">
                        {orderCreated.virtualAccountInfo.bankCode} Virtual Account:
                      </span>
                      <button
                        type="button"
                        onClick={copyVA}
                        className="text-[11px] opacity-75 hover:opacity-100 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="font-mono text-base font-bold tracking-widest">
                      {orderCreated.virtualAccountInfo.accountNumber}
                    </div>
                  </div>
                )}
              </div>

              <a
                href={orderCreated.paymentUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-neutral-100 text-neutral-950 font-semibold text-sm hover:bg-white transition-all shadow-md"
              >
                Open Official Payment Page
                <ExternalLink className="w-3.5 h-3.5 text-neutral-600" />
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-medium opacity-75 mb-1">
                    Customer Full Name <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Pratama"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium opacity-75 mb-1">
                      WhatsApp / Mobile <span className="text-rose-400">*</span>
                    </label>
                    <Input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium opacity-75 mb-1">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium opacity-75 mb-1">
                    Shipping Destination <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street address, district, city, postal code..."
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-2 border-t border-neutral-900">
                <label className="block text-[11px] font-medium opacity-75">
                  Settlement Channel (Xendit Direct)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('QRIS')}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                      paymentMethod === 'QRIS'
                        ? 'border-neutral-400 bg-neutral-900 text-white shadow-sm'
                        : 'border-neutral-800/80 bg-neutral-950 opacity-75 hover:border-neutral-700'
                    }`}
                  >
                    <QrCode className="w-4 h-4 mb-1.5" />
                    <span className="text-xs font-semibold">QRIS</span>
                    <span className="text-[9px] opacity-60">Instant Scan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('VA')}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                      paymentMethod === 'VA'
                        ? 'border-neutral-400 bg-neutral-900 text-white shadow-sm'
                        : 'border-neutral-800/80 bg-neutral-950 opacity-75 hover:border-neutral-700'
                    }`}
                  >
                    <Building className="w-4 h-4 mb-1.5" />
                    <span className="text-xs font-semibold">Virtual Account</span>
                    <span className="text-[9px] opacity-60">BCA, Mandiri, BRI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('EWALLET')}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                      paymentMethod === 'EWALLET'
                        ? 'border-neutral-400 bg-neutral-900 text-white shadow-sm'
                        : 'border-neutral-800/80 bg-neutral-950 opacity-75 hover:border-neutral-700'
                    }`}
                  >
                    <Wallet className="w-4 h-4 mb-1.5" />
                    <span className="text-xs font-semibold">E-Wallet</span>
                    <span className="text-[9px] opacity-60">OVO, DANA, Shopee</span>
                  </button>
                </div>
              </div>

              {/* Order total & CTA */}
              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  variant="default"
                  disabled={loading}
                  className="w-full h-11 text-sm font-semibold justify-between px-5"
                  style={{
                    backgroundColor: styles?.accentColor,
                    color: styles?.accentColor ? '#ffffff' : undefined,
                  }}
                >
                  <span>{loading ? 'Dispatching to Xendit...' : 'Complete Purchase'}</span>
                  <span className="font-mono text-xs font-bold">
                    Rp {amount.toLocaleString('id-ID')}
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
