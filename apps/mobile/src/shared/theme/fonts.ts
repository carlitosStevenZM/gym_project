import barlowBlack from '@/assets/fonts/BarlowCondensed-Black.ttf'
import barlowExtraBold from '@/assets/fonts/BarlowCondensed-ExtraBold.ttf'

import type { FontRole, FontWeight } from './tokens.gen'

/**
 * The condensed face ships with the app so a title weighs the same on both platforms; body
 * text deliberately keeps the system font, which already follows the reader's dynamic type
 * setting and needs no file.
 */
export const fontFiles = {
  'BarlowCondensed-Black': barlowBlack,
  'BarlowCondensed-ExtraBold': barlowExtraBold,
} as const

/** One file carries one weight, so the weight picks the file instead of `fontWeight`. */
const CONDENSED_BY_WEIGHT: Partial<Record<FontWeight, keyof typeof fontFiles>> = {
  '800': 'BarlowCondensed-ExtraBold',
  '900': 'BarlowCondensed-Black',
}

export type ResolvedFont = {
  readonly fontFamily?: string
  readonly fontWeight?: FontWeight
}

/**
 * Asking React Native for a `fontWeight` on top of a bundled family makes Android synthesise
 * a second bolding over a face that is already black, so the two never travel together.
 */
export function resolveFont(role: FontRole, fontWeight: FontWeight): ResolvedFont {
  if (role === 'body') return { fontWeight }

  const family = CONDENSED_BY_WEIGHT[fontWeight]
  if (!family) {
    throw new Error(
      `No condensed font file for weight ${fontWeight}. Add it to assets/fonts and to CONDENSED_BY_WEIGHT.`,
    )
  }
  return { fontFamily: family }
}
