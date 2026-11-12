import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'
import type { ColorToken } from '@/shared/theme/tokens.gen'

import { Text } from './Text'

/** Not copy: the figure shown when the exercise has no history yet. */
const NO_VALUE = '—'

export type FigureMarkVariant = 'record' | 'reference' | 'empty' | 'solid'

const FIGURE: Readonly<Record<FigureMarkVariant, ColorToken>> = {
  record: 'ink',
  reference: 'inkSoft',
  empty: 'inkMuted',
  solid: 'accentInk',
}

const useStyles = makeStyles((t) => ({
  badge: {
    /** Both lines hang off the right edge, so the column of figures is a column. */
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  /**
   * No mark at all. On this background `accent` and `ink-soft` sit at the same lightness
   * (1.15:1), so an orange figure never stood out from a grey one on its own — the ring
   * was carrying the whole signal. What does carry it, at 2.22:1 of pure lightness, is
   * `ink` against `ink-soft`: the best lift is simply the bright number in the column.
   */
  plain: {},
  /** The one place the figure is the subject rather than a reading on a row. */
  solid: {
    alignItems: 'center',
    backgroundColor: t.color.accent,
    borderRadius: t.radius.pill,
    paddingHorizontal: t.space.s3,
  },
}))

export type FigureMarkProps = {
  /** `null` draws the empty variant whatever variant was asked for. */
  value: number | null
  unit?: string
  variant?: FigureMarkVariant
  /** Only the `solid` variant has a box to size. 56 in a closing strip. */
  size?: number
}

/** One decimal at most: 67.5 yes, 67.50 no. */
function format(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

/**
 * A figure and its unit, with no container around them. Which one is your best lift is
 * carried by the figure itself, in `ink` against the column's `ink-soft`. It is not a
 * button: if something has to be touched, the row is the target.
 */
export function FigureMark({
  value,
  unit,
  variant = 'reference',
  size = theme.size.badge,
}: FigureMarkProps) {
  const s = useStyles()
  const shown: FigureMarkVariant = value === null ? 'empty' : variant
  const solid = shown === 'solid'

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[s.badge, solid ? s.solid : s.plain, solid ? { height: size, minWidth: size } : null]}
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
