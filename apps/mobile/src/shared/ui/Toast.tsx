import { useEffect } from 'react'
import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'

import { Text } from './Text'
import { Touchable } from './Touchable'
import { TONE_COLOR, TONE_ICON, type FeedbackTone } from './feedback-tone'
import { Icon } from './icons/Icon'

const PLAIN_MS = 3000
const WITH_ACTION_MS = 5000
const TONE_BORDER = 4

const useStyles = makeStyles((t) => ({
  toast: {
    alignItems: 'center',
    backgroundColor: t.color.surface,
    borderLeftWidth: TONE_BORDER,
    borderRadius: t.radius.lg,
    bottom: t.size.tabbarH + t.space.s4,
    flexDirection: 'row',
    gap: t.space.s3,
    left: t.space.s5,
    padding: t.space.s4,
    position: 'absolute',
    right: t.space.s5,
    zIndex: t.z.overlap,
  },
  message: { flex: 1 },
}))

export type ToastAction = {
  /** One action, always reversible: «Deshacer», «Reintentar». */
  label: string
  onPress: () => void
}

export type ToastProps = {
  message: string
  tone?: FeedbackTone
  action?: ToastAction
  onDismiss: () => void
}

/**
 * Floats over the content instead of sitting at the bottom, so it never covers the primary
 * action, and it never asks for a decision: that is what the Dialog is for.
 */
export function Toast({ message, tone = 'neutral', action, onDismiss }: ToastProps) {
  const s = useStyles()

  useEffect(() => {
    const timer = setTimeout(onDismiss, action ? WITH_ACTION_MS : PLAIN_MS)
    return () => clearTimeout(timer)
  }, [action, onDismiss])

  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[s.toast, { borderLeftColor: theme.color[TONE_COLOR[tone]] }]}
    >
      <Icon name={TONE_ICON[tone]} size={theme.size.iconMd} tone={TONE_COLOR[tone]} />
      <Text variant="body" tone="ink" style={s.message}>
        {message}
      </Text>
      {action ? (
        <Touchable accessibilityRole="button" onPress={action.onPress}>
          <Text variant="link" tone="accent">
            {action.label}
          </Text>
        </Touchable>
      ) : null}
    </View>
  )
}
