import { Path, Rect, Svg } from 'react-native-svg'

import { theme } from '@/shared/theme/theme'

export type ExerciseGlyphProps = {
  size?: number
}

/**
 * Stands in for a catalogue illustration while the exercise catalogue (D34) is not loaded.
 * A loaded barbell seen head on, which is also the shape of the app's mark.
 */
export function ExerciseGlyph({ size = theme.size.iconLg }: ExerciseGlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4.5 12h15" stroke={theme.color.accent} strokeWidth={2} strokeLinecap="round" />
      <Rect
        x={7}
        y={6.8}
        width={3.2}
        height={10.4}
        rx={1.3}
        stroke={theme.color.inkSoft}
        strokeWidth={1.8}
        fill={theme.color.surfaceAlt}
      />
      <Rect
        x={13.8}
        y={6.8}
        width={3.2}
        height={10.4}
        rx={1.3}
        stroke={theme.color.inkSoft}
        strokeWidth={1.8}
        fill={theme.color.surfaceAlt}
      />
    </Svg>
  )
}
