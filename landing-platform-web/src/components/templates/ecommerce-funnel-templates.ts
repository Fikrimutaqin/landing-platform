import { BlockItem } from '../builder/ElementorSidebar';

/**
 * 1. SALES PAGE TEMPLATE (Katalog E-Commerce Multi-Produk)
 */
export const SALES_PAGE_TEMPLATE: BlockItem[] = [
  // Sticky Navbar
  {
    id: 'blk_sales_nav',
    type: 'NAVBAR',
    content: {
      brandName: 'Official Brand Store',
      ctaText: 'Keranjang',
      navLinks: [
        { label: 'Katalog Produk', href: '#katalog' },
        { label: 'Ulasan Pelanggan', href: '#reviews' },
        { label: 'Tanya Jawab (FAQ)', href: '#faq' },
      ],
    },
    styles: { backgroundColor: '#ffffff', textColor: '#0f172a' },
  },
  // Hero Banner with High-Converting Headline
  {
    id: 'blk_sales_hero',
    type: 'HERO',
    content: {
      headline: 'Koleksi Eksklusif Produk Pilihan Terbaik',
      subheadline: 'Dapatkan diskon spesial hingga 50% untuk produk fisik & digital terlaris bulan ini dengan garansi resmi dan pengiriman cepat.',
      badgeText: '🔥 PROMO SPESIAL TERBATAS',
      ctaText: 'Belanja Sekarang',
      ctaHref: '#katalog',
    },
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
    content: {
      urgencyText: 'Flash Sale & Promo Gratis Ongkir Berakhir Dalam:',
    },
    styles: { backgroundColor: '#eff6ff', textColor: '#1e40af', padding: 'md' },
  },
  // Multi-Product E-Commerce Catalog (Supports >1 Products with filters, categories, cart & direct checkout)
  {
    id: 'blk_sales_catalog',
    type: 'PRODUCT_CATALOG',
    content: {
      title: 'Katalog Produk Pilihan',
      subtitle: 'Pilih produk favorit Anda, beli langsung dengan checkout cepat atau masukkan ke keranjang belanja.',
      checkoutPageUrl: '/p/checkout-page',
      showFilters: true,
      showSearch: true,
    },
    styles: { backgroundColor: '#ffffff', padding: 'xl' },
  },
  // Customer Reviews & Social Proof
  {
    id: 'blk_sales_reviews',
    type: 'REVIEWS',
    content: {},
    styles: { backgroundColor: '#f8fafc', textColor: '#0f172a', padding: 'lg' },
  },
  // FAQ Section
  {
    id: 'blk_sales_faq',
    type: 'FAQ',
    content: {},
    styles: { backgroundColor: '#ffffff', textColor: '#0f172a', padding: 'lg' },
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
 * 2. CHECKOUT PAGE TEMPLATE (Halaman Khusus Formulir Checkout)
 */
export const CHECKOUT_PAGE_TEMPLATE: BlockItem[] = [
  {
    id: 'blk_co_nav',
    type: 'NAVBAR',
    content: {
      brandName: 'Official Store',
      ctaText: 'Katalog Toko',
      navLinks: [
        { label: 'Katalog Produk', href: '/p/sales-page' },
        { label: 'Bantuan CS WhatsApp', href: 'https://wa.me/6281234567890' },
      ],
    },
    styles: { backgroundColor: '#ffffff', textColor: '#0f172a' },
  },
  {
    id: 'blk_co_timer',
    type: 'TIMER',
    content: {
      urgencyText: 'Selesaikan pemesanan Anda dalam 15 menit untuk mengunci harga promo:',
    },
    styles: { backgroundColor: '#eff6ff', textColor: '#1e40af', padding: 'sm' },
  },
  {
    id: 'blk_co_form',
    type: 'CHECKOUT_FORM',
    content: {
      formTitle: 'Formulir Pemesanan Express',
      paymentPageUrl: '/p/payment-instruction',
    },
    styles: { backgroundColor: '#ffffff', padding: 'xl' },
  },
  {
    id: 'blk_co_footer',
    type: 'FOOTER',
    content: {},
    styles: { backgroundColor: '#0f172a', textColor: '#94a3b8' },
  },
];

/**
 * 3. PAYMENT PAGE TEMPLATE (Halaman Khusus Instruksi Bayar QRIS & Virtual Account)
 */
export const PAYMENT_PAGE_TEMPLATE: BlockItem[] = [
  {
    id: 'blk_pay_nav',
    type: 'NAVBAR',
    content: {
      brandName: 'Official Store',
      ctaText: 'Bantuan CS',
      navLinks: [
        { label: 'Katalog Produk', href: '/p/sales-page' },
        { label: 'Bantuan CS WhatsApp', href: 'https://wa.me/6281234567890' },
      ],
    },
    styles: { backgroundColor: '#ffffff', textColor: '#0f172a' },
  },
  {
    id: 'blk_pay_instructions',
    type: 'PAYMENT_INSTRUCTION',
    content: {
      title: 'Instruksi Pembayaran Tagihan',
      description: 'Lakukan pembayaran sesuai nominal tepat di bawah ini. Sistem kami akan memverifikasi otomatis dalam 1-2 menit.',
      successPageUrl: '/p/thank-you-page',
    },
    styles: { backgroundColor: '#ffffff', padding: 'xl' },
  },
  {
    id: 'blk_pay_faq',
    type: 'FAQ',
    content: {},
    styles: { backgroundColor: '#f8fafc', textColor: '#0f172a', padding: 'lg' },
  },
  {
    id: 'blk_pay_footer',
    type: 'FOOTER',
    content: {},
    styles: { backgroundColor: '#0f172a', textColor: '#94a3b8' },
  },
];

/**
 * 4. SUCCESS PAGE TEMPLATE (Halaman Khusus Konfirmasi Bayar, Download & Resi)
 */
export const SUCCESS_PAGE_TEMPLATE: BlockItem[] = [
  {
    id: 'blk_succ_nav',
    type: 'NAVBAR',
    content: {
      brandName: 'Official Store',
      ctaText: 'Belanja Lagi',
      navLinks: [
        { label: 'Kembali Belanja', href: '/p/sales-page' },
        { label: 'Bantuan CS WhatsApp', href: 'https://wa.me/6281234567890' },
      ],
    },
    styles: { backgroundColor: '#ffffff', textColor: '#0f172a' },
  },
  {
    id: 'blk_succ_confirmation',
    type: 'SUCCESS_PAGE',
    content: {
      title: 'Pembayaran Sukses & Terverifikasi!',
      description: 'Terima kasih atas pesanan Anda. Invoice resmi telah diterbitkan dan pesanan segera dikirimkan.',
      storePageUrl: '/p/sales-page',
    },
    styles: { backgroundColor: '#f0fdf4', padding: 'xl' },
  },
  {
    id: 'blk_succ_faq',
    type: 'FAQ',
    content: {},
    styles: { backgroundColor: '#f8fafc', textColor: '#0f172a', padding: 'lg' },
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
    name: '1. Katalog Toko & Multi-Produk',
    title: 'Halaman Katalog E-Commerce & Etalase Produk',
    description: 'Etalase toko modern seperti real e-commerce dengan dukungan penjualan multi-produk, kategori filter, pencarian, dan keranjang belanja terintegrasi.',
    badge: 'Katalog',
    blocks: SALES_PAGE_TEMPLATE,
    defaultPixels: {
      fbEvent: 'ViewContent',
      tiktokEvent: 'ViewContent',
      gaEvent: 'view_item',
    },
    features: [
      'Multi-produk etalase (bisa jual >1 produk fisik maupun digital sekaligus)',
      'Filter kategori (Semua, Produk Fisik, Produk Digital) & live search',
      'Tombol "Beli Langsung" yang terhubung otomatis ke Halaman Checkout',
      'Tombol "+ Keranjang" dengan slide-over drawer interaktif',
      'Countdown flash sale, testimoni pembeli & FAQ interaktif',
    ],
  },
  {
    id: 'funnel_step_2_checkout',
    stepNumber: 2,
    slug: 'checkout-page',
    name: '2. Halaman Formulir Checkout',
    title: 'Halaman Checkout Khusus & Terpisah',
    description: 'Halaman khusus pengisian formulir pemesanan, kalkulator ongkos kirim ekspedisi, kode kupon diskon, dan pilihan metode pembayaran.',
    badge: 'Checkout',
    blocks: CHECKOUT_PAGE_TEMPLATE,
    defaultPixels: {
      fbEvent: 'InitiateCheckout',
      tiktokEvent: 'InitiateCheckout',
      gaEvent: 'begin_checkout',
    },
    features: [
      'Dukungan ringkasan multi-item dari keranjang belanja atau link produk langsung',
      'Input data penerima (Nama, No WhatsApp, Email)',
      'Pilihan kurir ekspedisi (JNE, SiCepat, J&T) dengan kalkulasi ongkir live',
      'Fitur input kupon diskon promo (HEMAT10, DISKON50)',
      'Otomatis membuat tagihan dan mengalihkan langsung ke Halaman Pembayaran',
    ],
  },
  {
    id: 'funnel_step_3_payment',
    stepNumber: 3,
    slug: 'payment-instruction',
    name: '3. Halaman Instruksi Pembayaran',
    title: 'Halaman Pembayaran QRIS Dinamis & Virtual Account',
    description: 'Halaman khusus instruksi pembayaran dengan countdown timer 24 jam, barcode QRIS nasional, nomor VA bank dengan tombol salin, dan simulasi lunas.',
    badge: 'Pembayaran',
    blocks: PAYMENT_PAGE_TEMPLATE,
    defaultPixels: {
      fbEvent: 'AddPaymentInfo',
      tiktokEvent: 'AddPaymentInfo',
      gaEvent: 'add_payment_info',
    },
    features: [
      'Countdown batas waktu pembayaran dinamis (24 jam)',
      'Barcode QRIS dinamis untuk scan lewat BCA, Mandiri, GoPay, OVO, ShopeePay',
      'Nomor Virtual Account bank dengan tombol 1-klik "Salin Rekening"',
      'Tombol "Simulasi Bayar Lunas" untuk demo otomatis',
      'Otomatis mengalihkan ke Halaman Sukses saat pembayaran terkonfirmasi',
    ],
  },
  {
    id: 'funnel_step_4_success',
    stepNumber: 4,
    slug: 'thank-you-page',
    name: '4. Halaman Sukses & Bukti Bayar',
    title: 'Halaman Konfirmasi Pembayaran Lunas & Akses Produk',
    description: 'Halaman invoice resmi berstatus Lunas (PAID), tombol download akses materi digital, pelacakan kurir fisik, dan tombol konfirmasi CS WhatsApp.',
    badge: 'Konfirmasi',
    blocks: SUCCESS_PAGE_TEMPLATE,
    defaultPixels: {
      fbEvent: 'Purchase',
      tiktokEvent: 'CompletePayment',
      gaEvent: 'purchase',
    },
    features: [
      'Badge terverifikasi LUNAS (PAID) dengan invoice resmi',
      'Tombol download instan & tautan akses khusus produk digital',
      'Detail alamat pengiriman & estimasi kurir untuk produk fisik',
      'Tombol interaktif WhatsApp CS dengan pesan otomatis yang siap kirim',
      'Pemicu konversi event Purchase ke Meta CAPI, TikTok & GA4',
    ],
  },
];
