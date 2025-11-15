# Tiny Inventory | GLOVER OLAOLUWA

Build a small inventory management system that tracks stores and the
products they carry.

## Run Instructions

```bash
# Run the entire application with
make dev

# The command will:
# 1. Start PostgreSQL
# 2. Run migrations
# 3. Seed sample data
# 4. Start the API server on http://localhost:3000
# 5. Start the Web app server on http://localhost:5173
```

**Note:** First run may take a while for database initialization and seeding.

## API Overview

- `GET /stores` and `POST /stores` expose paginated store management with Zod validation and Drizzle-powered persistence.

- `GET /stores/:id` plus `GET /stores/:id/products` back the store detail screen with scoped pagination and optional category filters.

- `GET /stores/:id/analytics` runs a single aggregated SQL query (SUM/AVG/COUNT) that powers the dashboard and store analytics tabs.

- `GET /products` accepts category, store, price-range, and free-text filters; `POST/PATCH/DELETE /products/:id` power the product drawer forms.

- `GET /categories`/`POST /categories` hydrate dropdowns while `/categories/:id` handles CRUD to keep taxonomy consistent across stores.

- `GET /health` is the docker-compose readiness probe to ensure the API spun up cleanly before the SPA starts.

## Decisions & Trade-offs

- **Express + Drizzle ORM + Zod at the API boundary.** Express keeps the HTTP layer tiny, Drizzle stays close to SQL for analytics-heavy queries, and Zod protects every route (`products.controller.ts`, `stores.controller.ts`, `categories.controller.ts`). The trade-off is wiring middleware (morgan, custom error handlers) manually instead of relying on a batteries-included framework.

- **TanStack Router + React Query + domain providers for frontend state.** Typed routes let the stores/products pages read and mutate URL state safely, while React Query (`useQuery`, `useMutation`) powers pagination, caching, and refetch on focus. Providers such as `ThemeProvider`, `SearchProvider`, `ProductsProvider`, and `StoresProvider` wrap contextual state (dialogs, command palette, theming) without pulling in Redux, and `NavigationProgress` + root-level error components provide loading/error boundaries per route. The trade-off is more boilerplate and a steeper learning curve for teammates unfamiliar with TanStack Router.

- **Screen architecture & separation of concerns.** Feature folders (`features/dashboard`, `features/stores`, `features/stores/store`, `features/products`) each own a well-architected screen: dashboard metrics, stores list with filters, store detail (analytics + products tabs), and product list with validation-driven dialogs. Shared hooks (`hooks/use-table-url-state`), services (`services/*.ts`), and UI primitives live outside to keep responsibilities crisp—at the cost of a slightly deeper folder structure.

- **URL-aware data tables built on TanStack Table.** Both the stores and products screens share a `DataTableToolbar`, column visibility toggles, faceted filters, pagination, and selection-aware bulk actions. The custom `useTableUrlState` hook syncs multi-criteria filters (category, stock, search) to the query string so URLs remain shareable, but that also means we own advanced table plumbing (empty states, scroll management, keyboard support).

- **React Hook Form + Zod for modals/drawers.** The product create/edit dialog (`ProductsActionDialog`) reuses schema validation for both client and server, feeds data to Sonner toasts for optimistic UX, and invalidates both products and stores queries to keep derived views current. The downside is extra ceremony (resolver wiring, default value resets) compared with simpler uncontrolled forms.

- **Shadcn/Tailwind design system with theming + command palette.** Shadcn components plus Tailwind tokens keep spacing/typography consistent, and the cookie-backed `ThemeProvider` + `ThemeSwitch` deliver light/dark modes. The keyboard-driven `CommandMenu` (⌘K) doubles as global navigation/search. Customizing and maintaining the design tokens is more work than adopting a heavier component library, but it keeps the UI expressive.

- **Axios service layer with retry-aware interceptors.** `web/src/services/api.ts` wraps Axios with logging, automatic retries for 5xx, and a centralized error shaper consumed by `useMutation` handlers. That improves debugging and optimistic toasts, yet slightly increases bundle size versus the Fetch API.

### Non-trivial Operation

**Store Analytics Endpoint** (`GET /stores/:id/analytics`)

Goes beyond basic CRUD by computing business metrics with SQL aggregations:

- **Total inventory value** - Sum of (price × quantity) across all products
- **Average product price** - Mean price using `AVG()` aggregation
- **Low stock alerts** - Count of products with 1-9 units using `CASE` statements
- **Out of stock items** - Count of products with 0 quantity
- **Category metrics** - Groups products by category with count and value per category
- **Distinct category count** - Uses `COUNT(DISTINCT)` for unique categories

**Technical approach:** Single query with multiple aggregations (SUM, AVG, COUNT, DISTINCT, CASE, GROUP BY) for efficiency rather than multiple database round-trips.

## Testing Approach

### Implementation

**Controller Tests** (`server/src/modules/**/*.controller.test.ts`)

- Zod validation paths, status codes, and payload transformations are asserted with mocked services (e.g., products controller tests).
- Keeps branching logic (filter parsing, price coercion, empty updates) covered without spinning up HTTP servers.

**Integration Tests** (`server/src/tests/api.integration.test.ts`)

- Supertest drives the real Express app to verify pagination, validation, and edge cases for `/stores`, `/products`, and `/health`.
- Ensures middleware (JSON parsing, error handling) behaves correctly under real network-like conditions.

**Test Framework: Vitest**

- Fast, modern test runner with native ESM support
- TypeScript support out of the box
- Easy mocking with `vi.mock()`
- Familiar Jest-like API

### Run Tests

```bash
cd server
npm test              # Run all tests once
npm run test:watch    # Watch mode
```

## Improvements with More Time

- **Additional features:** Ship a dedicated product detail/editor route with validation-driven forms, store timelines, and saved filter presets so advanced workflows go beyond the current tables.
- **Performance enhancements:** Virtualize the TanStack tables, add infinite scroll/background prefetching, and persist cached analytics so large inventories feel instant even on low-powered laptops.
- **Technical debt:** Replace mocked dashboard/store analytics with live API calls, generate shared TypeScript types from the Express routes, and add true optimistic updates for mutations instead of blanket cache invalidation.
