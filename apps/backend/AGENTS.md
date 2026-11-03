# AGENTS.md (backend)

The FastAPI service, and the only thing that talks to PostgreSQL (D37, D38). This file covers
**this app only**. For the product definition, the data model and the rules that apply to the whole
repo, read [`../../AGENTS.md`](../../AGENTS.md) first.

**Current state: no code yet.** The architecture section is intentionally pending definition. The
stack, conventions and discipline rules below are already settled for the first implementation.

## Authority order

1. The root rules in [`../../AGENTS.md`](../../AGENTS.md), and through it the SRS and the data model
2. This file, for anything specific to the service
3. Existing code, which is **evidence, not specification**

## What this app owns

- The database. [`../../requirements/DATA-MODEL.md`](../../requirements/DATA-MODEL.md) is the
  specification, not a suggestion: the 15 tables, their keys, constraints and indexes are already
  written there, and the schema is what enforces them
- The migrations, and the catalog import from `free-exercise-db` (D34), which is re-runnable because
  of `unique (external_source, external_id)`
- The API the client consumes

## Stack

| Area | Choice |
|---|---|
| Language | Python 3.12 |
| Dependency and environment manager | `uv` |
| API framework | FastAPI |
| API validation and serialization | Pydantic v2 |
| Database toolkit | SQLAlchemy 2.x with its async API |
| PostgreSQL driver | `asyncpg` |
| Migrations | Alembic |
| Formatter and linter | Ruff |
| Static type checking | Pyright |

Do not add mypy alongside Pyright. One type checker is enough for this service; Pyright is the
chosen checker.

## Architecture

**Pending definition.** The backend's final layer and folder structure have not been decided yet.
Do not introduce a new architectural boundary, folder convention or dependency direction as if it
were settled. Until this section is completed, keep new code small and follow the existing code and
the rules below.

The following constraints are already settled independently of the final architecture:

- FastAPI is the HTTP boundary.
- PostgreSQL is accessed only by the backend.
- Database access is encapsulated behind repositories or the equivalent persistence boundary.
- Business rules must not be implemented in routers.
- Domain rules must not depend on FastAPI.

## Data and persistence conventions

- PostgreSQL is the source of truth for schema constraints. Alembic migrations are the only way to
  change the database schema.
- Use the names and relationships from [`../../requirements/DATA-MODEL.md`](../../requirements/DATA-MODEL.md):
  singular `snake_case` table names and UUID primary keys.
- Use `Decimal` for kilogram values mapped to PostgreSQL `numeric`; never use floating point for
  weights.
- Use `date` for calendar days and timezone-aware datetimes for instants.
- User-owned data must always be scoped to the authenticated user. A query must not rely only on a
  resource ID when ownership is part of the model.
- The catalog is global and read-only for users. User-owned plan and reality data must reach
  `app_user` directly or through its owning parent.
- `routine_session.routine_name` is a historical snapshot. Do not replace it with a live routine
  lookup when presenting history.
- `ended_at` is null while a session is in progress. Session duration is calculated from
  `ended_at - started_at`; it is not stored separately.
- Every confirmed set is persisted immediately, as required by D41. Do not wait for the session to
  finish before saving sets.
- Progress values and previous-session data are queries derived from recorded sets; they are not
  duplicated as mutable summary columns.

## Naming and code conventions

- Code identifiers are in English and use the glossary terms from the SRS. User-facing text is in
  Spanish, as required by NF-4.
- Use `snake_case` for modules, functions and variables; `PascalCase` for classes and Pydantic
  models; `UPPER_SNAKE_CASE` for constants.
- Prefer explicit type annotations on public functions, methods, repository interfaces and case
  boundaries.
- Code must pass Ruff and Pyright before review.
- Keep HTTP schemas separate from persistence models. Do not expose SQLAlchemy models directly as
  API responses.
- Do not commit secrets, database credentials or environment-specific configuration.

## Transactions

- A transaction belongs to an application operation, not to an individual repository method.
- Any operation that modifies multiple tables must use one transaction for the complete operation.
- Creating a weekly training and its seven days is one atomic operation.
- Starting a routine session and creating its required records is one atomic operation when the
  operation creates both.
- Reordering rows with a uniqueness constraint must be performed inside a transaction that preserves
  the constraint throughout the operation.
- Commit only after all business rules and persistence operations for the operation succeed. Rollback
  on any failure.

## Error handling

Business and domain errors must not depend on FastAPI or HTTP status codes. The HTTP boundary maps
them to a consistent error response:

```json
{
  "error": {
    "code": "routine_not_found",
    "message": "La rutina no existe."
  }
}
```

Use these categories consistently:

| Situation | HTTP status |
|---|---:|
| Invalid request data | `422` |
| Missing or invalid authentication | `401` |
| Authenticated user lacks permission | `403` |
| Resource does not exist in the user's scope | `404` |
| Valid request conflicts with a business rule | `409` |
| Unexpected internal failure | `500` |

Do not expose SQL statements, stack traces, credentials or internal implementation details to the
client. Unexpected errors must be logged server-side and returned as a generic `internal_error`.

## Discipline rules

Every new backend change must pass these rules:

1. **FastAPI routers do not contain business logic.** They coordinate the request and response only.
2. **Routers do not query PostgreSQL directly.** Database access goes through the persistence
   boundary.
3. **Business logic lives in use cases or services.** It must not be hidden in routers or ORM model
   methods.
4. **Repositories encapsulate data access.** SQLAlchemy queries and PostgreSQL-specific details stay
   there.
5. **The domain does not depend on FastAPI.** Domain code must be usable without an HTTP server.
6. **Operations that modify multiple tables use one transaction.** Partial writes are not acceptable.
7. **Every user-data query filters by the authenticated user.** Never trust a client-provided owner
   ID or assume that a resource ID is globally safe.
8. **Alembic migrations are the only way to modify the schema.** Do not create or alter tables from
   application startup code.
9. **Important constraints belong in PostgreSQL as well as in Python.** Application validation is
   useful for messages; it is not a substitute for database enforcement.
10. **Behaviour changes update documentation in the same pull request.** A code change without its
    corresponding documentation change is incomplete.
11. **HTTP concerns stay at the HTTP boundary.** Domain errors do not carry status codes or FastAPI
    response objects.
12. **Persistence models are not API contracts.** Map database rows to response schemas explicitly.
13. **Catalog data is never edited through user-facing endpoints.** Catalog changes go through the
    import or maintenance workflow.
14. **A session set is saved when it is confirmed.** Do not batch confirmed sets only at session end
    (D41).

## Tests

An agent never creates or edits tests unless a developer explicitly asks for it. When tests are
requested, prioritize:

- domain and use-case business rules;
- user ownership and authorization boundaries;
- transaction boundaries and multi-table operations;
- repository queries and important PostgreSQL constraints;
- authentication and error mapping;
- endpoints whose contracts are consumed by the mobile client;
- migrations and catalog import idempotency.

## Pending decisions and documentation

- Define the backend architecture, its final layers, folder structure and dependency direction
  before the service grows beyond its initial implementation.
- Add the agreed database restrictions for `routine_session` and for the relevant `position`
  columns before the first migration.
- Update `DATA-MODEL.md` and `DATA-MODEL-EXPLAINED.md` when those restrictions are formally
  documented.
- Record new product or data-model decisions in the SRS §4 table and its §13 changelog.
- A behaviour change without its documentation update in the same pull request is incomplete.

[`../../docs/AGENT-DOCS-GUIDE.md`](../../docs/AGENT-DOCS-GUIDE.md) explains the purpose and division
of the repository's agent documentation. Backend operational documentation belongs in
[`docs/`](docs/), not in this file.
