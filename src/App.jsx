import { useEffect } from 'react'
import { useGymStore } from './store/useGymStore'
import { useAuthStore } from './store/useAuthStore'
import { cloudEnabled, configProblem } from './lib/supabase'
import Dashboard from './components/Dashboard/Dashboard'
import ActiveWorkout from './components/Workout/ActiveWorkout'
import RestTimer from './components/Workout/RestTimer'
import AuthScreen from './components/Auth/AuthScreen'

export default function App() {
  const activeSession = useGymStore((s) => s.activeSession)
  const { session, loading, init } = useAuthStore()

  useEffect(() => {
    init()
  }, [init])

  if (configProblem) {
    return (
      <div className="min-h-screen bg-base-950 flex items-center justify-center px-6">
        <div role="alert" className="max-w-md rounded-2xl border border-base-700 bg-base-900 p-5">
          <h1 className="text-lg font-extrabold">Supabase setup problem</h1>
          <p className="text-sm mt-2">{configProblem}</p>
          <p className="text-sm text-base-600 mt-2">Fix <code>.env.local</code>, then stop and restart <code>npm run dev</code>.</p>
        </div>
      </div>
    )
  }

  // Cloud configured → login required. Not configured → local-only V1 mode.
  if (cloudEnabled && loading) return <div className="min-h-screen bg-base-950" />
  if (cloudEnabled && !session) return <div className="min-h-screen bg-base-950"><AuthScreen /></div>

  return (
    <div className="min-h-screen bg-base-950">
      <Dashboard onStartWorkout={() => {}} />
      {activeSession && <ActiveWorkout onExit={() => {}} />}
      {/* Mounted at the app root so the rest timer survives any navigation. */}
      <RestTimer hasFooter={!!activeSession} />
    </div>
  )
}
