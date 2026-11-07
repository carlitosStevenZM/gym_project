# AGENTS.md (backend)

The FastAPI service, and the only thing that talks to PostgreSQL (D37, D38). This file covers
**this app only**. For the product definition, the data model and the rules that apply to the whole
repo, read [`../../AGENTS.md`](../../AGENTS.md) first.

**Current state: no code yet.** The architecture and conventions below are the rules for the first
implementation.

## Authority order

1. The root rules in [`../../AGENTS.md`](../../AGENTS.md), and through it the SRS and the data model
2. This file, for anything specific to the service
3. Existing code, which is **evidence, not specification**

## Read when the task touches it

- [`../../requirements/SRS.md`](../../requirements/SRS.md) — product behaviour and decisions D1–D44
- [`../../requirements/DATA-MODEL.md`](../../requirements/DATA-MODEL.md) — tables, constraints and indexes
- [`docs/agents/architecture.md`](docs/agents/architecture.md) — the modules, layers, boundaries and
  dependency direction
- [`docs/agents/development-rules.md`](docs/agents/development-rules.md) — tooling, Python, imports,
  database conventions, naming and tests
- [`docs/agents/anti-patterns.md`](docs/agents/anti-patterns.md) — the named wrong shapes, one per
  discipline rule
- [`docs/`](docs/) — backend operational documentation, once it exists

## The stack, settled

| | |
|---|---|
| Language | Python 3.12 |
| Dependency manager | `uv` |
| API | FastAPI + Pydantic v2 |
| Database access | SQLAlchemy 2.x async + `asyncpg` |
| Migrations | Alembic |
| Formatter and linter | Ruff |
| Type checking | Pyright |

Do not add mypy alongside Pyright.

## Conventions

- Code identifiers and database names are in English; user-facing text is Spanish (NF-4).
- Use `snake_case` for modules, functions and variables; `PascalCase` for classes and Pydantic
  models; `UPPER_SNAKE_CASE` for constants.
- Use explicit type annotations on public functions and module boundaries.
- Use `Decimal` for kilogram values, `date` for calendar days and timezone-aware datetimes for
  instants.
- Keep HTTP schemas separate from persistence models. Do not return SQLAlchemy models directly.
- Use UUID primary keys and follow the names and relationships in `DATA-MODEL.md`.
- Do not commit secrets or environment-specific credentials.

## Discipline rules

Every new backend change has to pass these rules:

1. **Routers do not contain business logic.** They coordinate HTTP input and output only.
2. **Routers do not query PostgreSQL directly.** They call application use cases.
3. **Business logic lives in use cases or services.** It is not hidden in routers or ORM models.
4. **Repositories encapsulate database access.** SQLAlchemy and PostgreSQL details stay there.
5. **The domain does not depend on FastAPI.**
6. **Operations that modify multiple tables use one transaction.** The transaction belongs to the
   application operation, not to an individual repository method.
7. **Every user-owned query is scoped to the authenticated user.** Never trust a client-provided
   owner ID.
8. **Alembic migrations are the only way to change the schema.** Do not modify tables at startup.
9. **Important constraints belong in PostgreSQL, not only in Python.**
10. **Modules do not import another module's internals or access its tables directly.**
11. **Confirmed sets are persisted immediately** (D41); do not wait for session completion.
12. **Catalog endpoints are read-only for users.** Catalog changes use the import or maintenance
    workflow.
13. **Behaviour changes update documentation in the same pull request.**

## Errors

Domain errors do not depend on FastAPI or HTTP. The HTTP boundary maps them to a consistent response:

```json
{
  "error": {
    "code": "routine_not_found",
    "message": "La rutina no existe."
  }
}
```

Use `401` for authentication, `403` for authorization, `404` for missing resources, `409` for
business conflicts, `422` for invalid input and `500` for unexpected failures. Never expose SQL,
stack traces or internal details to the client.

## Transactions and model rules

- Creating a weekly training and its seven days is atomic.
- Creating a routine and its exercises is atomic.
- Reordering rows with a uniqueness constraint happens inside a transaction.
- `routine_session.routine_name` is a historical snapshot.
- `ended_at` is null while a session is in progress; duration is calculated, not stored.
- Progress and previous-session values are queries over recorded sets, not duplicated summaries.
- Add the agreed restrictions for `routine_session` and the relevant `position` columns before the
  first migration, then update `DATA-MODEL.md` and `DATA-MODEL-EXPLAINED.md`.

## About tests

An agent never creates or edits tests unless a developer explicitly asks for it. When tests are
requested, prioritize business rules, ownership and authorization, transaction boundaries,
repositories, error mapping, endpoints consumed by mobile, migrations and catalog import
idempotency.
