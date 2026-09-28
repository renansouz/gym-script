import { CheckCircle2, Circle } from 'lucide-react'
import BottomSheet from '../shared/BottomSheet'

export default function ExerciseDrawer({ open, onClose, exercises, currentIndex, entries, onJump }) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Exercises">
      <div className="flex flex-col gap-1.5">
        {exercises.map((ex, i) => {
          const logged = Boolean(entries[ex.id])
          const isCurrent = i === currentIndex
          return (
            <button
              key={ex.id}
              onClick={() => {
                onJump(i)
                onClose()
              }}
              className={`flex items-center gap-3 text-left rounded-xl px-4 py-3 border ${
                isCurrent ? 'bg-accent-soft border-accent-dim' : 'bg-base-800 border-base-700 active:bg-base-700'
              }`}
            >
              {logged ? (
                <CheckCircle2 size={20} className="text-accent shrink-0" />
              ) : (
                <Circle size={20} className="text-base-600 shrink-0" />
              )}
              <div className="min-w-0">
                <div className="font-semibold truncate">{ex.name}</div>
                <div className="text-xs text-base-600">
                  {ex.sets} × {ex.repsMin}
                  {ex.repsMax !== ex.repsMin ? `–${ex.repsMax}` : ''} {ex.unit || 'reps'}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </BottomSheet>
  )
}
