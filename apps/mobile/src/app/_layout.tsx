import { Stack } from 'expo-router'

import '@/shared/i18n'

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />
}
