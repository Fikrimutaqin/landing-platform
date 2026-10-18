import { BlockItem } from '../builder/ElementorSidebar';

/**
 * 1. SALES PAGE TEMPLATE (Landing Page Jualan)
 */
export const SALES_PAGE_TEMPLATE: BlockItem[] = [
  // Sticky Navbar
  {
    id: 'blk_sales_nav',
    type: 'NAVBAR',
    content: {},
    styles: { backgroundColor: '#ffffff', textColor: '#0f172a' },
  },
  // Hero Banner with High-Converting Headline
  {
    id: 'blk_sales_hero',
    type: 'HERO',
    content: {},
    styles: {
      backgroundColor: '#0f172a',
      textColor: '#ffffff',
      accentColor: '#2563eb',
      padding: 'xl',
    },
  },
  // Urgency Timer
  {
    id: 'blk_sales_timer',
    type: 'TIMER',
    content: {},
    styles: { backgroundColor: '#f8fafc', padding: 'md' },
  },
  // Product Spotlight (Features, Specifications, Pricing)
  {
    id: 'blk_sales_spotlight',
    type: 'PRODUCT_SPOTLIGHT',
    content: {},
    styles: { backgroundColor: '#ffffff', padding: 'xl' },
  },
  // Customer Reviews & Social Proof
  {
    id: 'blk_sales_reviews',
    type: 'REVIEWS',
    content: {},
    styles: { backgroundColor: '#f8fafc', padding: 'lg' },
  },
  // FAQ Section
  {
    id: 'blk_sales_faq',
    type: 'FAQ',
    content: {},
    styles: { backgroundColor: '#ffffff', padding: 'lg' },
  },
  // Direct Checkout Form on sales page bottom
  {
    id: 'blk_sales_checkout',
    type: 'CHECKOUT_FORM',
    content: {},
    styles: { backgroundColor: '#f1f5f9', padding: 'xl' },
  },
  // Footer
  {
    id: 'blk_sales_footer',
    type: 'FOOTER',
    content: {},
    styles: { backgroundColor: '#0f172a', textColor: '#94a3b8' },
  },
];

/**
 * 2. CHECKOUT PAGE TEMPLATE (Page Checkout)
 */
export const CHECKOUT_PAGE_TEMPLATE: BlockItem[] = [
  {
    id: 'blk_co_nav',
    type: 'NAVBAR',
    content: {},
    styles: { backgroundColor: '#ffffff', textColor: '#0f172a' },
  },
  {
    id: 'blk_co_timer',
    type: 'TIMER',
    content: {},
    styles: { backgroundColor: '#eff6ff', padding: 'sm' },
  },
  {
    id: 'blk_co_form',
    type: 'CHECKOUT_FORM',
    content: {},
    styles: { backgroundColor: '#ffffff', padding: 'xl' },
  },
  {
    id: 'blk_co_reviews',
    type: 'REVIEWS',
    content: {},
    styles: { backgroundColor: '#f8fafc', padding: 'md' },
  },
  {
    id: 'blk_co_footer',
    type: 'FOOTER',
    content: {},
    styles: { backgroundColor: '#0f172a', textColor: '#94a3b8' },
  },
];

/**
 * 3. PAYMENT PAGE TEMPLATE (Page Payment & Instruksi Bayar)
 */
export const PAYMENT_PAGE_TEMPLATE: BlockItem[] = [
  {
    id: 'blk_pay_nav',
    type: 'NAVBAR',
    content: {},
    styles: { backgroundColor: '#ffffff', textColor: '#0f172a' },
  },
  {
    id: 'blk_pay_timer',
    type: 'TIMER',
    content: {},
    styles: { backgroundColor: '#fffbeb', textColor: '#b45309', padding: 'md' },
  },
  {
    id: 'blk_pay_instructions',
    type: 'CHECKOUT_FORM',
    content: {},
    styles: { backgroundColor: '#ffffff', padding: 'xl' },
  },
  {
    id: 'blk_pay_faq',
    type: 'FAQ',
    content: {},
    styles: { backgroundColor: '#f8fafc', padding: 'lg' },
  },
  {
    id: 'blk_pay_footer',
    type: 'FOOTER',
    content: {},
    styles: { backgroundColor: '#0f172a', textColor: '#94a3b8' },
  },
];

/**
 * 4. SUCCESS PAGE TEMPLATE (Thank You / Akses Produk)
 */
export const SUCCESS_PAGE_TEMPLATE: BlockItem[] = [
  {
    id: 'blk_succ_nav',
    type: 'NAVBAR',
    content: {},
    styles: { backgroundColor: '#ffffff', textColor: '#0f172a' },
  },
  {
    id: 'blk_succ_hero',
    type: 'HERO',
    content: {},
    styles: {
      backgroundColor: '#f0fdf4',
      textColor: '#166534',
      accentColor: '#16a34a',
      padding: 'xl',
    },
  },
  {
    id: 'blk_succ_spotlight',
    type: 'PRODUCT_SPOTLIGHT',
    content: {},
    styles: { backgroundColor: '#ffffff', padding: 'xl' },
  },
  {
    id: 'blk_succ_faq',
    type: 'FAQ',
    content: {},
    styles: { backgroundColor: '#f8fafc', padding: 'lg' },
  },
  {
    id: 'blk_succ_footer',
    type: 'FOOTER',
    content: {},
    styles: { backgroundColor: '#0f172a', textColor: '#94a3b8' },
  },
];

export interface FunnelStepInfo {
  id: string;
  stepNumber: number;
  slug: string;
  name: string;
  title: string;
  description: string;
  badge: string;
  blocks: BlockItem[];
  defaultPixels: {
    fbEvent: string;
    tiktokEvent: string;
    gaEvent: string;
  };
  features: string[];
}

export const ECOMMERCE_FUNNEL_STEPS: FunnelStepInfo[] = [
  {
    id: 'funnel_step_1_sales',
    stepNumber: 1,
    slug: 'sales-page',
    name: 'Landing Page Jualan',
    title: 'Halaman Penawaran & Presentasi Produk',
    description: 'Halaman penawaran produk dengan hero headline, benefit produk, ulasan pelanggan, FAQ, dan tombol pemesanan.',
    badge: 'Penawaran',
    blocks: SALES_PAGE_TEMPLATE,
    defaultPixels: {
      fbEvent: 'ViewContent',
      tiktokEvent: 'ViewContent',
      gaEvent: 'view_item',
    },
    features: [
      'Banner utama dengan judul penawaran dan deskripsi produk',
      'Countdown timer batas waktu promo',
      'Detail harga dan spesifikasi produk',
      'Daftar testimoni dan ulasan pembeli',
      'Formulir pemesanan langsung',
    ],
  },
  {
    id: 'funnel_step_2_checkout',
    stepNumber: 2,
    slug: 'checkout-page',
    name: 'Halaman Checkout',
    title: 'Formulir Pemesanan 1-Halaman',
    description: 'Formulir pemesanan cepat dengan input nama, nomor WhatsApp, pilihan kurir dan alamat kirim (fisik) atau email (digital).',
    badge: 'Checkout',
    blocks: CHECKOUT_PAGE_TEMPLATE,
    defaultPixels: {
      fbEvent: 'InitiateCheckout',
      tiktokEvent: 'InitiateCheckout',
      gaEvent: 'begin_checkout',
    },
    features: [
      'Input nama lengkap, nomor WhatsApp, dan email',
      'Pilihan kurir ekspedisi dan kalkulator ongkir',
      'Input khusus pengiriman produk digital',
      'Kode kupon dan diskon',
      'Pilihan pembayaran QRIS dan Virtual Account',
    ],
  },
  {
    id: 'funnel_step_3_payment',
    stepNumber: 3,
    slug: 'payment-instruction',
    name: 'Instruksi Pembayaran',
    title: 'Halaman Pembayaran QRIS & Virtual Account',
    description: 'Menampilkan QRIS dinamis dan nomor Virtual Account bank (BCA, Mandiri, BRI) dengan batas waktu pembayaran.',
    badge: 'Pembayaran',
    blocks: PAYMENT_PAGE_TEMPLATE,
    defaultPixels: {
      fbEvent: 'AddPaymentInfo',
      tiktokEvent: 'AddPaymentInfo',
      gaEvent: 'add_payment_info',
    },
    features: [
      'Batas waktu pembayaran 15 menit',
      'QRIS Dinamis untuk mobile banking dan e-wallet',
      'Nomor Virtual Account dengan tombol salin rekening',
      'Nominal tepat untuk verifikasi otomatis',
      'Konfirmasi status pembayaran real-time',
    ],
  },
  {
    id: 'funnel_step_4_success',
    stepNumber: 4,
    slug: 'thank-you-page',
    name: 'Halaman Konfirmasi & Sukses',
    title: 'Halaman Bukti Bayar & Akses Produk',
    description: 'Halaman konfirmasi pembayaran lunas dengan tautan unduh produk digital atau rincian pengiriman fisik.',
    badge: 'Konfirmasi',
    blocks: SUCCESS_PAGE_TEMPLATE,
    defaultPixels: {
      fbEvent: 'Purchase',
      tiktokEvent: 'CompletePayment',
      gaEvent: 'purchase',
    },
    features: [
      'Ringkasan invoice resmi dengan status Lunas (PAID)',
      'Tombol "Download File / Akses Materi" instan untuk produk digital',
      'Estimasi tanggal sampai kurir & nomor resi untuk produk fisik',
      'Tombol interaktif hubungi Layanan Pelanggan (CS) WhatsApp',
      'Pemicu event konversi utama (Purchase) ke Meta CAPI, TikTok & GA4',
    ],
  },
];
