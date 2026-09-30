import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, List, X } from 'lucide-react'
import { useGymStore } from '../../store/useGymStore'
import ExerciseView from './ExerciseView'
import ExerciseDrawer from './ExerciseDrawer'
import { prepareRestAlerts } from '../../utils/restAlert'
import Button from '../shared/Button'

export default function ActiveWorkout({ onExit }) {
  const activeSession = useGymStore((s) => s.activeSession)
  const program = useGymStore((s) => s.program)
  const logBestSet = useGymStore((s) => s.logBestSet)
  const goToExercise = useGymStore((s) => s.goToExercise)
  const nextExercise = useGymStore((s) => s.nextExercise)
  const prevExercise = useGymStore((s) => s.prevExercise)
  const finishWorkout = useGymStore((s) => s.finishWorkout)
  const cancelWorkout = useGymStore((s) => s.cancelWorkout)
  const getLastEntry = useGymStore((s) => s.getLastEntry)
  const getPR = useGymStore((s) => s.getPR)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const startRest = useGymStore((s) => s.startRest)
  const restActive = useGymStore((s) => s.restTimer !== null)
  const [draft, setDraft] = useState({ weight: 0, reps: 0 })

  const day = program.find((d) => d.id === activeSession?.dayId)
  const exercise = day?.exercises[activeSession?.index ?? 0]
  const isLast = activeSession && day ? activeSession.index === day.exercises.length - 1 : false
  const isFirst = activeSession ? activeSession.index === 0 : true

  // Seed the draft whenever the current exercise changes: prefer an already-logged
  // value for this session, fall back to last session's numbers as a starting point.
  useEffect(() => {
    if (!exercise) return
    const logged = activeSession.entries[exercise.id]
    const last = getLastEntry(exercise.id)
    if (logged) {
      setDraft(logged)
    } else if (last) {
      setDraft({ weight: last.weight, reps: last.reps })
    } else {
      setDraft({ weight: exercise.isTimeBased ? 0 : 20, reps: exercise.repsMin })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise?.id])

  if (!activeSession || !day || !exercise) return null

  const handleExit = () => {
    const hasProgress = Object.keys(activeSession.entries).length > 0
    if (hasProgress && !window.confirm('Discard this workout? Anything logged will be lost.')) return
    cancelWorkout()
    onExit()
  }

  const handleFinish = () => {
    finishWorkout()
    onExit()
  }

  const handleLog = () => {
    logBestSet(exercise.id, draft.weight, draft.reps)
  }

  return (
    <div className="fixed inset-0 z-40 bg-base-950 flex flex-col">
      <header
        className="flex items-center justify-between px-4 py-3 border-b border-base-800"
        style={{ paddingTop: 'calc(0.75rem + env(safe-area-inset-top, 0px))' }}
      >
        <button onClick={handleExit} className="h-10 w-10 flex items-center justify-center rounded-full active:bg-base-800" aria-label="Exit workout">
          <X size={20} />
        </button>
        <div className="text-center">
          <p className="font-bold text-sm">{day.name}</p>
          <p className="text-xs text-base-600">
            Exercise {activeSession.index + 1} of {day.exercises.length}
          </p>
        </div>
        <button onClick={() => setDrawerOpen(true)} className="h-10 w-10 flex items-center justify-center rounded-full active:bg-base-800" aria-label="View all exercises">
          <List size={20} />
        </button>
      </header>

      <div className={`flex-1 overflow-y-auto px-4 py-5 no-scrollbar max-w-md mx-auto w-full ${restActive ? 'pb-24' : ''}`}>
        <ExerciseView
          exercise={exercise}
          lastEntry={getLastEntry(exercise.id)}
          pr={getPR(exercise.id)}
          loggedEntry={activeSession.entries[exercise.id]}
          draft={draft}
          onDraftChange={setDraft}
          onLog={handleLog}
          onStartRest={(sec) => {
            prepareRestAlerts() // user tap: unlock audio + ask notification permission
            startRest(sec)
          }}
        />
      </div>

      <footer
        className="flex items-center gap-3 px-4 py-4 border-t border-base-800"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <Button variant="secondary" size="lg" onClick={prevExercise} disabled={isFirst} className="w-14 px-0">
          <ChevronLeft size={22} />
        </Button>
        {isLast ? (
          <Button className="flex-1" onClick={handleFinish}>
            Finish Workout
          </Button>
        ) : (
          <Button className="flex-1" onClick={nextExercise}>
            Next Exercise
            <ChevronRight size={20} />
          </Button>
        )}
      </footer>

      <ExerciseDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        exercises={day.exercises}
        currentIndex={activeSession.index}
        entries={activeSession.entries}
        onJump={goToExercise}
      />

    </div>
  )
}
