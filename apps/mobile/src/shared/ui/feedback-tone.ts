import type { ColorToken } from '@/shared/theme/tokens.gen'

import type { IconName } from './icons/Icon'

/** The four tones of the system. A tone never travels in the colour alone: each has its icon. */
export type FeedbackTone = 'success' | 'warning' | 'error' | 'neutral'

export const TONE_COLOR: Readonly<Record<FeedbackTone, ColorToken>> = {
  success: 'ok',
  warning: 'warning',
  error: 'danger',
  neutral: 'inkSoft',
}

export const TONE_ICON: Readonly<Record<FeedbackTone, IconName>> = {
  success: 'success',
  warning: 'alert',
  error: 'error',
  neutral: 'info',
}
