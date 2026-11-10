import { View, type StyleProp, type ViewStyle } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'
import type { ColorToken } from '@/shared/theme/tokens.gen'

import { Text } from './Text'
import { Touchable } from './Touchable'
import { Icon, type IconName } from './icons/Icon'
import { HOLD_MULTIPLIER, useHoldRepeat } from './use-hold-repeat'

const useStyles = makeStyles((t) => ({
  group: { gap: t.space.s2 },
  row: { alignItems: 'center', flexDirection: 'row', gap: t.space.s2 },
  key: {
    alignItems: 'center',
    backgroundColor: t.color.inputBg,
    borderRadius: t.radius.md,
    height: t.size.stepperKey,
    justifyContent: 'center',
    width: t.size.stepperKey,
  },
  value: {
    alignItems: 'center',
    backgroundColor: t.color.inputBg,
    borderRadius: t.radius.md,
    flex: 1,
    height: t.size.stepperKey,
    justifyContent: 'center',
  },
}))

export type StepperProps = {
  label: string
  value: number
  step: number
  onChange: (next: number) => void
  unit?: string
  min?: number
  max?: number
  /** A value out of reach of the step: the caller opens the numeric keyboard. */
  onPressValue?: () => void
  decrementLabel: string
  incrementLabel: string
  /** `ink-soft` while the set is only pre-filled with last time's value (D21). */
  tone?: Extract<ColorToken, 'ink' | 'inkSoft'>
  disabled?: boolean
}

export function Stepper({
  label,
  value,
  step,
  onChange,
  unit,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  onPressValue,
  decrementLabel,
  incrementLabel,
  tone = 'ink',
  disabled = false,
}: StepperProps) {
  const s = useStyles()

  const apply = (direction: -1 | 1, multiplier: number) => {
    const next = value + direction * step * multiplier
    onChange(Math.min(max, Math.max(min, Number(next.toFixed(2)))))
  }

  return (
    <View style={s.group}>
      <Text variant="label" tone="inkMuted">
        {label}
      </Text>
      <View style={s.row}>
        <StepperKey
          accessibilityLabel={decrementLabel}
          disabled={disabled || value <= min}
          icon="minus"
          onHoldStep={() => apply(-1, HOLD_MULTIPLIER)}
          onStep={() => apply(-1, 1)}
          style={s.key}
        />
        <Touchable
          accessibilityLabel={label}
          accessibilityRole={onPressValue ? 'button' : 'text'}
          disabled={disabled || !onPressValue}
          onPress={onPressValue}
          style={s.value}
        >
          <Text variant="numericLg" tone={tone}>
            {value}
          </Text>
          {unit ? (
            <Text variant="numericUnit" tone="inkMuted">
              {unit}
            </Text>
          ) : null}
        </Touchable>
        <StepperKey
          accessibilityLabel={incrementLabel}
          disabled={disabled || value >= max}
          icon="plus"
          onHoldStep={() => apply(1, HOLD_MULTIPLIER)}
          onStep={() => apply(1, 1)}
          style={s.key}
        />
      </View>
    </View>
  )
}

type StepperKeyProps = {
  accessibilityLabel: string
  disabled: boolean
  icon: IconName
  onStep: () => void
  onHoldStep: () => void
  style: StyleProp<ViewStyle>
}

function StepperKey({
  accessibilityLabel,
  disabled,
  icon,
  onStep,
  onHoldStep,
  style,
}: StepperKeyProps) {
  const hold = useHoldRepeat(onHoldStep)

  return (
    <Touchable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onStep}
      onPressIn={hold.start}
      onPressOut={hold.stop}
      style={style}
    >
      <Icon name={icon} size={theme.size.iconLg} tone="ink" />
    </Touchable>
  )
}
