import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useDateLabels } from '@/shared/lib/use-date-labels'
import { makeStyles } from '@/shared/theme/styles'
import { EmptyState } from '@/shared/ui/EmptyState'
import { PillButton } from '@/shared/ui/PillButton'
import { ScreenHeader } from '@/shared/ui/ScreenHeader'

import { TODAY_TRAINING } from './today.fixture'
import type { TodayView } from './types'

import { TodayLoading } from './components/TodayLoading'
import { TodayRest } from './components/TodayRest'
import { TodayTraining } from './components/TodayTraining'

const useStyles = makeStyles((t) => ({
  root: { backgroundColor: t.color.bg, flex: 1 },
  /** The 16 of air the vertical budget puts between the header and the window. */
  content: { paddingTop: t.space.s4 },
  gutter: { paddingHorizontal: t.space.s5 },
}))

export function TodayScreen() {
  const s = useStyles()
  const { t } = useTranslation()
  const labels = useDateLabels()
  const insets = useSafeAreaInsets()

  // The only line that knows where the data comes from. It becomes a `domain/today` hook the
  // day the backend exists; everything below reads the view model and nothing else.
  const view: TodayView = TODAY_TRAINING

  const date = view.kind === 'training' || view.kind === 'rest' ? view.date : null

  return (
    <View style={s.root}>
      <ScreenHeader badge={date ? labels.dayAndMonth(date) : undefined} title={t('tabs.today')} />
      <ScrollView contentContainerStyle={[s.content, { paddingBottom: insets.bottom }]}>
        <TodayBody view={view} />
      </ScrollView>
    </View>
  )
}

function TodayBody({ view }: { view: TodayView }) {
  const s = useStyles()
  const { t } = useTranslation()

  switch (view.kind) {
    case 'loading':
      return <TodayLoading />

    case 'error':
      return (
        <View style={s.gutter}>
          <EmptyState
            action={
              <PillButton
                block
                label={t('ui.action.retry')}
                onPress={retryNotWired}
                variant="outline"
              />
            }
            body={t('today.error.body')}
            title={t('today.error.title')}
          />
        </View>
      )

    case 'noWeeklyTraining':
      return (
        <View style={s.gutter}>
          <EmptyState
            action={
              <PillButton block label={t('ui.action.createWeek')} onPress={createWeekNotWired} />
            }
            body={t('today.noWeeklyTraining.body')}
            title={t('today.noWeeklyTraining.title')}
          />
        </View>
      )

    case 'rest':
      return <TodayRest view={view} />

    case 'training':
      return <TodayTraining onStart={startSessionNotWired} view={view} />
  }
}

// The three routes these open do not exist yet: starting a session is FR-6 and needs the
// backend, and creating a weekly training is FR-5, in the Rutinas tab. They are named rather
// than inlined so a grep for "NotWired" finds everything still waiting on a route.
function startSessionNotWired() {}
function createWeekNotWired() {}
function retryNotWired() {}
