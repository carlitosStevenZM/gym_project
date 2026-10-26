# gym_project

A mobile app for logging gym routines and tracking progress: build your routines, see what you are
training today, log every set, and watch your max weight move over time.

Monorepo. **FastAPI** backend, **React Native + Expo** client, one shared PostgreSQL database.
The product ships in Spanish.

## Where things are

```
apps/
  mobile/        the React Native + Expo client
  backend/       the FastAPI service
requirements/    what to build, how it is stored, and where it came from
docs/            documentation that is true for the whole repo
AGENTS.md        index and authority order, for agents and for people
```

Each app carries its own `AGENTS.md` and its own `docs/`, beside its code. The root keeps only what
both of them share.

No application code yet. The requirements phase is closed.

## Start here

| If you want to | Open |
|---|---|
| Know what the product does | [`requirements/SRS.md`](requirements/SRS.md) |
| Build against the database | [`requirements/DATA-MODEL.md`](requirements/DATA-MODEL.md) |
| Understand the model without SQL | [`requirements/DATA-MODEL-EXPLAINED.md`](requirements/DATA-MODEL-EXPLAINED.md) |
| Know why something was decided | [`requirements/DISCOVERY.md`](requirements/DISCOVERY.md) |
| See the screens | [`requirements/assets/prototype.html`](requirements/assets/prototype.html) |
| Work on the client | [`apps/mobile/AGENTS.md`](apps/mobile/AGENTS.md) |
| Work on the backend | [`apps/backend/AGENTS.md`](apps/backend/AGENTS.md) |
| Work in this repo with an agent | [`AGENTS.md`](AGENTS.md) |

The decisions that govern everything are in the SRS, §4, numbered D1 to D40.
