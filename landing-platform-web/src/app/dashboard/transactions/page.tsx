'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { TransactionsStore } from '@/lib/transactions-store';
import {
  Transaction,
  PaymentStatus,
  FulfillmentStatus,
} from '../../../../../shared/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  Check,
  X,
} from 'lucide-react';

export default function TransactionsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterStatus, setFilterStatus] = useState<'ALL' | PaymentStatus>('ALL');
  const [filterType, setFilterType] = useState<'ALL' | 'DIGITAL' | 'PHYSICAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [isEditingTracking, setIsEditingTracking] = useState(false);

  // Auth protection
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    setTransactions(TransactionsStore.getTransactions());
  }, []);

  const refreshList = () => {
    setTransactions(TransactionsStore.getTransactions());
  };

  const handleSelectTx = (tx: Transaction) => {
    setSelectedTx(tx);
    setTrackingInput(tx.shippingAddress?.trackingNumber || '');
    setIsEditingTracking(false);
  };

  const handleSaveTracking = (id: string) => {
    if (!trackingInput.trim()) return;
    const updated = TransactionsStore.updateShippingTracking(id, trackingInput.trim());
    refreshList();
    if (updated) setSelectedTx(updated);
    setIsEditingTracking(false);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleUpdateStatus = (id: string, newStatus: PaymentStatus, newFulfillment?: FulfillmentStatus) => {
    TransactionsStore.updateStatus(id, newStatus, newFulfillment);
    refreshList();
    if (selectedTx && (selectedTx.id === id || selectedTx.invoiceNumber === id)) {
      setSelectedTx(TransactionsStore.getTransactionById(id));
    }
  };

  // Filtered transactions
  const filtered = transactions.filter((tx) => {
    if (filterStatus !== 'ALL' && tx.paymentStatus !== filterStatus) return false;
    if (filterType !== 'ALL' && tx.productType !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchInv = tx.invoiceNumber.toLowerCase().includes(q);
      const matchName = tx.customerName.toLowerCase().includes(q);
      const matchPhone = tx.customerPhone.toLowerCase().includes(q);
      const matchProduct = tx.productName.toLowerCase().includes(q);
      return matchInv || matchName || matchPhone || matchProduct;
    }
    return true;
  });

  // Calculate Metrics
  const paidTransactions = transactions.filter((t) => t.paymentStatus === 'PAID');
  const pendingTransactions = transactions.filter((t) => t.paymentStatus === 'PENDING');
  const totalOmset = paidTransactions.reduce((acc, t) => acc + t.totalAmount, 0);
  const avgOrderValue = paidTransactions.length > 0 ? Math.round(totalOmset / paidTransactions.length) : 0;

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-[#08090c] text-slate-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-blue-100 dark:selection:bg-neutral-800">
      <DashboardHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
        {/* Page Title & Intro */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Transaksi &amp; Pesanan
            </h1>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              Riwayat pembayaran masuk pelanggan melalui QRIS dan Virtual Account.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {transactions.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (confirm('Hapus semua riwayat transaksi untuk memulai pengujian dari nol?')) {
                    TransactionsStore.clearAll();
                    refreshList();
                  }
                }}
                className="h-8 text-xs text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1.5"
              >
                <span>Kosongkan Riwayat Transaksi</span>
              </Button>
            )}
          </div>
        </div>

        {/* 4 Financial & Order Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-xs border-slate-200 dark:border-neutral-800">
            <CardContent className="p-4 space-y-1">
              <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Total Omset Lunas</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono truncate">
                Rp {totalOmset.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                {paidTransactions.length} transaksi berhasil
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-slate-200 dark:border-neutral-800">
            <CardContent className="p-4 space-y-1">
              <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Menunggu Pembayaran</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {pendingTransactions.length}
              </div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400/90 pt-1">
                Sesi pembayaran aktif
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-slate-200 dark:border-neutral-800">
            <CardContent className="p-4 space-y-1">
              <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Rata-Rata Order (AOV)</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white font-mono truncate">
                Rp {avgOrderValue.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-slate-400 dark:text-neutral-500 pt-1">
                Per transaksi lunas
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-slate-200 dark:border-neutral-800">
            <CardContent className="p-4 space-y-1">
              <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Metode Pembayaran</div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>QRIS &amp; Virtual Account</span>
              </div>
              <div className="text-[11px] text-slate-400 dark:text-neutral-500 font-mono pt-1">
                BCA, Mandiri, BRI, BNI
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900/90 p-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-neutral-800 p-0.5 rounded-lg text-xs overflow-x-auto">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${filterStatus === 'ALL'
                  ? 'bg-white dark:bg-neutral-950 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
                }`}
            >
              Semua ({transactions.length})
            </button>
            <button
              onClick={() => setFilterStatus('PAID')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${filterStatus === 'PAID'
                  ? 'bg-white dark:bg-neutral-950 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
                }`}
            >
              Lunas ({paidTransactions.length})
            </button>
            <button
              onClick={() => setFilterStatus('PENDING')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${filterStatus === 'PENDING'
                  ? 'bg-white dark:bg-neutral-950 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
                }`}
            >
              Menunggu ({pendingTransactions.length})
            </button>
            <button
              onClick={() => setFilterStatus('EXPIRED')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${filterStatus === 'EXPIRED'
                  ? 'bg-white dark:bg-neutral-950 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400'
                }`}
            >
              Kadaluarsa
            </button>
          </div>

          {/* Search by Query */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Invoice, Nama, No WA..."
              className="pl-8 h-8 text-xs bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="rounded-2xl bg-white dark:bg-neutral-950/90 border border-slate-200 dark:border-neutral-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-neutral-300">
              <thead className="bg-slate-50/70 dark:bg-neutral-900/60 border-b border-slate-200 dark:border-neutral-800 text-[11px] font-medium text-slate-500">
                <tr>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Pelanggan</th>
                  <th className="px-4 py-3">Produk</th>
                  <th className="px-4 py-3">Metode</th>
                  <th className="px-4 py-3">Total Tagihan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Fulfillment</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-900">
                {filtered.map((tx) => {
                  const isPaid = tx.paymentStatus === 'PAID';
                  const isPending = tx.paymentStatus === 'PENDING';
                  const isExpired = tx.paymentStatus === 'EXPIRED';
                  const isDigital = tx.productType === 'DIGITAL';

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-neutral-900/50 transition-colors"
                    >
                      {/* Invoice & Date */}
                      <td className="px-4 py-3 font-mono">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {tx.invoiceNumber}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(tx.createdAt).toLocaleString('id-ID', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </div>
                      </td>

                      {/* Customer info */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {tx.customerName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {tx.customerPhone}
                        </div>
                      </td>

                      {/* Product */}
                      <td className="px-4 py-3 max-w-55">
                        <div className="font-medium text-slate-800 dark:text-neutral-200 truncate">
                          {tx.productName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-slate-400">
                            {isDigital ? 'Digital' : 'Fisik'} · Qty: {tx.quantity}
                          </span>
                        </div>
                      </td>

                      {/* Payment Method */}
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-700 dark:text-neutral-300">
                        {tx.paymentMethod.replace('_', ' ')}
                      </td>

                      {/* Total Tagihan */}
                      <td className="px-4 py-3 font-mono font-semibold text-slate-900 dark:text-white">
                        Rp {tx.totalAmount.toLocaleString('id-ID')}
                      </td>

                      {/* Payment Status */}
                      <td className="px-4 py-3">
                        {isPaid && (
                          <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 text-[10px] font-medium">
                            Lunas
                          </Badge>
                        )}
                        {isPending && (
                          <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50 text-[10px] font-medium">
                            Menunggu
                          </Badge>
                        )}
                        {isExpired && (
                          <Badge variant="outline" className="bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 border-slate-200 dark:border-neutral-700 text-[10px] font-medium">
                            Kadaluarsa
                          </Badge>
                        )}
                      </td>

                      {/* Fulfillment Status */}
                      <td className="px-4 py-3 text-[11px]">
                        {isDigital ? (
                          <span className="text-slate-600 dark:text-neutral-400">
                            Akses terkirim
                          </span>
                        ) : (
                          <span className="text-slate-600 dark:text-neutral-400">
                            {tx.shippingAddress?.trackingNumber ? (
                              <span className="font-mono text-slate-900 dark:text-white">{tx.shippingAddress.trackingNumber}</span>
                            ) : (
                              'Perlu kirim'
                            )}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSelectTx(tx)}
                          className="h-7 text-xs font-medium px-2.5 bg-white dark:bg-neutral-900 hover:bg-slate-50 border-slate-200 dark:border-neutral-800"
                        >
                          Detail
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              Tidak ada data transaksi yang cocok dengan filter.
            </div>
          )}
        </div>
      </main>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-neutral-900 bg-slate-50/80 dark:bg-neutral-950/80">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white font-mono">
                {selectedTx.invoiceNumber}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Payment Status Bar */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase">
                    Status
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                    {selectedTx.paymentStatus === 'PAID' && 'Lunas'}
                    {selectedTx.paymentStatus === 'PENDING' && 'Menunggu Pembayaran'}
                    {selectedTx.paymentStatus === 'EXPIRED' && 'Kadaluarsa'}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {selectedTx.paymentStatus !== 'PAID' && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedTx.id, 'PAID', 'COMPLETED')}
                      className="h-7 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Tandai Lunas
                    </Button>
                  )}
                  {selectedTx.paymentStatus === 'PENDING' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(selectedTx.id, 'EXPIRED')}
                      className="h-7 text-xs text-rose-500 hover:bg-rose-50"
                    >
                      Batalkan
                    </Button>
                  )}
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                  Data Pembeli
                </div>
                <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nama:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{selectedTx.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">WhatsApp:</span>
                    <span className="font-mono text-slate-900 dark:text-white">{selectedTx.customerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-mono text-slate-700 dark:text-neutral-300">{selectedTx.customerEmail}</span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                  Rincian Pesanan
                </div>
                <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedTx.productName}</span>
                    <span className="font-mono text-slate-500">x{selectedTx.quantity}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-white">
                      Rp {selectedTx.subtotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                  {selectedTx.discount > 0 && (
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Diskon</span>
                      <span className="font-mono text-rose-500">- Rp {selectedTx.discount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  {selectedTx.shippingFee > 0 && (
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Ongkir</span>
                      <span className="font-mono text-slate-900 dark:text-white">
                        + Rp {selectedTx.shippingFee.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 dark:border-neutral-800 flex justify-between font-semibold text-sm">
                    <span>Total</span>
                    <span className="font-mono text-slate-900 dark:text-white">
                      Rp {selectedTx.totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping or Digital Delivery */}
              {selectedTx.productType === 'PHYSICAL' && selectedTx.shippingAddress && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                    <span>Alamat Pengiriman &amp; Resi</span>
                    <button
                      type="button"
                      onClick={() => setIsEditingTracking(!isEditingTracking)}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-[11px]"
                    >
                      {isEditingTracking ? 'Batal' : selectedTx.shippingAddress.trackingNumber ? 'Ubah Resi' : '+ Input Nomor Resi'}
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 space-y-2">
                    <p className="leading-relaxed text-xs">
                      {selectedTx.shippingAddress.street}, {selectedTx.shippingAddress.subdistrict}, {selectedTx.shippingAddress.city}, {selectedTx.shippingAddress.province} {selectedTx.shippingAddress.postalCode}
                    </p>

                    {isEditingTracking ? (
                      <div className="pt-2 border-t border-slate-200 dark:border-neutral-800 space-y-2">
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                          Nomor Resi {selectedTx.shippingAddress.courier}:
                        </label>
                        <div className="flex gap-2">
                          <Input
                            value={trackingInput}
                            onChange={(e) => setTrackingInput(e.target.value)}
                            placeholder="Contoh: JNE889230198273"
                            className="h-8 text-xs font-mono"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSaveTracking(selectedTx.id)}
                            className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white shrink-0 font-semibold"
                          >
                            Simpan Resi
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2 flex items-center justify-between text-[11px] border-t border-slate-200/60 dark:border-neutral-800">
                        <span className="text-slate-500">Kurir: {selectedTx.shippingAddress.courier}</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {selectedTx.shippingAddress.trackingNumber || 'Belum ada resi'}
                        </span>
                      </div>
                    )}

                    {selectedTx.shippingAddress.trackingNumber && !isEditingTracking && (
                      <a
                        href={`https://wa.me/${selectedTx.customerPhone.replace(/^0/, '62').replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Halo Kak ${selectedTx.customerName}, pesanan ${selectedTx.productName} (Invoice: ${selectedTx.invoiceNumber}) telah dikirim via ${selectedTx.shippingAddress.courier} dengan Nomor Resi: ${selectedTx.shippingAddress.trackingNumber}. Terima kasih!`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px] hover:bg-emerald-100 transition-colors"
                      >
                        Kirim Resi ke WhatsApp Pembeli
                      </a>
                    )}
                  </div>
                </div>
              )}

              {selectedTx.productType === 'DIGITAL' && (
                <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-800 dark:text-neutral-200">
                      Pengiriman Produk Digital
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-300">
                      Instan &amp; Otomatis
                    </Badge>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Link akses materi aktif dikirim ke: <span className="font-mono text-slate-800 dark:text-neutral-200 font-semibold">{selectedTx.customerEmail}</span>.
                  </p>
                  <a
                    href={`https://wa.me/${selectedTx.customerPhone.replace(/^0/, '62').replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Halo Kak ${selectedTx.customerName}, terima kasih atas pembelian ${selectedTx.productName} (Invoice: ${selectedTx.invoiceNumber}). Pembayaran Anda telah terverifikasi lunas. Silakan akses materi digital melalui email Anda atau link resmi kami. Selamat belajar!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-semibold text-[11px] hover:bg-blue-100 transition-colors"
                  >
                    Kirim Konfirmasi Akses via WhatsApp
                  </a>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-200 dark:border-neutral-900 bg-slate-50/80 dark:bg-neutral-950/80 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleCopy(`Halo Kak ${selectedTx.customerName}, terima kasih sudah memesan ${selectedTx.productName}. Pesanan Anda dengan invoice ${selectedTx.invoiceNumber} berstatus: ${selectedTx.paymentStatus}.`, 'wa')}
                className="text-xs text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white font-medium"
              >
                {copiedText === 'wa' ? 'Teks Tersalin!' : 'Salin Pesan Follow-Up WA'}
              </button>

              <Button size="sm" onClick={() => setSelectedTx(null)} className="h-8 text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800">
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
