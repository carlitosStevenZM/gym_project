# Anti-patterns

Named shapes that are wrong here. The point of giving them a name is that a review can say "this is
a networked screen" and both people know what is meant, what the fix is and which rule it breaks.
Without the name the conversation is "this feels off" and it goes nowhere.

Each one is the reverse of a rule in [`../../AGENTS.md`](../../AGENTS.md).

## Networked screen

A file under `screens/` that talks to the server: a `fetch`, a query key, a URL, an import from
`shared/api`.

```ts
// screens/routines/RoutinesScreen.tsx
const data = await http.get('/routines')        // networked screen
```

**Why it hurts.** The call cannot be reused by the other screens that need the same data, and it
cannot be found when the endpoint changes, because it lives where nobody looks for an endpoint.
Three screens touch the session and five touch routines, so the second copy is always already on its
way.

**Fix.** Move the call into the `domain/` module that owns that entity and consume its hook.

Breaks **[rule 1](../../AGENTS.md#discipline-rules)**.

## Seam violation

Importing from inside a `domain/` module instead of through its `index.ts`.

```ts
import { postSet } from '@/domain/session/api'     // seam violation
import { useActiveSession } from '@/domain/session' // fine
```

**Why it hurts.** The module stops having an interface: everything inside it becomes public by
accident, and renaming a private file breaks callers that were never supposed to know it existed.

**Fix.** Export it from `index.ts` if it is genuinely public, or go through what already is.

Breaks **[rule 2](../../AGENTS.md#discipline-rules)**.

## Duplicated truth

The same server data living in TanStack Query and also in a Context or a store.

```ts
const { data } = useRoutines()
useEffect(() => { setRoutines(data) }, [data])    // duplicated truth
```

**Why it hurts.** Two copies drift. One of them refreshes and the other does not, and the screen
that reads the stale one shows yesterday's data with no error anywhere. It is the hardest class of
bug to see, because nothing is broken, it is just old.

**Fix.** Read from the query where it is needed. If the point was to avoid refetching, that is what
`staleTime` is for.

Breaks **[rule 3](../../AGENTS.md#discipline-rules)**.

## Root Provider

A Provider mounted at the root for state that belongs to one part of the app.

```tsx
// app/_layout.tsx
<ActiveSessionProvider>      // Root Provider: it never unmounts
```

**Why it hurts.** It never unmounts, so its state survives leaving the flow, finishing the session
and starting another one. Somebody now has to remember to clear it, which is exactly the problem
Context was chosen to avoid.

**Fix.** Mount it in the `_layout` of the lowest route that needs it. Auth is the one case that
genuinely belongs at the root.

Breaks **[rule 4](../../AGENTS.md#discipline-rules)**.

## Exitless store

A Zustand store whose exits nobody wrote down.

```ts
// domain/x/store.ts
export const useX = create(() => ({ ... }))     // no header, no exits
```

**Why it hurts.** The store lives outside the React tree, so nothing tells it when it stopped being
needed. Without a stated exit, the first new path into it inherits whatever the last user left
behind, and that shows up as data belonging to somebody else.

**Fix.** Either state scope, who clears it and when in a comment at the top, or use Context, which
clears itself.

Breaks **[rule 6](../../AGENTS.md#discipline-rules)**.

## Trusted response

Treating what came over the network as if the compiler had checked it.

```ts
const routine = await http.get('/routines/1') as Routine    // trusted response
```

**Why it hurts.** The assertion silences the compiler without verifying anything. A field that
arrives `null` crashes three screens later, in a component that did nothing wrong, and the stack
trace points at the victim instead of the cause.

**Fix.** Parse it with the Zod schema at the edge. The wrapper returns `unknown` precisely so that
the assertion is not available.

Breaks **[rule 7](../../AGENTS.md#discipline-rules)**.

## Narrating comment

A comment that says what the next line already says.

```ts
// Increment the set number
setNumber += 1

// Loop through the exercises and send each one
for (const e of exercises) await sendExercise(e)
```

**Why it hurts.** It adds nothing on the day it is written and starts lying on the day the code
changes, because code gets refactored and comments do not. The next reader has no way to tell which
of the two is current, so they end up trusting the wrong one or verifying both.

**Fix.** Delete it. If the line genuinely needed explaining, the fix is a better name or a smaller
function, not a sentence above it. Keep comments that say *why*: a constraint, a workaround, a
decision reference.

Breaks **[rule 11](../../AGENTS.md#discipline-rules)**.

## Unscannable function

A function you have to read end to end before you know what it does. Usually it has internal blocks
introduced by comments, which is the tell.

```ts
async function saveSet(input: SetInput) {
  // validate
  ...
  // check if it is a record
  ...
  // send and refresh
  ...
}
```

**Why it hurts.** Nobody can skim it, so every reader pays full price, including the one who wrote
it three months ago. When a test fails it points here, and "here" is forty lines of several
different jobs.

**Fix.** Pull each block into a named function. The comment that introduced it is usually the name,
already written. The result has more lines and that is fine: fewer lines was never the goal.

Breaks **[rule 12](../../AGENTS.md#discipline-rules)**.
