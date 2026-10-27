# AGENTS.md (mobile)

The React Native + Expo client. This file covers **this app only**. For the product definition, the
data model and the rules that apply to the whole repo, read [`../../AGENTS.md`](../../AGENTS.md)
first.

**Current state: no code yet.** The architecture below is decided and written; nothing implements it
so far. When the first code lands, this file stops describing a plan and starts describing reality.

## Authority order

1. The root rules in [`../../AGENTS.md`](../../AGENTS.md), and through it the SRS and the data model
2. This file, for anything specific to the client
3. Existing code, which is **evidence, not specification**

## Read when the task touches it

- [`docs/agents/architecture.md`](docs/agents/architecture.md) — the layers, which way they depend, and why
- [`docs/agents/development-rules.md`](docs/agents/development-rules.md) — tooling, TypeScript, lint, naming
- [`docs/agents/anti-patterns.md`](docs/agents/anti-patterns.md) — the named wrong shapes, one per rule below

## The stack, settled

| | |
|---|---|
| Framework | Expo 58, Expo Router with **NativeTabs** |
| Language | TypeScript, `strict` plus `noUncheckedIndexedAccess` |
| Server state | TanStack Query |
| Client state | React Context by scope. Zustand only where the exits are countable |
| API types | Generated from the backend's OpenAPI, committed |
| Validation | Zod at the edge of every response |
| Styling | `StyleSheet` with own tokens |
| Forms | react-hook-form with `zodResolver` |
| Texts | i18next |
| E2E | Maestro, against mocks |

## Discipline rules

Numbered so a review can point at one. Every new piece of code has to pass all of them.

1. **`screens/` never calls the API.** No `fetch`, no query keys, no URLs. It goes through
   `domain/`. A screen that talks to the network is the one mistake that makes everything else here
   pointless.
2. **A `domain/` module is only imported through its `index.ts`.** Reaching into its internals is a
   seam violation, and it is visible in the import line.
3. **Server state belongs to TanStack Query and is never copied** into a Context or a store. One
   copy, one owner.
4. **A Provider is mounted in the `_layout` of the lowest route that needs it.** Auth is the only
   one at the root, because it is genuinely global. A Provider at the root never unmounts, which
   throws away the reason to use Context in the first place.
5. **Every context hook guards.** It throws if its Provider is missing, so misuse fails loudly
   instead of returning `undefined`.
6. **A Zustand store needs countable exits.** Its file opens with a comment stating its scope, who
   clears it and when. No comment, no store.
7. **Every API response is parsed with Zod at the edge.** The HTTP wrapper returns `unknown`; the
   schema is what produces the type. A type assertion on a network response is a lie.
8. **API types are generated, never written by hand** (`yarn api:types`).
9. **No `any`.** It is a lint error. If something truly needs it, the line carries a comment saying
   why.
10. **No literal user-facing strings in JSX.** They go through i18next.
11. **Comments are the exception.** Default to none, and never one that restates what the line
    does. A comment is for what the code cannot say: a constraint, a workaround and its reason, a
    decision reference. Long blocks need a real justification, and "this is complicated" is a
    request to split the code, not to narrate it.
12. **Atomise for reading, not for line count.** Fewer lines is not the goal; being understood at a
    glance is. Splitting into small, well named pieces is worth the extra lines every time, and it
    is what makes rule 11 possible.

## About tests

Covered by a rule at the root and repeated here because this is where it bites: **an agent never
creates or edits a test on its own.** Not a Maestro flow, not an integration test. It may write one
when a developer explicitly asks, following the rules in place. If a change breaks an existing test,
the agent reports which one and why, and the developer decides. Nothing obliges a flow to exist; the
developer decides what is worth testing.

Integration testing is deliberately undefined for now. Don't invent a convention for it.
