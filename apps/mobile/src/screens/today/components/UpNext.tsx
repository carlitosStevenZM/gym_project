import { useTranslation } from 'react-i18next'

import { useDateLabels } from '@/shared/lib/use-date-labels'
import { UpNextStrip, type UpNextItem } from '@/shared/ui/UpNextStrip'

import type { BestLift, UpNextDay } from '../types'

export type UpNextProps = {
  days: readonly UpNextDay[]
  /** On a rest day the strip carries the personal best instead of the day that is coming. */
  bestLift?: BestLift | null
}

export function UpNext({ days, bestLift }: UpNextProps) {
  const { t } = useTranslation()
  const labels = useDateLabels()

  if (bestLift) {
    return (
      <UpNextStrip
        accessibilityLabel={`${t('ui.upNext.label')}, ${bestLift.exerciseName}, ${bestLift.weightKg} ${t('unit.kg')}`}
        items={[
          {
            key: 'best-lift',
            label: t('ui.upNext.label'),
            title: bestLift.exerciseName,
            badge: { value: bestLift.weightKg, unit: t('unit.kg') },
          },
        ]}
      />
    )
  }

  const items: UpNextItem[] = days.map((day) => ({
    key: String(day.weekday),
    dayAbbr: labels.weekdayShort(day.weekday),
    label: t('ui.upNext.label'),
    title: day.routineName,
    detail: t('today.exerciseCount', { count: day.exerciseCount }),
  }))

  const spoken = days
    .map(
      (day) =>
        `${labels.weekdayLong(day.weekday)}, ${day.routineName}, ${t('today.exerciseCount', { count: day.exerciseCount })}`,
    )
    .join('. ')

  return <UpNextStrip accessibilityLabel={`${t('ui.upNext.label')}, ${spoken}`} items={items} />
}
