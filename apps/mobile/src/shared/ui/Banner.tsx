import { View } from 'react-native'

import { withAlpha } from '@/shared/theme/alpha'
import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'

import { Text } from './Text'
import { Touchable } from './Touchable'
import { TONE_COLOR, TONE_ICON, type FeedbackTone } from './feedback-tone'
import { Icon } from './icons/Icon'

/** The design system asks for `danger` at 15 % here and has no token for it. */
const ERROR_TINT = withAlpha(theme.color.danger, 0.15)

const useStyles = makeStyles((t) => ({
  banner: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: t.space.s3,
    paddingHorizontal: t.space.s5,
    paddingVertical: t.space.s3,
  },
  warning: { backgroundColor: t.color.accentSoft },
  error: { backgroundColor: ERROR_TINT },
  neutral: { backgroundColor: t.color.surface },
  message: { flex: 1 },
}))

export type BannerAction = {
  label: string
  onPress: () => void
}

export type BannerProps = {
  /** Says the consequence, not the technical state: «no puedes registrar series», not «error 503». */
  message: string
  tone?: Exclude<FeedbackTone, 'success'>
  action?: BannerAction
}

/**
 * A condition that lasts, pinned under the header and pushing the content down. If the user
 * can do nothing about it, it is a banner; if they just did something, it is a Toast.
 */
export function Banner({ message, tone = 'warning', action }: BannerProps) {
  const s = useStyles()
  const background = tone === 'error' ? s.error : tone === 'neutral' ? s.neutral : s.warning

  return (
    <View accessibilityLiveRegion="polite" accessibilityRole="alert" style={[s.banner, background]}>
      <Icon name={TONE_ICON[tone]} size={theme.size.iconSm} tone={TONE_COLOR[tone]} />
      <Text variant="caption" tone="ink" style={s.message}>
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
