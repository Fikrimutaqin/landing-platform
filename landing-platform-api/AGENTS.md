# Backend Repository Guidelines (landing-platform-api)

This directory contains the **NestJS + PostgreSQL + Drizzle ORM** backend REST API.

## Active Rules for Any Agent Working in This Directory:
1. **Scope**: Focus on API endpoints, business logic, Drizzle ORM database schemas, payment integrations, and tracking dispatchers.
2. **Database Integrity**: All tables use Drizzle ORM with strict foreign keys and multi-tenant `organization_id` scoping.
3. **Security**: Encrypt merchant secrets (Xendit secret keys, webhook tokens) using AES-256-GCM before saving to PostgreSQL.
4. **Tracking**: Implement Meta Conversions API (CAPI) and GA4 Measurement Protocol with SHA-256 hashed customer PII and event deduplication.
5. **Static Export**: Ensure the static HTML compiler generates clean, standalone HTML/CSS/JS without requiring node runtime on the merchant's hosting.
