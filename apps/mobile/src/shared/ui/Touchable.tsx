import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'

const useStyles = makeStyles((t) => ({
  pressed: { opacity: t.opacity.press },
  disabled: { opacity: t.opacity.disabled },
}))

export type TouchableProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>
}

/**
 * The two feedback states every control of the system shares. Having them in one place is
 * what keeps `opacity-press` and `opacity-disabled` from being retyped in thirty files.
 */
export function Touchable({ style, disabled, ...rest }: TouchableProps) {
  const s = useStyles()

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      style={({ pressed }) => [
        style,
        pressed && !disabled ? s.pressed : null,
        disabled ? s.disabled : null,
      ]}
    />
  )
}
