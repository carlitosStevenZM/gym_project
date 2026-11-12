import type { PlannedDay, TodayView } from './types'

/**
 * SCAFFOLDING. There is no `domain/` layer yet because there is no backend, so the screen
 * reads this instead. When `domain/today` lands, the single import in TodayScreen becomes a
 * hook and this file goes.
 *
 * The date is fixed on purpose: a fixture that moves with the clock changes which state the
 * screen renders depending on the day somebody opens it.
 */
const WEDNESDAY_14_OCT = new Date(2026, 9, 14)

const WEEK: readonly PlannedDay[] = [
  { weekday: 1, routineName: 'Espalda y bíceps', trained: true },
  { weekday: 2, routineName: null, trained: false },
  { weekday: 3, routineName: 'Pecho y tríceps', trained: false },
  { weekday: 4, routineName: null, trained: false },
  { weekday: 5, routineName: 'Pierna completa', trained: false },
  { weekday: 6, routineName: 'Hombro y abdomen', trained: true },
  { weekday: 7, routineName: null, trained: false },
]

const UP_NEXT = [{ weekday: 5, routineName: 'Pierna completa', exerciseCount: 6 }] as const

export const TODAY_TRAINING: TodayView = {
  kind: 'training',
  date: WEDNESDAY_14_OCT,
  weeklyTrainingName: 'Rutina de 4 días',
  routineName: 'Pecho y tríceps',
  exercises: [
    {
      id: 'bench-press',
      name: 'Press de banca',
      sets: 4,
      repsMin: 8,
      repsMax: 12,
      lastWeightKg: 67.5,
      isRecord: true,
    },
    {
      id: 'incline-dumbbell-press',
      name: 'Press inclinado con mancuernas',
      sets: 4,
      repsMin: 10,
      repsMax: 12,
      lastWeightKg: 24,
      isRecord: false,
    },
    {
      id: 'cable-fly',
      name: 'Aperturas en polea',
      sets: 3,
      repsMin: 12,
      repsMax: 15,
      lastWeightKg: 15,
      isRecord: false,
    },
    {
      id: 'dips',
      name: 'Fondos en paralelas',
      sets: 3,
      repsMin: 8,
      repsMax: 10,
      lastWeightKg: 0,
      isRecord: false,
    },
    {
      id: 'triceps-pushdown',
      name: 'Extensión de tríceps en polea',
      sets: 4,
      repsMin: 12,
      repsMax: 15,
      lastWeightKg: null,
      isRecord: false,
    },
  ],
  week: WEEK,
  upNext: UP_NEXT,
}

export const TODAY_REST: TodayView = {
  kind: 'rest',
  date: new Date(2026, 9, 15),
  bestLift: { exerciseName: 'Press de banca', weightKg: 67.5 },
  week: WEEK,
  upNext: UP_NEXT,
}

export const TODAY_NO_WEEKLY_TRAINING: TodayView = { kind: 'noWeeklyTraining' }
export const TODAY_LOADING: TodayView = { kind: 'loading' }
export const TODAY_ERROR: TodayView = { kind: 'error' }
