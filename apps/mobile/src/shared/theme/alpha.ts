/**
 * The only place in the app that computes a colour instead of reading a token. It exists
 * for one case: the design system asks for `danger` at 15 % behind an error banner and has
 * no token for it. When a `danger-soft` lands upstream, this file goes.
 */
export function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace('#', '')
  const full =
    value.length === 3
      ? value
          .split('')
          .map((channel) => channel + channel)
          .join('')
      : value

  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
