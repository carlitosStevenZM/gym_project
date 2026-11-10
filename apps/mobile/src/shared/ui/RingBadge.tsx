import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'
import type { ColorToken } from '@/shared/theme/tokens.gen'

import { Text } from './Text'

/** Not copy: the figure a badge shows when the exercise has no history yet. */
const NO_VALUE = '—'

export type RingBadgeVariant = 'record' | 'reference' | 'empty' | 'solid'

const RING: Readonly<Record<RingBadgeVariant, ColorToken>> = {
  record: 'accent',
  reference: 'ringTrack',
  empty: 'ringTrack',
  solid: 'accent',
}

const FIGURE: Readonly<Record<RingBadgeVariant, ColorToken>> = {
  record: 'ink',
  reference: 'inkSoft',
  empty: 'inkMuted',
  solid: 'accentInk',
}

const useStyles = makeStyles((t) => ({
  badge: {
    alignItems: 'center',
    borderRadius: t.radius.circle,
    borderWidth: t.border.ring,
    justifyContent: 'center',
  },
  solid: { backgroundColor: t.color.accent },
}))

export type RingBadgeProps = {
  /** `null` draws the empty variant whatever variant was asked for. */
  value: number | null
  unit?: string
  variant?: RingBadgeVariant
  /** 56 in a closing strip, 44 in a row, 36 when it is purely informative. */
  size?: number
}

/** One decimal at most: 67.5 yes, 67.50 no. */
function format(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

export function RingBadge({
  value,
  unit,
  variant = 'reference',
  size = theme.size.badge,
}: RingBadgeProps) {
  const s = useStyles()
  const shown: RingBadgeVariant = value === null ? 'empty' : variant

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        s.badge,
        shown === 'solid' ? s.solid : null,
        { borderColor: theme.color[RING[shown]], height: size, width: size },
      ]}
    >
      <Text variant="numericMd" tone={FIGURE[shown]}>
        {value === null ? NO_VALUE : format(value)}
      </Text>
      {unit && value !== null ? (
        <Text variant="numericUnit" tone="inkMuted">
          {unit}
        </Text>
      ) : null}
    </View>
  )
}
