import { Product } from '../../../shared/types';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

const CART_STORAGE_KEY = 'lp_merchant_cart_items';
const CART_EVENT_NAME = 'lp_cart_updated';

export class CartStore {
  static getItems(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  static saveItems(items: CartItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent(CART_EVENT_NAME, { detail: items }));
    } catch {
      // Ignore storage errors
    }
  }

  static addItem(product: Product, quantity: number = 1): CartItem[] {
    const items = this.getItems();
    const existingIndex = items.findIndex((i) => i.product.id === product.id);

    if (existingIndex >= 0) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        product,
        quantity,
      });
    }

    this.saveItems(items);
    return items;
  }

  static updateQuantity(productId: string, quantity: number): CartItem[] {
    let items = this.getItems();
    if (quantity <= 0) {
      return this.removeItem(productId);
    }

    items = items.map((i) => (i.product.id === productId ? { ...i, quantity } : i));
    this.saveItems(items);
    return items;
  }

  static removeItem(productId: string): CartItem[] {
    const items = this.getItems().filter((i) => i.product.id !== productId);
    this.saveItems(items);
    return items;
  }

  static clearCart(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CART_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(CART_EVENT_NAME, { detail: [] }));
  }

  static getSubtotal(): number {
    return this.getItems().reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);
  }

  static getItemCount(): number {
    return this.getItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  static subscribe(listener: (items: CartItem[]) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = (e: any) => listener(e.detail || CartStore.getItems());
    window.addEventListener(CART_EVENT_NAME, handler);
    return () => window.removeEventListener(CART_EVENT_NAME, handler);
  }
}
