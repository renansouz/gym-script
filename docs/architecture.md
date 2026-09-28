# Architecture

## High-level shape

Gym Script is a single-page React app with exactly two top-level "screens," rendered conditionally from one root component there is no router, because the app doesn't need one (no shareable deep links, no back-button-sensitive navigation beyond what's handled in-view).

```
App.jsx
├── Dashboard              (always rendered when there's no active session)
│   ├── StreakCounter
│   ├── TodayCard
│   │   └── BottomSheet (day override picker)
│   └── YesterdayCard
└── ActiveWorkout          (rendered as a full-screen overlay when activeSession exists)
    ├── ExerciseView
    │   └── NumberStepper × 2 (weight, reps)
    ├── ExerciseDrawer      (BottomSheet jump to any exercise)
    └── RestTimer           (full-screen overlay when a timer is running)
```

## Why no router / no screen-state in App.jsx

`App.jsx` doesn't hold any "which screen am I on" state itself. Instead, it reads `activeSession` directly from the Zustand store:

```jsx
const activeSession = useGymStore((s) => s.activeSession);
return (
  <>
    <Dashboard />
    {activeSession && <ActiveWorkout />}
  </>
);
```

Starting a workout (`startWorkout(dayId)`) sets `activeSession` in the store; finishing or canceling it sets `activeSession` back to `null`. The UI is a pure function of that one piece of state. This avoids an entire class of bugs where local "current view" state and store state (e.g., "is there an active session?") can drift out of sync there is exactly one source of truth.

## Data flow

1. **Seed data** (`src/data/workoutProgram.js`) is a plain, hand-authored array the 6-day split. It's imported once into the store's `initialState.program`.
2. **The store** (`src/store/useGymStore.js`) is the only place that reads/writes workout data. Components never touch `localStorage` directly.
3. **Components** subscribe to just the slices of store state they need via Zustand selectors (e.g. `useGymStore((s) => s.getTodayDayId())`), so re-renders stay scoped and fast.
4. **Persistence** happens automatically: Zustand's `persist` middleware serializes the entire store to `localStorage` on every change and rehydrates it on load. There is no manual save/load code anywhere in the app.

## The active-workout flow in detail

1. Dashboard computes `todayDay` from `getTodayDayId()` (rotation logic + any override see `docs/state-management.md`).
2. Tapping "Start Workout" calls `startWorkout(dayId)`, which creates `activeSession = { date, dayId, index: 0, entries: {} }`.
3. `ActiveWorkout` renders `day.exercises[activeSession.index]` via `ExerciseView`, seeding a local `draft` state (weight/reps) from either the already-logged entry for this session, or last session's numbers as a sensible starting point.
4. Tapping "Log Best Set" calls `logBestSet(exerciseId, weight, reps)`, which writes into `activeSession.entries` nothing is committed to permanent history yet.
5. Navigation (`nextExercise` / `prevExercise` / jumping via the drawer) just moves `activeSession.index`.
6. On the last exercise, the primary button becomes "Finish Workout", which calls `finishWorkout()`. This is the **one and only** place that:
   - appends each logged entry to `history[exerciseId]`
   - pushes a session summary to `sessions`
   - clears `activeSession`
7. Exiting early (the X button) calls `cancelWorkout()` after a confirmation if any sets were logged nothing is written to history, so a canceled workout leaves no trace (by design: partial/abandoned sessions shouldn't pollute PR history or the streak).

## Styling approach

Tailwind utility classes are used directly in components rather than a separate CSS-in-JS layer, keeping the mobile-first sizing (large touch targets, generous spacing, `env(safe-area-inset-*)` handling for notches/home indicators) visible right next to the markup it affects. Shared visual primitives (`Button`, `BottomSheet`, `NumberStepper`) live in `src/components/shared/` to keep touch-target sizing and dark-mode contrast consistent everywhere they're used.
