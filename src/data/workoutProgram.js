/**
 * Gym Script  Preloaded Workout Program (V1)
 * ---------------------------------------------
 * This is the "seed" data for a fresh install. It is intentionally a plain,
 * serializable array of objects (no classes, no functions) so that it can
 * later be:
 *   1. Edited by the user through a future "Customize Program" UI
 *   2. Persisted to localStorage as the user's *own* copy (see store/useGymStore.js)
 *   3. Imported/exported as JSON
 *
 * Each exercise has a permanent, stable `id`. History and personal records
 * are keyed by this id  NOT by name or array index  so reordering days or
 * renaming an exercise later never orphans a user's logged data.
 *
 * Rest is stored as a min/max range in seconds (restMinSec/restMaxSec).
 * The UI derives quick-tap timer presets from this range (see utils/rest.js).
 */

export const WORKOUT_PROGRAM = [
  {
    id: 'day1',
    order: 1,
    name: 'Push A',
    focus: 'Chest emphasis',
    exercises: [
      { id: 'd1-bench-press', name: 'Barbell Bench Press', sets: 4, repsMin: 5, repsMax: 8, restMinSec: 120, restMaxSec: 180 },
      { id: 'd1-incline-db-press', name: 'Incline Dumbbell Press', sets: 3, repsMin: 8, repsMax: 10, restMinSec: 120, restMaxSec: 120 },
      { id: 'd1-machine-chest-press', name: 'Machine Chest Press', sets: 3, repsMin: 8, repsMax: 12, restMinSec: 90, restMaxSec: 90 },
      { id: 'd1-cable-fly', name: 'Cable Fly / Pec Deck', sets: 3, repsMin: 12, repsMax: 15, restMinSec: 60, restMaxSec: 90 },
      { id: 'd1-seated-db-shoulder-press', name: 'Seated Dumbbell Shoulder Press', sets: 3, repsMin: 6, repsMax: 10, restMinSec: 120, restMaxSec: 120 },
      { id: 'd1-cable-lateral-raise', name: 'Cable Lateral Raise', sets: 3, repsMin: 12, repsMax: 20, restMinSec: 60, restMaxSec: 60 },
      { id: 'd1-rope-pushdown', name: 'Rope Triceps Pushdown', sets: 3, repsMin: 10, repsMax: 15, restMinSec: 60, restMaxSec: 90 },
      { id: 'd1-overhead-cable-ext', name: 'Overhead Cable Triceps Extension', sets: 2, repsMin: 12, repsMax: 15, restMinSec: 60, restMaxSec: 60 }
    ]
  },
  {
    id: 'day2',
    order: 2,
    name: 'Pull A',
    focus: 'Back emphasis',
    exercises: [
      { id: 'd2-pullup-lat-pulldown', name: 'Pull-ups / Lat Pulldown', sets: 4, repsMin: 6, repsMax: 10, restMinSec: 120, restMaxSec: 120 },
      { id: 'd2-barbell-row', name: 'Barbell Row / Chest-Supported Row', sets: 4, repsMin: 6, repsMax: 10, restMinSec: 120, restMaxSec: 120 },
      { id: 'd2-seated-cable-row', name: 'Seated Cable Row', sets: 3, repsMin: 8, repsMax: 12, restMinSec: 90, restMaxSec: 90 },
      { id: 'd2-single-arm-db-row', name: 'Single-Arm Dumbbell Row', sets: 3, repsMin: 10, repsMax: 12, restMinSec: 90, restMaxSec: 90 },
      { id: 'd2-straight-arm-pulldown', name: 'Straight-Arm Cable Pulldown', sets: 3, repsMin: 12, repsMax: 15, restMinSec: 60, restMaxSec: 60 },
      { id: 'd2-barbell-curl', name: 'Barbell Curl', sets: 3, repsMin: 6, repsMax: 10, restMinSec: 90, restMaxSec: 90 },
      { id: 'd2-incline-db-curl', name: 'Incline Dumbbell Curl', sets: 3, repsMin: 8, repsMax: 12, restMinSec: 60, restMaxSec: 90 },
      { id: 'd2-hammer-curl', name: 'Hammer Curl', sets: 3, repsMin: 10, repsMax: 12, restMinSec: 60, restMaxSec: 90 },
      { id: 'd2-reverse-curl', name: 'Reverse Curl', sets: 2, repsMin: 12, repsMax: 15, restMinSec: 60, restMaxSec: 60 }
    ]
  },
  {
    id: 'day3',
    order: 3,
    name: 'Legs + Abs',
    focus: 'Efficient and solid',
    exercises: [
      { id: 'd3-squat-leg-press', name: 'Back Squat / Leg Press', sets: 4, repsMin: 6, repsMax: 10, restMinSec: 120, restMaxSec: 180 },
      { id: 'd3-rdl', name: 'Romanian Deadlift', sets: 3, repsMin: 8, repsMax: 10, restMinSec: 120, restMaxSec: 120 },
      { id: 'd3-bulgarian-split-squat', name: 'Bulgarian Split Squat', sets: 3, repsMin: 8, repsMax: 12, restMinSec: 90, restMaxSec: 90, unit: 'per leg' },
      { id: 'd3-leg-curl', name: 'Lying / Seated Leg Curl', sets: 3, repsMin: 10, repsMax: 15, restMinSec: 60, restMaxSec: 90 },
      { id: 'd3-calf-raise', name: 'Standing Calf Raise', sets: 4, repsMin: 10, repsMax: 15, restMinSec: 60, restMaxSec: 60 },
      { id: 'd3-hanging-leg-raise', name: 'Hanging Leg Raise', sets: 3, repsMin: 10, repsMax: 15, restMinSec: 60, restMaxSec: 60 },
      { id: 'd3-cable-crunch', name: 'Cable Crunch', sets: 3, repsMin: 12, repsMax: 20, restMinSec: 60, restMaxSec: 60 }
    ]
  },
  {
    id: 'day4',
    order: 4,
    name: 'Shoulders + Arms',
    focus: '',
    exercises: [
      { id: 'd4-ohp', name: 'Seated Overhead Press (Barbell/DB)', sets: 4, repsMin: 5, repsMax: 8, restMinSec: 120, restMaxSec: 180 },
      { id: 'd4-db-lateral-raise', name: 'Dumbbell Lateral Raise', sets: 4, repsMin: 12, repsMax: 20, restMinSec: 60, restMaxSec: 60 },
      { id: 'd4-rear-delt-fly', name: 'Rear Delt Cable Fly / Reverse Pec Deck', sets: 4, repsMin: 12, repsMax: 20, restMinSec: 60, restMaxSec: 60 },
      { id: 'd4-close-grip-bench-dips', name: 'Close-Grip Bench Press / Weighted Dips', sets: 3, repsMin: 6, repsMax: 10, restMinSec: 120, restMaxSec: 120 },
      { id: 'd4-skull-crusher', name: 'EZ-Bar Skull Crusher / Cable Extension', sets: 3, repsMin: 10, repsMax: 12, restMinSec: 90, restMaxSec: 90 },
      { id: 'd4-preacher-curl', name: 'Preacher Curl / Machine Curl', sets: 3, repsMin: 8, repsMax: 12, restMinSec: 90, restMaxSec: 90 },
      { id: 'd4-cable-curl', name: 'Cable Curl', sets: 3, repsMin: 12, repsMax: 15, restMinSec: 60, restMaxSec: 60 },
      { id: 'd4-wrist-curl', name: 'Wrist Curls', sets: 2, repsMin: 15, repsMax: 20, restMinSec: 45, restMaxSec: 60 },
      { id: 'd4-reverse-wrist-curl', name: 'Reverse Wrist Curls', sets: 2, repsMin: 15, repsMax: 20, restMinSec: 45, restMaxSec: 60 }
    ]
  },
  {
    id: 'day5',
    order: 5,
    name: 'Push/Pull Hypertrophy',
    focus: 'Volume, not too heavy',
    exercises: [
      { id: 'd5-incline-press', name: 'Incline Barbell / Dumbbell Press', sets: 4, repsMin: 6, repsMax: 10, restMinSec: 120, restMaxSec: 120 },
      { id: 'd5-chest-supported-row', name: 'Chest-Supported Row', sets: 4, repsMin: 8, repsMax: 12, restMinSec: 90, restMaxSec: 120 },
      { id: 'd5-machine-chest-press-2', name: 'Machine Chest Press / DB Press', sets: 3, repsMin: 8, repsMax: 12, restMinSec: 90, restMaxSec: 90 },
      { id: 'd5-lat-pulldown-alt-grip', name: 'Lat Pulldown (different grip)', sets: 3, repsMin: 8, repsMax: 12, restMinSec: 90, restMaxSec: 90 },
      { id: 'd5-cable-fly-2', name: 'Cable Fly', sets: 2, repsMin: 12, repsMax: 15, restMinSec: 60, restMaxSec: 60 },
      { id: 'd5-face-pull', name: 'Face Pull', sets: 3, repsMin: 12, repsMax: 20, restMinSec: 60, restMaxSec: 60 },
      { id: 'd5-rope-pushdown-2', name: 'Rope Triceps Pushdown', sets: 3, repsMin: 10, repsMax: 15, restMinSec: 60, restMaxSec: 60 },
      { id: 'd5-ezbar-curl', name: 'EZ-Bar Curl', sets: 3, repsMin: 8, repsMax: 12, restMinSec: 60, restMaxSec: 90 }
    ]
  },
  {
    id: 'day6',
    order: 6,
    name: 'Arms + Rear Delts + Abs',
    focus: '',
    exercises: [
      { id: 'd6-close-grip-pressdown', name: 'Close-Grip Cable Pressdown', sets: 3, repsMin: 10, repsMax: 15, restMinSec: 60, restMaxSec: 60 },
      { id: 'd6-overhead-rope-ext', name: 'Overhead Rope Triceps Extension', sets: 3, repsMin: 10, repsMax: 15, restMinSec: 60, restMaxSec: 60 },
      { id: 'd6-incline-db-curl', name: 'Incline Dumbbell Curl', sets: 3, repsMin: 8, repsMax: 12, restMinSec: 60, restMaxSec: 90 },
      { id: 'd6-hammer-curl', name: 'Hammer Curl', sets: 3, repsMin: 10, repsMax: 12, restMinSec: 60, restMaxSec: 60 },
      { id: 'd6-reverse-curl', name: 'Reverse Curl / Cable Reverse Curl', sets: 3, repsMin: 12, repsMax: 15, restMinSec: 60, restMaxSec: 60 },
      { id: 'd6-rear-delt-machine-fly', name: 'Rear Delt Machine Fly', sets: 4, repsMin: 12, repsMax: 20, restMinSec: 60, restMaxSec: 60 },
      { id: 'd6-farmers-carry', name: "Farmer's Carry", sets: 3, repsMin: 30, repsMax: 45, restMinSec: 60, restMaxSec: 90, unit: 'seconds', isTimeBased: true },
      { id: 'd6-cable-woodchop', name: 'Cable Woodchop / Pallof Press', sets: 3, repsMin: 10, repsMax: 15, restMinSec: 60, restMaxSec: 60, unit: 'per side' },
      { id: 'd6-plank', name: 'Plank', sets: 3, repsMin: 30, repsMax: 60, restMinSec: 45, restMaxSec: 60, unit: 'seconds', isTimeBased: true }
    ]
  }
]

// Convenience lookup map: exerciseId -> { exercise, day }
export function buildExerciseIndex(program = WORKOUT_PROGRAM) {
  const index = {}
  for (const day of program) {
    for (const exercise of day.exercises) {
      index[exercise.id] = { exercise, day }
    }
  }
  return index
}

export function getDayById(dayId, program = WORKOUT_PROGRAM) {
  return program.find((d) => d.id === dayId) || null
}
