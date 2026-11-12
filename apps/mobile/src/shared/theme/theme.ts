import { border, color, opacity, radius, size, space, z } from './tokens.gen'
import { text, textTone } from './typography'

/**
 * The single theme (D43). Everything a component is allowed to draw with hangs off here, and
 * nothing hangs off here that the design system did not define.
 */
export const theme = {
  color,
  space,
  radius,
  size,
  border,
  opacity,
  z,
  text,
  textTone,
} as const

export type Theme = typeof theme
