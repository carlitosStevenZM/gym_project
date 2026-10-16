# requirements

The product definition. Three documents, each with a different job.

| File | What it is | When you read it |
|---|---|---|
| [`SRS.md`](SRS.md) | **What we're building.** Glossary, numbered decisions, domain model, functional and non-functional requirements, scope and release plan | All the time, while writing code |
| [`DATA-MODEL.md`](DATA-MODEL.md) | **How it's stored.** Every table, column, key, constraint and index, plus a Mermaid diagram | When you touch the database |
| [`DATA-MODEL-EXPLAINED.md`](DATA-MODEL-EXPLAINED.md) | **The same model, explained from scratch.** No SQL, a worked example of one training day row by row, and why each shape was chosen. *In Spanish, on purpose: it is written for Carlos* | When onboarding someone, or when you need the reasoning without the syntax |
| [`DISCOVERY.md`](DISCOVERY.md) | **Where it all came from.** The original idea, both rounds of questions with their answers, and the research into existing apps. *In Spanish, on purpose: it quotes the product owner verbatim* | When someone asks *why* something was decided |

**If any two disagree, `SRS.md` wins on *what* and `DATA-MODEL.md` wins on *how it's stored*.** `DATA-MODEL-EXPLAINED.md` explains that same model and has to be updated with it. `DISCOVERY.md` is a historical archive and is never updated backwards.

## assets

| File | What it is |
|---|---|
| [`assets/data-model.html`](assets/data-model.html) | The data model drawn out, grouped by zone, with the relationships as actual lines. Open it in a browser — Mermaid gets vague past a dozen tables |
| [`assets/domain-model-2026-10-15.png`](assets/domain-model-2026-10-15.png) | The diagram drawn in the October 15 meeting. The complete and corrected version lives in `DATA-MODEL.md` |
| [`assets/prototype.html`](assets/prototype.html) | A clickable 18-screen prototype, **in line with the agreed SRS**. Each screen's notes panel cites the decisions that govern it and, where it changed, what was removed from v0 and why. Its UI is in Spanish because the product is (NF-4) |

## Keeping it current

- A new decision goes into the table in **§4 of the SRS**, numbered, with its origin, and gets a line in the changelog in §13.
- If a decision is reversed, fix the row and record the change. The history is not deleted.
- Development documentation — agent guidelines, features, architecture — does not go here. It goes in [`../docs/`](../docs/).
