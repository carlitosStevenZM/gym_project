import { Circle, Path, Svg } from 'react-native-svg'

import { theme } from '@/shared/theme/theme'
import type { ColorToken } from '@/shared/theme/tokens.gen'

/** Drawn on a 24 grid; the design system specifies a 1.8 stroke inside a 22 box. */
const GRID = 24
const STROKE = (1.8 * GRID) / theme.size.iconMd

const PATHS = {
  chevronRight: ['M9 5l7 7-7 7'],
  chevronLeft: ['M15 5l-7 7 7 7'],
  chevronDown: ['M5 9l7 7 7-7'],
  check: ['M4.5 12.5l5 5 10-11'],
  close: ['M6 6l12 12', 'M18 6L6 18'],
  search: ['M16 16l5 5'],
  plus: ['M12 5v14', 'M5 12h14'],
  minus: ['M5 12h14'],
  alert: ['M12 4.2L2.6 20h18.8L12 4.2z', 'M12 10.2v4.3', 'M12 17.5h.01'],
  error: ['M15 9l-6 6', 'M9 9l6 6'],
  success: ['M8 12.2l2.7 2.7L16 9.4'],
  info: ['M12 11.2v5', 'M12 7.9h.01'],
  offline: [
    'M3 3l18 18',
    'M4.7 9.5a13 13 0 014.4-2.7',
    'M19.3 9.5a13 13 0 00-5.4-2.9',
    'M8 13.2a8 8 0 012.8-1.6',
    'M10.3 16.6a4 4 0 013.4 0',
    'M12 20h.01',
  ],
} as const

/** Icons whose shape needs a circle the stroke paths above cannot express. */
const CIRCLES: Partial<Record<IconName, { cx: number; cy: number; r: number }>> = {
  search: { cx: 10.5, cy: 10.5, r: 6.5 },
  error: { cx: 12, cy: 12, r: 8.6 },
  success: { cx: 12, cy: 12, r: 8.6 },
  info: { cx: 12, cy: 12, r: 8.6 },
}

export type IconName = keyof typeof PATHS

export type IconProps = {
  name: IconName
  /** Defaults to `icon-md`, the 22 px box of the system. */
  size?: number
  tone?: ColorToken
}

export function Icon({ name, size = theme.size.iconMd, tone = 'ink' }: IconProps) {
  const stroke = theme.color[tone]
  const circle = CIRCLES[name]

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${GRID} ${GRID}`} fill="none">
      {circle ? (
        <Circle
          cx={circle.cx}
          cy={circle.cy}
          r={circle.r}
          stroke={stroke}
          strokeWidth={STROKE}
          fill="none"
        />
      ) : null}
      {PATHS[name].map((d) => (
        <Path
          key={d}
          d={d}
          stroke={stroke}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}
    </Svg>
  )
}
