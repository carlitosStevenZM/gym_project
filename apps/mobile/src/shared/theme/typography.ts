import type { TextStyle } from 'react-native'

import { resolveFont } from './fonts'
import { color, textToken, type ColorToken, type TextToken, type TextVariant } from './tokens.gen'

/** Typography rule 2: only the display sizes and `label` are ever uppercased. */
const UPPERCASE: ReadonlySet<TextVariant> = new Set([
  'displayXl',
  'displayLg',
  'displayMd',
  'displaySm',
  'label',
])

function toTextStyle(variant: TextVariant, token: TextToken): TextStyle {
  return {
    ...resolveFont(token.family, token.fontWeight),
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
    ...(token.letterSpacing === undefined ? {} : { letterSpacing: token.letterSpacing }),
    ...(UPPERCASE.has(variant) ? { textTransform: 'uppercase' as const } : {}),
  }
}

function buildVariants(): Record<TextVariant, TextStyle> {
  const out = {} as Record<TextVariant, TextStyle>
  for (const variant of Object.keys(textToken) as TextVariant[]) {
    out[variant] = toTextStyle(variant, textToken[variant])
  }
  return out
}

function buildTones(): Record<ColorToken, TextStyle> {
  const out = {} as Record<ColorToken, TextStyle>
  for (const token of Object.keys(color) as ColorToken[]) {
    out[token] = { color: color[token] }
  }
  return out
}

/** The fourteen text styles of the system, ready to hand to a `<Text>`. */
export const text: Readonly<Record<TextVariant, TextStyle>> = buildVariants()

/** Every colour token as a text colour, so a caller never writes a hex to tint a word. */
export const textTone: Readonly<Record<ColorToken, TextStyle>> = buildTones()
