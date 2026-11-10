import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'

import { Stepper } from './Stepper'
import { Text } from './Text'
import { Touchable } from './Touchable'
import { Icon } from './icons/Icon'

/** The barbell step is the smallest plate in common use per side; everything else moves by 1. */
export const BARBELL_STEP_KG = 2.5
export const MACHINE_STEP_KG = 1

const useStyles = makeStyles((t) => ({
  root: { gap: t.space.s3 },
  row: { flexDirection: 'row', gap: t.space.s4 },
  column: { flex: 1 },
  confirm: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: t.space.s2,
    minHeight: t.size.touchMin,
  },
}))

export type SetStepperLabels = {
  weight: string
  reps: string
  unit: string
  decrementWeight: string
  incrementWeight: string
  decrementReps: string
  incrementReps: string
  confirm: string
  confirmed: string
}

export type SetStepperProps = {
  weight: number
  reps: number
  onChangeWeight: (value: number) => void
  onChangeReps: (value: number) => void
  onConfirm: () => void
  labels: SetStepperLabels
  weightStep?: number
  /** The set is confirmed: the keys lock and the row shows its mark. Undoing is the caller's. */
  confirmed?: boolean
  /** Still showing last time's weight, untouched (D21): the figure stays in `ink-soft`. */
  pristine?: boolean
  onPressWeight?: () => void
  onPressReps?: () => void
}

/**
 * Two taps and two values (FR-6). With last time's weight pre-filled a set confirms in one
 * tap; if this control ever needs a third, it was built wrong.
 */
export function SetStepper({
  weight,
  reps,
  onChangeWeight,
  onChangeReps,
  onConfirm,
  labels,
  weightStep = BARBELL_STEP_KG,
  confirmed = false,
  pristine = false,
  onPressWeight,
  onPressReps,
}: SetStepperProps) {
  const s = useStyles()
  const tone = pristine && !confirmed ? 'inkSoft' : 'ink'

  return (
    <View style={s.root}>
      <View style={s.row}>
        <View style={s.column}>
          <Stepper
            decrementLabel={labels.decrementWeight}
            disabled={confirmed}
            incrementLabel={labels.incrementWeight}
            label={labels.weight}
            onChange={onChangeWeight}
            onPressValue={onPressWeight}
            step={weightStep}
            tone={tone}
            unit={labels.unit}
            value={weight}
          />
        </View>
        <View style={s.column}>
          <Stepper
            decrementLabel={labels.decrementReps}
            disabled={confirmed}
            incrementLabel={labels.incrementReps}
            label={labels.reps}
            onChange={onChangeReps}
            onPressValue={onPressReps}
            step={1}
            tone={tone}
            value={reps}
          />
        </View>
      </View>
      <Touchable
        accessibilityLabel={confirmed ? labels.confirmed : labels.confirm}
        accessibilityRole="button"
        accessibilityState={{ checked: confirmed }}
        onPress={onConfirm}
        style={s.confirm}
      >
        <Icon name="check" size={theme.size.iconMd} tone={confirmed ? 'ok' : 'inkSoft'} />
        <Text variant="body" tone={confirmed ? 'ok' : 'inkSoft'}>
          {confirmed ? labels.confirmed : labels.confirm}
        </Text>
      </Touchable>
    </View>
  )
}
