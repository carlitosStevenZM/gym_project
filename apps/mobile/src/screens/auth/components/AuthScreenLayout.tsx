import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import type { ReactNode } from 'react'
import { KeyboardAvoidingView, Platform, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import authBackdrop from '@/assets/images/auth-sample.webp'
import { withAlpha } from '@/shared/theme/alpha'
import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'
import { Text } from '@/shared/ui/Text'
import { Touchable } from '@/shared/ui/Touchable'

/** How much of the screen the photograph covers before the gradient takes over. */
const BACKDROP_RATIO = 0.56

/** Where the gradient starts closing. Above this the photograph is itself. */
const FADE_START = 0.35

const FADE = [
  withAlpha(theme.color.bg, 0),
  withAlpha(theme.color.bg, 0.82),
  theme.color.bg,
] as const

const useStyles = makeStyles((t) => ({
  root: { backgroundColor: t.color.bg, flex: 1 },
  backdrop: { left: 0, position: 'absolute', right: 0, top: 0 },
  photo: { height: '100%', width: '100%' },
  fade: { bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 },
  keyboard: { flex: 1 },
  /**
   * The title gives way, not the form. It takes whatever is left once the keyboard has had
   * its share, and clips from the top rather than pushing the fields off the bottom.
   */
  head: {
    flexShrink: 1,
    gap: t.space.s2,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    paddingBottom: t.space.s6,
    paddingHorizontal: t.space.s5,
  },
  /**
   * Nothing here scrolls, and that is the whole point.
   *
   * A `TextInput` inside a scrollable container makes the platform scroll it above the
   * keyboard the instant it takes focus, while the window resize that lifts everything else
   * animates over its own ~250 ms. Those are two movements with different durations, and the
   * gap between them is what reads as the field jumping ahead of the screen. With no scroll
   * view in the way there is exactly one movement: the window getting shorter, which this
   * panel rides because it is anchored to the bottom.
   */
  panel: { flexShrink: 0, gap: t.space.s5, paddingHorizontal: t.space.s5 },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: t.space.s2,
    justifyContent: 'center',
  },
}))

export type AuthScreenLayoutProps = {
  kicker: string
  title: string
  children: ReactNode
  footerLabel: string
  footerAction: string
  onFooterPress: () => void
  /** Drawn above everything, for the screens that are not the first one. */
  header?: ReactNode
}

/**
 * The chrome both auth screens share: a photograph the content rises over, and a form
 * anchored to the bottom edge that moves as one piece.
 */
export function AuthScreenLayout({
  kicker,
  title,
  children,
  footerLabel,
  footerAction,
  onFooterPress,
  header,
}: AuthScreenLayoutProps) {
  const s = useStyles()
  const insets = useSafeAreaInsets()

  return (
    <View style={s.root}>
      <View style={[s.backdrop, { height: `${BACKDROP_RATIO * 100}%` }]}>
        <Image source={authBackdrop} style={s.photo} contentFit="cover" transition={240} />
        {/* The system allows exactly one gradient, and this is it: the guarantee that the
            title reads over an arbitrary photograph. */}
        <LinearGradient colors={FADE} locations={[0, FADE_START, 1]} style={s.fade} />
      </View>

      {header}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={s.keyboard}
      >
        <View style={s.head}>
          <Text variant="label" tone="accent">
            {kicker}
          </Text>
          <Text variant="displayLg" numberOfLines={1}>
            {title}
          </Text>
        </View>

        <View style={[s.panel, { paddingBottom: insets.bottom + theme.space.s6 }]}>
          {children}

          <View style={s.footer}>
            <Text variant="caption" tone="inkMuted">
              {footerLabel}
            </Text>
            <Touchable accessibilityRole="link" onPress={onFooterPress}>
              <Text variant="link" tone="accent">
                {footerAction}
              </Text>
            </Touchable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}
