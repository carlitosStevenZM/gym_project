# Lightweight SRS — Gym routine and progress app

**Version:** v1.10 — agreed
**Date:** October 26, 2026
**Based on:** [`DISCOVERY.md`](DISCOVERY.md) (the original idea and the two rounds of questions), the [`assets/prototype.html`](assets/prototype.html) prototype, and the **meeting of October 15, 2026**, where the v0 draft was reviewed and the domain model was closed.
**Status:** 🟢 **Closed.** No inconsistencies, no open points. The data model is in [`DATA-MODEL.md`](DATA-MODEL.md).

> **A note on language.** This document is in English because the code will be. The product itself ships in Spanish only (NF-4), so every user-facing string stays Spanish. The glossary in §3 maps both ways on purpose: the Spanish column is how we talk about it, the English column is how we name it in code.

---

## 1. Why this document exists

It is the reference for what we are building. It is written so that two people can develop without re-arguing the same thing every week.

**How to use it:** if something you are about to write code for is not in here, or is ambiguous, don't settle it in the code. Settle it here first.

Nothing is open at the moment. Every decision is in §4, numbered, with its origin.

---

## 2. Product

### 2.1 What it is

A **mobile app** for someone who trains at the gym to build their routines, look them up when they forget, log what they lift, and see whether they are improving.

### 2.2 Who it serves

- **Beginners** who don't remember their routine and don't always have someone to ask.
- **Intermediates** who want a serious record of their progress instead of a notebook or a spreadsheet.

### 2.3 What problems it solves

| Problem | How it solves it |
|---|---|
| "I forgot what I'm training today" | Today's routine, always at hand, with an image per exercise |
| "I don't know if I'm improving" | Every set logged, plus a max-weight chart per exercise |
| "How much did I lift last time?" | The app shows the previous session while you log |

### 2.4 Who it is NOT for

Coaches with clients · gym owners · nutrition, calories or body weight · social feed or sharing workouts.

### 2.5 Platform and team

| | |
|---|---|
| **Platform** | Mobile app, Android and iOS |
| **Client** | **React Native + Expo** |
| **Backend** | **FastAPI**, with PostgreSQL (D37, D38) |
| **Repository** | A single monorepo holding both (D39) |
| **Web** | Not a goal. If React Native produces it, it's a bonus, not a deliverable |
| **Ruled out** | Plain web and Angular (the project is mobile), Kotlin (and there is no physical Android device to test on) |
| **Split** | Alger on the data model and backend; Carlos on the client and part of the backend |

---

## 3. Glossary

These words mean this and nothing else — in the code, in the UI, and in conversation.

| Spanish (how we talk) | English (how we code) | Definition |
|---|---|---|
| **Ejercicio** | `Exercise` | A movement from the **catalog**. E.g. overhead press. We define it; users can't edit it |
| **Serie** | `ExerciseSet` | One real set of an exercise. Stores the **reps and weight** that actually happened |
| **Repetición** | rep | One movement inside a set |
| **Rutina** | `Routine` | **A group of exercises for one day.** E.g. "Pecho y tríceps". It has no day assigned: it is reusable |
| **Ejercicio de rutina** | `RoutineExercise` | An exercise **as configured inside a routine**: its position, its set count and its target rep range. It stores no name — it takes it from the catalog |
| **Entrenamiento semanal** | `WeeklyTraining` | **A set of 7 days**, where each day points at a routine or at rest. It is the calendar |
| **Día de entrenamiento** | `WeeklyTrainingDay` | One of the 7 days of a weekly training. It has a routine, or nothing (rest) |
| **Sesión de rutina** | `RoutineSession` | **What a person actually trained on a day.** Date, start and end time, which routine, and the records of the exercises they did |
| **Registro de ejercicio** | `ExerciseRecord` | What they actually did for **one** exercise inside a session: the exercise and its sets. The date is inherited from the session |
| **Grupo muscular** | `MuscleGroup` | The big one. There are six: chest, back, legs, shoulders, arms, abs |
| **Subgrupo muscular principal** | `MuscleSubgroup` | The specific one: upper chest, rear delt. Informational |
| **Repeticiones objetivo** | target reps | A range (8–12) the routine suggests. **Visual only: the app never validates against it** |

> **The three distinctions that hold the model together:**
> 1. **Routine** is the day (chest and triceps). **Weekly training** is the week. They are not the same and are never used as synonyms.
> 2. **Exercise** is the catalog (what exists). **Exercise record** is reality (what you did). Two separate entities.
> 3. **Weekly training** is the plan. **Routine session** is what you trained. What happened on a given day is never called an "entrenamiento" — that word is already taken by the plan.

### What not to call them

Every row below is a name that was genuinely used for that concept at some point, which is why it
is worth forbidding. Using the wrong one is not a style slip: it makes two people talk about
different tables.

| This | Never call it | Where the wrong name comes from |
|---|---|---|
| **Rutina** | rutina semanal, entrenamiento, sesión, día | `DISCOVERY.md` fused the day and the week into "rutina semanal", and that is where the ambiguity started |
| **Entrenamiento semanal** | programa, rutina semanal, rutina | "Programa" is what `DISCOVERY.md` called it before it was renamed |
| **Sesión de rutina** | entrenamiento, workout | **The dangerous one.** `DISCOVERY.md` defines *entrenamiento* as "what you actually did on a day", which is this. The SRS gave that word to the plan instead |
| **Serie** | registro de serie, set | "Registro de serie" is the `DISCOVERY.md` name |
| **Ejercicio** | registro de ejercicio, movimiento | The catalog entry, not what you did with it |
| **Registro de ejercicio** | ejercicio | What you did, not the catalog entry |

> **Reading `DISCOVERY.md` is a trap for one word.** It is a frozen archive and is never corrected
> backwards (that is deliberate), so its glossary still says *entrenamiento* for what this document
> calls a **sesión de rutina**, and *programa* for what this one calls an **entrenamiento semanal**.
> When the two disagree, this table wins.

---

## 4. Decisions

Every decision with its origin. The ones from the October 15 meeting are closed.

| # | Decision | Origin |
|---|---|---|
| D1 | **The weekly training is the primary structure.** 7 days, each with a routine or rest | Meeting Oct 15 |
| D2 | **A single day's routine cannot be swapped.** To train something else you change the whole weekly training. The "Otra rutina" button is removed | Meeting Oct 15 |
| D3 | **Multiple weekly trainings are allowed**, switched with a selector. The switch applies to the current day and the ones after it | Meeting Oct 15 |
| D4 | **The weekly training is reusable and permanent**: it always shows all 7 days, not just the ones left in the current week, and it is not wiped when the week ends | Meeting Oct 15 |
| D5 | **Rest days are not recorded.** Nobody cares when you rested | Meeting Oct 15 |
| D6 | **The "Actividad" entity is removed.** It was only an abstraction layer over exercise. A routine holds a list of exercises | Meeting Oct 15 |
| D7 | **Exercise (catalog) and Exercise record are separate entities** | Meeting Oct 15 |
| D8 | **A set is an entity** with reps and weight, not two loose fields on the record | Meeting Oct 15 |
| D9 | **Progress is measured per exercise, never per person**, and the metric is **max weight over time** | Meeting Oct 15 |
| D10 | **Volume / total weight moved is dropped** as a metric, both in the chart and in the summary | Meeting Oct 15 |
| D11 | **Sets are fixed**: defined when the routine is created, and cannot be added mid-workout | Meeting Oct 15 |
| D12 | **Unplanned exercises cannot be added** mid-workout | Meeting Oct 15 |
| D13 | **There is no free workout without a routine** | Meeting Oct 15 |
| D14 | **Target reps are a range and informational only.** The app neither validates nor warns | Meeting Oct 15 |
| D15 | **The rest timer stays**, configurable and visible, because logging happens set by set | Meeting Oct 15 |
| D16 | **Each exercise has exactly one primary muscle subgroup.** No secondary muscles | Meeting Oct 15 |
| D17 | **Logging a set captures two values: weight and reps.** Probably with selects | Meeting Oct 15 |
| D18 | **Only the current day can be logged.** Past days are not backfilled | Meeting Oct 15 *(implicit, confirm)* |
| D19 | Catalog navigation in **2 levels**: muscle group → exercise. The subgroup is metadata | v0, confirmed in the meeting |
| D20 | A routine stores **set count and target rep range**, but **no target weight** | v0, confirmed in the meeting |
| D21 | While logging, the app **shows the previous session** for that exercise | v0, not discussed in the meeting. Kept |
| D22 | Set count and target rep range are configured **per routine**, on **`RoutineExercise`**. The catalog does not carry them | Oct 15, after the meeting |
| D23 | `RoutineExercise` **has no name of its own**: it takes it from the catalog. Two uses of the same exercise are told apart by their numbers | Oct 15, after the meeting |
| D24 | For per-exercise annotations inside a routine there is a free-text **note** field | Oct 15 · **[V1.1]** |
| D25 | **`RoutineSession`** is added between the weekly training and the records. It carries date, start and end time, and which routine was trained. The exercise record loses its date and duration | Oct 15, after the meeting |
| D26 | **Six muscle groups**: chest, back, legs, shoulders, arms, abs. Calves live inside legs | Oct 15, after the meeting |
| D27 | **The "most reps" record is removed.** Without a reference weight the lightest set always wins it, and you never beat it again | Oct 15, after the meeting |
| D28 | **Weights in kilograms**, no unit selector | Oct 15 |
| D29 | **V1 requires an internet connection.** Offline support is deferred | Oct 15 |
| D30 | **Rest is a day's default state.** It is not chosen: a day with no routine assigned is rest. While configuring the weekly training you can clear a day's routine and it becomes rest again | Oct 15 |
| D31 | **One single weight field for every exercise.** No special types: on pull-ups and dips you enter the added weight (0 if none), on level-based machines the number on the dial | Oct 15 |
| D32 | **Sets left blank are not saved.** A set exists only if it was captured | Oct 15 |
| D33 | **Exercise equipment is unused in V1**, but the data is stored: it comes with the import | Oct 15 |
| D34 | **The catalog is imported from `free-exercise-db`** (MIT license), translated, and **lives in our own database**. No external API is called at runtime | Oct 15 |
| D35 | **The rest timer lives in Settings and is editable.** It is **one default value that applies to every exercise**; it is not configured per routine or per exercise. If that turns out to be needed, we'll revisit | Oct 15 |
| D36 | **Max weight is the only progress metric** in V1. No other is added | Oct 15 |
| D37 | **The backend is FastAPI.** | Oct 25 |
| D38 | **PostgreSQL is the database.** `DATA-MODEL.md` already assumes it: `citext`, `timestamptz`, partial unique indexes | Oct 25 |
| D39 | **One monorepo** holds the backend, the client and the requirements. Shared docs live at the root; each app carries its own architecture and conventions beside its code | Oct 25 |
| D40 | **Each app lives in `apps/<app>/`**, flat: `apps/mobile` and `apps/backend` today, and anything new lands beside them. No `apps` against `services` split until there is something to split | Oct 25 |
| D41 | **Every set is sent to the server the moment it is recorded.** The session is created when training starts (`ended_at` null) and closed when it ends, so closing the app mid routine loses nothing | Oct 26 |
| D42 | **Navigation uses the system's native tabs.** The prototype is the reference for the screens, not a contract for the navigation chrome: it is drawn by the OS and looks different on Android and on iOS | Oct 26 |
| D43 | **V1 ships with a single theme.** No light and dark, no theme setting. The tokens stay centralised, so adding a second one later is mechanical | Oct 26 |
| D44 | **The interface goes through i18n from the start**, with a single locale (NF-4). No user-facing literals in screen code | Oct 26 |

---

## 5. Domain model

> **Source:** the diagram drawn in the meeting is at [`assets/domain-model-2026-10-15.png`](assets/domain-model-2026-10-15.png). What follows is that same model, completed and with the corrections explained in §10.
>
> **The full database model — every table, column, key and index — is in [`DATA-MODEL.md`](DATA-MODEL.md)**, with a Mermaid diagram and a drawn one. This section is the conceptual shape; that document is what you build from.

```
User
  │  name · email · auth provider
  │
  ├── WeeklyTraining (many)  ····································· THE CALENDAR
  │     │  name
  │     │  is_active            (which one is in use)
  │     └── WeeklyTrainingDay × 7  (Monday … Sunday, fixed)
  │           └── routine_id → Routine   ·  NULL = rest
  │
  ├── Routine (many)  ············································ THE PLAN
  │     │  name  (e.g. "Pecho y tríceps")
  │     └── RoutineExercise (ordered list)
  │           ├── exercise_id → Exercise      (the name comes from here)
  │           ├── position
  │           ├── target_sets
  │           ├── target_reps_min / max
  │           └── note  (free text, optional)   ← V1.1
  │
  └── RoutineSession (many)  ····································· REALITY
        │  date
        │  started_at · ended_at   (duration is subtracted, never stored)
        │  routine_id → Routine    (which routine was trained that day)
        │
        └── ExerciseRecord (many)
              │  exercise_id → Exercise
              │
              └── ExerciseSet (list)
                    ├── set_number
                    ├── reps     (what was actually done)
                    └── weight

Exercise  ······················································ THE CATALOG
  │  Global. We define it; users can't edit it
  ├── name                       (overhead press)
  ├── muscle_group               (shoulders)
  ├── primary_muscle_subgroup    (rear delt)  · informational
  ├── equipment                  · stored, unused in V1 (D33)
  └── image
```

### The rules that hold the model together

1. **`ExerciseRecord` points at the catalog `Exercise`, never at the routine.** That is why progress survives any change of routine or weekly training: it does not matter which plan you did it under — what is stored is that on that day you did that exercise with those weights.

2. **A rest day is not an entity.** It is a `WeeklyTrainingDay` with a null `routine_id`. No record is stored.

3. **Set count and target rep range live on `RoutineExercise`, not on `Exercise`.** Sets and reps are not a property of the exercise, they are programming: the same bench press is 4×6 for strength and 3×12 for hypertrophy — see §10.1.

4. **Date and duration belong to the session, not to an exercise record.** The record only knows which exercise it was and which sets were done — see §10.2.

---

## 6. Functional requirements

Format: user story + verifiable criteria.
Priority: **[V1]** first release · **[V1.1]** after that · **[V2]** later.

---

### FR-1 · Authentication — [V1]

*As a user I want to sign in with my Google account or with email and password, so I don't lose my data.*

- One-tap Google sign-in
- Sign-up with email + password (8 characters minimum)
- If someone signed up with Google and then uses email/password with **the same address**, the accounts are linked; a second one is not created
- Password recovery by email
- The session does not expire between app launches
- Sign out available
- **[V1.1]** Delete account and all of its data

> The how (tokens, hashing, refresh) is technical design and does not belong in this document.

---

### FR-2 · Exercise catalog — [V1]

*As a user I want to quickly find the exercise I'm looking for and see how it's done.*

- Two-step navigation: **muscle group → exercise list** (D19)
- Muscle groups, **six**: chest · back · legs · shoulders · arms · abs (D26)
- Search by name, tolerant of accents and typos
- Exercise detail: name, image, muscle group, primary muscle subgroup
- Each exercise has exactly **one** primary muscle subgroup (D16)
- The catalog is global; users cannot add or edit exercises
- **Imported from `free-exercise-db`** and translated to Spanish; it lives in our database, with no dependency on an external API (D34)
- **[V2]** Filter by muscle subgroup, for advanced users

---

### FR-3 · Create a routine — [V1]

*As a user I want to build my routine for a day so I don't have to remember it or ask anyone.*

Agreed flow:

1. New routine → give it a name (e.g. "Pecho y tríceps")
2. Add exercises: muscle group → list with images → select. Several can be added before going back
3. For each exercise, set **how many sets** and the **target rep range**
4. Reorder exercises by dragging: you finish one and then move to the next
5. Save

- The rep range is informational (D14)
- **No target weight is captured** (D20)
- No limit on the number of routines
- **[V1.1]** A free-text **note** per exercise inside the routine (D24)
- Edit and duplicate an existing routine
- Deleting a routine **does not affect the history** of those exercises

---

### FR-4 · Browse routines — [V1]

*As a user I want to see the routines I've built.*

- List of all my routines
- Opening one: its exercises in order, with image and set count
- Readable at a glance, standing up, one-handed
- Lives in its own **Rutinas tab**

---

### FR-5 · Weekly training — [V1]

*As a user I want to plan my week and have the app tell me what's on today.*

- Create a weekly training with a **free-text name** ("Rutina 1", "Pecho + pierna", anything)
- Assign a routine to whichever of the **7 days** you want
- **Rest is the default** (D30): a day with no routine assigned is rest. There is nothing to pick
- A day's routine can be **cleared** — it becomes rest again — or reassigned
- All 7 days are always shown, regardless of what day it is today (D4)
- **Multiple weekly trainings**, with a **selector above the day assignment** to choose the active one (D3)
- Switching weekly training **applies to the current day and the ones after**; past days are untouched
- The weekly training is not wiped when the week ends: it repeats
- **A single day's routine cannot be swapped** (D2)

---

### FR-6 · Log the workout — [V1] · *the most important screen*

*As a user I want to log what I lift, between sets, without fighting my phone.*

- The home screen shows today's routine according to the active weekly training, plus a button to start
- Starting shows that routine's exercises, in order
- Each exercise shows **exactly the sets the routine defined** (D11)
- Each set captures **weight and reps** (D17), and is confirmed
- The weight field is **the same one for every exercise** (D31): on pull-ups or dips you enter the added weight, 0 if none; on level-based machines, the number on the dial
- A set left blank **is not saved** (D32)
- Confirming a set starts the **rest timer**, which can be skipped (D15). Nothing happens when it runs out: it is informational
- **What was done last time** for that exercise is shown as a reference (D21)
- On finishing, a summary with **how long it took** and what was done
- Sets **cannot** be added (D11)
- Exercises outside the routine **cannot** be added (D12)
- There is **no** free workout without a routine (D13)
- Only the current day is logged (D18)
- The summary does **not** show total sets or weight moved (D10)

**Quality bar:** logging a set must be two taps and two values. If it takes more than that once built, it was built wrong.

---

### FR-7 · History — [V1]

*As a user I want to see what I trained and how much I lifted.*

- History per exercise: every time I've done it, with date, weight and reps of each set
- Fix a record if it was mistyped
- History per day: a list of **routine sessions**, with date, which routine was trained and how long it took

---

### FR-8 · View progress — [V1.1]

*As a user I want to see whether I'm improving.*

- **Line chart per exercise**, one point per day (D9)
- The day's value is the **heaviest weight lifted that day in that exercise**
  > If in one session you lifted 10, 10 and 30 kg, that day's point is **30 kg**
- Time ranges: 1 month · 3 months · 1 year · all
- Single record shown: **heaviest weight** for that exercise, with its date
- Records dropped: **best volume** (D10) and **most reps** (D27)
- Progress is always per exercise and is **independent of whichever weekly training** was active on any given day
- Max weight is the **only** metric. No other is added (D36)

---

### FR-9 · Settings — [V1.1]

- Active weekly training selector
- Rest between sets: **one default value that applies to every exercise**, editable (D35)
- Sign out
- **[V1.1]** Delete account

---

## 7. Non-functional requirements

Only the ones that actually constrain how it gets built.

| # | Requirement | Status |
|---|---|---|
| **NF-1** | **No data loss.** Every confirmed set survives a force-quit or a dead battery | Firm |
| **NF-2** | **Instant response while logging.** Confirming a set must not feel slow, even though it has to reach the server | Firm |
| **NF-3** | **One-handed use**, standing, with a dirty screen. Big targets, no fine gestures | Firm |
| **NF-4** | **Spanish as the only language** in V1, catalog included | Firm |
| **NF-5** | **Weights in kilograms.** No unit selector | Firm (D28) |
| **NF-6** | **The day is computed in the phone's time zone**, so training at 11 pm doesn't land on the next day | Firm |
| **NF-7** | **V1 requires a connection.** Offline work is deferred, to avoid complexity we don't need yet | Firm (D29) |

---

## 8. Out of scope

- **AI chat that builds the routine** — future idea, still undefined
- Features for coaches or gyms
- Nutrition, calories, body weight, measurements
- Sharing, following other users, social feed
- Cardio and time- or distance-based exercises
- Supersets, drop sets, RPE/RIR
- Apple Watch and wearables
- A web version as a deliverable
- Monetization

---

## 9. Release plan

| Version | Contains | What it achieves |
|---|---|---|
| **V1** | FR-1 Auth · FR-2 Catalog · FR-3 Routines · FR-4 Browse · FR-5 Weekly training · FR-6 Logging · FR-7 History | **The app is useful** and **starts generating data** |
| **V1.1** | FR-8 Progress · FR-9 Settings · delete account | **The app hooks**: there are finally weeks worth charting |
| **V2** | Muscle-subgroup filter · whatever users ask for | — |

**Why the chart isn't in V1:** a chart with three points tells nobody anything. History has to accumulate first.

---

## 10. Model defects found and resolved

Reviewed against the meeting diagram ([`assets/domain-model-2026-10-15.png`](assets/domain-model-2026-10-15.png)). **All of them are resolved.** The model was on the right track: splitting catalog / record / set is correct, and having `ExerciseRecord` point at `Exercise` rather than at the routine is exactly what lets progress survive changes of plan.

What follows is kept as a record of *why* the model looks the way it does.

### 10.1 · Sets cannot live in the catalog — ✅ **resolved Oct 15**

**What the diagram had:** `Exercise` with `name, set count, target reps, muscle group, primary muscle subgroup`. And `Routine` was just a column of "Exercise N" boxes pointing at it, with no attributes of its own.

**The problem:** `Exercise` is the **catalog**, and the catalog is **one single thing shared by every user**. If `bench press` carries `sets: 4`:

- Two of your own routines can't use bench press with different set counts
- Changing the sets in one routine changes them in all of them
- And it changes them **for every user of the app**

It also contradicted the agreed flow: step 3 of creating a routine is precisely where you set how many sets each exercise gets. That is configuration **of that routine**, not of the exercise as it exists in the world.

**How other apps handle it.** No exercise database carries sets or reps. `free-exercise-db` ships name, category, equipment, primary muscles, secondary muscles, level, mechanic, instructions and images — no prescription field at all. The reason is that sets and reps are **programming**, not exercise identity. To spare users from typing them every time, what these apps prefill is **the last thing that person did on that exercise**, not a catalog value.

**The agreed fix:** an entity between routine and exercise.

```
RoutineExercise
  routine_id · exercise_id · position · target_sets
  target_reps_min · target_reps_max · note (V1.1)
```

- `position` is what makes drag-to-reorder possible, which was also agreed and had nowhere to live either.
- **It stores no name.** It takes it from the catalog through the FK. If it copied the name, fixing a catalog name later would leave old routines showing the old one.
- **It has no user-editable name of its own.** Two uses of the same exercise are told apart by their numbers ("Bench press · 4 × 6" vs "· 3 × 12"), and the day's intent lives in the routine's name. A name of its own would also break progress identity: the chart groups by catalog exercise (D9), so it would show a different name than the routine does.
- To annotate something about that exercise in that routine ("close grip", "seat at 4", "this is the heavy one") there is the **note**, which is free text and not a second name. It also covers the case where the same exercise appears twice in one routine.

### 10.2 · Duration was in the wrong place — ✅ **resolved Oct 15**

**What the diagram had:** `ExerciseRecord` = `Exercise, Day/Date, Duration, Set[]`.

**The problem:** the duration agreed on for the summary screen is the **whole workout's** ("you finish and it tells you how long you took"), not each exercise's. But a day with four exercises is four records, so that field either stores four different durations nobody asked for, or four copies of the same number.

Duration ending up there was the symptom of the real gap: **no entity represented "the day"**. Which is also why there was nowhere to store which routine that day corresponded to — exactly what the history screen needs in order to say "Espalda y bíceps · Monday Oct 6".

**The agreed fix:** add the missing entity, between the plan and the records.

```
RoutineSession
  date · started_at · ended_at · routine_id
    └── ExerciseRecord (many)
```

- **`date` and duration move up from the record to the session.** `ExerciseRecord` keeps only the exercise and its sets.
- **`started_at` and `ended_at`** are stored, not duration: it gets subtracted. The start time is needed anyway for the live timer, and this way the same fact doesn't exist in two forms.
- The **FK to `routine`** is what lets history say "Espalda y bíceps · Monday Oct 6". It is a historical label, nothing more.
- **The session does not change progress**, which still hangs off the exercise and still does not depend on the routine (D9).
- It also closes the naming clash from §3: "weekly training" keeps the plan and "routine session" keeps reality.

### 10.3 · How a rest day is represented — ✅ **resolved**

This was explicitly delegated ("whatever you decide, whatever makes more sense to you").

**Resolution:** `WeeklyTrainingDay.routine_id` is **nullable**. Null = rest. No separate entity, no special type, no record.

It is what was already sketched on the whiteboard — in the diagram the five days without a routine are drawn as empty boxes — and it is consistent with D5: if we are never going to query when someone rested, rest is the absence of data, not data.

### 10.4 · Fields that were missing — ✅ **filled in**

What the diagram didn't have yet. Each one holds up something already agreed. All of them are in [`DATA-MODEL.md`](DATA-MODEL.md) now.

| Where | What was missing | Why it's needed |
|---|---|---|
| `WeeklyTraining` | **name** and **is_active** | Multiple ones were agreed, switched with a selector (D3). Without a name they can't be told apart; without `is_active` the app doesn't know which to use today |
| `RoutineExercise` | **position** | Dragging exercises to change their order was agreed |
| `ExerciseSet` | **set_number** | Without it, three sets with the same weight and reps are indistinguishable and there is no "the third set" |
| `Exercise` | **image** | The exercise detail with its demonstration is what solves "I don't know how to do it" |
| `User` | relations to `WeeklyTraining`, `Routine` and `RoutineSession` | The diagram didn't include it; it came from the earlier model |

---

## 11. Open points

**None.** All nine points from this section were closed on October 15 and live in §4 as D28 through D36.

---

## 12. Accepted risks

These are not objections: the decisions are made and they are reasonable. They are written down so that if the complaint ever shows up, we know where it comes from and don't treat it as a bug.

| Decision | What can happen |
|---|---|
| **D11** fixed sets · **D12** no extra exercises · **D2** no swapping a day's routine | The app cannot log a day that didn't go as planned: the machine was taken, the day you felt strong, the day you arrived late and did half. Since the app's value is the history, every deviation is a hole in the data |
| **D13** no free workout | The day someone trains without a plan, nothing gets recorded |
| **D29** no offline | Logging happens at the gym, where signal is usually bad. If the connection drops mid-session we have to decide what happens to what was already captured. Accepted in exchange for not carrying sync in V1 |
| **D9 / D36** max weight only | If you stay at 65 kg for three weeks but go from 6 to 8 reps, the chart looks flat even though you are improving. That is exactly the feeling of being stuck that the app set out to solve |

All of them are cheap to reverse **as long as the model leaves the door open** — which is why `RoutineExercise` stores `target_sets` as what was *planned* while the recorded `ExerciseSet` rows are what was *real*, with nothing forcing them to match.

---

## 13. Changelog

| Date | Version | Change |
|---|---|---|
| 2026-10-26 | v1.10 | Glossary gains a **what not to call them** table (§3): the names each concept was actually called before, and the warning that `DISCOVERY.md` uses *entrenamiento* and *programa* with meanings this document reassigned |
| 2026-10-26 | v1.9 | Client architecture settled, and the four decisions out of it that are not internal to the client: sets are sent as they are recorded (D41), native tabs and what that means for the prototype (D42), a single theme (D43) and i18n from the start (D44). The rest of the architecture lives in `apps/mobile/` |
| 2026-10-25 | v1.8 | Monorepo layout settled (D40): one folder per app under `apps/`, each carrying its own `AGENTS.md` and `docs/`. The scaffolding for both apps is in place, with the backend's own rules left as a placeholder for whoever owns it |
| 2026-10-25 | v1.7 | Stack recorded: **FastAPI** backend and **PostgreSQL** (D37, D38), both already assumed by the data model but never written down, and a **monorepo** (D39). §2.5 updated: the client is React Native + Expo, and Carlos also works on part of the backend |
| 2026-10-16 | v1.6 | Translated to English (except `DISCOVERY.md`). The full database model is split out into `DATA-MODEL.md`: users, auth identities, settings and catalogs as tables, with keys, constraints and indexes. `DATA-MODEL-EXPLAINED.md` added for Carlos. The prototype is brought in line with the agreed decisions |
| 2026-10-15 | v1.5 | Last open point closed: **max weight is the only metric** (D36). The SRS is closed |
| 2026-10-15 | v1.4 | Eight of the nine open points in §11 closed (D28–D35). Among them, **V1 will not work offline**, contrary to the v0 proposal |
| 2026-10-15 | v1.3 | Muscle groups closed at **six** (D26) and the "most reps" record removed (D27). No inconsistencies left |
| 2026-10-15 | v1.2 | §10.2 closed: **`RoutineSession`** is born, date and duration move up from the record to the session (D25) |
| 2026-10-15 | v1.1 | §10.1 closed: **`RoutineExercise`** is born and set count and target rep range move down from the catalog to the routine (D22, D23, D24). §10.2 corrected against the actual diagram: duration **was** there, sitting on `ExerciseRecord` |
| 2026-10-15 | v1 | Full review with the product owner. Changes of substance against v0: **(a)** the weekly training is the primary structure again, instead of the loose-template model; **(b)** progress is measured with **max weight**, not estimated 1RM; **(c)** volume dropped as a metric; **(d)** dynamic sets, extra exercises and free workouts removed; **(e)** React Native set as the stack; **(f)** the data model closed, except for the points in §10 |
| 2026-10-10 | v0 | Draft from the context, the questions and research into existing apps. Unvalidated |
