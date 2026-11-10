import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'

import { Text } from './Text'
import { Touchable } from './Touchable'

const SEGMENT_HEIGHT = 36
const RAIL_PADDING = 3

/** The visible segment is 36 tall; the hit slop takes the target past `touch-min`. */
const SEGMENT_HIT_SLOP = 4

const useStyles = makeStyles((t) => ({
  rail: {
    backgroundColor: t.color.surface,
    borderRadius: t.radius.pill,
    flexDirection: 'row',
    padding: RAIL_PADDING,
  },
  segment: {
    alignItems: 'center',
    borderRadius: t.radius.pill,
    flex: 1,
    height: SEGMENT_HEIGHT,
    justifyContent: 'center',
  },
  active: { backgroundColor: t.color.accent },
  disabled: { opacity: t.opacity.disabled },
}))

export type Segment<T extends string> = {
  value: T
  label: string
}

export type SegmentedControlProps<T extends string> = {
  /** Two to four short, same-kind options. More than that, or long labels, means a Select. */
  segments: readonly Segment<T>[]
  value: T
  onChange: (value: T) => void
  label: string
  disabled?: boolean
}

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  label,
  disabled = false,
}: SegmentedControlProps<T>) {
  const s = useStyles()

  return (
    <View
      accessibilityLabel={label}
      accessibilityRole="radiogroup"
      style={[s.rail, disabled ? s.disabled : null]}
    >
      {segments.map((segment) => {
        const active = segment.value === value
        return (
          <Touchable
            accessibilityLabel={segment.label}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            disabled={disabled}
            hitSlop={SEGMENT_HIT_SLOP}
            key={segment.value}
            onPress={() => onChange(segment.value)}
            style={[s.segment, active ? s.active : null]}
          >
            <Text variant="link" tone={active ? 'accentInk' : 'inkSoft'}>
              {segment.label}
            </Text>
          </Touchable>
        )
      })}
    </View>
  )
}
