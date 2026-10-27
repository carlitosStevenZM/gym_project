# Conventions

The boring part, which is the first thing an agent gets wrong when nobody writes it down. The
architecture is in [`architecture.md`](architecture.md).

## Tooling

| | |
|---|---|
| Package manager | **yarn** |
| Lint | **ESLint** with Expo's config, plus the React Hooks and React Native plugins |
| Format | **Prettier** |
| Pre-commit | **lefthook**, running lint and types over the changed files only |
| E2E | **Maestro**, flows in `.maestro/` |

Pre-commit runs on what changed, not on the whole project, so it stays fast enough that nobody is
tempted to skip it. It exists because every change goes through a pull request that another person
has to approve: catching a type error before the push saves a round trip.

## TypeScript

```jsonc
{
  "strict": true,
  "noUncheckedIndexedAccess": true
}
```

`noUncheckedIndexedAccess` is the one that earns its place. Without it, reading `sets[3]` hands you
a `Set` whether or not there is anything there, and the app crashes somewhere else entirely. With
it, the compiler makes you say what happens when it is missing.

`any` is a **lint error**. When something genuinely needs it, usually an untyped library, the line
carries a comment saying why. A silent `any` spreads: everything it touches stops being checked and
nobody notices.

Types for the API are **never written by hand**. `yarn api:types` generates
`src/shared/api/schema.gen.ts` from the backend's OpenAPI and that file is committed. Hand written
API types drift from the real contract within a week, and TypeScript keeps validating against the
drift with a straight face.

## Imports

- `@/` points at `src/`.
- A `domain/` module is imported through its `index.ts` and nothing else.
- Everywhere else, import the file directly. There are no barrel files outside `domain/`, because
  they create import cycles that are painful to diagnose and make Metro load more than it needs.

```ts
import { useActiveSession } from '@/domain/session'       // yes
import { postSet } from '@/domain/session/api'            // no, seam violation
import { Button } from '@/shared/ui/Button'               // yes
```

## Texts

Every user-facing string goes through i18next. No literals in JSX.

The product ships in Spanish only (SRS · NF-4), so there is one locale file today. The reason to run
i18n anyway is that extracted strings can be read and corrected as a set, without reading JSX, and
plurals and formats are solved rather than improvised.

## Styling

`StyleSheet` plus the tokens in `shared/ui/tokens.ts`. No styling library and no component library:
the prototype already defines the look, and these are 18 screens without a design system behind them.

There is one theme. Tokens are centralised anyway, so adding a second one later is mechanical rather
than archaeological.

## Code a human can scan

These two rules are one idea. Code that is broken into well named pieces does not need a comment to
explain it, and a comment is usually the symptom of a piece that was never broken up.

### Comments are the exception, not the habit

**Default to none.** A comment earns its place only where the code genuinely cannot speak: a
constraint that is not visible from here, a workaround with the reason it exists, a reference to the
decision behind an odd looking choice.

```ts
// Increment the set number and send it to the server   ← no: it restates the line
setNumber += 1

// D31: 0 kg is valid, it is how bodyweight work is logged
if (weightKg < 0) throw new InvalidWeight()             ← yes: not visible from the code
```

Long comment blocks need a real reason, and "this part is complicated" is not one: that is a
request to split it up, not to narrate it. A comment that explains *what* is almost always a
rename waiting to happen; keep the ones that explain *why*.

The cost of a wrong comment is worse than its absence. Code gets refactored and comments do not, so
a stale comment ends up actively lying to the next reader, who has no way to tell.

### Atomise for reading, not for line count

**Fewer lines is not the goal. Being understandable at a glance is.** If splitting something into
three small functions adds lines but means a reader gets it without holding anything in their head,
split it. A clever one liner that has to be decoded is worse than four plain ones that do not.

```ts
// one piece: you have to read all of it to know what it does
async function saveSet(input: SetInput) {
  const parsed = SetSchema.parse(input)
  if (parsed.weightKg < 0) throw new InvalidWeight()
  const isRecord = parsed.weightKg > (await getMaxWeight(parsed.exerciseId))
  await http.post('/sets', parsed)
  if (isRecord) notifyRecord(parsed.exerciseId)
  queryClient.invalidateQueries({ queryKey: ['history'] })
  queryClient.invalidateQueries({ queryKey: ['progress'] })
}

// atomised: the top reads like a sentence, and each name answers its own question
async function saveSet(input: SetInput) {
  const set = validateSet(input)
  const isRecord = await beatsPreviousMax(set)
  await sendSet(set)
  if (isRecord) notifyRecord(set.exerciseId)
  refreshAfterSet()
}
```

The second version is longer. It is also the one you can read once and trust, and the one where a
failing test points at a function small enough to hold in your head.

Practical signs that something wants splitting: you reach for a comment to introduce a block, the
function needs the word "and" to be described, or you have to scroll to see all of it.

## Naming

- Files that export a component: `PascalCase.tsx`. Everything else: `kebab-case.ts`.
- Folders: `kebab-case`.
- Identifiers and filenames in **English**; user-facing text in **Spanish**. The glossary in SRS §3
  maps both ways, and it is the place to check before inventing a name for a domain concept.

## Tests

An agent never creates or edits a test on its own. See the rule in [`../../AGENTS.md`](../../AGENTS.md)
and at the root. Nothing here obliges a flow to exist: what is worth testing is the developer's
call.
