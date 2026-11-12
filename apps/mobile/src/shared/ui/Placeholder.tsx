import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'

import { Text } from './Text'

const useStyles = makeStyles((t) => ({
  root: {
    alignItems: 'center',
    backgroundColor: t.color.bg,
    flex: 1,
    gap: t.space.s2,
    justifyContent: 'center',
    padding: t.space.s6,
  },
  note: { textAlign: 'center' },
}))

export type PlaceholderProps = {
  title: string
  note: string
}

/** Stands in until the screen exists. It has no business logic and no state. */
export function Placeholder({ title, note }: PlaceholderProps) {
  const s = useStyles()

  return (
    <View style={s.root}>
      <Text variant="displayLg" tone="ink">
        {title}
      </Text>
      <Text variant="body" tone="inkMuted" style={s.note}>
        {note}
      </Text>
    </View>
  )
}
