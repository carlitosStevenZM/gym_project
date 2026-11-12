import { useTranslation } from 'react-i18next'

import type { TodayExercise } from '../types'

export type ExerciseLabels = {
  /** «4 series · 8-12 reps» */
  detail: (exercise: TodayExercise) => string
  /** The whole row as one sentence, for the screen reader. */
  sentence: (exercise: TodayExercise) => string
}

export function useExerciseLabels(): ExerciseLabels {
  const { t } = useTranslation()

  const reps = (exercise: TodayExercise): string =>
    exercise.repsMax === null
      ? String(exercise.repsMin)
      : t('today.repsRange', { min: exercise.repsMin, max: exercise.repsMax })

  const spokenReps = (exercise: TodayExercise): string =>
    exercise.repsMax === null
      ? t('today.a11y.repsExact', { count: exercise.repsMin })
      : t('today.a11y.repsRange', { min: exercise.repsMin, max: exercise.repsMax })

  return {
    detail: (exercise) =>
      t('today.exerciseDetail', {
        sets: t('today.setCount', { count: exercise.sets }),
        reps: reps(exercise),
      }),

    sentence: (exercise) =>
      [
        exercise.name,
        t('today.setCount', { count: exercise.sets }),
        spokenReps(exercise),
        exercise.lastWeightKg === null
          ? t('today.a11y.noHistory')
          : t('today.a11y.lastTime', { weight: exercise.lastWeightKg }),
        exercise.isRecord ? t('today.a11y.record') : null,
      ]
        .filter(Boolean)
        .join(', '),
  }
}
