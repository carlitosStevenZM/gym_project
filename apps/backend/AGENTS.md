# AGENTS.md (backend)

The FastAPI service, and the only thing that talks to PostgreSQL (D37, D38). This file covers
**this app only**. For the product definition, the data model and the rules that apply to the whole
repo, read [`../../AGENTS.md`](../../AGENTS.md) first.

**Current state: no code yet, and this file is a placeholder.** Whoever owns the backend writes the
rest. What is below is the shape and the part that is already settled, not the content.

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

## Still to write

[`../../docs/AGENT-DOCS-GUIDE.md`](../../docs/AGENT-DOCS-GUIDE.md) is about exactly this job and is
in Spanish on purpose. Its §6 lists what is worth having from the first commit. For this file that
means three sections:

- **Architecture:** the layers, the direction they depend in, and a numbered list of discipline
  rules that new code has to pass, each pointing at the decision behind it
- **Conventions:** dependency manager, formatter, line length, typing, what needs a test
- **Decisions:** while one still fits in a table row it goes to SRS §4. A file of its own is for
  when it needs half a page

One open question is waiting in the data model, flagged under `routine_session`: nothing prevents
two sessions on the same date, and it was never discussed. If one per day is the rule, it needs
`unique (user_id, session_date)`. Settle it before the first migration, not after.
