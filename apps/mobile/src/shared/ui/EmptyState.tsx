import type { ReactNode } from 'react'
import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'

import { Text } from './Text'

const useStyles = makeStyles((t) => ({
  box: {
    backgroundColor: t.color.surface,
    borderRadius: t.radius.lg,
    gap: t.space.s3,
    padding: t.space.s5,
  },
  hint: { backgroundColor: t.color.surfaceAlt, borderRadius: t.radius.sm, height: 12 },
  hints: { gap: t.space.s2, paddingTop: t.space.s2 },
  action: { paddingTop: t.space.s2 },
}))

export type EmptyStateProps = {
  title: string
  /** Names what is missing and what fills it. Never «No hay datos». */
  body: string
  /** A single PillButton, when the user can actually do something about it. */
  action?: ReactNode
  /** Two dim bars hinting at the shape of the list that will come. */
  showShape?: boolean
}

export function EmptyState({ title, body, action, showShape = false }: EmptyStateProps) {
  const s = useStyles()

  return (
    <View accessibilityRole="summary" style={s.box}>
      <Text accessibilityRole="header" variant="displayMd" tone="ink">
        {title}
      </Text>
      <Text variant="body" tone="inkSoft">
        {body}
      </Text>
      {showShape ? (
        <View accessibilityElementsHidden style={s.hints}>
          <View style={s.hint} />
          <View style={[s.hint, { width: '70%' }]} />
        </View>
      ) : null}
      {action ? <View style={s.action}>{action}</View> : null}
    </View>
  )
}
