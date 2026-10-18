import {
  Transaction,
  PaymentStatus,
  FulfillmentStatus,
} from '../../../shared/types';

const TRANSACTIONS_STORAGE_KEY = 'lp_merchant_transactions';

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export class TransactionsStore {
  static getTransactions(): Transaction[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      if (!stored) {
        return [];
      }
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  static clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TRANSACTIONS_STORAGE_KEY);
  }

  static getTransactionById(id: string): Transaction | null {
    const list = this.getTransactions();
    return list.find((t) => t.id === id || t.invoiceNumber === id) || null;
  }

  static createTransaction(tx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction {
    const transactions = this.getTransactions();
    const now = new Date().toISOString();
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };
    transactions.unshift(newTx);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
    }
    return newTx;
  }

  static updateStatus(id: string, paymentStatus: PaymentStatus, fulfillmentStatus?: FulfillmentStatus): Transaction | null {
    const transactions = this.getTransactions();
    const idx = transactions.findIndex((t) => t.id === id || t.invoiceNumber === id);
    if (idx === -1) return null;

    transactions[idx].paymentStatus = paymentStatus;
    if (fulfillmentStatus) {
      transactions[idx].fulfillmentStatus = fulfillmentStatus;
    }
    if (paymentStatus === 'PAID' && !transactions[idx].paidAt) {
      transactions[idx].paidAt = new Date().toISOString();
      if (transactions[idx].productType === 'DIGITAL') {
        transactions[idx].digitalAccessDelivered = true;
      }
    }
    transactions[idx].updatedAt = new Date().toISOString();

    if (typeof window !== 'undefined') {
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
    }
    return transactions[idx];
  }

  static updateShippingTracking(id: string, trackingNumber: string, courier?: string): Transaction | null {
    const transactions = this.getTransactions();
    const idx = transactions.findIndex((t) => t.id === id || t.invoiceNumber === id);
    if (idx === -1) return null;

    if (!transactions[idx].shippingAddress) {
      transactions[idx].shippingAddress = {
        recipientName: transactions[idx].customerName,
        phone: transactions[idx].customerPhone,
        street: 'Alamat Pelanggan',
        subdistrict: '',
        city: '',
        province: '',
        postalCode: '',
      };
    }

    transactions[idx].shippingAddress!.trackingNumber = trackingNumber;
    if (courier) {
      transactions[idx].shippingAddress!.courier = courier;
    }
    transactions[idx].fulfillmentStatus = 'SHIPPED';
    transactions[idx].updatedAt = new Date().toISOString();

    if (typeof window !== 'undefined') {
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
    }
    return transactions[idx];
  }

  static resetToDefaults(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
    }
  }
}
