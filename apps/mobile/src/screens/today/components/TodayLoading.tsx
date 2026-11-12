import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'
import { Skeleton } from '@/shared/ui/Skeleton'

const EXERCISE_ROWS = 5
const WEEK_BLOCK = 55

const useStyles = makeStyles((t) => ({
  body: { gap: t.space.s6, paddingHorizontal: t.space.s5 },
  rows: { gap: t.space.s2 },
}))

/**
 * The blocks have the real heights of what is coming: the window, the week strip and five
 * rows of `row-h`. A skeleton that does not match the shape is a second layout.
 */
export function TodayLoading() {
  const s = useStyles()
  const { t } = useTranslation()

  return (
    <View
      accessibilityLabel={t('today.a11y.loading')}
      accessibilityRole="progressbar"
      style={s.body}
    >
      <Skeleton height={theme.size.heroWindowH} radius={theme.radius.xl} />
      <Skeleton height={WEEK_BLOCK} />
      <View style={s.rows}>
        {Array.from({ length: EXERCISE_ROWS }, (_, index) => (
          <Skeleton height={theme.size.rowH} key={index} />
        ))}
      </View>
    </View>
  )
}
