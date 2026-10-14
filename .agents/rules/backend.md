# Backend Agent Guidelines (landing-platform-api)

You are the **Backend Specialist Agent** responsible for the core API services, database modeling, payment orchestration, server-side tracking, and static export compiler.

---

## 1. Technology Stack & Rules

- **Framework**: NestJS (TypeScript).
- **Database & ORM**: PostgreSQL with **Drizzle ORM** (`drizzle-orm`, `drizzle-kit`).
- **Validation**: `class-validator`, `class-transformer`.
- **API Documentation**: OpenAPI / Swagger (`@nestjs/swagger`) mounted at `/api/docs`.
- **Security & Crypto**: Node.js `crypto` with **AES-256-GCM** for sensitive merchant credentials.
- **Background Tasks**: BullMQ / Redis or asynchronous event emitters for tracking and webhook processing.

---

## 2. Modular Architecture (NestJS)

Inside `landing-platform-api/src/`:
```text
modules/
├── auth/                       # JWT, AuthGuards, Merchant Registration & Login
├── organizations/              # Multi-tenant management, plans, and team access
├── pages/                      # Page CRUD, JSONB block tree schema, versions & publishing
├── products/                   # Products, inventory, variant definitions
├── orders/                     # Checkout pipeline, order state machine (PENDING, PAID, EXPIRED)
├── payments/                   # BYOK Payment Engine:
│   ├── adapters/               # Gateway implementations (XenditAdapter, Midtrans, Stripe)
│   ├── vault/                  # AES-256-GCM encryption/decryption of merchant keys
│   └── webhooks/               # Webhook receiver per merchant (:organizationId)
├── tracking/                   # Dual-Layer Server Tracking:
│   ├── capi/                   # Meta Conversions API client
│   └── ga4/                    # Google Analytics 4 Measurement Protocol client
├── domains/                    # Custom domain mapping, DNS TXT verification
└── export/                     # Standalone HTML/CSS/JS compiler & ZIP packaging
database/
├── schema.ts                   # Drizzle ORM PostgreSQL schema definitions
├── migrate.ts                  # Drizzle migration runner
└── drizzle.config.ts           # Drizzle configuration
```

---

## 3. Core Backend Deliverables & Standards

### 3.1. Drizzle ORM & PostgreSQL Schema
Define type-safe Drizzle tables in `database/schema.ts`:
- `organizations`: Multi-tenant root.
- `users`: Merchant accounts with bcrypt-hashed passwords.
- `pages`: Landing page metadata, status (`DRAFT`, `PUBLISHED`), and active JSONB block tree.
- `page_versions`: Immutable history of published revisions.
- `products`: Items sold on landing pages.
- `orders`: Customer checkout submissions, item snapshots, status.
- `payment_configs`: Encrypted `api_key` and `webhook_secret` using AES-256-GCM.
- `analytics_configs`: Merchant Facebook Pixel ID, Meta CAPI token, GA4 measurement ID.
- `domains`: Custom domain records and verification status (`PENDING`, `VERIFIED`).

### 3.2. Bring-Your-Own-Key (BYOK) Payment Vault & Xendit
- Implement `PaymentGatewayAdapter` interface:
  ```typescript
  export interface PaymentGatewayAdapter {
    createInvoice(config: DecryptedPaymentConfig, dto: CreateOrderDto): Promise<InvoiceResult>;
    verifyWebhook(config: DecryptedPaymentConfig, headers: Record<string, string>, body: any): Promise<boolean>;
  }
  ```
- `XenditAdapter`:
  - Calls Xendit's Invoice API using the merchant's decrypted secret key.
  - Supports Virtual Accounts (BCA, Mandiri, BRI, BNI), QRIS, and E-Wallets (OVO, DANA, ShopeePay).
  - Handles incoming Xendit webhook callback: validates webhook token, transitions order to `PAID`, and triggers the tracking dispatcher.

### 3.3. Server-Side Tracking (Meta CAPI & GA4)
- When checkout succeeds:
  1. Receive customer identifiers (`phone`, `email`, `client_ip`, `user_agent`, `event_id`).
  2. Hash PII using SHA-256 per Meta guidelines.
  3. Send `Purchase` event to Meta Conversions API (`graph.facebook.com/v19.0/{pixel_id}/events`).
  4. Send `purchase` event to GA4 Measurement Protocol (`google-analytics.com/mp/collect`).
  5. Include `event_id` to deduplicate against the browser's client-side pixel event.

### 3.4. Static HTML/CSS Export Engine
- Compile the stored JSONB block tree into clean, self-contained semantic HTML.
- Generate bundled CSS and an embeddable, standalone `<script>` for client checkout.
- Compress into a `.zip` archive and return a downloadable stream or presigned URL.
