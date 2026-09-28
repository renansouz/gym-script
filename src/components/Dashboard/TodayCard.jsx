import { useState } from 'react'
import { ChevronRight, RefreshCw } from 'lucide-react'
import Button from '../shared/Button'
import BottomSheet from '../shared/BottomSheet'
import { useGymStore } from '../../store/useGymStore'

export default function TodayCard({ todayDay, onStart }) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const program = useGymStore((s) => s.program)
  const setTodayOverride = useGymStore((s) => s.setTodayOverride)

  return (
    <>
      <div className="bg-base-800 border border-base-700 rounded-2xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-base-600 font-semibold mb-1">Today</p>
            <h2 className="text-2xl font-extrabold">{todayDay.name}</h2>
            {todayDay.focus && <p className="text-sm text-base-600 mt-0.5">{todayDay.focus}</p>}
          </div>
          <button
            onClick={() => setPickerOpen(true)}
            className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full bg-base-700 active:bg-base-600"
            aria-label="Change today's workout"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <p className="text-sm text-base-600 mt-3">{todayDay.exercises.length} exercises</p>

        <Button className="w-full mt-4" onClick={onStart}>
          Start Workout
          <ChevronRight size={20} />
        </Button>
      </div>

      <BottomSheet open={pickerOpen} onClose={() => setPickerOpen(false)} title="Switch today's workout">
        <div className="flex flex-col gap-2">
          {program.map((day) => (
            <button
              key={day.id}
              onClick={() => {
                setTodayOverride(day.id)
                setPickerOpen(false)
              }}
              className={`text-left rounded-xl px-4 py-3 border ${
                day.id === todayDay.id
                  ? 'bg-accent-soft border-accent-dim'
                  : 'bg-base-800 border-base-700 active:bg-base-700'
              }`}
            >
              <div className="font-semibold">{day.name}</div>
              {day.focus && <div className="text-xs text-base-600">{day.focus}</div>}
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  )
}
