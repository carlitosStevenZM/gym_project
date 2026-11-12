import type { ReactNode } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'
import { Text } from '@/shared/ui/Text'
import { Touchable } from '@/shared/ui/Touchable'

const useStyles = makeStyles((t) => ({
  root: { backgroundColor: t.color.bg, flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: t.space.s5 },
  head: { gap: t.space.s2, marginBottom: t.space.s8 },
  form: { gap: t.space.s5 },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: t.space.s2,
    justifyContent: 'center',
    marginTop: t.space.s8,
  },
}))

export type AuthScreenLayoutProps = {
  kicker: string
  title: string
  children: ReactNode
  footerLabel: string
  footerAction: string
  onFooterPress: () => void
}

/**
 * The chrome both auth screens share. Centred rather than top-aligned: there is no content
 * above the form to anchor it, and a form hanging from a header leaves the screen
 * bottom-heavy the moment the keyboard is up.
 */
export function AuthScreenLayout({
  kicker,
  title,
  children,
  footerLabel,
  footerAction,
  onFooterPress,
}: AuthScreenLayoutProps) {
  const s = useStyles()
  const insets = useSafeAreaInsets()

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.root}>
      <ScrollView
        contentContainerStyle={[
          s.content,
          {
            paddingBottom: insets.bottom + theme.space.s10,
            paddingTop: insets.top + theme.space.s10,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.head}>
          <Text variant="label" tone="accent">
            {kicker}
          </Text>
          <Text variant="displayLg">{title}</Text>
        </View>

        <View style={s.form}>{children}</View>

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
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
