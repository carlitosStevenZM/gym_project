import type { IsoWeekday } from '@/shared/lib/use-date-labels'

export type TodayExercise = {
  id: string
  name: string
  sets: number
  /** Informational only: the app never validates what was logged against it (D14). */
  repsMin: number
  /** Absent when the routine targets a single figure instead of a range. */
  repsMax: number | null
  /** What was lifted last time in this exercise (D21). `null` with no history. */
  lastWeightKg: number | null
  isRecord: boolean
  illustrationUri?: string
}

export type PlannedDay = {
  weekday: IsoWeekday
  /** `null` is rest: rest is the absence of a routine, never a choice (D30). */
  routineName: string | null
  trained: boolean
}

export type UpNextDay = {
  weekday: IsoWeekday
  routineName: string
  exerciseCount: number
}

export type BestLift = {
  exerciseName: string
  weightKg: number
}

type DayShape = {
  date: Date
  /** All seven days, always, whatever day it is today (D4). */
  week: readonly PlannedDay[]
  upNext: readonly UpNextDay[]
}

export type TodayView =
  | { kind: 'loading' }
  | { kind: 'error' }
  /** Nothing is planned at all: the one state where the app asks the user for something. */
  | { kind: 'noWeeklyTraining' }
  /** Today has no routine, so there is no window, no disc and nothing to start (D13, D30). */
  | (DayShape & { kind: 'rest'; bestLift: BestLift | null })
  | (DayShape & {
      kind: 'training'
      weeklyTrainingName: string
      routineName: string
      exercises: readonly TodayExercise[]
    })
