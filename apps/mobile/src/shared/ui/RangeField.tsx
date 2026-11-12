import { TextInput, View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'

import { Text } from './Text'

/** Not copy: the separator between the two cells of a range. */
const DASH = '–'

const useStyles = makeStyles((t) => ({
  field: { gap: t.space.s2 },
  row: { alignItems: 'center', flexDirection: 'row', gap: t.space.s3 },
  cell: {
    backgroundColor: t.color.inputBg,
    borderColor: t.color.inputLine,
    borderRadius: t.radius.md,
    borderWidth: t.border.hairline,
    flex: 1,
    height: t.size.inputH,
  },
  input: { ...t.text.numericMd, color: t.color.ink, height: '100%', textAlign: 'center' },
  disabled: { opacity: t.opacity.disabled },
}))

export type Range = {
  min: number | null
  max: number | null
}

export type RangeFieldProps = {
  label: string
  value: Range
  onChange: (value: Range) => void
  minLabel: string
  maxLabel: string
  /** Fixed while a session is in progress: sets and target do not move mid session (D11). */
  disabledReason?: string
}

function parse(text: string): number | null {
  const digits = text.replace(/[^0-9]/g, '')
  return digits === '' ? null : Number(digits)
}

/**
 * The target range is informative and is never validated against what was logged (D14), so
 * neither cell can produce an error. The only rule is that the maximum follows the minimum
 * up instead of showing a complaint.
 */
export function RangeField({
  label,
  value,
  onChange,
  minLabel,
  maxLabel,
  disabledReason,
}: RangeFieldProps) {
  const s = useStyles()
  const disabled = disabledReason !== undefined

  const changeMin = (text: string) => {
    const min = parse(text)
    const max = min !== null && value.max !== null && min > value.max ? min : value.max
    onChange({ min, max })
  }

  return (
    <View style={[s.field, disabled ? s.disabled : null]}>
      <Text variant="label" tone="inkSoft">
        {label}
      </Text>
      <View style={s.row}>
        <View style={s.cell}>
          <TextInput
            accessibilityLabel={minLabel}
            editable={!disabled}
            inputMode="numeric"
            onChangeText={changeMin}
            placeholderTextColor={theme.color.inkMuted}
            style={s.input}
            value={value.min === null ? '' : String(value.min)}
          />
        </View>
        <Text variant="body" tone="inkMuted">
          {DASH}
        </Text>
        <View style={s.cell}>
          <TextInput
            accessibilityLabel={maxLabel}
            editable={!disabled}
            inputMode="numeric"
            onChangeText={(text) => onChange({ ...value, max: parse(text) })}
            placeholderTextColor={theme.color.inkMuted}
            style={s.input}
            value={value.max === null ? '' : String(value.max)}
          />
        </View>
      </View>
      {disabledReason ? (
        <Text variant="caption" tone="inkMuted">
          {disabledReason}
        </Text>
      ) : null}
    </View>
  )
}
