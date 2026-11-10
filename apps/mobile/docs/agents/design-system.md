# Design system in code

How the product's design system reaches the screen, and what you are allowed to write when you
build an interface in this app. The decision behind it is **D47**; the look itself is not defined
here, it is defined by the design system and vendored into the repo.

The short version: **you never type a colour, a length or a font size.** They come from the theme,
and the theme is generated.

## The chain

```
design system (its own export)
        │  copied verbatim, by hand, when it changes
        ▼
design-system/tokens.json              the vendored export · the source of truth in this repo
        │  yarn tokens
        ▼
src/shared/theme/tokens.gen.ts         GENERATED · the only file in src/ that holds literals
        │
        ├── typography.ts              the 14 text styles, resolved to real font families
        └── theme.ts                   the single theme object (D43)
                │
                ▼
        styles.ts · makeStyles()       every stylesheet is a function of the theme
                │
                ▼
        src/shared/ui/*                the components, which read nothing else
```

Each arrow is one-way. A component never reaches past `makeStyles` into `tokens.gen.ts`, and
nothing writes back up the chain.

## What you write

### A text style

`shared/ui/Text` is the only thing in the app that sets a font. It takes one of the fourteen
variants of the system and one colour token.

```tsx
<Text variant="displayXl">{routine.name}</Text>
<Text variant="caption" tone="inkMuted">{summary}</Text>
```

Uppercasing is part of the variant, not of the caller: `displayXl`, `displayLg`, `displayMd`,
`displaySm` and `label` uppercase themselves. Write the string in natural case and pass it in.

### A stylesheet

```tsx
const useStyles = makeStyles((t) => ({
  card: {
    backgroundColor: t.color.surface,
    borderRadius: t.radius.lg,
    padding: t.space.s4,
  },
}))

export function Card() {
  const s = useStyles()
  return <View style={s.card} />
}
```

`makeStyles` builds the sheet once, at module load, and hands back a hook. The hook shape is the
point: there is one theme today, and when a second arrives only `styles.ts` changes, not the call
sites. See [D43](../../../../requirements/SRS.md).

### A pressable

`shared/ui/Touchable` already applies `opacity-press` and `opacity-disabled`. Use it instead of
`Pressable` unless the component overrides the feedback, which only `ActionDisc` does (it swaps to
`accent-press`).

## The rules

1. **No literal colours, lengths or font sizes in `src/`.** `tokens.gen.ts` is the only exception,
   and it is generated. A value the design system does not define is a question for the design
   system, not a number you pick.
2. **A length comes from the scale.** Base 4, eight steps. If you need 18, the answer is 16 or 20.
3. **A component under `shared/ui/` takes its user-facing text as a prop.** It never calls
   `useTranslation` itself, so it stays pure and the screen owns the copy (rule 10, D44). The
   wording the design system fixes is in `shared/i18n/es.ts` under `ui.*`.
4. **A disabled control says why.** `PillButton` and `TextField` take `disabledReason` instead of a
   `disabled` boolean, so the rule is the type signature rather than a convention.
5. **No state is carried by colour alone.** Trained is a fill, today is a ring, a record is a ring
   plus its place in the list. The feedback tones each carry their own icon.
6. **44 px of target, always**, even when the drawn thing is smaller. Use `hitSlop`.

## When the design system changes

1. Replace `design-system/tokens.json` with the new export, verbatim.
2. `yarn tokens` — regenerates and formats `src/shared/theme/tokens.gen.ts`.
3. `yarn typecheck` — a removed or renamed token is a compile error at every use. That is the whole
   reason the token unions are generated.

The generator does three mechanical things and nothing else, all of them at the top of
`scripts/generate-tokens.mjs`: it camel-cases the names, strips `px`, and applies two overrides —
`ventana-h` becomes `heroWindowH` because identifiers here are English, and `radius-circle` becomes
`9999` because React Native draws a circle from an oversized radius rather than from `50%`.

## What the components are called

The design system names its components in Spanish; identifiers in this repo are English
(`development-rules.md`). The map:

| Design system | In code | |
|---|---|---|
| DiscoAccion | `ActionDisc` | |
| BotonPill | `PillButton` | gained a `danger` variant, see below |
| CampoTexto | `TextField` | |
| StepperPeso | `Stepper` + `SetStepper` | split: one key pair, and the pair of pairs plus its confirmation |
| SelectorRango | `RangeField` | |
| Interruptor | `Switch` | |
| Buscador | `SearchField` | |
| Desplegable | `Select` | |
| SelectorSegmentado | `SegmentedControl` | |
| HojaInferior | `BottomSheet` | |
| FilaOpcion | `OptionRow` | |
| Calendario | `MonthCalendar` | |
| Dialogo | `Dialog` | |
| Aviso | `Toast` | |
| Banner | `Banner` | |
| Cargando | `Skeleton` + `Spinner` + `PillButton loading` | the three shapes of waiting, as three pieces |
| Temporizador | `RestTimer` | |
| FilaEjercicio | `ExerciseRow` | |
| BadgeAnillo | `RingBadge` | |
| SemanaDias | `WeekStrip` | |
| GraficaProgreso | `ProgressChart` | |
| TiraSiguiente | `UpNextStrip` | |
| CabeceraPantalla | `ScreenHeader` | |
| Ventana | `HeroWindow` | |
| ChipVidrio | `GlassChip` | |
| EstadoDescanso | `RestDayCard` + `EmptyState` | the rest day, and the other two empty states |
| BarraPestanas | — | not a component: the OS draws it (D42). The constraint it documents is `tabbarH` |

Plus three pieces the design system does not name, because they are code concerns rather than
design ones: `Text`, `Touchable` and `Divider`.

## Where the code departs from the design system

Four places, all deliberate.

| What | The system says | The code does | Why |
|---|---|---|---|
| Display face | Take the condensed face from the OS, ship no font files | Ships Barlow Condensed in two weights | **D48.** `AvenirNextCondensed-Medium` and `sans-serif-condensed` are different enough to change the weight of a title. The splash is held until the font is in, which is what the system was protecting against |
| `ChipVidrio` text | 11 px, weight 700 | `caption` (12 px, weight 400) | 11/700 is outside the type scale and appears once. The chip is told apart by its container, not by a bespoke size |
| Error banner | `danger` at 15 % | `withAlpha(danger, 0.15)` | The system has no `danger-soft` token. `shared/theme/alpha.ts` is the one place the app computes a colour, and it goes away when the token lands |
| `BotonPill` | Three variants | Four: a `danger` outline | `Dialogo` asks for the destructive action in `danger` and no variant provided it |

## What is not built

- **The screens.** This change delivers the system, not the eighteen screens.
- **The exercise catalogue illustrations** (D34). `ExerciseRow` falls back to `ExerciseGlyph`, the
  stroke barbell, until the catalogue is imported.
- **The photography bank.** `assets/images/hero-sample.webp` is the design system's filler frame,
  from Unsplash. See [`../../assets/README.md`](../../assets/README.md).
- **Dynamic type.** The layouts grow, but nothing has been checked at the largest system text size
  on a device yet.

## Design constraints

- **`makeStyles` returns a hook even though it ignores the theme argument today.** Removing the
  indirection would inline the single theme into thirty files and make D43's "mechanical" promise
  false.
- **`resolveFont` never returns a `fontFamily` and a `fontWeight` together.** A bundled family
  carries one weight per file; asking Android for a weight on top makes it synthesise a second
  bolding over a face that is already black.
- **The tab bar's 83 px belong to the OS.** No composition may use them; a fixed action floats
  16 px above instead (`Toast` and `RestTimer` both do).

## Known caveats

- `ProgressChart` returns `null` under three points. The caller is the one that has to render the
  empty state; nothing enforces that it does.
- `BottomSheet` carries its own `GestureHandlerRootView` because gestures inside a React Native
  `Modal` do not otherwise reach the handler on Android.
- Nothing stops a second `Toast` from mounting. "One at a time" is a host's job and there is no
  host yet.

## Related

- [`architecture.md`](architecture.md) — the layers this sits inside
- [`development-rules.md`](development-rules.md) — naming, imports, comments
- [`../../assets/README.md`](../../assets/README.md) — where the fonts and images come from
- SRS **D42**, **D43**, **D44**, **D47**, **D48**
