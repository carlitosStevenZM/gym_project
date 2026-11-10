import { ActivityIndicator } from 'react-native'

import { theme } from '@/shared/theme/theme'
import type { ColorToken } from '@/shared/theme/tokens.gen'

export type SpinnerProps = {
  tone?: ColorToken
  label: string
}

/** For a wait whose shape we cannot guess. When we can, the answer is a Skeleton. */
export function Spinner({ tone = 'accent', label }: SpinnerProps) {
  return <ActivityIndicator accessibilityLabel={label} color={theme.color[tone]} size="small" />
}
