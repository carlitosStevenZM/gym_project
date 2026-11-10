import { Text as RNText, type TextProps as RNTextProps } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'
import type { ColorToken, TextVariant } from '@/shared/theme/tokens.gen'

const useVariants = makeStyles((t) => t.text)
const useTones = makeStyles((t) => t.textTone)

export type TextProps = RNTextProps & {
  /** One of the fourteen styles of the system. Nothing else sets a font size. */
  variant?: TextVariant
  tone?: ColorToken
}

export function Text({ variant = 'body', tone = 'ink', style, ...rest }: TextProps) {
  const variants = useVariants()
  const tones = useTones()

  return <RNText {...rest} style={[variants[variant], tones[tone], style]} />
}
