import { CheckCircle2 } from 'lucide-react'
import { formatFriendlyDate } from '../../utils/dateHelpers'

export default function YesterdayCard({ lastSession }) {
  if (!lastSession) {
    return (
      <div className="bg-base-900 border border-base-700 rounded-2xl p-4">
        <p className="text-sm text-base-600">No workouts logged yet. Let's fix that. 💪</p>
      </div>
    )
  }

  return (
    <div className="bg-base-900 border border-base-700 rounded-2xl p-4 flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-accent-soft flex items-center justify-center shrink-0">
        <CheckCircle2 size={20} className="text-accent" />
      </div>
      <div>
        <p className="text-xs text-base-600">{formatFriendlyDate(lastSession.date)}</p>
        <p className="font-semibold">
          {lastSession.dayName} · {lastSession.exerciseIds.length} exercises logged
        </p>
      </div>
    </div>
  )
}
