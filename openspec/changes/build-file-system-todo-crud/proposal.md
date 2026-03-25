## Why

The repository is still using the default Vite starter and does not yet exercise the todo domain described in `domain.md`. This change creates a realistic CRUD baseline with a local file-system-backed API so the frontend can ship against a stable HTTP contract before the data layer is later migrated to React Query.

## What Changes

- Replace the Vite starter screen with a responsive todo CRUD interface built with React, TypeScript, and Tailwind CSS.
- Add a local `/api/todos` HTTP API hosted through the Vite dev server that stores todos in a JSON file on disk.
- Implement plain `fetch`-based frontend data access for listing, creating, updating, toggling, and deleting todos.
- Add basic validation and error handling for blank titles and missing todo records.

## Capabilities

### New Capabilities
- `todo-crud-ui`: Single-page todo interface for viewing and managing todos with standard CRUD interactions.
- `todo-file-api`: Local HTTP API for persisting todos to the file system via JSON storage.

### Modified Capabilities

## Impact

- Affected frontend app shell and styling in `src/`.
- New Vite middleware and Node file-system persistence support in app configuration/runtime code.
- New Tailwind CSS dependency and related build configuration.
- Public API surface added at `/api/todos` for later reuse by a React Query client.
