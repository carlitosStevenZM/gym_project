# apps

One folder per deployable application. Each one owns its code, its `AGENTS.md` and its `docs/`.

| App | What it is | Stack |
|---|---|---|
| [`mobile/`](mobile/) | The client, the app people actually use | React Native + Expo (SRS §2.5) |
| [`backend/`](backend/) | The API and the only thing that talks to the database | FastAPI, PostgreSQL (D37, D38) |

**The rule:** whatever is true for only one app lives inside that app. Architecture, layers,
discipline rules, dependency and tooling conventions, testing. Whatever is shared stays at the root.
The split is set in [`../AGENTS.md`](../AGENTS.md) under "Monorepo scoping".

New apps land here, flat, beside these two.
