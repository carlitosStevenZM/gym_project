# docs

**Development-cycle documentation**: whatever comes up while building the app and while it stays alive.

Things that belong here pass one test: **they are true for the whole repo, not for one app.**

## agents/

The **normative** layer: what everyone has to comply with, regardless of which app they are in.

| File | |
|---|---|
| [`agents/git-workflow.md`](agents/git-workflow.md) | **How a change gets into `main`**: branches, pull requests and the one approval they need, commit convention, and the renumbering rule for when two PRs both want the next decision number |
| [`agents/documentation-standard.md`](agents/documentation-standard.md) | **How to write a document** that describes how a part of the product works: the ground rules, the header that makes it trustworthy, and what done means |
| [`agents/_template.md`](agents/_template.md) | The skeleton to copy when writing one |

## Guides

| File | |
|---|---|
| [`AGENT-DOCS-GUIDE.md`](AGENT-DOCS-GUIDE.md) | **Conceptual** guide on documenting a backend so agents can work in it: the documentation layers and their authority order, which documents actually carry weight (glossary, ADRs, discipline rules, named anti-patterns), and what is worth having from the first commit. It prescribes no content: the architecture and the rules are ours to decide. *In Spanish, on purpose: it is written for Carlos* |

It is the **what** and `agents/documentation-standard.md` is the **how**. They are different layers
and neither repeats the other.

## What else belongs here

- Running the monorepo as a whole
- Setup and decisions that cross both apps
- Documents describing a mechanism shared by both, written to the standard above

**What does NOT belong here**, and there are two kinds:

- The product and requirements definition. That lives in [`../requirements/`](../requirements/) and is kept separate on purpose, so this folder doesn't fill up with product decision-making.
- Anything true for a single app. Its architecture, layers, conventions and testing live beside its code, in `apps/<app>/AGENTS.md` and `apps/<app>/docs/`. That split is set in [`../AGENTS.md`](../AGENTS.md) under "Monorepo scoping".

| If you're looking for | It's in |
|---|---|
| What to build | [`../requirements/SRS.md`](../requirements/SRS.md) |
| How it's stored | [`../requirements/DATA-MODEL.md`](../requirements/DATA-MODEL.md) |
| Why it was decided that way | [`../requirements/DISCOVERY.md`](../requirements/DISCOVERY.md) |
| The numbered decisions | `SRS.md` §4 |
| How to work inside one app | `apps/<app>/AGENTS.md` |
