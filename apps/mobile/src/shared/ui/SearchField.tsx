import { useState } from 'react'
import { TextInput, View, type TextInputProps } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'

import { Touchable } from './Touchable'
import { Icon } from './icons/Icon'

const CLEAR_HIT_SLOP = 14

const useStyles = makeStyles((t) => ({
  box: {
    alignItems: 'center',
    backgroundColor: t.color.inputBg,
    borderColor: t.color.inputLine,
    borderRadius: t.radius.pill,
    borderWidth: t.border.hairline,
    flexDirection: 'row',
    gap: t.space.s3,
    height: t.size.inputH,
    paddingHorizontal: t.space.s4,
  },
  focused: { borderColor: t.color.focus, borderWidth: t.border.focus },
  input: { ...t.text.body, color: t.color.ink, flex: 1, padding: 0 },
}))

export type SearchFieldProps = Omit<TextInputProps, 'style' | 'value'> & {
  value: string
  /** Filters as you type: searching is not validating. */
  onChangeText: (value: string) => void
  label: string
  clearLabel: string
}

export function SearchField({
  value,
  onChangeText,
  label,
  clearLabel,
  onBlur,
  onFocus,
  ...rest
}: SearchFieldProps) {
  const s = useStyles()
  const [focused, setFocused] = useState(false)

  return (
    <View style={[s.box, focused ? s.focused : null]}>
      <Icon name="search" size={theme.size.iconSm} tone="inkMuted" />
      <TextInput
        {...rest}
        accessibilityLabel={label}
        onBlur={(event) => {
          setFocused(false)
          onBlur?.(event)
        }}
        onChangeText={onChangeText}
        onFocus={(event) => {
          setFocused(true)
          onFocus?.(event)
        }}
        placeholderTextColor={theme.color.inkMuted}
        style={s.input}
        value={value}
      />
      {value.length > 0 ? (
        <Touchable
          accessibilityLabel={clearLabel}
          accessibilityRole="button"
          hitSlop={CLEAR_HIT_SLOP}
          onPress={() => onChangeText('')}
        >
          <Icon name="close" size={theme.size.iconSm} tone="inkMuted" />
        </Touchable>
      ) : null}
    </View>
  )
}
