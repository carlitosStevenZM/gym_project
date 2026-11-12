import { useState, type ComponentRef, type Ref } from 'react'
import { TextInput, View, type TextInputProps } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'

import { Text } from './Text'
import { Icon } from './icons/Icon'

const useStyles = makeStyles((t) => ({
  field: { gap: t.space.s2 },
  box: {
    backgroundColor: t.color.inputBg,
    borderColor: t.color.inputLine,
    borderRadius: t.radius.md,
    borderWidth: t.border.hairline,
    height: t.size.inputH,
    justifyContent: 'center',
    paddingHorizontal: t.space.s4,
  },
  focused: { borderColor: t.color.focus, borderWidth: t.border.focus },
  errored: { borderColor: t.color.danger, borderWidth: t.border.focus },
  readOnly: { backgroundColor: t.color.surface, borderWidth: 0 },
  disabled: { opacity: t.opacity.disabled },
  input: { ...t.text.body, color: t.color.ink, padding: 0 },
  message: { alignItems: 'center', flexDirection: 'row', gap: t.space.s2 },
}))

/** What a screen gets back: enough to move focus, nothing else. */
export type TextFieldHandle = ComponentRef<typeof TextInput>

export type TextFieldProps = Omit<TextInputProps, 'style' | 'editable'> & {
  /** Always visible above the box. A placeholder is never the label: it leaves on first keypress. */
  label: string
  /** Shown under the box in `ink-muted` while there is no error. */
  help?: string
  /** Replaces the help line, says how to fix it, and thickens the border. */
  error?: string
  readOnly?: boolean
  /** Disabling is only possible with a reason the user can read. */
  disabledReason?: string
  /** So a form can send the return key to the next field. */
  ref?: Ref<TextFieldHandle>
}

export function TextField({
  label,
  help,
  error,
  readOnly = false,
  disabledReason,
  onBlur,
  onFocus,
  ref,
  ...rest
}: TextFieldProps) {
  const s = useStyles()
  const [focused, setFocused] = useState(false)
  const disabled = disabledReason !== undefined
  const message = error ?? disabledReason ?? help

  return (
    <View style={[s.field, disabled ? s.disabled : null]}>
      <Text variant="label" tone="inkSoft">
        {label}
      </Text>
      <View
        style={[
          s.box,
          readOnly ? s.readOnly : null,
          focused && !error ? s.focused : null,
          error ? s.errored : null,
        ]}
      >
        <TextInput
          {...rest}
          accessibilityLabel={label}
          editable={!disabled && !readOnly}
          onBlur={(event) => {
            setFocused(false)
            onBlur?.(event)
          }}
          onFocus={(event) => {
            setFocused(true)
            onFocus?.(event)
          }}
          placeholderTextColor={theme.color.inkMuted}
          ref={ref}
          style={s.input}
        />
      </View>
      {message ? (
        <View style={s.message}>
          {error ? <Icon name="error" size={theme.size.iconSm} tone="danger" /> : null}
          <Text variant="caption" tone={error ? 'danger' : 'inkMuted'}>
            {message}
          </Text>
        </View>
      ) : null}
    </View>
  )
}
