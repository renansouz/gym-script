import { Dumbbell, LogOut } from 'lucide-react'
import { cloudEnabled } from '../../lib/supabase'
import { useAuthStore } from '../../store/useAuthStore'
import { useGymStore } from '../../store/useGymStore'
import StreakCounter from './StreakCounter'
import TodayCard from './TodayCard'
import YesterdayCard from './YesterdayCard'

export default function Dashboard({ onStartWorkout }) {
  const program = useGymStore((s) => s.program)
  const todayDayId = useGymStore((s) => s.getTodayDayId())
  const lastSession = useGymStore((s) => s.getLastSession())
  const { streak, workedOutToday } = useGymStore((s) => s.getStreak())
  const startWorkout = useGymStore((s) => s.startWorkout)
  const signOut = useAuthStore((s) => s.signOut)

  const todayDay = program.find((d) => d.id === todayDayId)

  const handleStart = () => {
    startWorkout(todayDay.id)
    onStartWorkout()
  }

  return (
    <div className="min-h-full flex flex-col px-4 pt-6 pb-10 gap-5 max-w-md mx-auto w-full">
      <header className="flex items-center gap-2 px-1">
        <Dumbbell size={22} className="text-accent" />
        <h1 className="text-xl font-extrabold tracking-tight flex-1">Gym Script</h1>
        {cloudEnabled && (
          <button onClick={signOut} className="h-11 w-11 flex items-center justify-center rounded-full active:bg-base-800" aria-label="Sign out">
            <LogOut size={20} className="text-base-600" />
          </button>
        )}
      </header>

      <StreakCounter streak={streak} workedOutToday={workedOutToday} />

      <TodayCard todayDay={todayDay} onStart={handleStart} />

      <div>
        <p className="text-xs uppercase tracking-wide text-base-600 font-semibold mb-2 px-1">Yesterday</p>
        <YesterdayCard lastSession={lastSession} />
      </div>
    </div>
  )
}
