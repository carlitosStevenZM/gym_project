# Layout and composition

## The scale

Base 4. Eight steps and no more: `space-1` 4 · `space-2` 8 · `space-3` 12 · `space-4` 16 ·
`space-5` 20 · `space-6` 24 · `space-8` 32 · `space-10` 40.

A value outside the scale is an implementation error, not a design decision. If something wants
18, it takes 16 or 20.

| Step | Where |
|---|---|
| `space-1` 4 | Between a figure and its unit; between an icon and text that touch |
| `space-2` 8 | Between elements of one group: chips, weekdays |
| `space-3` 12 | Between an illustration and the name beside it; a row's vertical padding |
| `space-4` 16 | A card's inner padding; before the figure at the end of a row |
| `space-5` 20 | **The side margin of every screen**, and the window's padding |
| `space-6` 24 | Between distinct blocks of one screen, including above a rule that separates two |
| `space-8` 32 | Between major sections |
| `space-10` 40 | The breathing room before a screen closes |

The side margin is **20 px and it is the same everywhere**: header, window, lists and strips share
a left edge.

One number deserves its own line, because the same gap reads differently on each side of a row:
an illustration takes `space-3` before the name, and a figure takes `space-4`. A circle's ink runs
to the edge of its box, so the identical number looks tighter next to one.

## The vertical budget

A phone screen is 844 px and the native tab bar keeps **83**. What is left is **761**, and it is
spent before anything is drawn. The Hoy screen:

```
 56   header (Hoy + the date)
 16   air
212   the photographic window
 52   the disc, which hangs out of it
 50   the week: label and seven days
 16   air
240   five exercise rows at 48
 24   air
 56   the closing strip
 40   air over the tab bar
────
762
```

Two rules came out of getting this wrong:

1. **Anything anchored to the bottom edge is measured against the flow.** An element positioned
   against the bottom does not push the list, it rides on top of it. Work out where the content
   ends before anchoring anything.
2. **Nothing occupies the tab bar's 83 px.** A full-bleed bottom action does not exist in this
   app: it either floats 16 px above, or it is part of the content.

Five rows fit without scrolling. From six the list scrolls and the closing strip goes below the
fold, which is correct — the row does not get compressed.

## Vertical rhythm

- Inside a block, elements sit at `space-2` or `space-3`.
- Between blocks, `space-6`. **That includes the space above a rule**: a rule that separates two
  blocks and hugs the one above it reads as the end of that block, not as a boundary.
- Between sections, `space-8`.
- The change of rhythm is what separates. **A rule is not needed between every two things** — one
  appears only when two rows of the same kind repeat.

## Composing a screen

1. **One zone of impact**, at the top: the window with the title and the disc. It is what is seen
   in the first five seconds.
2. **A scannable body**: rows of constant height, one datum left and one right, no boxes.
3. **A close**: a strip that props up the end of the list. Never dead black over the tab bar — if
   space is left over, content is missing or something is too big.

## Headers

A screen header is **part of the page, not chrome**: it scrolls with the content (**DS6**). This
system allows no shadow and no elevation, so a pinned header has nothing legal to separate itself
with from content sliding underneath, and the join reads as a hard cut.

## Density

The exercise row is **48 px**: 4 of padding, a 40 illustration, 4 of padding. The whole row is the
touch target, above the 44 minimum.

## The tab bar is not ours

Navigation uses the operating system's native tabs (SRS · D42). iOS and Android paint them with
their own background, type, height and scroll behaviour. Ours is the icon, the label, and `accent`
for the active state.

Icons are 1.8 px stroke in a 22 px box (`icon-md`), rounded ends, no fill. Active in `accent`,
inactive in `ink-muted`. The five: house (Hoy), lines (Rutinas), clock (Historial), bars
(Progreso), gear (Ajustes). Never emoji, never brand iconography.

**Labels never hide.** A bar of icons alone makes people guess. Android currently hides the
inactive ones and paints its own active indicator, which contradicts this: see the open list in
[`DECISIONS.md`](DECISIONS.md).
