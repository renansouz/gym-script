/**
 * All dates in Gym Script are stored as 'YYYY-MM-DD' local-date strings
 * (never full ISO timestamps with time) so that day-based comparisons
 * ("did I work out today?") are simple string equality checks, immune to
 * timezone drift within a single device.
 */

export function todayStr(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function yesterdayStr(date = new Date()) {
  const d = new Date(date)
  d.setDate(d.getDate() - 1)
  return todayStr(d)
}

export function daysAgoStr(n, date = new Date()) {
  const d = new Date(date)
  d.setDate(d.getDate() - n)
  return todayStr(d)
}

export function parseDateStr(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatFriendlyDate(str) {
  if (!str) return ''
  const date = parseDateStr(str)
  const today = todayStr()
  const yest = yesterdayStr()
  if (str === today) return 'Today'
  if (str === yest) return 'Yesterday'
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

/** ISO-8601 week key, e.g. "2026-W39", used to group workouts into weeks for the streak algorithm. */
export function weekKey(dateStr) {
  const date = parseDateStr(dateStr)
  const target = new Date(date.valueOf())
  const dayNr = (date.getDay() + 6) % 7 // Monday = 0
  target.setDate(target.getDate() - dayNr + 3)
  const firstThursday = new Date(target.getFullYear(), 0, 4)
  const diff = target - firstThursday
  const week = 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000))
  return `${target.getFullYear()}-W${String(week).padStart(2, '0')}`
}
