# State Management

Gym Script uses a single Zustand store (`src/store/useGymStore.js`), persisted to `localStorage` via `zustand/middleware`'s `persist`. There is no other client-side state store component-local `useState` is only used for ephemeral UI state that has no business being saved (e.g. whether a bottom sheet is open, the in-progress numeric draft before it's logged, whether the rest timer is running).

## Store shape

```js
{
  program: WorkoutDay[],        // the 6-day split (see docs/data-model.md)
  history: {
    [exerciseId]: Array<{ date: 'YYYY-MM-DD', weight: number, reps: number }>
  },
  sessions: Array<{
    date: 'YYYY-MM-DD',
    dayId: string,
    dayName: string,
    exerciseIds: string[]        // which exercises had a logged best set
  }>,
  overrides: {
    [date]: dayId                // one-off "do a different day today" choices
  },
  activeSession: null | {
    date: 'YYYY-MM-DD',
    dayId: string,
    index: number,                // which exercise is currently shown
    entries: { [exerciseId]: { weight, reps } }   // not yet committed to history
  }
}
```

## Why `history` is keyed by exercise ID, not by session

Storing history as `{ [exerciseId]: [...] }` rather than nesting it inside each session makes the two most common reads **"what's my last entry for this exercise?"** and **"what's my all-time PR for this exercise?"** O(1) lookups plus a linear scan of just that exercise's own (typically short) history, instead of scanning every past session. `sessions` is kept separately, purely as a chronological log for the Dashboard's "Yesterday" card and the streak calculation.

## Why the in-progress workout doesn't touch `history` until "Finish"

`activeSession.entries` is a scratch space. Nothing is appended to `history` or `sessions` until `finishWorkout()` runs. This means:

- Backing out of a set (changing the weight/reps before finishing) never leaves stray history entries.
- Canceling a workout entirely (`cancelWorkout()`) is a true no-op on your stats no partial/abandoned session pollutes your PRs or streak.
- Re-opening the app mid-workout (e.g. after the phone locks) restores `activeSession` from `localStorage` exactly as it was nothing is lost, and nothing is double-committed.

## Today's scheduled day: rotation + override

`getRotationDayId()` looks at the most recently **completed** session and returns the next day in the program's `order` sequence (wrapping back to day 1 after the last day). This is intentionally calendar-agnostic: the rotation advances based on workouts actually completed, not on the day of the week, so skipping a day (sick, travel, etc.) doesn't skip a workout in the split you pick up where you left off.

`getTodayDayId()` layers a one-off `overrides[today]` on top of the rotation result, so tapping "switch today's workout" on the Dashboard only affects today, without disturbing the underlying rotation for future days.

## Streak algorithm

Implemented in `src/utils/streak.js`. The rule, in plain language: **you can take up to 2 rest days in any rolling 7-day window without breaking your streak.**

The algorithm walks backward from today one calendar day at a time, maintaining a sliding window of the last 7 days' workout/rest classification:

1. If today doesn't have a logged workout yet, start counting from yesterday (today "not done yet" isn't the same as today "missed" the day isn't over).
2. For each day walked, push its classification (workout/rest) into a 7-day sliding window.
3. If that window ever contains more than 2 rest days, stop the streak ends there.
4. Every day walked before that point counts toward the streak total, whether it was a workout day or an "allowed" rest day (mirroring how Duolingo's streak freezes work: the streak number reflects consecutive days of consistency, not literal consecutive workout days).

This is intentionally a rolling-window rule rather than a simple "reset every Monday" rule, so the allowance always reflects your last 7 days, not an arbitrary calendar boundary.

**Note on tuning:** `calculateStreak(workoutDates, maxRestDaysPerWeek)` takes the allowance as a parameter (defaulting to 2, per the spec). If you want a stricter or looser policy, change the call site in `useGymStore.js`'s `getStreak()`.

## Persistence details

- **Library:** `zustand/middleware` → `persist` + `createJSONStorage(() => localStorage)`.
- **Storage key:** `gym-script-storage`.
- **Versioning:** the persisted blob carries a `version: 1` field. If the store shape changes in a future release in a way that's incompatible with existing saved data, bump this version and add a `migrate` function to `persist`'s config to transform old data forward rather than discarding it.
- **No manual save calls anywhere:** every store mutation (`set(...)`) is automatically serialized to `localStorage` by the middleware component code never imports `localStorage` directly.
