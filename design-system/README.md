# Design system

How the product looks and behaves. This folder is the **source of truth** for that, the same way
[`../requirements/SRS.md`](../requirements/SRS.md) is for what the product does and
[`../requirements/DATA-MODEL.md`](../requirements/DATA-MODEL.md) is for how data is stored.

A single theme, a single accent, photography in exactly one place. One file holds every value
([`tokens.json`](tokens.json)); the rest of the folder holds the rules that a value cannot express.

> **The design system began as a published artifact** and was ported here on 10 November 2026.
> That artifact is frozen origin material, not a source: it does not know about anything learnt
> since, and nothing reads from it. See **DS1** in [`DECISIONS.md`](DECISIONS.md).

## The product, in a paragraph

Someone who trains cannot **remember what is on today** and cannot **tell whether they are
improving**, because their log lives in a notebook, a spreadsheet or their head. The app solves
exactly three things: today's routine, the set-by-set log, and one progress metric — the heaviest
weight per exercise.

It is not a coach, it is not a social network, it does not count calories and it does not sell
programmes. The visual system exists to hold that up, not to disguise what is missing.

## The four principles

1. **The data is the ornament.** Hierarchy comes from figures and the type scale, not from boxes
   or effects. A screen that needs decoration to look designed is a screen short of content.
2. **One accent.** Orange marks the primary action and today. Two uses. Everything else is ink on
   warm black.
3. **Nothing judges.** Target reps are informational, the timer does not punish, and last time's
   weight is a reference rather than a goal. The system's tone follows that product decision.
4. **It is used standing up, one-handed, with a dirty screen.** 44 px of target minimum, the
   primary action within thumb reach, no fine gestures.

## Voice

Short sentences, second person, no exclamation marks and no emoji. The product speaks **Spanish
only** (SRS · NF-4), so the examples below are the real copy.

| Like this | Not like this |
|---|---|
| «Hoy toca pecho y tríceps.» | «¡Vamos por ese pecho! 💪» |
| «La vez pasada: 67.5 kg × 8.» | «Supera tu récord anterior» |
| «Descansa 90 segundos.» | «¡Descanso terminado, a darle!» |
| «Marca nueva: 92 kg.» | «¡Felicidades, eres una máquina!» |

## The folder

| | |
|---|---|
| [`tokens.json`](tokens.json) | Every value in the system, each with the note that says what it is for. Nothing else holds a colour or a length |
| [`DECISIONS.md`](DECISIONS.md) | The numbered decision log, and the problems still open |
| [`color.md`](color.md) | The roles, the single-accent rule, and the measured contrast table |
| [`typography.md`](typography.md) | Three families, fourteen styles, and the rules that are not negotiable |
| [`layout.md`](layout.md) | The spacing scale, the vertical budget, and how a screen is composed |
| [`photography.md`](photography.md) | The window, the gradient, which image works and what it costs |
| [`feedback.md`](feedback.md) | Success, warning, error and loading: which piece, and what to say |
| [`forms.md`](forms.md) | Fields, keyboards, validation, and logging a set |
| [`accessibility.md`](accessibility.md) | Contrast, touch targets, screen reader, dynamic type |

How all of this reaches React Native — the generator, `makeStyles`, the component names — is the
client's business and lives in
[`../apps/mobile/docs/agents/design-system.md`](../apps/mobile/docs/agents/design-system.md).

## The shape of things

- **Colour.** Warm black `bg`, surface `surface`, ink `ink` and a rust orange `accent`. One theme
  in V1 (SRS · D43); the tokens are centralised so a second is mechanical.
- **Type.** Condensed at 900 for titles and figures, the system font for body. Labels uppercase
  with 2 px of tracking.
- **Space.** A base-4 scale, a 20 px side margin, and a vertical budget that always subtracts the
  83 px of the tab bar.
- **Shape.** Everything is round: pills, discs and circular thumbnails; cards take radii from 12
  to 20. No shadows — depth comes from surface and air.
- **Photography.** One image per screen, inside a window with margins, gradient mandatory, **no
  tint**.

## What this system does not do

- **No shadows and no elevation.** If two planes have to be told apart, change the surface. This
  one has teeth: it is why a pinned header cannot work here (**DS6**).
- **No decorative gradients.** The only one allowed is the one that guarantees text contrast over
  a photograph.
- **No second accent.** Green and red exist as signal (`ok`, `danger`) and never as style.
- **No containers around a figure.** A number is marked by being brighter, not by being boxed
  (**DS5**).
- **No brand iconography and no emoji.** Icons are stroke; the exercise illustration comes from
  the catalogue. The single exception is a third party's own sign-in mark, which the system does
  not get to redraw (**DS9**).
- **No animation that carries meaning.** Whatever an animation says has to be written as well.

## Changing it

1. A value changes in [`tokens.json`](tokens.json), never anywhere else.
2. A rule changes in the page that owns it, and if it overturns something the system used to say,
   it gets a numbered line in [`DECISIONS.md`](DECISIONS.md).
3. The client regenerates with `yarn tokens`; a removed token is then a compile error at every use.
4. Both ship in the same pull request as the code, like every other document here.

Before a value enters: **measure it**. Contrast against `bg` and against `surface`, and the width
of the longest real string it has to hold. Three of the four defects found on the first device run
were two values of the same tone assuming they would be told apart, and a fourth was a figure that
did not fit the circle drawn for it.
