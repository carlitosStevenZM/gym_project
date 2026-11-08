# Architecture

How the backend is divided into modules, which way dependencies point, and why the boundaries are
there. The short, always-loaded version of this lives in [`../../AGENTS.md`](../../AGENTS.md); this
document contains the reasoning behind it.

## The shape

The backend is a **modular monolith**: one FastAPI application, one deployable unit and one
PostgreSQL database.

```text
apps/backend/
├── app/
│   ├── main.py                  application composition and startup
│   └── modules/
│       ├── account/
│       ├── catalog/
│       ├── planning/
│       ├── training/
│       └── history/
├── migrations/                  Alembic migrations
└── pyproject.toml
```

Each module owns one business boundary. When the module is large enough, its internal shape is:

```text
module/
├── api/                         routers, dependencies and HTTP schemas
├── application/                 use cases and transaction orchestration
├── domain/                      rules, concepts and domain errors
└── infrastructure/              repositories, SQLAlchemy and integrations
```

Small modules may omit an empty layer, but they may not move that layer's responsibility into an
unrelated one. There is no shared folder for gym-specific behaviour. Shared code must be generic
and have no knowledge of routines, sessions or exercises.

## The modules

The data model's zones are the starting point for the boundaries. They are not just visual groups:
they identify who owns a row and which part of the product changes it.

### `account`

Owns:

- `app_user`
- `auth_identity`
- `password_reset_token`
- `user_settings`

It authenticates users and provides the authenticated user identity to the rest of the application.
Other modules may use that identity, but they do not modify account tables directly.

### `catalog`

Owns:

- `muscle_group`
- `muscle_subgroup`
- `equipment`
- `exercise`

The catalog is global and read-only for users. Its import and maintenance workflows are separate
from user-owned routine and training operations. `exercise` is the bridge that Plan and Reality
share, but neither module owns or edits catalog rows.

### `planning`

Owns:

- `weekly_training`
- `weekly_training_day`
- `routine`
- `routine_exercise`

It represents what the user intends to train: routines, their ordered exercises and the weekly
calendar. Creating a weekly training includes creating its seven days in the same transaction.

### `training`

Owns:

- `routine_session`
- `exercise_record`
- `exercise_set`

It represents what the user actually trained. A session starts with `ended_at = NULL`, and every
confirmed set is persisted immediately (D41). This is the highest-frequency write path and must stay
short and transactional.

### `history`

`history` is initially a query module, not a table owner. It exposes read operations such as session
history, exercise history and progress by combining data owned by `training`, `planning` and
`catalog`.

It must not copy mutable history into its own tables merely to make a query convenient. If a future
read model is needed for performance, that is a separate decision with an explicit consistency
contract.

## Which way dependencies point

```text
HTTP request
    ↓
API/router
    ↓
Application/use case ─────→ domain rules
    ↓
Repository interface
    ↓
Infrastructure adapter ───→ SQLAlchemy/asyncpg ───→ PostgreSQL
```

More precisely:

- `api/` depends on `application/` and translates HTTP input and output.
- `application/` coordinates use cases, transactions and calls to module interfaces.
- `domain/` contains rules that must work without FastAPI or PostgreSQL.
- `infrastructure/` implements persistence interfaces and contains SQLAlchemy-specific code.
- A module may call another module only through its public application interface, never through its
  internal files or tables.
- The direction of a dependency is not changed just because two modules have a foreign key between
  their tables.

The database is a shared physical resource, but ownership is logical: a repository may query the
tables it owns. Cross-module reads go through a module interface or an explicitly defined query
boundary. This prevents the database schema from becoming the only API between modules.

## Communication between modules

Communication is initially an in-process function or interface call. It is not an HTTP request,
message-bus event or direct SQL query into another module.

| Caller | Callee | Why | Frequency and constraint |
|---|---|---|---|
| Any user module | `account` | authenticated user identity | frequent; keep authentication dependencies lightweight |
| `planning` | `catalog` | validate and display selected exercises | frequent reads; catalog remains read-only |
| `training` | `planning` | start a session from a routine | frequent enough to keep in-process |
| `training` | `catalog` | resolve exercise identity and metadata | frequent reads; do not duplicate catalog ownership |
| `history` | `training` | sessions, records and sets | read-heavy; queries must remain user-scoped |
| `history` | `planning` / `catalog` | routine labels and exercise information | read-heavy; no direct table ownership |

Communication frequency is one boundary criterion, not the only one. Data ownership, transaction
boundaries and consistency requirements matter just as much.

## Transactions and consistency

Transactions belong to application use cases, not individual repository methods. A use case that
changes several tables commits or rolls back as one operation.

Examples:

- Creating a routine and its `routine_exercise` rows is atomic.
- Creating a weekly training and its seven days is atomic.
- Starting a session and creating its initial records is atomic when both happen in one operation.
- Confirming a set commits immediately; it must not wait for the workout to finish.
- Reordering `position` values happens inside a transaction that preserves the relevant uniqueness
  constraints.

If extracting a module would require a distributed transaction for a high-frequency operation, that
is evidence to keep the modules together until the consistency requirement changes.

## Public module boundaries

Modules expose business operations, not their tables or private classes.

Examples of public operations:

```text
planning.create_routine()
planning.assign_routine_to_day()
training.start_session()
training.record_set()
training.finish_session()
catalog.list_exercises()
history.get_exercise_history()
```

The public interface should use domain or application DTOs, not SQLAlchemy models. Internal imports
such as `planning.infrastructure.models` from `training` are boundary violations.

## Why a modular monolith

The project needs one API, one database and immediate persistence while a user logs sets. Starting
with microservices would add network failures, distributed authentication, independent deployments
and cross-service consistency before the product needs them.

The monolith still preserves future options. A module can be extracted later when it has:

- a clear owner for its data;
- a stable public interface;
- no dependence on another module's private implementation;
- communication that tolerates network latency and failure;
- an independent scaling or deployment need.

`catalog` is the most natural future extraction candidate because it is global and mostly read-only.
`training` is less suitable initially because it has the highest write frequency and the strongest
consistency requirements.

## Boundaries and the data model

Use [`../../../../requirements/assets/data-model.html`](../../../../requirements/assets/data-model.html)
to inspect the visual relationships and [`../../../../requirements/DATA-MODEL.md`](../../../../requirements/DATA-MODEL.md)
for the authoritative constraints.

Before adding a table or moving a rule, answer:

1. Which module owns the row?
2. Which module owns the rule that validates it?
3. Which operations must change it atomically?
4. Which modules read it, and how often?
5. Is the read allowed through a public interface rather than a direct table query?
6. Would extracting this module require a distributed transaction?

If those answers are unclear, settle the boundary before adding code. Do not let a convenient join or
an easy import silently create a dependency between module internals.
