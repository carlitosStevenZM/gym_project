# Architecture

How the client is laid out and which way the dependencies point. The short, always loaded version
of this lives in [`../../AGENTS.md`](../../AGENTS.md); this is the reasoning behind it.

## The shape

```
app/                    routes only, thin files
├── _layout.tsx           AuthProvider lives here
├── login.tsx
├── (tabs)/               NativeTabs: the five sections
│   ├── hoy.tsx
│   ├── rutinas.tsx
│   ├── historial.tsx
│   ├── progreso.tsx
│   └── ajustes.tsx
├── session/
│   ├── _layout.tsx       ActiveSessionProvider lives here
│   └── ...
└── ejercicio/[id].tsx

src/
├── screens/            one folder per screen of the prototype
│   └── active-session/
│       ├── ActiveSessionScreen.tsx
│       ├── components/
│       └── hooks/
├── domain/             one folder per entity, what crosses screens
│   └── session/
│       ├── index.ts      the public interface
│       ├── api.ts        private
│       ├── schemas.ts    private, Zod
│       └── types.ts
└── shared/             generic, knows nothing about the gym
    ├── ui/               Button, Card, tokens
    ├── api/              http wrapper, schema.gen.ts
    ├── i18n/
    └── lib/              dates, formatting
```

## Which way it depends

```
app/  →  screens/  →  domain/  →  shared/
```

Only in that direction, and never back. Concretely:

- `app/` composes a screen and nothing else. If a route file grows past a screenful, something that
  belongs in `screens/` is sitting in the wrong place.
- `screens/` paints and handles interaction. It reads data through `domain/` hooks. **It never
  touches the network.**
- `domain/` owns one entity: its queries, its mutations, its schemas and its types. It is the only
  layer allowed to talk to `shared/api`.
- `shared/` is generic. A file there that mentions a routine, a session or an exercise is in the
  wrong folder.

Two screens never import from each other. If they need the same thing, that thing belongs in
`domain/` or in `shared/`.

## Why `domain/` exists

Screens are not the unit of the product. The active session is touched by three of them: `today`
starts it, `active-session` fills it, `session-saved` closes it. A routine is touched by five. The
catalog, by three.

Group strictly by screen and all of that has to live somewhere else, which in practice means
`shared/` turns into the drawer where half the domain ends up next to the date formatter. `domain/`
is that somewhere, with a name and a boundary.

The boundary is the `index.ts`. What it exports is public; everything else in the folder is
private. That makes the rule checkable: `@/domain/session` is fine, `@/domain/session/api` is a seam
violation you can see in the diff and a linter can forbid.

## Where state lives

Three places, with a line between them that has to stay sharp, because the failure mode is the same
piece of truth existing twice.

**TanStack Query owns everything that comes from the server.** Routines, sessions, history,
progress, user settings. It is never copied into a Context or a store: one copy, one owner. Saving a
set invalidates `['history']` and `['progress']`, and those screens refresh themselves.

**Context owns what dies with a route.** The Provider is mounted in the `_layout` of the lowest
route that needs it, so leaving that route clears the state without anybody remembering to. Auth is
the single exception at the root, because it is genuinely global. Every hook guards and throws when
its Provider is missing.

**Zustand owns what lives as long as the app and whose exits you can count on one hand.** A store is
a module singleton: it sits outside the React tree and nobody tells it when it stops being needed,
so it has to be cleared on purpose. That is fine when the exits are `logout()` or closing the app,
and dangerous when they depend on how you navigated. In V1 there is exactly one: the exercise
catalog, preloaded at startup. It is immutable, shared by every user and never needs clearing, and
keeping it in memory is what makes the exercise picker search instantly with no network.

Every store states its scope, who clears it and when, in a comment at the top of the file.

## The session is on the server

`DATA-MODEL.md` settles this and it shapes the whole client: a session is created when training
starts and carries `ended_at = null` until it ends. Each set is sent **the moment it is recorded**.

So there is no local copy of a workout in progress to keep, to persist or to reconcile. Close the
app mid routine and the open session is still there when you come back, because it was never only in
the phone. This is why the client needs so little state of its own.

The cost is one request per set, and the open question that comes with it is what the user sees when
one fails. That is not decided yet.

## The contract with the backend

The backend publishes OpenAPI. `yarn api:types` reads it and writes `src/shared/api/schema.gen.ts`,
which is committed, so compiling never needs the backend running and a contract change shows up as a
diff in a pull request instead of as a crash.

Generated types only exist at compile time, so every response is also parsed with Zod where it
enters the app. The HTTP wrapper returns `unknown` and the schema is what produces the type, which
is why there is no type assertion anywhere on a network response.

## Navigation

Expo Router with **NativeTabs**, so the five sections are drawn by the operating system. That buys
native feel, gestures and accessibility, and it costs exact visual fidelity: the prototype is the
reference for the screens, not a contract for the navigation chrome, and it looks different on
Android and on iOS. A pull request is not wrong for failing to match the prototype's tab bar.

NativeTabs is new in Expo 58 and lightly documented. Expect to read release notes rather than blog
posts.
