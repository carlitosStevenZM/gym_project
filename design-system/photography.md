# Photography

The image is the only piece of this system that is not drawn from tokens, and the only one with a
recurring cost. That is why it has the strictest rules.

## The window

The photograph **does not bleed**: it lives inside a window with `space-5` margins, `radius-xl`
corners and a height of `hero-window-h` (212 px). Contained, the image brings colour and life
without becoming wallpaper, and a mediocre photograph does not ruin the screen.

## The five rules

1. **One photograph per screen.** The moment two compete, the screen is a collage. Exercise
   thumbnails **are not photographs**: they are the catalogue's illustration.
2. **The gradient is mandatory.** Without it no contrast is guaranteed, and that is not
   negotiable.
3. **No tint.** The image stays in its own colour. A tinted variant existed — grey plus `accent`
   at 30 % — which landed any photograph in the palette without looking at it; it was dropped
   because it killed exactly what the photograph brings. In exchange, each image has to be chosen
   so it does not fight the orange.
4. **Only on Hoy.** Rutinas, Historial, Progreso and Ajustes carry none. That way the photograph
   keeps meaning «today you train» instead of becoming background decoration.
5. **A rest day has no window.** With no routine there is no photograph and no disc: rest is the
   absence of both (SRS · D30).

## Which image works

- **Gym atmosphere**, not a specific exercise: a bar on the floor, plates, hands loading. The
  catalogue already illustrates the exercise.
- **No recognisable faces** and no third-party brands.
- **Dark and low-contrast in the lower third**, which is where the text lands.
- **Horizontal, 16:10 or wider**, because the window crops to 212 px of height.
- **It must not compete with the orange.** Blue and grey work; a photograph full of red or orange
  saturates the screen.

## What it costs

The exercise catalogue (imported from `free-exercise-db`, SRS · D34) brings **illustrations per
exercise**, not atmosphere. This system's photography has to be licensed or produced: ten to
fifteen images, somebody choosing them with judgement, and replacement as they age. The one that
ships today is Unsplash filler.

If the photography does not happen, the system stands without it: the window becomes a `surface`
block with the same title and the same disc. That is the proof the image adds rather than holds up.

## Technical treatment

| Property | Value |
|---|---|
| Crop | `cover`, centred |
| Radius | `radius-xl` |
| Gradient | `scrim-top` at 0 % → transparent at 34 % → `scrim-bottom` at 100 % |
| Text over it | `label` in `accent`, title in `display-xl`, metadata in `ink` over the opaque zone |
| Chips over it | Glass chip: `glass-fill` with a `glass-line` border. Never a solid surface |
| Nothing else | No filters, no forced saturation, no vignette, no rotated text |

## Two things the first device run showed

Both are **open**, recorded in [`DECISIONS.md`](DECISIONS.md), and they interact:

- **The window has no bottom edge.** `scrim-bottom` at 96 % of `bg` means the lower half of the
  photograph *is* the page: the bottom corners lose their radius and the disc has nothing to sit
  on. A window with no photograph is `surface` on `bg`, 1.10:1, which is invisible too.
- **The gradient assumes a short text block.** The clear stop is fixed at 34 %, but kicker plus a
  two-line title plus chips begins at 24 % of the window, where the veil is 0.16 — the photograph
  is effectively bare there. What forces the second line is the 120 px right inset, which exists
  to clear the disc: every real routine name needs 268–312 px and the inset leaves 190. The disc
  only occupies the bottom 56 px, so the inset probably belongs to the bottom row alone.
