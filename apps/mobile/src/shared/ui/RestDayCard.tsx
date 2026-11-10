import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'

import { Text } from './Text'

const useStyles = makeStyles((t) => ({
  box: {
    alignItems: 'center',
    borderColor: t.color.line,
    borderRadius: t.radius.xl,
    borderStyle: 'dashed',
    borderWidth: t.border.hairline,
    gap: t.space.s2,
    paddingHorizontal: t.space.s5,
    paddingVertical: t.space.s8,
  },
}))

export type RestDayCardProps = {
  /** «DESCANSO» */
  title: string
  /** «Este día no tiene rutina asignada» */
  note: string
}

/**
 * A rest day is the absence of a routine, not a choice the user made (D30), so there is no
 * photograph, no disc and no button: nothing to start, and offering to «train anyway»
 * would contradict D13.
 */
export function RestDayCard({ title, note }: RestDayCardProps) {
  const s = useStyles()

  return (
    <View accessibilityRole="summary" style={s.box}>
      <Text variant="displayLg" tone="inkMuted">
        {title}
      </Text>
      <Text variant="caption" tone="inkMuted">
        {note}
      </Text>
    </View>
  )
}
