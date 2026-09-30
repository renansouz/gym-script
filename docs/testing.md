# Testing

Run: `npm test` (Vitest).

Covered now:
- `src/utils/__tests__/streak.test.js` — streak algorithm, including the fix that streak/rest-day allowance
  never reaches before the first-ever session, and that a streak of only forgiven rest days is 0.

- `src/lib/__tests__/supabaseConfig.test.js` — env/URL normalization and invalid-config detection.
- `src/__tests__/authGate.test.jsx` — signed-out → login, loading → blank, signed-in → dashboard, sign-out → login.

Planned with V2 backend: exercise-library reuse logic, Supabase RLS policy tests.
Manual check for the stepper layout: browser devtools at 375px width, open a workout, confirm both rows fit.
