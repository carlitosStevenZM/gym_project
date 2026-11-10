import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'
import type { ColorToken } from '@/shared/theme/tokens.gen'

import { Text } from './Text'

/** Not copy: the figure shown when the exercise has no history yet. */
const NO_VALUE = '—'

export type FigureMarkVariant = 'record' | 'reference' | 'empty' | 'solid'

const MARK: Readonly<Record<FigureMarkVariant, ColorToken>> = {
  record: 'accent',
  reference: 'ringTrack',
  empty: 'ringTrack',
  solid: 'accent',
}

const FIGURE: Readonly<Record<FigureMarkVariant, ColorToken>> = {
  record: 'ink',
  reference: 'inkSoft',
  empty: 'inkMuted',
  solid: 'accentInk',
}

const useStyles = makeStyles((t) => ({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: t.space.s2,
  },
  /**
   * A rule under the figure rather than a ring around it. The ring only ever carried one
   * bit — whether this is your best lift — and paid for it with a circle that a four
   * character figure does not fit: where digits are widest a 44 circle is 24 across.
   *
   * It hugs its content instead of filling a fixed box, so the gap under the figure is the
   * same whether or not there is a unit beneath it. An underline that floats away from its
   * text stops reading as an underline.
   */
  underline: { borderBottomWidth: t.border.ring, paddingBottom: t.space.s1 },
  /** The one place the badge is the subject rather than a mark on a row. */
  solid: { backgroundColor: t.color.accent, borderRadius: t.radius.pill },
}))

export type FigureMarkProps = {
  /** `null` draws the empty variant whatever variant was asked for. */
  value: number | null
  unit?: string
  variant?: FigureMarkVariant
  /** The height, and the width a short figure keeps: 56 in a closing strip, 44 in a row. */
  size?: number
}

/** One decimal at most: 67.5 yes, 67.50 no. */
function format(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

/**
 * A figure, its unit, and a rule underneath that says whether it is your best. It is not a
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
      style={[
        s.badge,
        solid ? s.solid : s.underline,
        { borderBottomColor: theme.color[MARK[shown]], minWidth: size },
        solid ? { height: size } : null,
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
