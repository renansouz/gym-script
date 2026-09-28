import { useGymStore } from './store/useGymStore'
import Dashboard from './components/Dashboard/Dashboard'
import ActiveWorkout from './components/Workout/ActiveWorkout'

export default function App() {
  const activeSession = useGymStore((s) => s.activeSession)

  return (
    <div className="min-h-screen bg-base-950">
      <Dashboard onStartWorkout={() => {}} />
      {activeSession && <ActiveWorkout onExit={() => {}} />}
    </div>
  )
}
