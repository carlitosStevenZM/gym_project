import type { PlannedDay } from './types'

export type WeekProgress = {
  done: number
  /** Days with a routine. Rest days are not a target, they are the absence of one (D30). */
  planned: number
  ratio: number
}

export function weekProgress(week: readonly PlannedDay[]): WeekProgress {
  const done = week.filter((day) => day.trained).length
  const planned = week.filter((day) => day.routineName !== null).length

  return { done, planned, ratio: planned === 0 ? 0 : done / planned }
}
