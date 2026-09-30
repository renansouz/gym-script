import { describe, it, expect } from 'vitest'
import { calculateStreak } from '../streak'

const T = '2026-09-29' // fixed "today" (Tuesday)
const set = (...d) => new Set(d)

describe('calculateStreak', () => {
  it('returns 0 with no workouts', () => {
    expect(calculateStreak(set(), 2, T)).toEqual({ streak: 0, workedOutToday: false })
  })

  it('BUG FIX: a brand-new user with one session today has a streak of 1, not 2-3', () => {
    expect(calculateStreak(set('2026-09-29'), 2, T).streak).toBe(1)
  })

  it('one session yesterday (none today) is a streak of 1', () => {
    expect(calculateStreak(set('2026-09-28'), 2, T)).toEqual({ streak: 1, workedOutToday: false })
  })

  it('never grants rest-day allowance before the first-ever session', () => {
    // first session 3 days ago, then nothing: today+yesterday are allowed rests (2), so streak is 3 days walked
    expect(calculateStreak(set('2026-09-26'), 2, T).streak).toBe(3)
    // first session 6 days ago and nothing since: streak is broken (only forgiven rest days) -> 0
    expect(calculateStreak(set('2026-09-23'), 2, T).streak).toBe(0)
  })

  it('counts consecutive workout days', () => {
    expect(calculateStreak(set('2026-09-27', '2026-09-28', '2026-09-29'), 2, T).streak).toBe(3)
  })

  it('allows up to 2 rest days per rolling week', () => {
    const d = set('2026-09-29', '2026-09-27', '2026-09-25', '2026-09-24', '2026-09-23')
    expect(calculateStreak(d, 2, T).streak).toBe(7)
  })

  it('breaks when a window has 3 rest days', () => {
    const d = set('2026-09-29', '2026-09-24')
    // 29 (W), 28 (R), 27 (R), 26 (R -> violation): only the 3 days before the violation count
    expect(calculateStreak(d, 2, T).streak).toBe(3)
  })
})
