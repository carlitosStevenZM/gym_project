# Feedback

Four tones, four pieces, and one rule above them: **the system informs, it neither celebrates nor
scolds.**

## The four tones

| Tone | Token | What it means | Example |
|---|---|---|---|
| Success | `ok` | Something was saved | «Serie registrada» · «Marca nueva: 92 kg» |
| Warning | `warning` | Worth knowing, does not block | «Sin conexión: la serie se guardará al volver» |
| Error | `danger` | Something failed and there is something to do | «No se pudo guardar la serie. Reintentar» |
| Neutral | `ink-soft` | Information with no charge | «Descanso terminado» |

No tone travels in the colour alone: each carries its own icon and its text says it. The three
signal colours also differ in lightness, not only in hue.

## Which piece

| Piece | When | How long |
|---|---|---|
| **Toast**, floating over the content | Confirming something that just happened and needs no decision | 3 s, or 5 s with an undo action |
| **Banner**, pinned under the header | A condition that lasts: offline, a session open elsewhere | Until the condition ends |
| **Inline error**, under the field | The problem is one specific value | Until the value changes |
| **Dialog** | Something destructive or irreversible has to be confirmed | Until the user decides |
| **Loading** | The wait goes past 300 ms | While it lasts |

**A toast never asks for a decision** — that is the dialog. **A dialog never informs without
asking** — that is the toast.

## What to say

Three parts, in this order: **what happened, why, and what to do.** Without the third it is a
complaint.

| Like this | Not like this |
|---|---|
| «No se pudo guardar la serie. Sin conexión. Reintentar» | «Error inesperado» |
| «Marca nueva: 92 kg» | «¡Enhorabuena, nuevo récord! 🎉» |
| «Descansa 90 segundos» | «¡Se acabó el descanso, a darle!» |
| «Este día quedó sin rutina» | «Operación completada con éxito» |

Never: exclamation marks, emoji, «¡Ups!», «Algo salió mal», or the passive voice.

## Behaviour

1. **What is confirmed is confirmed where it happened.** Logging a set is confirmed on the set,
   not with a floating toast: confirming the obvious is noise (SRS · NF-2).
2. **One toast at a time.** The second replaces the first; they do not stack.
3. **A toast floats 16 px over the tab bar**, never on top of it, and never over the primary
   action.
4. **Nothing disappears without a trace.** If an error dismisses itself, whatever failed stays
   visible where it was.
5. **Anything irreversible goes through a dialog**, and the destructive button says the verb:
   «Borrar cuenta», never «Aceptar».
6. **No data loss** (SRS · NF-1): if a set did not reach the server, the state says so and retries;
   it is not removed from the screen.

## Waiting

Three shapes, chosen by how much is known about what is coming, not by how long it takes.

| Shape | When |
|---|---|
| **Skeleton** | The shape of what is coming is known: a list, a card. Blocks at the real heights |
| **Inline spinner** | The shape is unknown, or the area is small |
| **Busy button** | The wait was caused by the user's own action. The label is replaced; the width does not change |

- **Under 300 ms, show nothing.** A flash is worse than the wait.
- **A skeleton imitates the real shape**: if five 48 px rows are coming, it has five 48 px rows.
- **A skeleton never carries text**, not even «Cargando…».
- **No fake percentages.**
- **Past ten seconds** it becomes an error with a retry: an infinite wait is a failure with no
  notice.
- **Logging a set never shows a wait** (SRS · NF-2): it paints as done immediately and reconciles
  behind.

## Open

The error banner is specified as `danger` at 15 % and there is no token for it, so the client
computes that one colour. A `danger-soft` would remove the exception.
