Tiny Inventory | GLOVER OLAOLUWA
Full-stack inventory management system for tracking stores, analytics, and product catalogs. Built with Express, PostgreSQL, React 18, TanStack Router/Query, and TypeScript to showcase senior-level frontend architecture on top of a pragmatic API.

Quick Start

Docker Deployment

```bash
# Start everything with a single command
make dev
```

The application will automatically:

- Start PostgreSQL 16 with persisted volume
- Run Drizzle migrations
- Seed demo data (stores, categories, products)
- Build & start the Express API on port 3000
- Start the React SPA (Vite dev server) on port 5173

Access URLs:

- Frontend: http://localhost:5173
- API: http://localhost:3000
- Health Check: http://localhost:3000/health

Note: First run usually takes 1–2 minutes while Docker builds images and seeds the database.

Running Tests Locally

```bash
cd server
npm install
npm test           # Run Vitest suite (controllers + integration)
npm run test:watch # Watch mode during development
```

Architecture Overview

System Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                            │
│     React 18 + TypeScript + Vite + Shadcn/Tailwind + TanStack Router │
│     - Feature folders (dashboard, stores, store detail, products)    │
│     - TanStack Query for server-state caching & mutations            │
└───────────────────────────────┬──────────────────────────────────────┘
                                │ HTTP/REST (Axios client)
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         API LAYER (Express)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │   Routes     │▶▶│  Zod Schemas │▶▶│ Error Handler │                │
│  └──────────────┘  └──────────────┘  └──────────────┘                │
└───────────────────────────────┬──────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                  SERVICE LAYER (Business Logic)                      │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐         │
│  │  Stores      │     │  Products    │     │  Categories  │         │
│  └──────────────┘     └──────────────┘     └──────────────┘         │
└───────────────────────────────┬──────────────────────────────────────┘
                                │ Drizzle ORM
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      DATABASE (PostgreSQL 16)                        │
│           UUID primary keys, timestamps, soft delete flags           │
└──────────────────────────────────────────────────────────────────────┘
```

Tech Stack Summary

Backend

- Runtime: Node.js 20 + TypeScript
- Framework: Express with custom middleware + morgan logging
- Database: PostgreSQL 16 with UUID primary keys
- ORM: Drizzle ORM for type-safe SQL
- Validation: Zod per route/controller
- Testing: Vitest + Supertest (controllers + integration)

Frontend

- Framework: React 18 + TypeScript + Vite
- Routing: TanStack Router (typed routes, loaders, error boundaries)
- State Management: TanStack Query + Context Providers (`ThemeProvider`, `SearchProvider`, `ProductsProvider`, `StoresProvider`)
- UI System: Shadcn UI components + Tailwind CSS tokens, light/dark theming via cookie-backed provider
- Tables & Filtering: TanStack Table with custom toolbar, view options, bulk actions, URL-synced filters
- Utilities: Axios client with retry + toast-driven optimistic UX, Sonner toasts, Lucide icons, command palette (⌘K) for navigation/search

Infrastructure

- Containerization: Docker + Docker Compose (db, API, SPA)
- Database Tooling: Drizzle Kit migrations, seed scripts
- Logging: morgan middleware with per-request timing
- Dev Tooling: tsx for dev server, ESLint, Prettier, knip, cz, etc.

Design Principles

- **Frontend-first UX:** Feature folders for Dashboard, Stores, Store Detail, and Products keep screens cohesive with shared hooks and design primitives.
- **URL as state:** `useTableUrlState` keeps pagination, global search, and faceted filters encoded in the URL so links remain shareable/bookmarkable.
- **Type safety everywhere:** Shared Zod schemas → controller validation → generated TypeScript types for React Query hooks → strongly typed table columns.
- **Separation of concerns:** Routes handle HTTP, services own business logic, hooks/providers own client-side state machines, UI primitives live under `components/`.
- **Real-world ergonomics:** Command palette, bulk selection toolbars, modular dialogs/drawers, and theme-aware components mimic production-grade admin dashboards.
- **Testing-in-mind:** Controller tests mock services for fast feedback; integration tests hit the real Express app to ensure contracts stay intact.

API Documentation

Endpoints

```
GET    /stores                     # List stores (paginated)
POST   /stores                     # Create store
GET    /stores/:id                 # Store details
GET    /stores/:id/products        # Products scoped to a store (paginated + category filter)
GET    /stores/:id/analytics       # Aggregated analytics for dashboard/store tabs

GET    /products                   # List products (search + category + stock filters)
GET    /products/:id               # Product details
POST   /products                   # Create product
PATCH  /products/:id               # Update product (partial supported)
DELETE /products/:id               # Delete product

GET    /categories                 # List categories (feeds dropdowns)
POST   /categories                 # Create category
PATCH  /categories/:id             # Update category
DELETE /categories/:id             # Delete category

GET    /health                     # Health probe for Docker/devops
```

Standardized Response Format

API responses return JSON objects with domain data and metadata (no extra envelope). Examples:

Single resource:

```json
{
  "id": "a3b6...",
  "name": "Main Street Market",
  "location": "Austin, TX",
  "createdAt": "2024-03-01T12:00:00.000Z"
}
```

Paginated collection:

```json
{
  "stores": [{ "id": "a3b6...", "name": "Main Street Market" }],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

Error response:

```json
{
  "error": "Invalid query parameters",
  "details": [
    { "path": ["page"], "message": "Number must be greater than or equal to 1" }
  ]
}
```

Benefits:

- Predictable shapes keep the Axios client + React Query hooks simple (`data?.stores`, `data?.pagination`).
- Pagination metadata always ships alongside data, enabling infinite scroll or server-driven paging.
- Validation errors surface Zod paths/messages so UI forms can map them back to fields.

Error Handling

- `400 Bad Request` — Validation failures (Zod), malformed query/body.
- `404 Not Found` — Missing stores/products.
- `409 Conflict` — Database constraint issues (e.g., duplicate names) surfaced via error middleware.
- `500 Internal Server Error` — Unexpected issues logged server-side.

Example validation error payload:

```json
{
  "error": "Invalid request body",
  "details": [
    {
      "path": ["price"],
      "message": "Expected number, received string"
    }
  ]
}
```

Frontend Application

Tech Stack

- React 18 + TypeScript with Vite dev server and HMR.
- TanStack Router for nested layouts, loader/error boundaries, and typed search params.
- TanStack Query orchestrates server state, caching, background refetch, and mutation side effects.
- Shadcn UI + Tailwind theme tokens for consistent spacing, typography, and semantic colors; `ThemeProvider` adds light/dark + system modes with cookie persistence.
- Axios service layer with interceptors, retry logic for 5xx responses, and Sonner toasts for optimistic UX feedback.
- Command palette (`CommandMenu`) wired to `SearchProvider` for ⌘K navigation, theme switching, and quick filtering.

Features

Store Management

- Stores list screen (`features/stores`) delivers a TanStack Table with column visibility toggles, bulk selection toolbar, and shadcn dialogs/drawers for create/edit flows.
- URL-synced filtering (global filter + column filters) keeps search, pagination, and per-column filters shareable between teammates.
- Store detail screen tabs expose analytics + scoped product management without leaving the page.

Product Management

- Products table supports multi-criteria filtering (name search, category faceted filter, stock state filter) plus column sorting, pagination, and selection-aware bulk delete flows.
- Create/Edit dialog uses React Hook Form + Zod to validate price/quantity, fetches categories/stores via React Query, and invalidates caches on success.
- Store-level product tab reuses the same provider/table while constraining queries via route parameters.

User Experience

- Command palette search, header search button, and keyboard shortcuts enhance navigation.
- Navigation progress bar + table loading states give responsive feedback; error states surface descriptive copy.
- Theme switch + profile dropdown mimic production-grade dashboards.
- Empty states, bulk action toolbars, and confirm dialogs create polished flows even for edge cases.

Design Decisions

TanStack Query over Redux/Context

- Removes boilerplate for server state, keeps cache normalized, and exposes first-class support for mutations + background refetch.
- Query keys mirror API filters, simplifying invalidation and ensuring lists stay current after create/edit/delete.

TanStack Router over React Router

- Typed route APIs guarantee search params/URL states stay consistent with server filters.
- Route-level loaders + error components simplify global error boundaries.

Tailwind + Shadcn over heavy component libraries

- Utility classes + design tokens keep layout consistent while still allowing deep customization.
- Shadcn primitives (dialog, dropdown, tabs, table, skeletons) accelerate development without sacrificing control.

Type-safe Axios Client

- Central `api.ts` sets base URL, retry strategy, and error normalization so components can focus on UX rather than wiring fetch details.
- Consistent error objects let Sonner toasts and form helpers surface actionable copy.

Testing Strategy

Test Types

1. **Controller Tests** (`server/src/modules/**/ *.controller.test.ts`)
   - Mock services to isolate request validation, status codes, and payload transformations (e.g., price coercion).
   - Fast (~milliseconds) so they run on every change/watch cycle.
2. **API Integration Tests** (`server/src/tests/api.integration.test.ts`)
   - Supertest drives the real Express app to verify pagination, validation, and error handling without mocking.
   - Ensures middleware (JSON parsing, error handler) and routes behave as a unit.

How to Run

```bash
cd server
npm test            # Runs entire Vitest suite
npm run test:watch  # Watch mode
```

Requirements:

- Node.js 20+ locally (or run via Docker)
- PostgreSQL is mocked via Drizzle for controller tests; integration tests hit the Express app without needing a live DB thanks to seed fixtures.

Coverage Approach

- Route/controller tests verify Zod schemas, HTTP status codes, pagination metadata, and response shapes.
- Integration tests ensure contract fidelity for `/stores`, `/products`, `/health`, and error edge cases.
- Shared helpers avoid mocking Drizzle query builders to keep tests resilient to refactors.

Decisions & Trade-offs

Technology Choices

- **Express over heavier frameworks:** Keeps the API layer minimal while pairing nicely with Drizzle; the trade-off is rolling more middleware/structuring by hand.
- **Drizzle ORM over Prisma/TypeORM:** SQL-first ergonomics make analytics queries easy to express, but the ecosystem is younger with fewer high-level abstractions.
- **PostgreSQL over SQLite:** Demonstrates production-ready patterns (UUIDs, analytics queries) but requires Docker for contributors.
- **UUID primary keys:** Avoids enumeration attacks and eases replication yet costs a few bytes per row; acceptable for this scale.

Architecture Decisions

- **No repository layer:** Services speak directly to Drizzle, keeping the codebase lean; would reintroduce repositories if multiple data sources appear.
- **Zod at the boundary:** Schemas provide runtime safety and descriptive errors for both backend and frontend forms.
- **Shared URL/table hook:** Owning `useTableUrlState` brings powerful UX (shareable filters) but increases custom code to maintain.
- **Cookie-backed theming:** Theme choices persist across sessions with zero backend requirements, but we must maintain the provider + command/menu wiring ourselves.

Non-trivial Operation

Store Analytics Endpoint (`GET /stores/:id/analytics`)

- Aggregates total value, average price, low/out-of-stock counts, and per-category breakdown using a single SQL query (SUM, AVG, COUNT DISTINCT, CASE).
- Feeds the dashboard summary cards and the Store Detail analytics tab without multiple round-trips.
- Example response:

```json
{
  "summary": {
    "totalProducts": 1248,
    "totalValue": 45231.89,
    "avgProductPrice": 36.24,
    "lowStockItems": 23,
    "outOfStockItems": 5,
    "categories": 8
  },
  "categoryBreakdown": [
    { "category": "Electronics", "count": 245, "totalValue": 15420.5 }
  ]
}
```

Production Readiness

What's Implemented

- CRUD APIs for stores/products/categories with validation + pagination.
- React SPA with multi-screen layout, analytics dashboard, command palette, shareable filter URLs, and responsive design.
- Seed scripts + Docker Compose for repeatable demo environments.
- Logging + health checks for observability.
- Vitest coverage on controllers + end-to-end API flows.

What's Missing

- AuthN/AuthZ (JWT, RBAC) for multi-user deployments.
- Dedicated API documentation (Swagger/OpenAPI) + SDK generation.
- Real-time features (websockets, subscriptions) for live stock updates.
- Automated frontend tests (component/E2E) and story-driven visual regression coverage.
- Metrics/alerts (Prometheus, OpenTelemetry) for production observability.

If I Had More Time

- **Frontend enhancements:** Implement dedicated product detail/edit routes with inline validation, add saved filters + filter pills, and wire dashboard/store analytics to live API data instead of mocked constants.
- **Performance upgrades:** Virtualize large tables, stream paginated queries, and prefetch linked resources while the user hovers navigational elements.
- **UX polish:** Add debounced search everywhere, skeleton screens for analytics/cards, richer empty states with contextual CTAs, and optimistic updates instead of blanket query invalidations.
- **Testing & tooling:** Introduce React Testing Library for data-table interactions, Playwright for end-to-end regression, and automated accessibility checks (axe) baked into CI.
