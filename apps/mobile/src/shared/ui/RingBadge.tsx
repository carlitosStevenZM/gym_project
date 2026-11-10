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
    /**
     * A pill, not a circle. Where a figure is widest — the top of its digits — a circle is
     * at its narrowest: 67.5 needs 35 px and a 44 circle offers 24 there, so the number
     * runs into the ring. At `radius-pill` the shape stays round and follows its content,
     * which for a short figure is still a circle.
     */
    borderRadius: t.radius.pill,
    borderWidth: t.border.ring,
    justifyContent: 'center',
    paddingHorizontal: t.space.s2,
  },
  solid: { backgroundColor: t.color.accent },
}))

export type RingBadgeProps = {
  /** `null` draws the empty variant whatever variant was asked for. */
  value: number | null
  unit?: string
  variant?: RingBadgeVariant
  /** The height, and the width a short figure keeps: 56 in a closing strip, 44 in a row. */
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
        { borderColor: theme.color[RING[shown]], height: size, minWidth: size },
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
