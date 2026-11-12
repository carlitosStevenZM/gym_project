# Decisions

Every decision that overturns something this system used to say, numbered so a review can point at
one. `DS` to keep it apart from the SRS's `D` numbers: this log is about how the product looks,
the SRS's §4 is about what it does. When a design decision also changes the product, it goes in
both and says so.

A rule that has always been true is not here, it is in the page that owns it.

| # | Decision | Origin |
|---|---|---|
| DS1 | **This folder is the source of truth, not the published artifact.** The system was designed as an artifact and ported here on 10 Nov 2026. The artifact is frozen origin material: nothing reads from it, nothing is published back to it, and it does not know about anything learnt since. What survives from it is here | Nov 10, 2026 · SRS **D50** |
| DS2 | **The condensed display face ships with the app as a font file.** The system used to say both families came from the operating system. `AvenirNextCondensed-Medium` and `sans-serif-condensed` are different enough to change the weight of a title, so the condensed one is bundled, subset to Latin, and the splash is held until it is in. Body text still takes the system font and ships no file | Nov 9, 2026 · SRS **D48** |
| DS3 | **The disc's progress ring is its outer band, not a collar on the core.** Drawn against the core, an `accent` arc on an `accent` fill is 1.00:1: the only thing that read was the part that was missing, so the disc looked bitten rather than counted. Outside the separation ring it sits on `bg`, at 6.70:1 | Nov 9, 2026 |
| DS4 | **`disc-core` is 96 and `border-gap-disc` is 4.** «EMPEZAR» is 79.4 px at `display-sm`, and a circle is narrowest exactly where a line of text is widest. The 88 px core clipped it. The separation ring pays for the growth so the disc stays 112 and no composition moves | Nov 9, 2026 |
| DS5 | **A figure carries no container, and `accent` means two things rather than three.** The ring around a weight existed to say «this is your best lift». On this background `accent` has *less* luminance than `ink-soft` (0.317 against 0.373, 1.15:1 between them), so an orange figure never stood out from a grey one — the ring was carrying the whole signal, and it cost a circle that a four-character figure does not fit. The best lift is now the figure in `ink` against a column of `ink-soft`: 2.22:1 of pure lightness, no box, no rule. `accent` keeps the primary action and today | Nov 10, 2026 |
| DS6 | **A screen header scrolls with its content; it is never pinned.** The system allows no shadow and no elevation, so a pinned header has nothing legal to separate itself with from content sliding underneath, and the join reads as a hard cut. The vertical budget already counts the header as part of the page rather than as chrome | Nov 9, 2026 |
| DS7 | **The pill button has a fourth variant, `danger`**: outlined, in `danger`. The dialog requires its destructive action in `danger` and the three original variants could not express it | Nov 9, 2026 |
| DS8 | **The glass chip uses `caption`.** Its recipe asked for 11 px at weight 700, which is outside the type scale and appears exactly once. The chip is told apart by its container, not by a bespoke size | Nov 9, 2026 |
| DS9 | **The Google mark is the one piece of brand iconography the system carries.** The system says it has none, and that rule stands for everything it draws itself. It cannot stand for a third party's sign-in button: FR-1 requires Google sign-in, and Google's guidelines do not permit a recoloured or redrawn G, so a stroke icon in `ink` is not an option the way a tinted mark would be. The mark ships in its four colours, is never recoloured, and appears **only** on that button. `PillButton` gains a `leading` slot to carry it, because `icon` is tone-driven and cannot express a four-colour fill | Nov 11, 2026 · SRS **FR-1** |

## Open

Problems found and not yet solved. They are here so nobody rediscovers them, and so nobody
"fixes" one by accident in the wrong direction.

| What | The measurement | Where |
|---|---|---|
| **A planned day and a rest day are the same circle.** `surface-alt` against `surface` is **1.09:1**, and the rest day's initial is `ink-disabled` on `surface` at **1.96:1** — a token this system's own colour page forbids for anything carrying information. A day with a routine and a day without are indistinguishable today | 1.09:1 · 1.96:1 | [`color.md`](color.md), [`accessibility.md`](accessibility.md) |
| **The window has no bottom edge.** `scrim-bottom` is 96 % of `bg`, so the lower half of a photograph *is* the page background: the bottom corners lose their radius and the disc has nothing to sit on. A window with no photograph is `surface` on `bg`, **1.10:1**, which is also invisible | 1.10:1 | [`photography.md`](photography.md) |
| **The gradient assumes a short text block.** Its clear stop is fixed at 34 %, but kicker plus a two-line title plus chips starts at 24 % of the window, where the veil is 0.16. Contrast over an arbitrary photograph is not guaranteed there. The 120 px right inset is what forces two lines: every real routine name needs 268–312 px and the inset leaves 190 | 0.16 veil | [`photography.md`](photography.md) |
| **There is no `danger-soft`.** The error banner is specified as `danger` at 15 % and no token says it, so the client computes it in the one place it computes a colour | — | [`feedback.md`](feedback.md) |
| **Android hides inactive tab labels** and paints its own active indicator. This system says labels never hide. The tab bar is drawn by the OS (SRS · D42), so either the client can configure it or this rule has to change | — | [`layout.md`](layout.md) |
