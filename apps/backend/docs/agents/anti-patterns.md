# Anti-patterns

Named shapes that are wrong in this backend. The point of giving them a name is that a review can
say "this is a fat router" and both people know what is wrong, what the fix is and which rule it
breaks.

Each one is the reverse of a rule in [`../../AGENTS.md`](../../AGENTS.md). The module boundaries
and dependency direction are described in [`architecture.md`](architecture.md).

## Fat router

A router that validates business conditions, queries the database and decides what the operation
means instead of coordinating HTTP input and output.

```python
@router.post("/routines")
async def create_routine(payload: RoutineCreate, db: AsyncSession):
    routine = Routine(name=payload.name)
    db.add(routine)
    await db.commit()
    return routine
```

**Why it hurts.** The use case cannot be reused outside HTTP, the transaction is hidden in the
transport layer, and business rules become difficult to find or change.

**Fix.** Map the request into an application command, call the use case and map its result or
domain error back to HTTP.

Breaks **[rule 1](../../AGENTS.md#discipline-rules)**.

## SQL router

A router that obtains an `AsyncSession`, builds a SQLAlchemy query or reads a table directly.

```python
@router.get("/routines/{routine_id}")
async def get_routine(routine_id: UUID, db: AsyncSession):
    result = await db.execute(select(Routine).where(Routine.id == routine_id))
    return result.scalar_one()
```

**Why it hurts.** Database details spread through the API, ownership checks become easy to forget,
and changing persistence affects every endpoint that wrote its own query.

**Fix.** Call an application use case. The use case depends on a repository interface, and the
infrastructure adapter owns SQLAlchemy.

Breaks **[rule 2](../../AGENTS.md#discipline-rules)**.

## Hidden business rule

A rule that lives only in an ORM model, a router or a serializer because it was convenient there.

```python
class RoutineSession(Base):
    def finish(self):
        self.ended_at = datetime.now(timezone.utc)
```

**Why it hurts.** The rule is coupled to one persistence shape and can be bypassed by another use
case, import or background operation.

**Fix.** Put the behaviour in a domain object or application service that can be called without
FastAPI or SQLAlchemy. Keep structural constraints in PostgreSQL.

Breaks **[rule 3](../../AGENTS.md#discipline-rules)**.

## Repository-shaped use case

A use case whose only job is to expose methods that mirror a table, with no application operation
or business meaning.

```python
async def create_routine(repository: RoutineRepository, routine: Routine) -> Routine:
    return await repository.add(routine)
```

**Why it hurts.** The application layer becomes a pass-through and callers start depending on
persistence details. Multi-table operations and transaction boundaries then have nowhere to live.

**Fix.** Make the use case express an operation such as `create_routine_with_exercises` or
`start_session`, and let repositories provide persistence capabilities behind it.

Breaks **[rule 4](../../AGENTS.md#discipline-rules)**.

## Framework-shaped domain

A domain rule that imports FastAPI, SQLAlchemy, Pydantic or an HTTP exception.

```python
from fastapi import HTTPException

def finish_session(session):
    if session.ended_at is not None:
        raise HTTPException(status_code=409, detail="Already finished")
```

**Why it hurts.** The domain cannot run independently, and the same rule cannot be reused by a
different adapter without importing the web framework.

**Fix.** Raise a domain error such as `SessionAlreadyFinishedError`. Let the HTTP boundary map it
to `409` and the Spanish response contract.

Breaks **[rule 5](../../AGENTS.md#discipline-rules)**.

## Split transaction

A multi-table operation that commits once per repository call.

```python
await routine_repository.create(routine)          # commits
await routine_repository.add_exercises(exercises) # commits again
```

**Why it hurts.** A failure halfway through leaves a routine without its exercises or a weekly
training without all seven days.

**Fix.** Let the application use case own one transaction and commit only after the complete
operation succeeds. Reordering `position` values also belongs inside that transaction.

Breaks **[rule 6](../../AGENTS.md#discipline-rules)**.

## Floating owner

A query that accepts a `user_id` from the request and uses it as the authority for ownership.

```python
@router.get("/sessions")
async def list_sessions(user_id: UUID, current_user: CurrentUser):
    return await sessions.list_for_user(user_id)
```

**Why it hurts.** A client can replace the ID and read another user's routines, sessions or
progress.

**Fix.** Derive the owner from the authenticated identity and apply it in every user-owned query.
Ignore or reject client-provided owner IDs.

Breaks **[rule 7](../../AGENTS.md#discipline-rules)**.

## Startup migration

A startup hook that creates, alters or repairs tables when the application boots.

```python
@app.on_event("startup")
async def create_tables(engine):
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
```

**Why it hurts.** Schema changes become implicit, cannot be reviewed or rolled back as migrations,
and multiple instances may race at startup.

**Fix.** Create an Alembic migration and run migrations as a separate deployment step.

Breaks **[rule 8](../../AGENTS.md#discipline-rules)**.

## Python-only invariant

A critical rule is checked in application code but has no database constraint.

```python
if not await repository.exists_position(routine_id, position):
    await repository.insert_exercise(item)
```

**Why it hurts.** Two requests can pass the check concurrently and leave invalid state in the
database.

**Fix.** Enforce structural rules in PostgreSQL: one session per user and day, unique `position`
within its collection, and unique `set_number` within an exercise record. Translate constraint
violations into the appropriate domain conflict.

Breaks **[rule 9](../../AGENTS.md#discipline-rules)**.

## Table trespass

A module imports another module's SQLAlchemy model or repository and queries its tables directly.

```python
from modules.planning.infrastructure.models import RoutineExercise

async def start_session(...):
    exercises = await db.execute(select(RoutineExercise))
```

**Why it hurts.** The foreign key becomes an accidental public API. The owning module can no longer
change its persistence model without breaking unrelated code.

**Fix.** Call the owning module's public application interface and exchange domain or application
DTOs rather than ORM models.

Breaks **[rule 10](../../AGENTS.md#discipline-rules)**.

## Buffered set

A confirmed set is kept in memory and sent only when the user finishes the workout.

```python
session.pending_sets.append(set_input)

async def finish_session(...):
    await api.save_all(session.pending_sets)
```

**Why it hurts.** Force-quitting the app or losing power erases confirmed work.

**Fix.** Persist each confirmed set immediately. The session may remain open with `ended_at = NULL`
without making completion a prerequisite for saving data.

Breaks **[rule 11](../../AGENTS.md#discipline-rules)**.

## Editable catalog

A user-facing endpoint that creates, renames, deletes or otherwise mutates catalog rows.

```python
@router.delete("/exercises/{exercise_id}")
async def delete_exercise(exercise_id: UUID, current_user: CurrentUser):
    await catalog.delete(exercise_id)
```

**Why it hurts.** The catalog is global and shared. One user's change would alter exercise identity
and navigation for every user, and could damage historical progress.

**Fix.** Keep catalog endpoints read-only for users. Catalog changes go through the import or an
explicit maintenance workflow.

Breaks **[rule 12](../../AGENTS.md#discipline-rules)**.

## Undocumented contract

A change to endpoint behaviour, persistence rules or user-visible behaviour that ships without
updating the documentation that defines it.

```python
# The endpoint now allows two sessions on the same day,
# but SRS.md and DATA-MODEL.md still say one.
```

**Why it hurts.** The next feature is built against a false contract. The implementation, SRS and
model then disagree.

**Fix.** Update the relevant SRS decision, data-model constraint and backend documentation in the
same pull request.

Breaks **[rule 13](../../AGENTS.md#discipline-rules)**.
