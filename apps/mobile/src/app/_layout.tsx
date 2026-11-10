import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import '@/shared/i18n'
import { fontFiles } from '@/shared/theme/fonts'
import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'

/** Holding the splash until the display face is in avoids the title reflowing on launch. */
void SplashScreen.preventAutoHideAsync()

const useStyles = makeStyles((t) => ({
  root: { backgroundColor: t.color.bg, flex: 1 },
}))

export default function RootLayout() {
  const s = useStyles()
  const [fontsReady, fontError] = useFonts(fontFiles)

  /** A face that fails to load falls back to the system font. It never holds the app shut. */
  const ready = fontsReady || fontError !== null

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync()
  }, [ready])

  if (!ready) return null

  return (
    <GestureHandlerRootView style={s.root}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{ contentStyle: { backgroundColor: theme.color.bg }, headerShown: false }}
      />
    </GestureHandlerRootView>
  )
}
