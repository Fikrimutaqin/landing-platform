/**
 * Shared Type Definitions & Contracts
 * Used by both landing-platform-web (Frontend) and landing-platform-api (Backend)
 */

// -------------------------------------------------------------
// 1. SHADCN COMPONENT CATALOG TYPES
// -------------------------------------------------------------

export type ShadcnComponentType =
  | 'Accordion'
  | 'Alert'
  | 'AlertDialog'
  | 'AspectRatio'
  | 'Attachment'
  | 'Avatar'
  | 'Badge'
  | 'Breadcrumb'
  | 'Bubble'
  | 'Button'
  | 'ButtonGroup'
  | 'Calendar'
  | 'Card'
  | 'Carousel'
  | 'Chart'
  | 'Checkbox'
  | 'Collapsible'
  | 'Combobox'
  | 'Command'
  | 'ContextMenu'
  | 'DataTable'
  | 'DatePicker'
  | 'Dialog'
  | 'Direction'
  | 'Drawer'
  | 'DropdownMenu'
  | 'Empty'
  | 'Field'
  | 'HoverCard'
  | 'Input'
  | 'InputGroup'
  | 'InputOTP'
  | 'Item'
  | 'Kbd'
  | 'Label'
  | 'Marker'
  | 'Menubar'
  | 'Message'
  | 'MessageScroller'
  | 'NativeSelect'
  | 'NavigationMenu'
  | 'Pagination'
  | 'Popover'
  | 'Progress'
  | 'QuestionnaireNew'
  | 'RadioGroup'
  | 'Resizable'
  | 'ScrollArea'
  | 'Select'
  | 'Separator'
  | 'Sheet'
  | 'Sidebar'
  | 'Skeleton'
  | 'Slider'
  | 'Spinner'
  | 'Switch'
  | 'Table'
  | 'Tabs'
  | 'Textarea'
  | 'Toast'
  | 'Toggle'
  | 'ToggleGroup'
  | 'Tooltip'
  | 'Typography';

export interface ElementStyles {
  textColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: 'center' | 'top' | 'bottom';
  backgroundOverlay?: number; // 0 to 1 opacity
  borderWidth?: number; // in px: 0, 1, 2, 4, 8
  borderColor?: string;
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  opacity?: number; // 0 to 100
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  headlineFontSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: 'sans' | 'serif' | 'mono' | 'space' | 'jakarta';
  customClasses?: string;
  tablet?: ResponsiveStyleOverrides;
  mobile?: ResponsiveStyleOverrides;
}

export interface StyleClass {
  id: string;
  name: string; // e.g. "hero-headline", "primary-button", "feature-card"
  description?: string;
  styles: ElementStyles;
}

export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    muted: string;
    border: string;
    destructive: string;
  };
  fonts: {
    heading: 'sans' | 'serif' | 'mono' | 'space' | 'jakarta';
    body: 'sans' | 'serif' | 'mono' | 'space' | 'jakarta';
  };
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export interface ShadcnComponentInstance {
  id: string;
  type: ShadcnComponentType;
  props: Record<string, any>;
  styles?: ElementStyles;
  classNames?: string[];
  children?: ShadcnComponentInstance[];
  masterComponentId?: string;
  isMasterInstance?: boolean;
  overrides?: Record<string, { props?: Record<string, any>; styles?: Partial<ElementStyles> }>;
}

// -------------------------------------------------------------
// 2. PAGE BUILDER & CONTAINER BLOCK TREE SCHEMA
// -------------------------------------------------------------

export type BlockType =
  | 'CONTAINER'
  | 'NAVBAR'
  | 'HERO'
  | 'PRODUCT_SPOTLIGHT'
  | 'PRODUCT_CATALOG'
  | 'IMAGE'
  | 'CHECKOUT_FORM'
  | 'PAYMENT_INSTRUCTION'
  | 'SUCCESS_PAGE'
  | 'REVIEWS'
  | 'TIMER'
  | 'FEATURE_GRID'
  | 'FAQ'
  | 'FOOTER';

export interface BlockStyles {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: 'center' | 'top' | 'bottom';
  backgroundOverlay?: number; // 0 to 1 opacity for dark tint
  textColor?: string;
  accentColor?: string;
  fontFamily?: 'sans' | 'serif' | 'mono' | 'space' | 'jakarta';
  paddingY?: 'none' | 'compact' | 'normal' | 'spacious';
  paddingX?: 'none' | 'compact' | 'normal' | 'spacious';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  borderWidth?: number; // in px: 0, 1, 2, 4, 8
  borderColor?: string;
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  opacity?: number; // 0 to 100
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  headlineFontSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  textAlign?: 'left' | 'center' | 'right';
  customCssClass?: string;
  classNames?: string[];
  tablet?: ResponsiveStyleOverrides;
  mobile?: ResponsiveStyleOverrides;
}

export type DeviceViewport = 'desktop' | 'tablet' | 'mobile';

export interface ResponsiveLayoutOverrides {
  display?: 'flex' | 'grid';
  flexDirection?: 'row' | 'col';
  reverse?: boolean;
  wrap?: boolean;
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch';
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  rowGap?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  columnGap?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  maxWidth?: 'narrow' | 'compact' | 'boxed' | 'full';
  contentPosition?: 'left' | 'center' | 'right';
}

export interface ResponsiveStyleOverrides {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundOverlay?: number;
  textColor?: string;
  accentColor?: string;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  paddingY?: 'none' | 'compact' | 'normal' | 'spacious';
  paddingX?: 'none' | 'compact' | 'normal' | 'spacious';
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  opacity?: number;
  textAlign?: 'left' | 'center' | 'right';
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  headlineFontSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  fontFamily?: 'sans' | 'serif' | 'mono' | 'space' | 'jakarta';
}

export interface ContainerLayout {
  display: 'flex' | 'grid';
  flexDirection: 'row' | 'col';
  reverse?: boolean;
  wrap?: boolean;
  justify: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align: 'start' | 'center' | 'end' | 'stretch';
  columns: 1 | 2 | 3 | 4 | 6 | 12;
  gap: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  rowGap?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  columnGap?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  templatePreset?: 'equal' | 'split-left' | 'split-right' | 'sidebar' | 'custom';
  maxWidth?: 'narrow' | 'compact' | 'boxed' | 'full';
  contentPosition?: 'left' | 'center' | 'right';
  tablet?: ResponsiveLayoutOverrides;
  mobile?: ResponsiveLayoutOverrides;
}

export interface BaseBlockProps {
  id: string;
  type: BlockType;
  order: number;
  isHidden?: boolean;
  styles?: BlockStyles;
  classNames?: string[];
  layout?: ContainerLayout;
  masterComponentId?: string;
  isMasterInstance?: boolean;
  overrides?: Record<string, { props?: Record<string, any>; styles?: Partial<ElementStyles> }>;
}

export interface ContainerBlockProps extends BaseBlockProps {
  type: 'CONTAINER';
  label?: string;
  layout: ContainerLayout;
  columnsContent: Array<{
    id: string;
    columnWidth?: string; // e.g. "1/2", "auto", "1/3"
    components: ShadcnComponentInstance[];
  }>;
}

export interface NavbarBlockProps extends BaseBlockProps {
  type: 'NAVBAR';
  brandName: string;
  brandLogoUrl?: string;
  positionMode: 'sticky' | 'fixed' | 'static';
  navLinks: Array<{ label: string; href: string }>;
  ctaText: string;
  ctaAction?: 'scroll_to_checkout' | 'external_link';
}

export interface HeroBlockProps extends BaseBlockProps {
  type: 'HERO';
  headline: string;
  subheadline: string;
  badgeText?: string;
  ctaText: string;
  ctaAction?: 'scroll_to_checkout' | 'external_link';
  ctaTargetUrl?: string;
  showBadge?: boolean;
}

export interface ProductSpotlightProps extends BaseBlockProps {
  type: 'PRODUCT_SPOTLIGHT';
  productId: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  inventoryBadgeText?: string;
  features: string[];
}

export interface ImageBlockProps extends BaseBlockProps {
  type: 'IMAGE';
  imageUrl: string;
  altText: string;
  caption?: string;
  aspectRatio?: '16:9' | '4:3' | '21:9' | 'auto';
  fullWidth?: boolean;
}

export interface CheckoutFormProps extends BaseBlockProps {
  type: 'CHECKOUT_FORM';
  productId: string;
  productTitle: string;
  amount: number;
  formTitle: string;
  formDescription?: string;
  supportedPaymentMethods: ('QRIS' | 'VA' | 'EWALLET')[];
  submitButtonText: string;
}

export interface ReviewsBlockProps extends BaseBlockProps {
  type: 'REVIEWS';
  sectionTitle: string;
  subtitle?: string;
  items: Array<{
    author: string;
    roleOrStore: string;
    comment: string;
    rating: number;
    verified: boolean;
  }>;
}

export interface TimerBlockProps extends BaseBlockProps {
  type: 'TIMER';
  urgencyText: string;
  durationHours?: number;
  durationMinutes?: number;
}

export interface FaqBlockProps extends BaseBlockProps {
  type: 'FAQ';
  sectionTitle: string;
  subtitle?: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export interface FooterBlockProps extends BaseBlockProps {
  type: 'FOOTER';
  brandName: string;
  copyrightText?: string;
  badges: string[];
}

export type PageBlock =
  | ContainerBlockProps
  | NavbarBlockProps
  | HeroBlockProps
  | ProductSpotlightProps
  | ImageBlockProps
  | CheckoutFormProps
  | ReviewsBlockProps
  | TimerBlockProps
  | FaqBlockProps
  | FooterBlockProps;

export interface PageContentTree {
  version: number;
  theme: {
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  };
  blocks: PageBlock[];
}

// -------------------------------------------------------------
// 3. E-COMMERCE & CHECKOUT CONTRACTS
// -------------------------------------------------------------

export interface CustomerInfoDto {
  name: string;
  phone: string;
  email?: string;
  address?: {
    street: string;
    city?: string;
    province?: string;
    postalCode?: string;
  };
  notes?: string;
}

export interface CreateCheckoutRequestDto {
  pageId: string;
  productId: string;
  quantity: number;
  selectedVariantId?: string;
  customer: CustomerInfoDto;
  preferredPaymentMethod?: 'VIRTUAL_ACCOUNT' | 'QRIS' | 'EWALLET' | 'CREDIT_CARD' | 'COD';
  trackingContext?: {
    eventId: string;
    fbp?: string;
    fbc?: string;
    clientIp?: string;
    userAgent?: string;
  };
}

export interface CreateCheckoutResponseDto {
  orderId: string;
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
  totalAmount: number;
  currency: string;
  paymentUrl?: string;
  virtualAccountInfo?: {
    bankCode: string;
    accountNumber: string;
    expirationDate: string;
  };
  qrisInfo?: {
    qrString: string;
    qrImageUrl: string;
  };
}

// -------------------------------------------------------------
// 4. PAYMENT GATEWAY (BYOK) DEFINITIONS
// -------------------------------------------------------------

export type PaymentProvider = 'XENDIT' | 'MIDTRANS' | 'STRIPE';

export interface XenditMerchantConfig {
  apiKey: string;
  webhookSecret: string;
  isProduction: boolean;
}

// -------------------------------------------------------------
// 5. MARKETING TRACKING & ANALYTICS
// -------------------------------------------------------------

export type TrackingEventType =
  | 'PageView'
  | 'ViewContent'
  | 'InitiateCheckout'
  | 'AddPaymentInfo'
  | 'Purchase';

export interface TrackingEventPayload {
  eventName: TrackingEventType;
  eventId: string;
  eventTime: number;
  sourceUrl: string;
  userData?: {
    emailHash?: string;
    phoneHash?: string;
    clientIpAddress?: string;
    clientUserAgent?: string;
    fbp?: string;
    fbc?: string;
  };
  customData?: {
    currency?: string;
    value?: number;
    contentName?: string;
    contentCategory?: string;
    contentIds?: string[];
    numItems?: number;
  };
}

// -------------------------------------------------------------
// 6. PERSISTENCE, PROJECTS & DOCUMENT MODEL (Milestone 4)
// -------------------------------------------------------------

export interface PageSeoMetadata {
  metaTitle?: string;
  metaDescription?: string;
  favicon?: string;
  ogImage?: string;
  canonicalUrl?: string;
  keywords?: string;
  // Per-Page Tracking & Analytics Pixels
  facebookPixelId?: string;
  tiktokPixelId?: string;
  googleAnalyticsId?: string; // e.g. G-XXXXXXX
  customHeadScripts?: string;
  customBodyScripts?: string;
}

export interface PageDocument {
  schemaVersion: number;
  id: string;
  projectId: string;
  organizationId?: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED';
  blocks: any[]; // Supports BlockItem / PageBlock
  tokens?: DesignTokens;
  styleClasses?: StyleClass[];
  seoMetadata?: PageSeoMetadata;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface PageSummary {
  id: string;
  projectId: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED';
  isDefault?: boolean;
  blockCount?: number;
  updatedAt: string;
}

export interface ProjectSummary {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description?: string;
  pagesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePageDto {
  projectId: string;
  title: string;
  slug: string;
  templateKey?: string;
}

export interface UpdatePageDraftDto {
  title?: string;
  slug?: string;
  blocks?: any[];
  tokens?: DesignTokens;
  styleClasses?: StyleClass[];
  seoMetadata?: PageSeoMetadata;
}

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

// -------------------------------------------------------------
// 7. REUSABLE COMPONENTS & MASTER SYMBOLS (Milestone 5)
// -------------------------------------------------------------

export type MasterComponentCategory = 'navigation' | 'hero' | 'cards' | 'cta' | 'footer' | 'general';

export interface MasterComponent {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  category: MasterComponentCategory;
  schemaVersion: number;
  rootType: 'block' | 'component';
  blockData?: any; // Full BlockItem
  componentData?: ShadcnComponentInstance;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMasterComponentDto {
  projectId: string;
  name: string;
  description?: string;
  category?: MasterComponentCategory;
  rootType: 'block' | 'component';
  blockData?: any;
  componentData?: ShadcnComponentInstance;
}

export interface UpdateMasterComponentDto {
  name?: string;
  description?: string;
  category?: MasterComponentCategory;
  blockData?: any;
  componentData?: ShadcnComponentInstance;
}

// -------------------------------------------------------------
// 8. PREVIEW, PUBLISHING & VERSIONING (Milestone 6)
// -------------------------------------------------------------

export interface PublishedPageVersion {
  id: string; // e.g. ver_1729...
  pageId: string;
  versionNumber: number; // 1, 2, 3...
  title: string;
  slug: string;
  blocks: any[];
  tokens?: DesignTokens;
  styleClasses?: StyleClass[];
  seoMetadata?: PageSeoMetadata;
  publishedBy?: string;
  notes?: string;
  createdAt: string;
}

export interface PublishPageDto {
  notes?: string;
  publishedBy?: string;
}

export interface RollbackPageDto {
  versionId: string;
}

export interface PublicPageResponse {
  id: string;
  projectId: string;
  title: string;
  slug: string;
  status: 'PUBLISHED';
  blocks: any[];
  tokens?: DesignTokens;
  styleClasses?: StyleClass[];
  seoMetadata?: PageSeoMetadata;
  versionNumber: number;
  publishedAt: string;
}

// -------------------------------------------------------------
// 9. AUTHENTICATION & MULTI-TENANCY CONTRACTS
// -------------------------------------------------------------

export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  organizationName?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  planTier: string;
  createdAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  organizationName: string;
  planTier?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  organization?: Organization;
  message?: string;
}

export interface UserProfileUpdateDto {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

// -------------------------------------------------------------
// 10. E-COMMERCE PRODUCTS & TRANSACTIONS CONTRACTS
// -------------------------------------------------------------

export type ProductType = 'DIGITAL' | 'PHYSICAL';
export type ProductStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

export interface DigitalAttachment {
  type: 'download_url' | 'license_key' | 'redirect_link';
  accessUrl: string;
  instructions?: string;
}

export interface Product {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description: string;
  type: ProductType;
  price: number;
  originalPrice?: number;
  sku?: string;
  stock?: number;
  weight?: number; // in grams
  imageUrl?: string;
  category?: string;
  status: ProductStatus;
  digitalAttachment?: DigitalAttachment;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  slug?: string;
  description: string;
  type: ProductType;
  price: number;
  originalPrice?: number;
  sku?: string;
  stock?: number;
  weight?: number;
  imageUrl?: string;
  category?: string;
  status?: ProductStatus;
  digitalAttachment?: DigitalAttachment;
}

export type PaymentMethod =
  | 'QRIS'
  | 'BCA_VA'
  | 'MANDIRI_VA'
  | 'BRI_VA'
  | 'BNI_VA'
  | 'EWALLET'
  | 'COD';

export type PaymentStatus = 'PAID' | 'PENDING' | 'EXPIRED' | 'REFUNDED';
export type FulfillmentStatus = 'UNFULFILLED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED';

export interface ShippingAddress {
  recipientName: string;
  phone: string;
  street: string;
  subdistrict: string;
  city: string;
  province: string;
  postalCode: string;
  courier?: string;
  trackingNumber?: string;
}

export interface Transaction {
  id: string;
  invoiceNumber: string;
  organizationId: string;
  pageId?: string;
  productId: string;
  productName: string;
  productType: ProductType;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  quantity: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  shippingAddress?: ShippingAddress;
  digitalAccessDelivered?: boolean;
  notes?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}


