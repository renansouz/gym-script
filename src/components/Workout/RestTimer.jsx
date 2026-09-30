import { useEffect, useState } from 'react'
import { Pause, Play, X, Plus, Minus, Maximize2, Minimize2, Timer } from 'lucide-react'
import { useGymStore } from '../../store/useGymStore'
import { formatClock } from '../../utils/rest'
import { fireRestAlert, scheduleRestNotification, cancelRestNotification } from '../../utils/restAlert'

/**
 * Global rest timer. Mounted once in App (NOT inside a screen) so it keeps
 * running while the user navigates, edits weights, or opens the drawer.
 * Compact bar by default (never blocks the UI); tap to expand to the big ring.
 */
export default function RestTimer({ hasFooter }) {
  const timer = useGymStore((s) => s.restTimer)
  const adjustRest = useGymStore((s) => s.adjustRest)
  const togglePauseRest = useGymStore((s) => s.togglePauseRest)
  const markRestAlerted = useGymStore((s) => s.markRestAlerted)
  const clearRest = useGymStore((s) => s.clearRest)

  const [now, setNow] = useState(Date.now())
  const [expanded, setExpanded] = useState(false)

  // Re-render from the wall clock; also immediately on returning to the app.
  useEffect(() => {
    if (!timer) return
    const tick = () => setNow(Date.now())
    const id = setInterval(tick, 250)
    document.addEventListener('visibilitychange', tick)
    window.addEventListener('focus', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
      window.removeEventListener('focus', tick)
    }
  }, [!!timer])

  const paused = timer?.pausedRemainingMs != null
  const remainingMs = timer ? (paused ? timer.pausedRemainingMs : timer.endTimestamp - now) : 0
  const remaining = Math.max(0, Math.ceil(remainingMs / 1000))
  const done = !!timer && !paused && remainingMs <= 0

  // Foreground alert (sound + vibrate) exactly once per timer.
  useEffect(() => {
    if (timer && done && !timer.alerted) {
      fireRestAlert()
      markRestAlerted()
    }
  }, [done, timer?.alerted])

  // Keep the background (service-worker) notification in sync with the timer state.
  useEffect(() => {
    if (timer && !paused && !timer.alerted) scheduleRestNotification(timer.endTimestamp)
    else cancelRestNotification()
  }, [timer?.endTimestamp, paused, timer?.alerted, !!timer])

  if (!timer) return null

  const close = () => {
    cancelRestNotification()
    setExpanded(false)
    clearRest()
  }

  if (!expanded) {
    return (
      <div
        className="fixed inset-x-0 z-[60] px-4 pointer-events-none"
        style={{ bottom: hasFooter ? 'calc(5.5rem + env(safe-area-inset-bottom, 0px))' : 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div
          className={`pointer-events-auto max-w-md mx-auto flex items-center gap-2 rounded-2xl border px-3 py-2 shadow-lg ${
            done ? 'bg-accent border-accent-dim text-white' : 'bg-base-900 border-base-700'
          }`}
        >
          <Timer size={18} className={done ? 'text-white' : 'text-accent'} />
          <button onClick={() => setExpanded(true)} className="flex-1 text-left h-11 flex items-center gap-2" aria-label="Expand rest timer">
            <span className="text-2xl font-extrabold tabular-nums">{done ? 'Go!' : formatClock(remaining)}</span>
            <span className={`text-xs font-semibold uppercase tracking-wide ${done ? 'text-white/80' : 'text-base-600'}`}>
              {done ? 'Rest over' : paused ? 'Paused' : 'Rest'}
            </span>
          </button>
          {!done && (
            <>
              <button onClick={() => adjustRest(-15)} className="h-11 w-11 flex items-center justify-center rounded-xl bg-base-800 border border-base-700 active:bg-base-700" aria-label="Subtract 15 seconds">
                <Minus size={16} />
              </button>
              <button onClick={() => adjustRest(15)} className="h-11 w-11 flex items-center justify-center rounded-xl bg-base-800 border border-base-700 active:bg-base-700" aria-label="Add 15 seconds">
                <Plus size={16} />
              </button>
              <button onClick={togglePauseRest} className="h-11 w-11 flex items-center justify-center rounded-xl bg-accent text-white active:bg-accent-dim" aria-label={paused ? 'Resume' : 'Pause'}>
                {paused ? <Play size={16} /> : <Pause size={16} />}
              </button>
            </>
          )}
          <button onClick={close} className={`h-11 w-11 flex items-center justify-center rounded-xl ${done ? 'bg-white/20 active:bg-white/30' : 'active:bg-base-800'}`} aria-label="Dismiss timer">
            <X size={18} />
          </button>
        </div>
      </div>
    )
  }

  const pct = Math.max(0, Math.min(1, remaining / timer.totalSeconds))
  const circumference = 2 * Math.PI * 90

  return (
    <div className="fixed inset-0 z-[60] bg-base-950/95 backdrop-blur flex flex-col items-center justify-center gap-8 px-6">
      <button
        onClick={() => setExpanded(false)}
        className="absolute top-6 right-6 h-11 w-11 flex items-center justify-center rounded-full bg-base-800 active:bg-base-700"
        style={{ marginTop: 'env(safe-area-inset-top, 0px)' }}
        aria-label="Minimize timer"
      >
        <Minimize2 size={20} />
      </button>

      <p className="text-base-600 font-semibold uppercase tracking-widest text-sm">{paused ? 'Paused' : 'Rest'}</p>

      <div className="relative h-64 w-64 flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="absolute inset-0 -rotate-90">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#16a34a"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - pct)}
            style={{ transition: 'stroke-dashoffset 0.25s linear' }}
          />
        </svg>
        <span className={`text-6xl font-extrabold tabular-nums ${done ? 'text-accent' : ''}`}>{done ? 'Go!' : formatClock(remaining)}</span>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => adjustRest(-15)} className="h-12 w-12 flex items-center justify-center rounded-full bg-base-800 active:bg-base-700 border border-base-700" aria-label="Subtract 15 seconds">
          <Minus size={18} />
        </button>
        <button onClick={togglePauseRest} disabled={done} className="h-16 w-16 flex items-center justify-center rounded-full bg-accent text-white active:bg-accent-dim disabled:opacity-40" aria-label={paused ? 'Resume' : 'Pause'}>
          {paused ? <Play size={26} /> : <Pause size={26} />}
        </button>
        <button onClick={() => adjustRest(15)} className="h-12 w-12 flex items-center justify-center rounded-full bg-base-800 active:bg-base-700 border border-base-700" aria-label="Add 15 seconds">
          <Plus size={18} />
        </button>
      </div>

      <button onClick={close} className="text-base-600 font-semibold text-sm active:text-gray-900">
        Skip rest
      </button>
    </div>
  )
}
