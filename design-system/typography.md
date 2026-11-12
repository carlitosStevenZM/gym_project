# Typography

Three families with three jobs. None of them does another's.

## The families

| Family | Token | What it is | For |
|---|---|---|---|
| Display | `display` | **Barlow Condensed**, bundled with the app in two weights (DS2) | Titles and the word inside the disc. Always uppercase |
| Text | `body` | The system font: San Francisco on iOS, Roboto on Android | All body copy, exercise names, metadata |
| Figures | `numeric` | The same condensed face as Display | Kilos, sets, counters, abbreviated dates |

The condensed face ships as a file rather than coming from the operating system, which is a change
from how this system started: **DS2** has the reasoning. Body text still takes the system font on
purpose — it is what the reader's OS already renders best, it follows their dynamic type setting,
and it costs nothing to download.

Both files are subset to Latin, 50 KB each, and keep the `tnum` feature so a figure does not
jitter as it steps.

## Which style where

| Style | Where | Rule |
|---|---|---|
| `display-xl` | The name of today's routine | Once per screen. Twice means one of them is not the title |
| `display-lg` | Secondary screen titles | Never inside a list row |
| `display-md` | «Hoy», «Rutinas», section headers | Lives alongside the native top bar |
| `display-sm` | Inside the disc and condensed buttons | 1.2 px of tracking, always uppercase |
| `body` | Any sentence | The default. If in doubt, this one |
| `body-strong` | An exercise, session or routine name inside a row | Weight 600, never 700: 700 is display territory |
| `caption` | Date, duration, target sets | Always under a `body-strong`, never alone |
| `label` | Section headers | Uppercase, 2 px of tracking, three words maximum |
| `link` | «Ver progreso», «Ver todo» | Right of a section header, in `accent` |
| `numeric-xl` | The headline figure | One per screen |
| `numeric-lg` | A figure in a card or a stepper | |
| `numeric-md` | A figure at the end of a row | |
| `numeric-sm` | In-line counters: «2/4», indices, weekday initials | |
| `numeric-unit` | «KG», «MIN» | In `ink-muted` and always smaller than its figure |

## Not negotiable

1. **The condensed face is never body copy.** It carries a three-word title and a figure; a
   15 px sentence in condensed is unreadable in a gym.
2. **Uppercase is reserved for `display-*` and `label`.** An exercise name in uppercase loses its
   word shape and reads more slowly. The implementation puts the uppercasing in the style, not in
   the string, so this cannot be got wrong by accident.
3. **A figure and its unit never share a size.** The unit is always `numeric-unit` in `ink-muted`:
   the eye is looking for the number, not for the «kg».
4. **Never two display weights on one screen.** Display is 900, full stop; hierarchy comes from
   size.
5. **Never negative tracking.** The condensed face is already narrow and tightening breaks it.
   Only `label` and `display-sm` carry tracking, and it is positive.
6. **A title may break into two lines, never three.** If «Extensión de tríceps en polea» does not
   fit in two, the row uses `body-strong`, not display.

## Measure before you fit

A condensed face is narrow, which makes it tempting to assume text fits. Two of the defects found
on the first device run were exactly that: «EMPEZAR» is **79.4 px** at `display-sm` and the disc
offered 72, and «67.5» is **35.2 px** at `numeric-md` where its circle was 24 across.

Before a figure or a label goes inside a shape, measure the longest real string against the width
the shape actually offers at the height the text sits. In a circle, that is not the diameter.

## Dynamic type

The layout takes the system's large body size: rows grow taller, titles go from one line to two,
and no figure truncates. What does not scale is the tab bar, which the OS draws. Check every screen
at the largest text size before calling it done.
