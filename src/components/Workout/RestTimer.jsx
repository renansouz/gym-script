import { useEffect, useRef, useState } from 'react'
import { Pause, Play, X, Plus, Minus } from 'lucide-react'
import { formatClock } from '../../utils/rest'

/**
 * Plays a short beep using the Web Audio API  no external audio file
 * needed, so it works fully offline as part of the PWA.
 */
function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.45)
    osc.onended = () => ctx.close()
  } catch {
    // Audio not available (e.g. autoplay restrictions)  fail silently.
  }
}

export default function RestTimer({ initialSeconds, onClose }) {
  const [remaining, setRemaining] = useState(initialSeconds)
  const [running, setRunning] = useState(true)
  const finishedRef = useRef(false)

  useEffect(() => {
    if (!running) return
    if (remaining <= 0) {
      if (!finishedRef.current) {
        finishedRef.current = true
        playBeep()
        if (navigator.vibrate) navigator.vibrate([200, 100, 200])
      }
      return
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(id)
  }, [remaining, running])

  const pct = Math.max(0, Math.min(1, remaining / initialSeconds))
  const circumference = 2 * Math.PI * 90

  return (
    <div className="fixed inset-0 z-50 bg-base-950/95 backdrop-blur flex flex-col items-center justify-center gap-8 px-6">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 h-11 w-11 flex items-center justify-center rounded-full bg-base-800 active:bg-base-700"
        style={{ marginTop: 'env(safe-area-inset-top, 0px)' }}
        aria-label="Close timer"
      >
        <X size={20} />
      </button>

      <p className="text-base-600 font-semibold uppercase tracking-widest text-sm">Rest</p>

      <div className="relative h-64 w-64 flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="absolute inset-0 -rotate-90">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={remaining <= 0 ? '#16a34a' : '#16a34a'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - pct)}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <span className={`text-6xl font-extrabold tabular-nums ${remaining <= 0 ? 'text-accent' : ''}`}>
          {remaining <= 0 ? "Go!" : formatClock(remaining)}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setRemaining((r) => Math.max(0, r - 15))}
          className="h-12 w-12 flex items-center justify-center rounded-full bg-base-800 active:bg-base-700 border border-base-700"
          aria-label="Subtract 15 seconds"
        >
          <Minus size={18} />
        </button>

        <button
          onClick={() => setRunning((r) => !r)}
          className="h-16 w-16 flex items-center justify-center rounded-full bg-accent text-base-950 active:bg-accent-dim"
          aria-label={running ? 'Pause' : 'Resume'}
        >
          {running ? <Pause size={26} /> : <Play size={26} />}
        </button>

        <button
          onClick={() => setRemaining((r) => r + 15)}
          className="h-12 w-12 flex items-center justify-center rounded-full bg-base-800 active:bg-base-700 border border-base-700"
          aria-label="Add 15 seconds"
        >
          <Plus size={18} />
        </button>
      </div>

      <button onClick={onClose} className="text-base-600 font-semibold text-sm active:text-gray-900">
        Skip rest
      </button>
    </div>
  )
}
