# Tiny Inventory | GLOVER OLAOLUWA

A full-stack inventory management system for tracking stores, analytics, and product catalogs. Built with Express, PostgreSQL, React 18, TanStack Router/Query, and TypeScript to showcase senior-level frontend architecture on top of a pragmatic API.

This README provides a comprehensive overview of the project's architecture, design decisions, and technical implementation, with a special focus on the frontend.

## Quick Start

The entire development environment is containerized with Docker for one-command setup.

```bash
# Start the database, API, and frontend with a single command
make dev
```

The application will automatically:

1.  **Start PostgreSQL 16** with a persisted volume (`pgdata`).
2.  **Run Drizzle migrations** to set up the database schema.
3.  **Seed demo data** (stores, categories, products).
4.  **Build & start the Express API** on `http://localhost:3000`.
5.  **Start the React SPA** (Vite dev server) on `http://localhost:5173`.

**Access URLs:**

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **API:** [http://localhost:3000](http://localhost:3000)
- **API Health Check:** [http://localhost:3000/health](http://localhost:3000/health)

> **Note:** The first run may take 1–2 minutes while Docker builds the images and seeds the database. Subsequent runs will be much faster.

## System Architecture

The application follows a classic three-tier architecture, containerized for portability and ease of development.

```
                                     ┌─────────────────────────────┐
                                     │        Docker Network       │
                                     │      (app-network bridge)   │
                                     └─────────────┬───────────────┘
                                                   │
                           ┌───────────────────────┼───────────────────────┐
                           │                       │                       │
┌──────────────────────────▼──────────────┐ ┌──────▼───────────────────────┐ ┌──────▼───────────────────────┐
│         Frontend (Vite SPA)             │ │          Backend (API)         │ │          Database            │
│  - React 18, TypeScript               │ │  - Node.js 20, Express         │ │  - PostgreSQL 16             │
│  - TanStack Router, Query, Table      │ │  - TypeScript, Zod             │ │  - Drizzle ORM & Migrations  │
│  - Tailwind CSS, shadcn/ui            │ │  - Service/Route Pattern       │ │  - Persisted Volume (`pgdata`) │
│  - Hosted on port 5173                │ │  - Hosted on port 3000         │ │  - Hosted on port 5432       │
└───────────────────────────────────────┘ └────────────────────────────────┘ └────────────────────────────────┘
```

---

## Frontend Deep Dive

The frontend is the core focus of this project, designed to demonstrate a modern, robust, and scalable architecture for building data-intensive applications.

### Technology Stack

- **Framework:** **React 18** with **TypeScript** for a strongly-typed, component-based UI.
- **Build Tool:** **Vite** for lightning-fast HMR (Hot Module Replacement) and optimized builds.
- **Routing:** **TanStack Router** for type-safe, search-param-aware routing and nested layouts.
- **Server State Management:** **TanStack Query** for caching, background refetching, mutations, and optimistic updates.
- **Client State Management:** **React Context** and custom hooks for theme, layout, and search state.
- **Data Tables:** **TanStack Table** for powerful, headless table logic.
- **Forms:** **React Hook Form** with **Zod** for schema-based validation.
- **UI Components:** **shadcn/ui** for accessible, unstyled component primitives.
- **Styling:** **Tailwind CSS** for a utility-first styling workflow.
- **Icons:** **Lucide React** for a comprehensive and lightweight icon set.
- **API Client:** **Axios** for making HTTP requests to the backend.

### Project Structure

The `web/` directory is organized by feature and function to promote scalability and maintainability.

```
web/
├── public/                  # Static assets
└── src/
    ├── assets/              # Icons, logos
    ├── components/          # Reusable, generic UI components
    │   ├── data-table/      # Core table components (toolbar, pagination)
    │   ├── layout/          # App layout (header, sidebar)
    │   └── ui/              # shadcn/ui components
    ├── config/              # App-wide configuration (e.g., fonts)
    ├── context/             # Global context providers (Theme, Search)
    ├── features/            # Business-specific features/views
    │   ├── dashboard/       # Dashboard view and components
    │   ├── products/        # Products feature (table, forms, dialogs)
    │   └── stores/          # Stores feature (table, forms, store detail view)
    ├── hooks/               # Reusable custom hooks (useDebounce, useMobile)
    ├── lib/                 # Utility functions and libraries
    ├── routes/              # TanStack Router route definitions
    ├── services/            # API layer (Axios client, typed API calls)
    └── stores/              # Client-side state stores (e.g., Zustand)
```

### Component Architecture

Components are categorized to enforce a clear separation of concerns:

1.  **UI Primitives (`/components/ui`):** Raw, unstyled components from `shadcn/ui` (e.g., `Button`, `Dialog`, `Input`). They know nothing about the application's business logic.
2.  **Generic Components (`/components`):** Compositions of UI primitives to create reusable components used across multiple features (e.g., `CommandMenu`, `ProfileDropdown`, `DataTable`). These are still business-logic-agnostic.
3.  **Feature Components (`/features/*`):** Business-specific components that consume data and perform actions related to a particular domain (e.g., `ProductsTable`, `CreateStoreDialog`). They are composed of generic components and UI primitives.

This layered approach allows for maximum reusability and a consistent look and feel, while isolating complex business logic within feature folders.

### State Management

State is divided into two categories: **Server State** and **Client State**.

- **Server State (TanStack Query):** Manages all data fetched from the API.

  - **Caching:** API responses are cached to avoid redundant network requests. `staleTime` and `cacheTime` are configured for optimal freshness.
  - **Mutations:** `useMutation` is used for `POST`, `PATCH`, and `DELETE` operations. It handles loading/error states and automatically invalidates relevant queries on success to refetch fresh data.
  - **Query Keys:** A structured query key system (e.g., `['products', { page, search }]`) ensures that queries are unique and can be targeted for invalidation.

- **Client State (React Context & Hooks):** Manages UI-specific state that is not persisted on the server.
  - `ThemeProvider`: Manages light/dark mode, persisting the choice to `localStorage`.
  - `SearchProvider`: Powers the global command menu (`⌘K`).
  - `LayoutProvider`: Manages the state of the sidebar (collapsed/expanded).
  - **URL State:** For data table filters, sorting, and pagination, the URL is treated as the single source of truth via the `useTableUrlState` hook. This makes the UI state shareable and bookmarkable.

### Routing (TanStack Router)

TanStack Router provides a type-safe and powerful routing solution.

- **Route Tree:** Routes are defined in the `src/routes` directory and automatically generated into a `routeTree.gen.ts` file.
- **Layouts:** The `__root.tsx` file defines the root layout, which includes the main sidebar and header. Nested routes are rendered within this layout.
- **Loaders:** Data can be pre-fetched in route loaders, though this project prefers fetching data in components with `useQuery` to leverage its caching and background refetching capabilities.
- **Search Param Validation:** Zod schemas are used to validate and parse URL search parameters, providing type safety for filters and pagination.

### Data Table System

The data table is one of the most complex and powerful systems in the application.

- **Core (`/components/data-table`):** Contains the building blocks:
  - `DataTable`: The main wrapper that accepts columns and data.
  - `Toolbar`: Provides search, filtering, and view options.
  - `Pagination`: Handles page navigation.
  - `TableSkeleton`: A skeleton loader that matches the table's structure, providing an excellent loading state UX.
- **Feature Implementation (`/features/products/components/products-table.tsx`):**
  - Defines the `columns` for the table, including cell renderers for actions (edit/delete buttons) and custom formatting.
  - Fetches data using a `useQuery` hook that is synchronized with the URL state.
  - Uses the `useDebounce` hook to prevent excessive API calls while the user is typing in the search bar.
- **URL State Synchronization (`/hooks/use-table-url-state.ts`):** This custom hook is the key to the table's power. It synchronizes the table's state (pagination, sorting, filtering) with the URL's search parameters, providing a shareable and bookmarkable UX.

### Forms & Validation

Forms are built using **React Hook Form** and **Zod** for a robust and type-safe experience.

- **Schema:** A Zod schema defines the shape and validation rules for the form data.
- **Hooks:** `useForm` from React Hook Form manages the form's state, validation, and submission.
- **Integration:** The `zodResolver` connects the Zod schema to React Hook Form, enabling automatic validation.
- **Dynamic Schemas:** In the `ProductsActionDialog`, the Zod schema is created dynamically. The `storeId` field is only required if the dialog is opened from the global products page, but not when it's opened from a specific store's page. This showcases how to handle conditional validation.

### Design System & Theming

- **Tailwind CSS:** Provides a utility-first framework for rapid and consistent styling.
- **shadcn/ui:** Offers a set of accessible and unstyled component primitives that can be fully customized.
- **Theming:** A custom `theme.css` file defines CSS variables for light and dark modes, which are toggled by the `ThemeProvider`. This provides a seamless and performant theme-switching experience.

---

## Backend Architecture

The backend is a lightweight Express server designed to be a pragmatic and scalable foundation for the frontend.

### Technology Stack

- **Runtime:** **Node.js 20** with **TypeScript**.
- **Framework:** **Express** for routing and middleware.
- **Database:** **PostgreSQL 16**.
- **ORM:** **Drizzle ORM** for type-safe, SQL-like database queries.
- **Validation:** **Zod** for validating request bodies, params, and query strings.
- **Testing:** **Vitest** and **Supertest** for unit and integration testing.

### API Design

- **RESTful Principles:** The API follows RESTful conventions for endpoints and HTTP methods.
- **Service Layer:** Business logic is encapsulated in services (e.g., `products.service.ts`), keeping the route handlers thin and focused on request/response handling.
- **Standardized Responses:** All successful responses follow a consistent structure (e.g., `{ "data": [...], "pagination": {...} }`), and errors are handled by a central middleware.
- **Soft Deletes:** Products and other resources are soft-deleted by setting a `deletedAt` timestamp. All `SELECT` queries are filtered with `isNull(deletedAt)` to exclude deleted records. This preserves data history and allows for recovery.

---

## Testing Strategy

- **Backend:**
  - **Unit/Controller Tests:** Use Vitest to test individual controller functions, mocking the service layer to isolate validation and response logic.
  - **Integration Tests:** Use Vitest and Supertest to test the full request/response cycle of the Express app, ensuring that routes, middleware, and services work together correctly.
- **Frontend:**
  - Currently, the frontend lacks automated tests. This is a key area for future improvement.

---

## Design Decisions & Trade-offs

| Decision                             | Reason                                                                                                    | Trade-off                                                                                               |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **TanStack Everything**              | Provides a cohesive, type-safe ecosystem for routing, server state, and tables.                           | Higher learning curve and potential for vendor lock-in compared to more disparate libraries.            |
| **shadcn/ui over Component Library** | Full control over component styling and logic. Copy-paste model makes customization easy.                 | More initial setup required compared to a pre-styled library like MUI or Ant Design.                    |
| **URL as State for Tables**          | Creates a shareable and bookmarkable UX, which is critical for collaborative data-driven apps.            | Requires custom hooks and careful state synchronization, adding complexity.                             |
| **Drizzle ORM over Prisma**          | Offers a more SQL-like, type-safe query experience that feels closer to the database.                     | Younger ecosystem with fewer high-level abstractions (e.g., no built-in seeding library).               |
| **Soft Deletes**                     | Preserves data integrity and history, allowing for auditing and recovery.                                 | Requires careful filtering on all `SELECT` queries to avoid exposing deleted data.                      |
| **Faker.js for Dashboard**           | Allows for rapid UI development and demonstration of complex components without a fully-featured backend. | The UI is not representative of real data, which can be misleading. Requires a follow-up to wire it up. |

---

## Production Readiness & Future Enhancements

This project serves as a strong foundation but is not yet production-ready.

### What's Missing

1.  **Authentication & Authorization:** No user login or role-based access control.
2.  **Comprehensive Frontend Testing:** No unit, integration, or end-to-end tests for the React application.
3.  **Observability:** No structured logging, metrics, or tracing.
4.  **CI/CD:** No automated pipeline for testing, building, and deploying.

### If I Had More Time (4-Week Plan)

- **Week 1: Auth & Users:**

  - Implement JWT-based authentication (login, logout, refresh tokens).
  - Add a `users` table and protect all relevant API endpoints.
  - Create a login page and manage auth state on the frontend.

- **Week 2: Frontend Testing:**

  - Set up Vitest and React Testing Library for the frontend.
  - Write unit tests for critical hooks (`useDebounce`, `useTableUrlState`).
  - Write integration tests for the data table and form components.

- **Week 3: Polish & Real Data:**

  - Replace all `faker.js` mock data with live API calls (e.g., on the dashboard).
  - Add optimistic updates for all mutations to improve perceived performance.
  - Implement real-time updates with WebSockets for inventory changes.

- **Week 4: Observability & Deployment:**
  - Integrate a logging service (e.g., Pino) for structured JSON logs.
  - Add a CI/CD pipeline (e.g., GitHub Actions) to automate testing and builds.
  - Write a production-ready `Dockerfile` and deployment script.
