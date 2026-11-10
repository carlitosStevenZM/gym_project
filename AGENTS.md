# AGENTS.md

Monorepo for a gym routine and progress tracking app. **FastAPI** backend, **React Native + Expo**
mobile client, one shared PostgreSQL database.

This file is an **index and a contract**, not a manual. Read the document that applies to your task.
`CLAUDE.md` is a symlink to this file.

**Current state: the client has its design system and its first screen, the backend does not
exist.** `apps/mobile` is an Expo 58 project that starts in Expo Go with a full interface layer —
tokens generated from the design system's export and the shared components built on them — plus
the **Hoy** screen composed on top of a fixture. The other four screens are placeholders and there
is no business logic. `apps/backend` is still empty.

## Authority order

When two sources disagree:

1. `requirements/SRS.md` wins on **what** the product does, and its §4 table is the decision log
2. `requirements/DATA-MODEL.md` wins on **how data is stored**
3. `design-system/` wins on **how it looks and behaves**, and its `DECISIONS.md` is that log (D50)
4. `apps/<app>/AGENTS.md` wins on anything specific to that app
5. Existing code, which is **evidence, not specification**

`requirements/DISCOVERY.md` never wins anything. It is a frozen archive of how the decisions were
reached, kept for the *why*, and it is never updated backwards.

If you find a contradiction, fix the lower-priority source to match the higher one. Don't report it
and carry on.

## Read first

- `requirements/SRS.md` — glossary (§3), the numbered decisions (§4), requirements, scope
- `requirements/DATA-MODEL.md` — tables, keys, constraints, indexes
- `design-system/README.md` — the brand book, and the index to colour, type, layout and the rest

## Read when the task touches it

- `requirements/DATA-MODEL-EXPLAINED.md` — the same model in prose, no SQL *(Spanish)*
- `requirements/DISCOVERY.md` — why something was decided *(Spanish)*
- `requirements/assets/prototype.html` — the 18 screens. The reference for **what is on** each one;
  how it looks is the design system's (D47)
- `design-system/tokens.json` — every value in the interface. Changing one here is the only way
- `docs/agents/git-workflow.md` — branches, pull requests, commit convention, how a change gets in
- `docs/agents/documentation-standard.md` — how to write a document, and the template to copy
- `docs/` — development-cycle documentation that is true for the whole repo
- `apps/<app>/AGENTS.md` and `apps/<app>/docs/` — everything that is true for one app only

## Rules we actually follow

- **A new decision goes into the SRS §4 table**, numbered, with its origin, plus a line in the §13
  changelog. Not into a comment, not into a commit message. A decision about **how the product
  looks** goes into `design-system/DECISIONS.md` instead, numbered `DS`; if it also changes what
  the product does, it goes in both and says so.
- **Documentation ships in the same commit as the code it describes.** A behaviour change without
  its doc update is incomplete.
- **`DATA-MODEL-EXPLAINED.md` moves with `DATA-MODEL.md`.** Two documents about the same model; if
  one lags it is worse than not having it.
- **An agent never creates or edits a test on its own.** Not unit, not integration, not E2E. It
  writes one when a developer explicitly asks, following the rules in place; otherwise it may
  recommend one and stop there. If a change breaks an existing test, it reports which one and why,
  and **the developer decides**. A test an agent repaired to make its own work pass is worse than no
  test at all.
- **Discovered an unwritten rule?** Write it down in the same PR.
- The product ships in **Spanish only** (SRS · NF-4). Code, identifiers and most docs are in
  English; the two documents marked *(Spanish)* above are deliberately not, because of who reads them.

## Monorepo scoping

The backend and the mobile client share the domain and nothing else. One folder per app under
`apps/`, flat, and new apps land beside them (D40).

- **Shared, and stays at the root:** the glossary, the decision log, the data model, the design
  system, the git workflow, this file, and `docs/` for whatever is true of the whole repo.
- **Per app, in its own `AGENTS.md` and its own `docs/` next to its code:** architecture and layers,
  discipline rules, dependency and tooling conventions, testing.

Don't write one architecture document covering both. They have different layers, different
conventions and different failure modes.

| App | Its rules |
|---|---|
| Client | [`apps/mobile/AGENTS.md`](apps/mobile/AGENTS.md) |
| Backend | [`apps/backend/AGENTS.md`](apps/backend/AGENTS.md) |

The design system is at the root even though only the client renders anything today. It is
product definition — brand, voice, principles, the values themselves — in the same category as
the SRS, and the day a second client exists it reads the same `tokens.json`. What is specific to
React Native lives with the client, in
[`apps/mobile/docs/agents/design-system.md`](apps/mobile/docs/agents/design-system.md).
