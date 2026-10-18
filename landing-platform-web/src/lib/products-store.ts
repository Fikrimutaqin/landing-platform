import { Product, CreateProductDto, ProductType } from '../../../shared/types';

const PRODUCTS_STORAGE_KEY = 'lp_merchant_products';

export const INITIAL_PRODUCTS: Product[] = [];

export class ProductsStore {
  static getProducts(): Product[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
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
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
  }

  static getProductById(id: string): Product | null {
    const list = this.getProducts();
    return list.find((p) => p.id === id) || null;
  }

  static getProductBySlug(slug: string): Product | null {
    const list = this.getProducts();
    return list.find((p) => p.slug === slug) || null;
  }

  static saveProduct(dto: CreateProductDto, existingId?: string): Product {
    const products = this.getProducts();
    const now = new Date().toISOString();

    if (existingId) {
      const index = products.findIndex((p) => p.id === existingId);
      if (index >= 0) {
        const updated: Product = {
          ...products[index],
          ...dto,
          id: existingId,
          slug: dto.slug || products[index].slug,
          updatedAt: now,
        };
        products[index] = updated;
        if (typeof window !== 'undefined') {
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
        }
        return updated;
      }
    }

    const newProduct: Product = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      organizationId: 'org_orderonline',
      name: dto.name,
      slug: dto.slug || dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: dto.description || '',
      type: dto.type,
      price: Number(dto.price) || 0,
      originalPrice: dto.originalPrice ? Number(dto.originalPrice) : undefined,
      sku: dto.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      stock: dto.type === 'PHYSICAL' ? (dto.stock !== undefined ? Number(dto.stock) : 100) : undefined,
      weight: dto.type === 'PHYSICAL' ? (dto.weight !== undefined ? Number(dto.weight) : 500) : undefined,
      imageUrl: dto.imageUrl || (dto.type === 'DIGITAL' 
        ? 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'),
      category: dto.category || (dto.type === 'DIGITAL' ? 'Produk Digital' : 'Produk Fisik'),
      status: dto.status || 'ACTIVE',
      digitalAttachment: dto.type === 'DIGITAL' ? dto.digitalAttachment : undefined,
      createdAt: now,
      updatedAt: now,
    };

    products.unshift(newProduct);
    if (typeof window !== 'undefined') {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    }
    return newProduct;
  }

  static deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filtered));
    }
    return true;
  }

  static resetToDefaults(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    }
  }
}
