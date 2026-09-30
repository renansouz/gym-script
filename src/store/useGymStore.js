import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { WORKOUT_PROGRAM, buildExerciseIndex } from '../data/workoutProgram'
import { todayStr } from '../utils/dateHelpers'
import { calculateStreak } from '../utils/streak'

/**
 * Gym Script global store (Zustand + localStorage persistence)
 * ---------------------------------------------------------------
 * See docs/state-management.md for the full data-model write-up.
 *
 * Shape (persisted):
 *   program:        the workout split (seeded from data/workoutProgram.js,
 *                    copied into state so a future "edit program" UI can
 *                    mutate the user's own copy without touching the source file)
 *   history:        { [exerciseId]: Array<{ date, weight, reps }> }   append-only log
 *   sessions:       Array<{ date, dayId, dayName, exerciseIds: string[] }>  one per completed workout
 *   overrides:      { [date]: dayId }  one-off "do a different day today" overrides
 *   activeSession:  null | { date, dayId, index, entries: { [exerciseId]: {weight, reps} } }
 *                   (in-progress workout; only committed to history/sessions on finish)
 */

const initialState = {
  program: WORKOUT_PROGRAM,
  history: {},
  sessions: [],
  overrides: {},
  activeSession: null,
  // Rest timer lives in the global store (not component state) so it survives
  // navigation and app close/reopen. Remaining time is ALWAYS derived from the
  // wall-clock `endTimestamp`, never counted down with setInterval.
  //   null | { endTimestamp, totalSeconds, pausedRemainingMs: number|null, alerted: boolean }
  restTimer: null
}

export const useGymStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // ---------- Derived getters ----------

      exerciseIndex() {
        return buildExerciseIndex(get().program)
      },

      /** The day that comes next in the rotation, based on the last completed session. */
      getRotationDayId() {
        const { program, sessions } = get()
        if (sessions.length === 0) return program[0].id
        const last = sessions[sessions.length - 1]
        const lastDay = program.find((d) => d.id === last.dayId)
        if (!lastDay) return program[0].id
        const nextOrder = (lastDay.order % program.length) + 1
        const nextDay = program.find((d) => d.order === nextOrder)
        return nextDay ? nextDay.id : program[0].id
      },

      /** The day scheduled for today, honoring any manual override for today's date. */
      getTodayDayId() {
        const { overrides } = get()
        const today = todayStr()
        if (overrides[today]) return overrides[today]
        return get().getRotationDayId()
      },

      setTodayOverride(dayId) {
        const today = todayStr()
        set((state) => ({ overrides: { ...state.overrides, [today]: dayId } }))
      },

      clearTodayOverride() {
        const today = todayStr()
        set((state) => {
          const next = { ...state.overrides }
          delete next[today]
          return { overrides: next }
        })
      },

      /** Most recent completed session (for the "Yesterday" dashboard card), or null. */
      getLastSession() {
        const { sessions } = get()
        return sessions.length ? sessions[sessions.length - 1] : null
      },

      /** Personal record for an exercise: highest weight logged (ties broken by higher reps). */
      getPR(exerciseId) {
        const records = get().history[exerciseId]
        if (!records || records.length === 0) return null
        return records.reduce((best, r) => {
          if (!best) return r
          if (r.weight > best.weight) return r
          if (r.weight === best.weight && r.reps > best.reps) return r
          return best
        }, null)
      },

      /** The most recently logged set for an exercise (excludes the current in-progress session). */
      getLastEntry(exerciseId) {
        const records = get().history[exerciseId]
        if (!records || records.length === 0) return null
        return records[records.length - 1]
      },

      getStreak() {
        const dates = new Set(get().sessions.map((s) => s.date))
        return calculateStreak(dates, 2)
      },

      // ---------- Active workout lifecycle ----------

      startWorkout(dayId) {
        set({
          activeSession: {
            date: todayStr(),
            dayId,
            index: 0,
            entries: {}
          }
        })
      },

      logBestSet(exerciseId, weight, reps) {
        set((state) => {
          if (!state.activeSession) return {}
          return {
            activeSession: {
              ...state.activeSession,
              entries: {
                ...state.activeSession.entries,
                [exerciseId]: { weight: Number(weight), reps: Number(reps) }
              }
            }
          }
        })
      },

      goToExercise(index) {
        set((state) => {
          if (!state.activeSession) return {}
          return { activeSession: { ...state.activeSession, index } }
        })
      },

      nextExercise() {
        const { activeSession, program } = get()
        if (!activeSession) return
        const day = program.find((d) => d.id === activeSession.dayId)
        const max = day.exercises.length - 1
        set({ activeSession: { ...activeSession, index: Math.min(activeSession.index + 1, max) } })
      },

      prevExercise() {
        const { activeSession } = get()
        if (!activeSession) return
        set({ activeSession: { ...activeSession, index: Math.max(activeSession.index - 1, 0) } })
      },

      /** Commits the in-progress session to history + sessions log, then clears it. */
      finishWorkout() {
        const { activeSession, program, history, sessions } = get()
        if (!activeSession) return
        const day = program.find((d) => d.id === activeSession.dayId)
        const exerciseIds = Object.keys(activeSession.entries)

        const nextHistory = { ...history }
        for (const exId of exerciseIds) {
          const entry = activeSession.entries[exId]
          const prevRecords = nextHistory[exId] || []
          nextHistory[exId] = [...prevRecords, { date: activeSession.date, ...entry }]
        }

        const session = {
          date: activeSession.date,
          dayId: activeSession.dayId,
          dayName: day ? day.name : 'Workout',
          exerciseIds
        }

        // Replace an existing same-day session (if user already logged today, e.g. re-finishing)
        const filteredSessions = sessions.filter((s) => s.date !== activeSession.date)

        set({
          history: nextHistory,
          sessions: [...filteredSessions, session],
          activeSession: null,
          restTimer: null
        })
      },

      cancelWorkout() {
        set({ activeSession: null, restTimer: null })
      },

      // ---------- Rest timer (wall-clock based) ----------

      startRest(seconds) {
        set({
          restTimer: {
            endTimestamp: Date.now() + seconds * 1000,
            totalSeconds: seconds,
            pausedRemainingMs: null,
            alerted: false
          }
        })
      },

      /** Add/subtract seconds (e.g. +15 / -15) from the running or paused timer. */
      adjustRest(deltaSec) {
        const t = get().restTimer
        if (!t) return
        const delta = deltaSec * 1000
        if (t.pausedRemainingMs !== null) {
          const next = Math.max(0, t.pausedRemainingMs + delta)
          set({ restTimer: { ...t, pausedRemainingMs: next, totalSeconds: Math.max(t.totalSeconds, Math.ceil(next / 1000)) } })
        } else {
          const end = Math.max(Date.now(), t.endTimestamp + delta)
          const remainingSec = Math.ceil((end - Date.now()) / 1000)
          set({
            restTimer: {
              ...t,
              endTimestamp: end,
              totalSeconds: Math.max(t.totalSeconds, remainingSec),
              alerted: end - Date.now() > 0 ? false : t.alerted
            }
          })
        }
      },

      togglePauseRest() {
        const t = get().restTimer
        if (!t || t.alerted) return
        if (t.pausedRemainingMs !== null) {
          set({ restTimer: { ...t, endTimestamp: Date.now() + t.pausedRemainingMs, pausedRemainingMs: null } })
        } else {
          set({ restTimer: { ...t, pausedRemainingMs: Math.max(0, t.endTimestamp - Date.now()) } })
        }
      },

      markRestAlerted() {
        const t = get().restTimer
        if (t) set({ restTimer: { ...t, alerted: true } })
      },

      clearRest() {
        set({ restTimer: null })
      }
    }),
    {
      name: 'gym-script-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1
    }
  )
)
