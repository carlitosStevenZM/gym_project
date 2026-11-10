import { useTranslation } from 'react-i18next'

import { isoWeekdayOf, useDateLabels, type IsoWeekday } from '@/shared/lib/use-date-labels'
import { WeekStrip, type WeekDay } from '@/shared/ui/WeekStrip'

import type { PlannedDay } from '../types'

export type WeekOverviewProps = {
  week: readonly PlannedDay[]
  today: Date
}

/**
 * Turns the plan into the seven circles. Trained and today are not exclusive: a day that is
 * both is filled and ringed, which is why `today` travels apart from the state.
 */
export function WeekOverview({ week, today }: WeekOverviewProps) {
  const { t } = useTranslation()
  const labels = useDateLabels()
  const todayWeekday: IsoWeekday = isoWeekdayOf(today)

  const days: WeekDay[] = week.map((day) => ({
    key: String(day.weekday),
    initial: labels.weekdayInitial(day.weekday),
    state: day.trained ? 'trained' : day.routineName ? 'planned' : 'rest',
    today: day.weekday === todayWeekday,
    accessibilityLabel: [
      labels.weekdayLong(day.weekday),
      day.weekday === todayWeekday ? t('today.a11y.today') : null,
      day.routineName ?? t('today.a11y.rest'),
      day.trained ? t('today.a11y.trained') : null,
    ]
      .filter(Boolean)
      .join(', '),
  }))

  const done = week.filter((day) => day.trained).length
  const planned = week.filter((day) => day.routineName !== null).length

  return (
    <WeekStrip
      counter={t('ui.week.counter', { done, planned })}
      days={days}
      label={t('ui.week.label')}
    />
  )
}
