# Development rules

The conventions that are easiest to get wrong when nobody writes them down. The architecture is in
[`architecture.md`](architecture.md), and the short rules loaded by every agent are in
[`../../AGENTS.md`](../../AGENTS.md).

## Tooling

| | |
|---|---|
| Dependency manager | **uv** |
| Formatter | **Ruff format** |
| Lint | **Ruff check** |
| Type checking | **Pyright** |
| Database migrations | **Alembic** |
| Test runner | **pytest**, when a developer explicitly requests tests |

Ruff is the single formatter and linter. Do not add Black, isort or mypy alongside the settled
tooling. Lock dependencies with `uv.lock` and use `uv run` for project commands so local and CI
environments execute the same tool versions.

## Python

- Target **Python 3.12** and use modern built-in generics and union syntax.
- Public functions and module boundaries have explicit type annotations.
- Use `Decimal` for kilogram values, `date` for calendar days and timezone-aware datetimes for
  instants.
- Use Pydantic v2 models at the HTTP boundary. HTTP schemas and SQLAlchemy persistence models are
  separate types; never return an ORM model directly from a router.
- Use UUID primary keys and the names and relationships defined by `DATA-MODEL.md`.
- Do not use `Any` to silence Pyright. If an external library genuinely requires an escape hatch,
  keep it narrow and explain why at the boundary.

## Imports and module boundaries

The dependency direction is:

```text
api → application → domain
                 ↓
          infrastructure → SQLAlchemy/asyncpg → PostgreSQL
```

- A module imports another module only through its public application interface.
- Do not import another module's routers, repositories, ORM models or private helpers.
- The domain does not import FastAPI, Pydantic, SQLAlchemy or HTTP exceptions.
- Keep generic shared code free of gym-specific concepts. If code belongs to one business boundary,
  keep it in that module.
- Routers translate HTTP input and output; use cases coordinate operations; repositories own database
  access.

The full layer responsibilities and module ownership are in [`architecture.md`](architecture.md).

## HTTP and errors

- Validate request data at the API boundary with Pydantic.
- Domain errors are framework-independent. The HTTP boundary maps them to the common error contract:

  ```json
  {
    "error": {
      "code": "routine_not_found",
      "message": "La rutina no existe."
    }
  }
  ```

- Use `401` for authentication, `403` for authorization, `404` for missing resources, `409` for
  business conflicts, `422` for invalid input and `500` for unexpected failures.
- Never expose SQL, stack traces or internal implementation details to the client.
- User-facing messages are Spanish. Code identifiers, error codes and database names are English.

## Database and migrations

- Alembic migrations are the only way to change the schema. Never create or alter tables at startup.
- Important invariants are enforced in PostgreSQL as well as in application code.
- A use case owns the transaction when an operation changes multiple tables. Repository methods do
  not commit independently.
- Every query over user-owned data is scoped to the authenticated user; never trust an owner ID from
  the client.
- Confirmed sets are persisted immediately. Do not buffer them until a session is finished.
- Catalog endpoints are read-only for users. Catalog changes use the import or maintenance workflow.
- Do not commit secrets, credentials or environment-specific configuration.

## Code a human can scan

**Default to no comments.** A comment earns its place only when the code cannot express the reason:
a non-obvious constraint, a workaround and why it exists, or a reference to a product decision.
Comments must not restate the code or narrate a large block. If a block needs a paragraph to explain
it, split it into well-named functions first.

**Atomise for reading, not line count.** A use case should read as a sequence of meaningful business
steps. Extract a function when the description needs “and”, when a comment is needed to introduce a
block, or when the reader must hold too much detail in their head. The goal is code that can be
understood at a glance, not the fewest lines.

## Naming and files

- Modules and files: `snake_case.py`.
- Functions and variables: `snake_case`.
- Classes, domain errors and Pydantic models: `PascalCase`.
- Constants: `UPPER_SNAKE_CASE`.
- Database identifiers follow `DATA-MODEL.md`; do not invent synonyms for domain concepts.
- Identifiers and documentation are in English; user-facing text is in Spanish.

## Tests

An agent never creates or edits tests unless a developer explicitly asks for them. When tests are
requested, follow the existing project configuration and prioritize business rules, ownership and
authorization, transaction boundaries, repositories, error mapping, mobile-facing endpoints,
migrations and catalog-import idempotency.

Behaviour changes update the relevant documentation in the same pull request. Do not add a test or a
new convention merely because this document mentions a possible testing area; the developer decides
what is worth testing.
