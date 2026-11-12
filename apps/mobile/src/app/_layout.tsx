import { QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { AuthProvider, useAuth } from '@/domain/auth'
import '@/shared/i18n'
import { queryClient } from '@/shared/api/query-client'
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

  if (!ready) return null

  return (
    <GestureHandlerRootView style={s.root}>
      <StatusBar style="light" />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}

/**
 * Inside AuthProvider because it reads the session, and the splash stays up until that
 * session is known: routing on a status of `loading` would show the login screen for a
 * frame to somebody who is already signed in.
 */
function RootNavigator() {
  const { status } = useAuth()

  useEffect(() => {
    if (status !== 'loading') void SplashScreen.hideAsync()
  }, [status])

  if (status === 'loading') return null

  return (
    <Stack
      screenOptions={{ contentStyle: { backgroundColor: theme.color.bg }, headerShown: false }}
    >
      <Stack.Protected guard={status === 'authenticated'}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={status === 'anonymous'}>
        <Stack.Screen name="login" />
        {/* Pushed, not replaced, so it slides in and the back gesture takes you to login. */}
        <Stack.Screen name="signup" options={{ animation: 'slide_from_right' }} />
      </Stack.Protected>
    </Stack>
  )
}
