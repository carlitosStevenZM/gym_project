# Forms and data entry

The app asks for little, but it asks in the worst possible context: standing, one-handed, between
sets, with a dirty screen (SRS · NF-3). Input design beats aesthetics here.

## The logging rule

**Logging a set is two taps and two values** (SRS · FR-6). That sentence is the yardstick: if,
once built, it needs one more tap, it was built wrong.

Which is why weight and reps are not typed into an ordinary field. They are captured with a
stepper of 64 px keys and steps that know about gyms — 2.5 kg on a barbell, 1 rep. The numeric
keyboard is the emergency exit, for a value the step cannot reach.

| Value | Step | Why |
|---|---|---|
| Barbell weight | 2.5 kg | The smallest plate in common use per side |
| Dumbbell or machine | 1 kg | The real jump on the rack |
| Reps | 1 | — |
| Held down | ×4 | To get from 20 to 80 without twenty taps |

One weight field for everything (SRS · D31): on pull-ups and dips it is the added weight, 0 if
none; on a stack machine, the number on the pin.

## Fields

| Rule | Why |
|---|---|
| The label is always visible above, never only a placeholder | A placeholder leaves on the first keypress and takes the reference with it |
| One field per row | You do not tab sideways one-handed |
| The right keyboard: numeric for kilos, email for email | The wrong keyboard is a design error, not a user error |
| Height `input-h` (52) and an `input-line` border at 3.5:1 | A control border has to reach 3:1 |
| The active field takes a 2 px `focus` border | Focus is always visible, including with a hardware keyboard |
| Units outside the field, never typed into the value | «kg» as a grey suffix |

Disabling is only possible with a reason the user can read. A dead control that does not say why
it is dead is not a state, it is a bug — the implementation makes this the type signature rather
than a convention.

## Validation

1. **Validate on blur, not on keypress.** Marking an email invalid on the third letter is
   harassment.
2. **The error lives under its field**, in `danger`, with an icon and text, and says how to fix it.
3. **Never clear what the user typed** to "tidy up" an error.
4. **The target is never validated.** The rep range is informational: the app does not warn or
   correct if you did 6 where it said 8–12 (SRS · D14).
5. **A blank set is not saved** (SRS · D32). It is not an error; it simply does not exist.

## Actions

- Primary at the bottom, 230 px centred, or full width in a sheet.
- The destructive action never sits next to the primary: it lives at the end, separated by
  `space-8`, in `danger`, behind a confirmation dialog.
- While saving, the button goes busy; the form does not lock.

## What there is not

- **No silent autosave in settings forms**: what is saved is confirmed.
- **No unmarked optional fields**: if something is optional, the label says so.
- **No unit picker**: the app is in kilos (SRS · D28, NF-5).
