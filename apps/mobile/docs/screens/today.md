# Hoy

Status: Current
Last verified: 2026-11-10 against feat/mobile-design-system, on an Android emulator
Source of truth: `src/screens/today/TodayScreen.tsx` · `src/screens/today/types.ts`

## Purpose

The first tab and the screen FR-6 calls the most important one: what you train today, how the week
is going, and the one action that starts the session. It is also the only screen in the app that
carries a photograph.

## How it works today

### Five states, one view model

`TodayScreen` reads a `TodayView` (`types.ts`) and switches on its `kind`. Nothing else in the
screen branches on missing data.

| `kind` | What is drawn |
|---|---|
| `loading` | Skeletons at the real heights: the window, the week strip, five rows of `row-h` |
| `error` | `EmptyState` with a retry |
| `noWeeklyTraining` | `EmptyState` with «Crear semana». The one state where the app asks for something |
| `rest` | `RestDayCard`, the week, and the personal best in place of the day that is coming |
| `training` | The composition below |

A rest day has no window and no disc. That is not an omission: rest is the absence of a routine,
not a choice the user made (D30), and there is nothing to start (D13).

### The composition of the training state

The design system's vertical budget is 761 px — a 844 px phone minus the 83 px the tab bar takes —
and it is spent before anything is drawn, not after. How the code spends it:

| Budget | Where |
|---|---|
| 56 header | `ScreenHeader`, title plus the date pill. It is **inside** the ScrollView (DS6) |
| 16 air | `body` padding, `TodayScreen.tsx` |
| 212 window | `HeroWindow`, `heroWindowH` |
| 60 disc | `afterHero` padding, `HERO_DISC_OVERHANG` plus `space-2` |
| 50 week | `WeekOverview` → `WeekStrip` |
| 16 + 240 list | `list` padding plus five `ExerciseRow` at `row-h` |
| 24 air | `UpNextStrip`'s own `space-6`, the gap a block boundary takes |
| 56 closing strip | `UpNext` → `UpNextStrip` |
| 40 air | `UpNextStrip`'s own `space-10` over the tab bar |

That is 770 against the 761 a 844 px phone offers, so the smallest reference device scrolls by
nine pixels. Which is fine: the header scrolls with the content anyway.

Which is why `HeroWindow` exports `HERO_DISC_OVERHANG` rather than hiding the 52: whatever follows
the window has to clear the half of the disc that hangs out of it, and that number has to come
from one place.

### Where the data comes from

From a fixture. There is no `domain/` layer because there is no backend, so `TodayScreen.tsx` has
exactly one line that knows it:

```tsx
const view: TodayView = TODAY_TRAINING
```

That line becomes a `domain/today` hook and `today.fixture.ts` goes. Everything under it reads the
view model and nothing else, so the swap does not reach the components.

`today.fixture.ts` also exports `TODAY_REST`, `TODAY_LOADING`, `TODAY_ERROR` and
`TODAY_NO_WEEKLY_TRAINING`. Change the one line to see a state.

The fixture's date is frozen on **Wednesday 14 October 2026**, the prototype's day. A fixture that
moved with the clock would render a different state depending on when somebody opened the app, and
the week strip derives "today" from `view.date`, never from `new Date()`.

### Text and dates

Every string goes through i18next (D44). Day and month names live in `es.ts` rather than coming
from `Intl`, because the initials are a product choice: `Intl` narrows both *martes* and
*miércoles* to M, and a week strip with two Ms cannot be read. `useDateLabels` is the only thing
that reads them.

The accessibility sentences are built in the screen, not in the components: `useExerciseLabels`
produces «Press de banca, 4 series, de 8 a 12 repeticiones, la vez pasada 67.5 kilos» from the view
model, and `WeekOverview` produces «miércoles, hoy, pecho y tríceps».

## Key files

- `src/screens/today/TodayScreen.tsx` — the header, the scroll, and the switch over the five states
- `src/screens/today/types.ts` — the view model
- `src/screens/today/today.fixture.ts` — scaffolding, deleted when `domain/` exists
- `src/screens/today/week-progress.ts` — done and planned, shared by the ring and the counter
- `src/screens/today/components/` — the three bodies, plus the two blocks that turn plan into UI
- `src/shared/lib/use-date-labels.ts` — Spanish day and month names

## Gotchas and edge cases

- **Three of the prototype's blocks are not here**: «Últimas sesiones», «Tus marcas» and the two
  counters. See D49; this is deliberate and re-adding them is a product decision, not a fix.
- **The disc's action goes nowhere.** `startSessionNotWired` is an empty function: starting a
  session is FR-6 and needs the backend. The same is true of «Crear semana» (FR-5) and of the
  retry. They are named functions rather than inline arrows so a grep for `NotWired` finds
  everything still waiting on a route.
- **The exercise rows are not pressable**, so `ExerciseRow` announces itself as text rather than as
  a button. The exercise detail route does not exist.
- **The illustrations are a glyph.** The catalogue (D34) is not imported, so every row falls back
  to `ExerciseGlyph`.
- **The photograph is filler** and comes from Unsplash through the design system. See
  [`../../assets/README.md`](../../assets/README.md).

## Design constraints

- **The disc hangs out of the window and is announced after the title.** It is drawn mounted on
  the corner, but it only makes sense once you have heard which routine it starts, so it comes
  last in the reading order even though it overlaps what came before.
- **Today and trained are not exclusive.** `WeekStrip` takes `today` apart from the state, because
  a day that is both is filled *and* ringed; collapsing them into one enum loses that.
- **The closing strip is anchored to the end of the content, never to the bottom edge.** A strip
  pinned to the bottom rides over the last row of the list.

## Known caveats

- **Only seen on one device.** It has run on an Android emulator at 393 dp, which is where the
  four fixes in DS3–DS6 came from. Nothing has been checked on iOS, on a small phone, or at the
  largest system text size.
- **Three defects of the design system are still visible here**: a planned day looks the same as
  a rest day, the window has no bottom edge, and the kicker lands where the gradient is almost
  clear. All three are in the open list in
  [`../../../../design-system/DECISIONS.md`](../../../../design-system/DECISIONS.md).

## Related

- [`../agents/design-system.md`](../agents/design-system.md) — the components this screen composes
- [`../../../../design-system/`](../../../../design-system/) — the system this composes
- SRS **FR-5**, **FR-6**, **D4**, **D13**, **D21**, **D30**, **D42**, **D44**, **D47**, **D49**, **D50**
