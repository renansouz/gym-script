import { Flame } from 'lucide-react'

export default function StreakCounter({ streak, workedOutToday }) {
  const isActive = streak > 0

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 border ${
        isActive ? 'bg-accent-soft border-accent-dim' : 'bg-base-800 border-base-700'
      }`}
    >
      <Flame
        size={28}
        className={isActive ? 'text-accent' : 'text-base-600'}
        fill={isActive ? 'currentColor' : 'none'}
        strokeWidth={isActive ? 0 : 2}
      />
      <div className="flex-1">
        <div className="text-2xl font-extrabold leading-none">{streak}</div>
        <div className="text-xs text-base-600 mt-0.5">
          {streak === 1 ? 'day streak' : 'day streak'}
          {isActive && !workedOutToday ? ' · train today to keep it' : ''}
        </div>
      </div>
      {isActive && workedOutToday && (
        <span className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
          Done today
        </span>
      )}
    </div>
  )
}
