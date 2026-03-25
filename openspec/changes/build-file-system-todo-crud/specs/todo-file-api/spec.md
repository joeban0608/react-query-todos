## ADDED Requirements

### Requirement: Todo API persists records to the local file system
The system SHALL expose local HTTP endpoints for listing, creating, updating, and deleting todos, and SHALL persist todo records to a JSON file on disk.

#### Scenario: List todos
- **WHEN** a client sends `GET /api/todos`
- **THEN** the system returns the persisted todos as JSON

#### Scenario: Create todo
- **WHEN** a client sends `POST /api/todos` with a valid title
- **THEN** the system stores a new todo with generated id and timestamps and returns the created record

#### Scenario: Update todo
- **WHEN** a client sends `PATCH /api/todos/:id` with a new title or completion state for an existing todo
- **THEN** the system updates the persisted record, refreshes `updatedAt`, and returns the updated todo

#### Scenario: Delete todo
- **WHEN** a client sends `DELETE /api/todos/:id` for an existing todo
- **THEN** the system removes the persisted record and returns a successful response

### Requirement: Todo API rejects invalid requests
The system SHALL reject blank titles and unknown todo ids with error responses that the frontend can handle deterministically.

#### Scenario: Blank title in create or update request
- **WHEN** a client sends a blank or whitespace-only title
- **THEN** the system returns a client error response and does not change persisted data

#### Scenario: Unknown todo id
- **WHEN** a client updates or deletes a todo id that does not exist
- **THEN** the system returns a not found response and does not change persisted data
