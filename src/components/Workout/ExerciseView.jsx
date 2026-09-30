import { Trophy, History, Timer, Check } from 'lucide-react'
import NumberStepper from '../shared/NumberStepper'
import Button from '../shared/Button'
import { getRestPresets, formatRestRange, formatSeconds } from '../../utils/rest'

export default function ExerciseView({ exercise, lastEntry, pr, loggedEntry, draft, onDraftChange, onLog, onStartRest }) {
  const repsLabel = `${exercise.repsMin}${exercise.repsMax !== exercise.repsMin ? `–${exercise.repsMax}` : ''} ${
    exercise.unit === 'seconds' ? 'sec' : exercise.unit === 'per leg' || exercise.unit === 'per side' ? exercise.unit : 'reps'
  }`
  const weightUnit = exercise.isTimeBased ? null : 'kg'
  const presets = getRestPresets(exercise.restMinSec, exercise.restMaxSec)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-extrabold leading-tight">{exercise.name}</h2>
        <p className="text-base-600 mt-1">
          {exercise.sets} sets × {repsLabel} · rest {formatRestRange(exercise.restMinSec, exercise.restMaxSec)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-base-900 border border-base-700 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-base-600 text-xs font-semibold uppercase tracking-wide mb-1">
            <History size={13} /> Last time
          </div>
          {lastEntry ? (
            <p className="font-bold">
              {lastEntry.weight}{weightUnit ? weightUnit : ''} × {lastEntry.reps}
            </p>
          ) : (
            <p className="text-base-600 text-sm">No data yet</p>
          )}
        </div>
        <div className="bg-base-900 border border-base-700 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-accent text-xs font-semibold uppercase tracking-wide mb-1">
            <Trophy size={13} /> All-time PR
          </div>
          {pr ? (
            <p className="font-bold text-accent">
              {pr.weight}{weightUnit ? weightUnit : ''} × {pr.reps}
            </p>
          ) : (
            <p className="text-base-600 text-sm">No data yet</p>
          )}
        </div>
      </div>

      <div className="bg-base-800 border border-base-700 rounded-2xl p-5">
        <p className="text-center text-xs uppercase tracking-wide text-base-600 font-semibold mb-4">
          Log your best set
        </p>
        <div className="flex flex-col gap-4">
          {!exercise.isTimeBased && (
            <NumberStepper label="Weight" value={draft.weight} onChange={(v) => onDraftChange({ ...draft, weight: v })} step={2.5} suffix="kg" />
          )}
          <NumberStepper
            label={exercise.isTimeBased ? 'Seconds' : 'Reps'}
            value={draft.reps}
            onChange={(v) => onDraftChange({ ...draft, reps: v })}
            step={1}
          />
        </div>
        <Button
          className="w-full mt-5"
          variant={loggedEntry ? 'secondary' : 'primary'}
          onClick={onLog}
        >
          {loggedEntry ? (
            <>
              <Check size={18} /> Logged — tap to update
            </>
          ) : (
            'Log Best Set'
          )}
        </Button>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-base-600 font-semibold mb-2">Rest timer</p>
        <div className="flex gap-2">
          {presets.map((sec) => (
            <button
              key={sec}
              onClick={() => onStartRest(sec)}
              className="flex-1 h-12 flex items-center justify-center gap-1.5 rounded-xl bg-base-800 border border-base-700 active:bg-base-700 font-semibold"
            >
              <Timer size={16} /> {formatSeconds(sec)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
