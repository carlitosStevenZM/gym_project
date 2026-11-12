import type { ReactNode } from 'react'
import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'
import type { ColorToken } from '@/shared/theme/tokens.gen'

import { Text } from './Text'
import { Touchable } from './Touchable'
import { Icon, type IconName } from './icons/Icon'

/** Not copy: the busy state replaces the label with three dots without changing the width. */
const BUSY_GLYPH = '···'

const ICON_SIZE = 13

export type PillButtonVariant = 'white' | 'accent' | 'outline' | 'danger'

const INK: Readonly<Record<PillButtonVariant, ColorToken>> = {
  white: 'bg',
  accent: 'accentInk',
  outline: 'ink',
  danger: 'danger',
}

const useStyles = makeStyles((t) => ({
  pill: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: t.radius.pill,
    flexDirection: 'row',
    gap: t.space.s2,
    height: t.size.buttonH,
    justifyContent: 'center',
    width: 230,
  },
  large: { height: t.size.buttonHLg },
  block: { alignSelf: 'stretch', width: 'auto' },
  white: { backgroundColor: t.color.pillInk },
  accent: { backgroundColor: t.color.accent },
  outline: { borderColor: t.color.line, borderWidth: t.border.ring },
  danger: { borderColor: t.color.danger, borderWidth: t.border.ring },
  busyLabel: { opacity: 0 },
  busyGlyph: { left: 0, position: 'absolute', right: 0, textAlign: 'center' },
  footnote: { marginTop: t.space.s2, textAlign: 'center' },
}))

export type PillButtonProps = {
  label: string
  onPress: () => void
  variant?: PillButtonVariant
  /** Full width. Only in a form or a sheet: on a content screen a full width pill reads as a slab. */
  block?: boolean
  /** `button-h-lg`, for the only action on the screen. */
  large?: boolean
  icon?: IconName
  /**
   * A node before the label, for the one mark the system's stroke icons cannot draw: the
   * Google G, which ships in its own colours (**DS9**). Prefer `icon` for everything else.
   */
  leading?: ReactNode
  /** A line under the button saying what is about to happen. */
  footnote?: string
  loading?: boolean
  /**
   * Disabling is only possible with a reason, because the system forbids a dead control that
   * does not say why it is dead.
   */
  disabledReason?: string
  accessibilityLabel?: string
}

export function PillButton({
  label,
  onPress,
  variant = 'accent',
  block = false,
  large = false,
  icon,
  leading,
  footnote,
  loading = false,
  disabledReason,
  accessibilityLabel,
}: PillButtonProps) {
  const s = useStyles()
  const tone = INK[variant]
  const note = disabledReason ?? footnote

  return (
    <View>
      <Touchable
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole="button"
        accessibilityState={{ busy: loading, disabled: disabledReason !== undefined }}
        disabled={disabledReason !== undefined || loading}
        onPress={onPress}
        style={[s.pill, s[variant], large ? s.large : null, block ? s.block : null]}
      >
        {leading}
        {icon ? <Icon name={icon} size={ICON_SIZE} tone={tone} /> : null}
        <Text variant="displaySm" tone={tone} style={loading ? s.busyLabel : undefined}>
          {label}
        </Text>
        {loading ? (
          <Text variant="displaySm" tone={tone} style={s.busyGlyph}>
            {BUSY_GLYPH}
          </Text>
        ) : null}
      </Touchable>
      {note ? (
        <Text variant="caption" tone="inkMuted" style={s.footnote}>
          {note}
        </Text>
      ) : null}
    </View>
  )
}
