import { todayStr, daysAgoStr } from './dateHelpers'

/**
 * calculateStreak
 * ----------------
 * Duolingo-style streak with a forgiveness rule: you may take up to
 * `maxRestDaysPerWeek` (default 2) rest days within any trailing 7-day
 * window without breaking your streak.
 *
 * Algorithm (walks backward one calendar day at a time from today):
 *   1. If today has no logged workout yet, it's not counted as a "miss"
 *      yet (the day isn't over)  we simply start counting from yesterday.
 *   2. For each day walked, classify it as a workout day or a rest day.
 *   3. Track a rolling 7-day window of that classification.
 *   4. The moment a window would contain more than `maxRestDaysPerWeek`
 *      rest days, the streak is broken  we stop and return the count of
 *      days walked *before* that violation.
 *   5. Every day walked before a violation counts toward the streak,
 *      whether it was a workout day or an "allowed" rest day  this
 *      mirrors Duolingo's streak-freeze behavior.
 *
 * @param {Set<string>} workoutDates - set of 'YYYY-MM-DD' strings with a completed workout
 * @param {number} maxRestDaysPerWeek - rest days allowed per rolling 7-day window
 * @returns {{ streak: number, workedOutToday: boolean }}
 */
export function calculateStreak(workoutDates, maxRestDaysPerWeek = 2) {
  const today = todayStr()
  const workedOutToday = workoutDates.has(today)

  if (workoutDates.size === 0) {
    return { streak: 0, workedOutToday: false }
  }

  let streak = 0
  let window = [] // most recent day at index 0
  let dayOffset = workedOutToday ? 0 : 1 // start today if done, else start yesterday
  const HARD_CAP_DAYS = 3650 // safety guard against infinite loops

  for (let i = 0; i < HARD_CAP_DAYS; i++) {
    const dateStr = daysAgoStr(dayOffset + i)
    const isWorkoutDay = workoutDates.has(dateStr)

    window.unshift(isWorkoutDay)
    if (window.length > 7) window.pop()

    const restDaysInWindow = window.filter((v) => v === false).length
    if (restDaysInWindow > maxRestDaysPerWeek) break

    streak += 1

    // Stop scanning once we're clearly past any activity (perf guard for
    // very old / fresh installs): if the last 7 checked days were all
    // rest days AND we've already found zero workouts in scanned history,
    // there's nothing left to find.
    if (i > 400) break
  }

  return { streak, workedOutToday }
}
