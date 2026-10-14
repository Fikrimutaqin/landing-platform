import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  jsonb,
  numeric,
  integer,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// -------------------------------------------------------------
// 1. ORGANIZATIONS (Multi-tenant root)
// -------------------------------------------------------------
export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  planTier: varchar('plan_tier', { length: 50 }).default('FREE').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// -------------------------------------------------------------
// 2. USERS (Merchants & Team Members)
// -------------------------------------------------------------
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('OWNER').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// -------------------------------------------------------------
// 3. PAGES (Landing Pages with JSONB Block Trees)
// -------------------------------------------------------------
export const pages = pgTable('pages', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 150 }).notNull(),
  status: varchar('status', { length: 50 }).default('DRAFT').notNull(), // DRAFT | PUBLISHED
  activeDraftContent: jsonb('active_draft_content').notNull(), // Hierarchical JSON block tree
  seoMetadata: jsonb('seo_metadata').default({}).notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// -------------------------------------------------------------
// 4. PAGE VERSIONS (Immutable Published Revisions)
// -------------------------------------------------------------
export const pageVersions = pgTable('page_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  pageId: uuid('page_id')
    .references(() => pages.id, { onDelete: 'cascade' })
    .notNull(),
  versionNumber: integer('version_number').notNull(),
  contentTree: jsonb('content_tree').notNull(),
  seoMetadata: jsonb('seo_metadata').default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// -------------------------------------------------------------
// 5. PRODUCTS (Items Sold on Landing Pages)
// -------------------------------------------------------------
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  price: numeric('price', { precision: 14, scale: 2 }).notNull(),
  compareAtPrice: numeric('compare_at_price', { precision: 14, scale: 2 }),
  currency: varchar('currency', { length: 10 }).default('IDR').notNull(),
  images: jsonb('images').default([]).notNull(),
  sku: varchar('sku', { length: 100 }),
  inventoryQuantity: integer('inventory_quantity').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// -------------------------------------------------------------
// 6. ORDERS (Checkout Submissions)
// -------------------------------------------------------------
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  pageId: uuid('page_id').references(() => pages.id, { onDelete: 'set null' }),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'set null' }),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 50 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }),
  shippingAddress: jsonb('shipping_address'),
  totalAmount: numeric('total_amount', { precision: 14, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('IDR').notNull(),
  status: varchar('status', { length: 50 }).default('PENDING').notNull(), // PENDING | PAID | EXPIRED | FAILED
  paymentProvider: varchar('payment_provider', { length: 50 }).default('XENDIT').notNull(),
  externalInvoiceId: varchar('external_invoice_id', { length: 255 }),
  paymentUrl: text('payment_url'),
  paymentDetails: jsonb('payment_details'), // Virtual account info, QRIS string, etc.
  trackingEventId: varchar('tracking_event_id', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// -------------------------------------------------------------
// 7. PAYMENT CONFIGURATIONS (BYOK Vault - Encrypted Secrets)
// -------------------------------------------------------------
export const paymentConfigs = pgTable('payment_configs', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  provider: varchar('provider', { length: 50 }).notNull(), // XENDIT | MIDTRANS | STRIPE
  encryptedApiKey: text('encrypted_api_key').notNull(), // AES-256-GCM cipher
  encryptedWebhookSecret: text('encrypted_webhook_secret'),
  keyIv: varchar('key_iv', { length: 64 }).notNull(), // Initialization vector
  authTag: varchar('auth_tag', { length: 64 }).notNull(), // GCM auth tag
  isProduction: boolean('is_production').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// -------------------------------------------------------------
// 8. ANALYTICS CONFIGURATIONS (Dual-Layer Tracking)
// -------------------------------------------------------------
export const analyticsConfigs = pgTable('analytics_configs', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  fbPixelId: varchar('fb_pixel_id', { length: 100 }),
  encryptedFbCapiToken: text('encrypted_fb_capi_token'),
  fbCapiIv: varchar('fb_capi_iv', { length: 64 }),
  fbCapiAuthTag: varchar('fb_capi_auth_tag', { length: 64 }),
  ga4MeasurementId: varchar('ga4_measurement_id', { length: 100 }),
  encryptedGa4ApiSecret: text('encrypted_ga4_api_secret'),
  ga4Iv: varchar('ga4_iv', { length: 64 }),
  ga4AuthTag: varchar('ga4_auth_tag', { length: 64 }),
  gtmId: varchar('gtm_id', { length: 100 }),
  capiEnabled: boolean('capi_enabled').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// -------------------------------------------------------------
// 9. DOMAINS (Custom Domains with DNS Status)
// -------------------------------------------------------------
export const domains = pgTable('domains', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  domainName: varchar('domain_name', { length: 255 }).notNull().unique(),
  targetPageId: uuid('target_page_id').references(() => pages.id, { onDelete: 'set null' }),
  verificationStatus: varchar('verification_status', { length: 50 }).default('PENDING').notNull(),
  sslStatus: varchar('ssl_status', { length: 50 }).default('INITIALIZING').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// -------------------------------------------------------------
// RELATIONS
// -------------------------------------------------------------
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  pages: many(pages),
  products: many(products),
  orders: many(orders),
  paymentConfigs: many(paymentConfigs),
  analyticsConfigs: many(analyticsConfigs),
  domains: many(domains),
}));

export const pagesRelations = relations(pages, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [pages.organizationId],
    references: [organizations.id],
  }),
  versions: many(pageVersions),
  orders: many(orders),
}));
