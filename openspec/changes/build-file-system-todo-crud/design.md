## Context

The current repository is a minimal Vite React template with no todo domain logic, no backend, and no Tailwind CSS setup. The requested project needs a working CRUD experience that persists to the local file system while keeping the frontend client simple enough to swap from plain `fetch` to React Query later.

## Goals / Non-Goals

**Goals:**
- Deliver a single-page todo CRUD interface with responsive styling.
- Expose a stable local HTTP API at `/api/todos` from the Vite runtime.
- Persist todo data to a JSON file inside the repository using Node file-system APIs.
- Keep frontend data access isolated behind a small API client module.

**Non-Goals:**
- Adding routing, authentication, filtering, pagination, or due dates.
- Introducing a separate backend process or database.
- Migrating the frontend to React Query in this change.

## Decisions

- Use Vite dev server middleware for API endpoints rather than a separate Node server.
  This keeps local development to one process and matches the repo’s current lightweight setup.
- Store todos in a single JSON file with an array payload.
  The data shape is simple, human-readable, and sufficient for local CRUD practice without schema tooling.
- Keep the API contract minimal:
  `GET /api/todos`, `POST /api/todos`, `PATCH /api/todos/:id`, and `DELETE /api/todos/:id`.
  This supports all required user interactions and leaves room for a later React Query integration without changing route semantics.
- Model todos as `{ id, title, completed, createdAt, updatedAt }`.
  Timestamps make update behavior and persistence observable without adding more domain fields.
- Use Tailwind CSS for layout and component styling.
  This matches the requested stack and makes it easy to replace the starter CSS with a focused UI.

## Risks / Trade-offs

- [Vite middleware is primarily a dev-time API surface] -> Keep the API implementation encapsulated so it can later move to a dedicated server if needed.
- [Concurrent writes to a JSON file can be fragile] -> Use a simple read/modify/write flow and keep the scope to a single-user local development workflow.
- [Frontend and API live in the same repo/runtime] -> Separate API helper logic and UI concerns into distinct modules so later migration is mechanical.
- [Tailwind setup changes the styling toolchain] -> Keep the configuration minimal and remove unused starter CSS to reduce overlap.
