import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native'

import { theme, type Theme } from './theme'

type NamedStyles<T> = { [P in keyof T]: ImageStyle | TextStyle | ViewStyle }

/**
 * Every stylesheet in the app is written as a function of the theme, although D43 says there
 * is exactly one today. That is the point: a second theme becomes a change to this file and
 * to the hook it hands back, not a rewrite of every component, and no component anywhere
 * reaches for a raw token.
 *
 *   const useStyles = makeStyles((t) => ({ root: { padding: t.space.s4 } }))
 */
export function makeStyles<T extends NamedStyles<T>>(factory: (t: Theme) => T): () => T {
  const sheet = StyleSheet.create(factory(theme))
  return () => sheet
}
