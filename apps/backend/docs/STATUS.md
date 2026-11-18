# Backend status

Last updated: 2026-11-17

## Current phase

Backend project bootstrap.

## Completed

- Neon project `gym_project` created.
- Development database `gym_project_dev` created.
- Database connection string saved locally.
- Backend architecture documented as a modular monolith.
- Backend development rules documented.
- Backend anti-patterns documented.
- D45 and D46 references normalized and merged into `main`.
- Created `pyproject.toml`.
- Added the settled backend dependencies.
- Created `uv.lock`.
- Verified the environment with `uv sync`.
- Verified Python, Ruff, Pyright, Pytest and Uvicorn.
- Created `.env.example` with the `DATABASE_URL` placeholder.
- Created `app/main.py`.
- Added and verified the `/health` endpoint.
- Configured Pyright for the local `.venv`.
- Verified Ruff with `uv run ruff check app`.
- Created `app/core/config.py` for environment-based settings.
- Created `app/infrastructure/database.py` for the asynchronous SQLAlchemy engine and sessions.
- Added SQLAlchemy asyncio support with `sqlalchemy[asyncio]`.
- Verified the connection to Neon with `SELECT 1`.
- Added `scripts/check_database.py` to verify the database connection and report the current database and user.
- Understood conceptually how `config.py` loads settings and how `database.py` creates the async engine and sessions.
- Created the SQLAlchemy declarative base at `app/infrastructure/models/base.py`.
- Initialized the Alembic directory and configuration.
- Configured Alembic to use the async database connection and `Base.metadata`.
- Removed the placeholder database URL from `alembic.ini`; the real URL remains in `.env`.
- Added one representative SQLAlchemy model per module: `AppUser`, `MuscleGroup`, `Routine` and
  `RoutineSession`.
- Registered the models through `app/infrastructure/models/__init__.py`.
- Verified the four tables and their mappers with SQLAlchemy.

## Current task

Understand and review the representative SQLAlchemy models before implementing the remaining tables.

## Next tasks

1. Implement the remaining SQLAlchemy models from `DATA-MODEL.md`.
2. Verify the complete model metadata through Alembic.
3. Create the initial Alembic migration.

## Important rules

- Read `apps/backend/AGENTS.md` before working.
- The real Neon connection string belongs only in `.env`.
- Never commit credentials or secrets.
- All schema changes must use Alembic migrations.
- Do not use `Base.metadata.create_all()`.
- Do not create or modify tables manually.
- Do not modify `main` directly.
- One task or unit of work equals one branch.
- Update this file after completing each task.

## Decisions

- The backend uses a modular monolith.
- Initial modules are `account`, `catalog`, `planning`, `training` and `history`.
- The first implementation uses Python 3.12, `uv`, FastAPI, Pydantic v2, SQLAlchemy async, `asyncpg`, Alembic, Ruff and Pyright.
- Neon hosts the shared development PostgreSQL database.

## Blockers

- The initial migration is still pending until all SQLAlchemy models exist.

## Handoff

Four representative models now demonstrate the module structure and are registered in
`Base.metadata`. Review them first, then implement the remaining models before creating the initial
Alembic migration. Update this file after completing each task.
