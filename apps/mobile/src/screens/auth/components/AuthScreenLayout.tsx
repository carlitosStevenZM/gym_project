import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import type { ReactNode } from 'react'
import { Animated, Keyboard, Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import authBackdrop from '@/assets/images/auth-sample.webp'
import { useKeyboardRise } from '@/shared/lib/use-keyboard-rise'
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
  /** One piece, moved by one value. Nothing inside it moves on its own. */
  body: { flex: 1, justifyContent: 'flex-end' },
  head: { gap: t.space.s2, paddingBottom: t.space.s6, paddingHorizontal: t.space.s5 },
  panel: { gap: t.space.s5, paddingHorizontal: t.space.s5 },
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
 * The chrome both auth screens share: a photograph, and a form anchored to the bottom edge
 * that rises over the keyboard as a single piece.
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
  const keyboard = useKeyboardRise()

  return (
    /**
     * Tapping anywhere that is not a control puts the keyboard away. The inputs and buttons
     * win the touch before this does, because the responder system gives it to the innermost
     * view that wants it, so nothing here has to opt out.
     */
    <Pressable accessible={false} onPress={Keyboard.dismiss} style={s.root}>
      <View style={[s.backdrop, { height: `${BACKDROP_RATIO * 100}%` }]}>
        <Image source={authBackdrop} style={s.photo} contentFit="cover" transition={120} />
        {/* The system allows exactly one gradient, and this is it: the guarantee that the
            title reads over an arbitrary photograph. */}
        <LinearGradient colors={FADE} locations={[0, FADE_START, 1]} style={s.fade} />
      </View>

      {header}

      <Animated.View
        style={[s.body, { transform: [{ translateY: Animated.multiply(keyboard.height, -1) }] }]}
      >
        {/* Dropped outright rather than squeezed. Clipping it was two attempts of trying to
            make a title survive a space that cannot hold it, and on iOS the clip did not even
            hold: the kicker ended up drawn over the first field. */}
        {keyboard.isOpen ? null : (
          <View style={s.head}>
            <Text variant="label" tone="accent" numberOfLines={1}>
              {kicker}
            </Text>
            <Text variant="displayLg" numberOfLines={1}>
              {title}
            </Text>
          </View>
        )}

        <View
          style={[
            s.panel,
            { paddingBottom: (keyboard.isOpen ? 0 : insets.bottom) + theme.space.s6 },
          ]}
        >
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
      </Animated.View>
    </Pressable>
  )
}
