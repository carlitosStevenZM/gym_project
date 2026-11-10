import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'
import { EmptyState } from '@/shared/ui/EmptyState'
import { RestDayCard } from '@/shared/ui/RestDayCard'

import type { TodayView } from '../types'

import { UpNext } from './UpNext'
import { WeekOverview } from './WeekOverview'

const useStyles = makeStyles((t) => ({
  body: { gap: t.space.s6, paddingHorizontal: t.space.s5 },
}))

export type TodayRestProps = {
  view: Extract<TodayView, { kind: 'rest' }>
}

/**
 * No window and no disc: a rest day is the absence of a routine, not a choice the user made
 * (D30), and there is nothing to start (D13).
 */
export function TodayRest({ view }: TodayRestProps) {
  const s = useStyles()
  const { t } = useTranslation()

  return (
    <View style={s.body}>
      <RestDayCard note={t('ui.restDay.note')} title={t('ui.restDay.title')} />
      <WeekOverview today={view.date} week={view.week} />
      {view.bestLift ? (
        <UpNext bestLift={view.bestLift} days={view.upNext} />
      ) : (
        <EmptyState body={t('today.noRecords.body')} showShape title={t('today.noRecords.title')} />
      )}
    </View>
  )
}
