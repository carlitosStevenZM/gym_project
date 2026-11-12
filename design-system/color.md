# Colour

One theme, thirty-one tokens, one accent. Every value is in [`tokens.json`](tokens.json) with the
note that says what it is for; this page is the part a value cannot say.

## The roles

| Role | Tokens | Rule |
|---|---|---|
| Backgrounds | `bg`, `surface`, `surface-alt` | Three planes at most. A fourth means the hierarchy is wrong |
| Lines | `line`, `line-soft` | Decoration and separation. **Neither is a control border**: they do not reach 3:1 |
| Ink | `ink`, `ink-soft`, `ink-muted`, `ink-disabled` | Three levels of information and one of absence |
| Accent | `accent`, `accent-ink`, `accent-soft`, `accent-press` | Two uses, below |
| Signal | `ok`, `warning`, `danger` | State only. Never style |
| Over a photograph | `scrim-top`, `scrim-bottom`, `glass-fill`, `glass-line`, `pill-ink` | They only exist with an image underneath |
| System | `tabbar-bg`, `ring-track`, `ring-gap` | Chrome and geometry |

## The single-accent rule

`accent` means exactly two things:

1. **The primary action** of the screen — one only.
2. **Today** — the current day in the week.

Any other orange on screen steals meaning from those two. If the header is already orange, the
button is black or outlined.

It used to mean a third thing, your personal best, and it could not: see **DS5**. On this
background orange is *dimmer* than the secondary grey, so an orange figure recedes instead of
standing out. The best lift is marked by brightness — `ink` in a column of `ink-soft` — and the
accent stays out of it.

## Measured contrast

Computed from the real token values with WCAG's relative luminance formula. Regenerate this table
whenever a value moves; do not edit a number by hand.

| Pair | Ratio | Verdict |
|---|---|---|
| `ink` on `bg` | 17.2:1 | AA and AAA |
| `ink` on `surface` | 15.6:1 | AA and AAA |
| `ink-soft` on `surface` | 7.0:1 | AA and AAA |
| `ink-muted` on `surface` | 5.1:1 | AA |
| `ink-muted` on `bg` | 5.6:1 | AA |
| `accent` on `bg` | 6.7:1 | AA |
| `accent` on `surface` | 6.1:1 | AA |
| `accent-ink` on `accent` | 6.7:1 | AA |
| `ok` on `surface` | 8.3:1 | AA and AAA |
| `warning` on `surface` | 7.7:1 | AA and AAA |
| `danger` on `surface` | 5.7:1 | AA |
| `signal-ink` on `ok` | 8.8:1 | AA and AAA |
| `signal-ink` on `danger` | 6.0:1 | AA |
| `bg` on `pill-ink` | 19.2:1 | AA and AAA |
| `ink` on `tabbar-bg` | 16.5:1 | AA and AAA |
| `input-line` on `input-bg` | 3.5:1 | Passes the 3:1 a control border needs |
| `ink-disabled` on `surface` | **2.0:1** | **Fails.** Disabled controls only, which WCAG exempts, and never carrying information |
| `line` on `surface` | **1.4:1** | **Fails.** Decoration. A border that communicates uses `ink-muted` or `accent` |

`ink-muted` is the lightest tone that still passes AA on a surface: **do not lighten it.**

## Lightness, not hue

This is the trap this system keeps falling into, so it gets its own section. Three of the four
defects found on the first device run were two values of the same tone assuming they would be told
apart.

| What has to be distinguished | Ratio | |
|---|---|---|
| The filled part of the progress ring, on `bg` | 6.70:1 | works |
| The best lift against the rest of the column | 2.22:1 | works — `ink` against `ink-soft` |
| The unfilled part of the ring, on `bg` | 1.51:1 | faint on purpose; the arc carries the reading |
| An orange figure against a grey one | **1.15:1** | **does not work** — see DS5 |
| A window with no photograph, on the page | **1.10:1** | **does not work** — open |
| A planned day against a rest day | **1.09:1** | **does not work** — open |

Before a pair enters the system, measure it. Two tokens that have to be told apart differ in
**lightness**; differing in hue alone is not a difference.

## Never

- **Text directly over a photograph with no gradient.** No contrast value is guaranteed against an
  arbitrary image.
- **Two states separated by hue alone.** Trained, today and rest differ by fill, ring and dimming
  as well as by colour.
- **Red and green as the only pair.** `ok` and `danger` also differ in lightness, and never carry
  the meaning by themselves.
- **A new colour for one screen.** Three repetitions is the threshold for a value to enter the
  system.
