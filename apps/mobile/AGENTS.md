# AGENTS.md (mobile)

The React Native + Expo client. This file covers **this app only**. For the product definition, the
data model and the rules that apply to the whole repo, read [`../../AGENTS.md`](../../AGENTS.md)
first.

**Current state: no code yet.** The folder exists, the architecture does not. Nothing below
describes code that is already here.

## Authority order

1. The root rules in [`../../AGENTS.md`](../../AGENTS.md), and through it the SRS and the data model
2. This file, for anything specific to the client
3. Existing code, which is **evidence, not specification**

## What this app owns

- Every screen in [`../../requirements/assets/prototype.html`](../../requirements/assets/prototype.html),
  whose notes panel cites the decisions that govern each one
- The user-facing strings, in Spanish and only Spanish (SRS · NF-4)
- Nothing about storage. The database belongs to the backend, and
  [`../../requirements/DATA-MODEL.md`](../../requirements/DATA-MODEL.md) is the contract both sides read

## Architecture

Not decided yet. When it is, it goes here: the layers, the direction they depend in, and a numbered
list of discipline rules that new code has to pass, each one pointing at the decision behind it.

Until then there is nothing to follow, so don't infer an architecture from whatever lands first.
A repo teaches by example even when nobody meant to write a rule.

## Conventions

Not decided yet either: package manager, formatter, linter, line length, how strict TypeScript is,
what needs a test. The commit that sets the project up settles them, and writes them here in that
same commit.
