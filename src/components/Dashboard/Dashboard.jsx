import { Dumbbell } from 'lucide-react'
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

  const todayDay = program.find((d) => d.id === todayDayId)

  const handleStart = () => {
    startWorkout(todayDay.id)
    onStartWorkout()
  }

  return (
    <div className="min-h-full flex flex-col px-4 pt-6 pb-10 gap-5 max-w-md mx-auto w-full">
      <header className="flex items-center gap-2 px-1">
        <Dumbbell size={22} className="text-accent" />
        <h1 className="text-xl font-extrabold tracking-tight">Gym Script</h1>
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
