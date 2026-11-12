# Accessibility

Not a final pass: contrast and touch target are decided when the token is chosen.

## Contrast

- **4.5:1 for normal text**, 3:1 for large text (≥24 px, or ≥18.7 px bold) and for interface
  elements.
- Every text pair in the theme is measured in [`color.md`](color.md). The two that fail are marked
  there and their use is restricted.
- **Over a photograph contrast is not calculated, it is guaranteed** by the mandatory gradient.
- When a colour token is added, measure it against `bg` and against `surface` before it enters.
  A pair that does not reach is not approved "because it looks fine".

## Touch

- **44 × 44 px minimum**, even when the drawn thing is smaller: a 44 px badge holding a 16 px
  number is still a 44 px target.
- The exercise row is tappable whole, not just its name.
- The disc has a 96 px core — the largest target in the system — and it sits in the right third,
  where the thumb reaches without the hand moving.
- At least `space-2` between two targets.

## Screen reader

- **Every control without text carries a label**: the disc announces «Empezar, press de banca»,
  and its ring announces «dos de cuatro entrenamientos de la semana» separately.
- Decorative SVGs are marked hidden; informative ones take an image role and a label.
- **Reading order follows visual order.** The disc is drawn mounted on the window but is announced
  after the routine title, which is what gives it meaning.
- Units are read in full: «sesenta y siete punto cinco kilos», not «67.5 KG» spelled out.
- A row is announced as one sentence, built by the screen rather than by the component: «Press de
  banca, 4 series, de 8 a 12 repeticiones, la vez pasada 67.5 kilos».

## Colour and meaning

No state depends on colour alone.

| State | Colour | And also |
|---|---|---|
| Trained | `accent` | Solid fill |
| Today | `accent` | A 2 px ring, no fill |
| Rest | `surface` | Dimmed, and no routine label |
| Your best lift | — | The brightest figure in the column: `ink` against `ink-soft`, 2.22:1 |

The last row used to be `accent` plus a ring. It is not any more, and the reason is worth keeping:
on this background `accent` and `ink-soft` sit at the same lightness, so the colour was carrying
nothing and the ring was carrying everything. See **DS5**.

**Rest and planned currently fail this test** — `surface-alt` against `surface` is 1.09:1 and the
rest day's initial is `ink-disabled` at 1.96:1, which is this system's own forbidden token for
anything carrying information. It is in the open list in [`DECISIONS.md`](DECISIONS.md).

## Dynamic type

The layout takes the large body size: rows grow, titles go to two lines, figures do not truncate.
Verify at the system's maximum before calling a screen done.

## Motion

No animation carries meaning, so there is nothing to lose by reducing motion. Any transition added
respects the system preference and is never the only sign that something happened.

## The four states of a control

Every control defines **normal, pressed** (`opacity-press`), **disabled** (`opacity-disabled`,
always with text explaining why) and **loading**. There is no hover on mobile; visible focus
matters only if a web version ever exists.
