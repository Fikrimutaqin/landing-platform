# Multi-Agent Workspace Guidelines

Welcome to the **Landing Page & E-Commerce Funnel Platform** workspace.
This project is engineered with a decoupled, dual-repository architecture designed for two specialized agents operating in parallel.

---

## 1. Multi-Agent Roles & Ownership

| Agent Role | Target Directory | Primary Responsibilities |
| :--- | :--- | :--- |
| **Frontend Agent** | `landing-platform-web/` | Next.js 15 App Router, shadcn/ui, visual component block builder, live preview, client tracking scripts, merchant admin portal. |
| **Backend Agent** | `landing-platform-api/` | NestJS REST API, PostgreSQL + Drizzle ORM, BYOK Xendit payment vault (AES-256), Meta CAPI & GA4 dispatchers, custom domain verification, static HTML export engine. |

---

## 2. Shared Contracts & Communication Rules

1. **Contract-First Development**:
   - Both agents must conform to the TypeScript contracts defined in `shared/types/index.ts`.
   - Any modifications to the Page Block schema, Checkout DTOs, or Tracking events MUST be updated in `shared/types/` first.

2. **Decoupled Repositories**:
   - Do NOT tightly couple the frontend build to backend internal code.
   - All frontend-to-backend communication occurs strictly over REST APIs (`/api/v1/*`) or public storefront endpoints (`/api/v1/public/*`).

3. **Multi-Tenancy Standard**:
   - Every database query and business transaction belongs to an `organization_id` (merchant tenant).
   - Public landing page requests identify the organization via domain header or URL slug.

4. **Security & Secrets**:
   - Never expose merchant payment secrets or access tokens in frontend client bundles.
   - Decryption of API keys occurs exclusively on the backend within isolated services.
