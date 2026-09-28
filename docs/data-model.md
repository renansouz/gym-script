# Data Model: The Workout Program

## Schema

`src/data/workoutProgram.js` exports `WORKOUT_PROGRAM`, an array of **day** objects:

```ts
type WorkoutDay = {
  id: string; // stable, e.g. 'day1' never reuse or reassign
  order: number; // 1-based position in the rotation
  name: string; // e.g. "Push A"
  focus: string; // short subtitle, e.g. "Chest emphasis" (can be '')
  exercises: Exercise[];
};

type Exercise = {
  id: string; // stable, globally unique, e.g. 'd1-bench-press'
  name: string;
  sets: number;
  repsMin: number;
  repsMax: number; // equal to repsMin if it's a fixed rep target
  restMinSec: number;
  restMaxSec: number; // equal to restMinSec if it's a fixed rest time
  unit?: string; // optional override, e.g. 'per leg', 'per side', 'seconds'
  isTimeBased?: boolean; // true for planks/carries hides the "weight" input
};
```

## Why exercise IDs are permanent and hand-picked (not auto-generated)

IDs like `d1-bench-press` are written by hand rather than generated (e.g. via array index or a UUID at runtime) for one critical reason: **`history` and PRs are keyed by exercise ID.** If IDs were derived from array position, reordering exercises within a day something a future "customize program" feature will let users do would silently reassign a different exercise's history to the wrong ID. Hand-picked, descriptive, stable IDs make this impossible, and they're also easier to debug when inspecting `localStorage` directly.

**If you hand-edit `workoutProgram.js`:** you can freely change an exercise's `name`, `sets`, rep/rest ranges, etc. but never change or reuse an existing `id` for a _different_ exercise, or its logged history will attach to the wrong lift. Adding a brand-new exercise is always safe; just give it a new, never-before-used ID.

## Why rest is a range (`restMinSec`/`restMaxSec`), not a single number

The source program specifies rest as ranges ("rest 2 to 3 min"). Rather than collapsing that to one number, the range is preserved and the UI (`src/utils/rest.js`'s `getRestPresets`) derives up to 3 quick-tap timer buttons from it (min, midpoint, max), so e.g. for bench press's 2–3 min rest you get **[2m] [2m 30s] [3m]** buttons instead of the app guessing a single "correct" value for you.

## Why `sets`/`repsMin`/`repsMax` are targets, not a checklist

Gym Script deliberately does not ask you to check off each individual set. `sets`/`repsMin`/`repsMax` are shown as a **target** (e.g. "4 sets × 5–8 reps") next to a single Best Set input. This is the core "Best Set Principle" from the product spec: the number that best predicts progression is your best set of the day, not a full per-set log so that's the only number Gym Script asks you to enter.

## Extensibility: making the program user-editable

The store copies `WORKOUT_PROGRAM` into its own persisted `program` field on first load (see `docs/state-management.md`). This means a future in-app editor only needs to:

1. Add store actions like `addExercise(dayId, exercise)`, `updateExercise(exerciseId, changes)`, `reorderExercises(dayId, newOrder)`, `renameDay(dayId, name)`.
2. Mutate `state.program` directly via `set()` no changes needed to `history`, `sessions`, or the streak logic, since those are keyed by exercise ID and calendar date, not by position in `program`.
3. Removing an exercise a user has history for is the one case worth a deliberate product decision (hide it from the active program but keep its `history` for PR purposes, vs. hard-delete both) not implemented in V1, flagged here for whoever builds that feature next.
