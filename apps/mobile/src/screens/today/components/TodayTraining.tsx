import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import heroSample from '@/assets/images/hero-sample.webp'
import { makeStyles } from '@/shared/theme/styles'
import { ActionDisc } from '@/shared/ui/ActionDisc'
import { ExerciseRow } from '@/shared/ui/ExerciseRow'
import { HERO_DISC_OVERHANG, HeroWindow } from '@/shared/ui/HeroWindow'

import type { TodayView } from '../types'
import { weekProgress } from '../week-progress'

import { UpNext } from './UpNext'
import { WeekOverview } from './WeekOverview'
import { useExerciseLabels } from './exercise-labels'

const useStyles = makeStyles((t) => ({
  gutter: { paddingHorizontal: t.space.s5 },
  /** Clears the half of the disc that hangs below the window. */
  afterHero: { paddingTop: HERO_DISC_OVERHANG + t.space.s2 },
  list: { paddingTop: t.space.s4 },
}))

export type TodayTrainingProps = {
  view: Extract<TodayView, { kind: 'training' }>
  onStart: () => void
}

export function TodayTraining({ view, onStart }: TodayTrainingProps) {
  const s = useStyles()
  const { t } = useTranslation()
  const labels = useExerciseLabels()
  const progress = weekProgress(view.week)

  const totalSets = view.exercises.reduce((sum, exercise) => sum + exercise.sets, 0)
  const firstExercise = view.exercises[0]

  return (
    <>
      <HeroWindow
        chips={[
          t('today.exerciseCount', { count: view.exercises.length }),
          t('today.setCount', { count: totalSets }),
        ]}
        disc={
          <ActionDisc
            accessibilityLabel={
              firstExercise
                ? t('today.a11y.start', { exercise: firstExercise.name })
                : t('ui.action.start')
            }
            label={t('ui.action.start')}
            onPress={onStart}
            progress={progress.ratio}
            progressLabel={t('today.a11y.weekProgress', {
              done: progress.done,
              planned: progress.planned,
            })}
          />
        }
        kicker={t('today.kicker', { weekly: view.weeklyTrainingName })}
        source={heroSample}
        title={view.routineName}
      />

      <View style={[s.gutter, s.afterHero]}>
        <WeekOverview today={view.date} week={view.week} />
      </View>

      <View style={[s.gutter, s.list]}>
        {view.exercises.map((exercise) => (
          <ExerciseRow
            accessibilityLabel={labels.sentence(exercise)}
            detail={labels.detail(exercise)}
            illustrationUri={exercise.illustrationUri}
            isRecord={exercise.isRecord}
            key={exercise.id}
            name={exercise.name}
            unit={t('unit.kg')}
            weight={exercise.lastWeightKg}
          />
        ))}
      </View>

      <View style={s.gutter}>
        <UpNext days={view.upNext} />
      </View>
    </>
  )
}
