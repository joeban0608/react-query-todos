## ADDED Requirements

### Requirement: User can manage todos from a single page
The system SHALL provide a single-page interface that displays persisted todos and allows the user to create, edit, complete, and delete todos without reloading the page.

#### Scenario: Todos load on page entry
- **WHEN** the user opens the application
- **THEN** the system fetches the current todo list and renders each persisted todo in the interface

#### Scenario: User creates a todo
- **WHEN** the user submits a non-empty title
- **THEN** the system creates the todo through the API and renders the new todo in the list

#### Scenario: User updates an existing todo
- **WHEN** the user changes a todo title or completion state
- **THEN** the system persists the change through the API and updates the rendered todo

#### Scenario: User deletes a todo
- **WHEN** the user requests deletion for an existing todo
- **THEN** the system removes the todo through the API and no longer renders it in the list

### Requirement: UI communicates validation and request failures
The system SHALL prevent blank todo titles from being submitted and SHALL present an understandable error state when API requests fail.

#### Scenario: Blank title is rejected
- **WHEN** the user submits a todo with an empty or whitespace-only title
- **THEN** the system blocks the request and shows validation feedback

#### Scenario: API request fails
- **WHEN** an API request returns an error response or network failure
- **THEN** the system shows an error message and preserves a usable interface state
