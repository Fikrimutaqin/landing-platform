# E-Commerce Landing Page Platform

A high-converting, component-based landing page builder platform for merchants, equipped with:
- **Bring-Your-Own-Key (BYOK) Payments**: Direct Xendit integration with AES-256 encrypted merchant credentials.
- **Dual-Layer Analytics**: Meta Facebook Pixel + Meta Conversions API (CAPI) and Google Analytics 4 (GA4) with event deduplication.
- **Custom Domains & Static Export**: Cloud hosting with automated SSL or 1-click standalone HTML/CSS/JS boilerplate export.

---

## Workspace Structure

```text
landing-platform/
├── .agents/
│   └── rules/
│       ├── frontend.md            # Guidelines for Frontend Agent
│       └── backend.md             # Guidelines for Backend Agent
├── AGENTS.md                      # High-level dual-agent protocol & boundaries
├── shared/
│   └── types/
│       └── index.ts               # Canonical TypeScript contracts & schemas
├── landing-platform-web/          # Next.js 15 + shadcn/ui application
│   └── AGENTS.md                  # Scoped rules for frontend directory
└── landing-platform-api/          # NestJS + PostgreSQL + Drizzle ORM backend
    └── AGENTS.md                  # Scoped rules for backend directory
```

---

## Dual-Agent Operating Guide

You can run two agents concurrently or alternate between them:

### Agent 1: Frontend Specialist (`landing-platform-web/`)
- **Focus**: UI/UX, Page Builder canvas, `@dnd-kit` block ordering, shadcn/ui components, client tracking injection.
- **Rules File**: [.agents/rules/frontend.md](file:///Users/fikrimutaqin/Project/SIDE_HUSTLE/landing-platform/.agents/rules/frontend.md) & [landing-platform-web/AGENTS.md](file:///Users/fikrimutaqin/Project/SIDE_HUSTLE/landing-platform/landing-platform-web/AGENTS.md).

### Agent 2: Backend Specialist (`landing-platform-api/`)
- **Focus**: NestJS modules, Drizzle ORM schemas, Xendit payment vault, Meta CAPI / GA4 dispatchers, HTML export engine.
- **Rules File**: [.agents/rules/backend.md](file:///Users/fikrimutaqin/Project/SIDE_HUSTLE/landing-platform/.agents/rules/backend.md) & [landing-platform-api/AGENTS.md](file:///Users/fikrimutaqin/Project/SIDE_HUSTLE/landing-platform/landing-platform-api/AGENTS.md).

### Shared Contract:
Both agents must adhere to the data structures defined in:
- [shared/types/index.ts](file:///Users/fikrimutaqin/Project/SIDE_HUSTLE/landing-platform/shared/types/index.ts)
