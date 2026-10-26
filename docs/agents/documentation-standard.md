# Documentation standard

How to write a document that describes how a part of this product works. It applies to both apps.

This is the **how**. [`../AGENT-DOCS-GUIDE.md`](../AGENT-DOCS-GUIDE.md) is the **what**: which kinds
of document exist and what each one is for. They do not overlap, and this one assumes that one.

> **Not yet in force.** Everything below turns on verifying claims against the code, and there is no
> code yet. Until there is, this is the shape the first feature document has to take, not a rule
> anyone is breaking.

## What a document like this is

A document that answers **how does this part of the app work today**, for someone who needs to
change it. It is not a plan, not an analysis, not a record of what was considered. Those are other
things and they live elsewhere: the *why* is in the SRS decision table, and the history is in
`DISCOVERY.md`.

Not everything needs one. A document earns its place when the knowledge is hard to rebuild by
reading the code: a mechanism spread across ten files, a contract with the other app, a behaviour
that depends on something you cannot see from the file you are in. If someone finds it in thirty
seconds by opening a file, don't write it.

## Where it goes

| It is true for | It goes in |
|---|---|
| One app | `apps/<app>/docs/<area>/<topic>.md` |
| Both apps | `docs/<area>/<topic>.md` |

Normative documents, the ones stating what new code has to comply with, go in the `agents/` folder
of either, which is where this file is.

## Ground rules

1. **Document reality, not intentions.** Present tense. How it works *now*, not how it used to, not
   how someone planned to change it, not the options that were weighed.
2. **The implementation is the source of truth, not the document.** When the two disagree, the code
   wins and the document gets fixed. That includes what materially decides the behaviour from
   outside the file: environment, config, and the backend contract. When a behaviour branches on one
   of those, say where that decision lives instead of re-documenting it.
3. **You own correctness.** Every claim has to be something you verified. If you are not sure a
   sentence is true, open the code and confirm it, or leave it out. Cite as `path/to/file.tsx:120`
   so a reader can check you.
4. **This is not a fix task.** You are documenting, not changing behaviour. If you notice something
   that looks like a bug, write one line under **Known caveats** and move on. Documenting a wart is
   correct; fixing it belongs in its own change.
5. **Preserve constraints, not archaeology.** Don't keep the story of how something was decided. But
   if a current behaviour is deliberate and removing it would cause a regression, capture that in
   one line under **Design constraints**. Only the few that genuinely protect a rule.
6. **English, no emojis in headings.** Concise beats exhaustive: a document that gets read beats one
   that is complete. User-facing strings stay Spanish, as everywhere else.
7. **Name the file after the thing, not the activity.** `rest-timer.md`, not
   `rest-timer-implementation-plan.md`. The name is a promise about what is inside.
8. **It ships in the same pull request as the code it describes.** Already a rule at the root, and
   this is where it is enforced: a behaviour change without its document is incomplete.

## The header

Every document carries three lines, and they are what makes it trustworthy rather than merely
written.

```
Status: Current
Last verified: 2026-11-04 against main@a1b2c3d
Source of truth: `src/domain/session/api.ts:44`
```

`Last verified` is the honest one. It does not claim the document is correct today, it says when
somebody last checked and against what. A reader can then decide how much to trust it, and whoever
updates the code knows what they are invalidating.

## Writing one

1. **Read the code** the document is about, including whatever decides the behaviour from outside it.
2. **Copy [`_template.md`](_template.md)** into place and fill it in, deleting the guidance comments.
3. **Verify every claim.** The code is the tie-breaker, always.
4. **Fill the header**, with the real branch and commit you checked against.
5. **Link it** from the `README.md` of its folder, so it is reachable without knowing it exists.
6. **Sanity check:** could someone new trust this as the source of truth? Is every sentence something
   you actually confirmed?

## Done means

- The document describes current behaviour, in present tense, and every claim was verified.
- `Status`, `Last verified` and `Source of truth` are filled in with real values.
- Any constraint worth preserving is one line under **Design constraints**.
- It is listed in its folder's `README.md`.
- It travels in the same pull request as the code it describes.
