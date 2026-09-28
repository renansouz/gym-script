/**
 * Derives 1-3 quick-tap rest-timer presets (in seconds) from an exercise's
 * restMinSec/restMaxSec range, and a human label like "60s" or "2-3 min".
 */
export function getRestPresets(restMinSec, restMaxSec) {
  const presets = new Set()
  presets.add(restMinSec)
  if (restMaxSec && restMaxSec !== restMinSec) {
    const mid = Math.round((restMinSec + restMaxSec) / 2 / 15) * 15
    if (mid > restMinSec && mid < restMaxSec) presets.add(mid)
    presets.add(restMaxSec)
  }
  return Array.from(presets).sort((a, b) => a - b)
}

export function formatSeconds(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  if (m === 0) return `${s}s`
  if (s === 0) return `${m}m`
  return `${m}m ${s}s`
}

export function formatRestRange(restMinSec, restMaxSec) {
  if (!restMaxSec || restMaxSec === restMinSec) return formatSeconds(restMinSec)
  return `${formatSeconds(restMinSec)}–${formatSeconds(restMaxSec)}`
}

export function formatClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
