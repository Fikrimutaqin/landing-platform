'use client';

import React, { useState, useEffect } from 'react';
import { CartStore, CartItem } from '@/lib/cart-store';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Package,
} from 'lucide-react';
import Link from 'next/link';

interface CartDrawerProps {
  checkoutUrl?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({
  checkoutUrl = '/p/checkout-page',
  isOpen,
  onClose,
}: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(CartStore.getItems());
    const unsubscribe = CartStore.subscribe((updatedItems) => {
      setItems(updatedItems);
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const subtotal = CartStore.getSubtotal();
  const totalItems = CartStore.getItemCount();

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#0c0d12] text-slate-900 dark:text-neutral-100 h-full flex flex-col shadow-2xl border-l border-slate-200 dark:border-neutral-800 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between bg-slate-50/70 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Keranjang Belanja
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                {totalItems} Produk Dipilih
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body: Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-500">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-neutral-900 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8 opacity-40" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm text-slate-800 dark:text-neutral-200">
                  Keranjang Masih Kosong
                </h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  Pilih produk dari katalog kami untuk memulai pemesanan.
                </p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 flex gap-3 shadow-xs"
              >
                {/* Product Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-neutral-800 shrink-0 border border-slate-200 dark:border-neutral-700">
                  <img
                    src={item.product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info & Quantity controls */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {item.product.name}
                      </h4>
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1.5 py-0 mt-0.5 border-slate-200 dark:border-neutral-700"
                      >
                        {item.product.type === 'DIGITAL' ? 'Digital' : 'Fisik'}
                      </Badge>
                    </div>
                    <button
                      onClick={() => CartStore.removeItem(item.product.id)}
                      className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                    </span>

                    {/* Stepper */}
                    <div className="flex items-center gap-1 border border-slate-200 dark:border-neutral-700 rounded-lg p-0.5 bg-slate-50 dark:bg-neutral-800">
                      <button
                        onClick={() => CartStore.updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center rounded text-slate-600 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs font-semibold px-1.5">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => CartStore.updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center rounded text-slate-600 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer: Subtotal & Checkout Button */}
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-neutral-800 bg-slate-50/70 dark:bg-neutral-900/50 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-neutral-400">Subtotal:</span>
              <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                Rp {subtotal.toLocaleString('id-ID')}
              </span>
            </div>

            <Link href={checkoutUrl} onClick={onClose} className="block w-full">
              <Button className="w-full h-10 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md flex items-center justify-center gap-2">
                <span>Lanjut ke Formulir Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Checkout Aman &amp; Terenkripsi 256-Bit</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
