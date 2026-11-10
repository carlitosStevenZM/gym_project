import { useState } from 'react'
import { View, type LayoutChangeEvent } from 'react-native'
import { Circle, Line, Path, Svg } from 'react-native-svg'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'

import { Text } from './Text'

/** Below three points there is no line worth looking at: the caller shows the empty state. */
export const MIN_POINTS = 3

const LINE_WIDTH = 2.5
const DOT_RADIUS = 4
const GRID_LINES = 3
/** Keeps the end dots inside the plot instead of half clipped by its edge. */
const INSET = DOT_RADIUS + 2

const useStyles = makeStyles((t) => ({
  root: { gap: t.space.s4 },
  heading: { gap: t.space.s1 },
  plot: { height: t.size.chartH },
  axis: { flexDirection: 'row', justifyContent: 'space-between' },
}))

export type ProgressPoint = {
  /** A moment, so an irregular gap between sessions reads as the gap it was. */
  x: number
  y: number
}

export type ProgressChartProps = {
  points: readonly ProgressPoint[]
  /** The exercise, over the plot. */
  title?: string
  /** The current figure, over the plot. */
  value?: number
  valueUnit?: string
  /** Two or three marks under the plot. */
  axisLabels?: readonly string[]
  /** Marks the personal best once. */
  recordIndex?: number
  /** «press de banca, de 55 a 67.5 kilos entre mayo y octubre, tendencia al alza» */
  accessibilityLabel: string
}

type Scale = {
  toX: (x: number) => number
  toY: (y: number) => number
  low: number
  high: number
}

/**
 * The Y axis never starts at zero: on weights that flattens the line into a useless
 * straight edge. It starts one step under the lowest value of the range.
 */
function scaleFor(points: readonly ProgressPoint[], width: number, height: number): Scale {
  const ys = points.map((point) => point.y)
  const xs = points.map((point) => point.x)
  const min = Math.min(...ys)
  const max = Math.max(...ys)
  const step = max === min ? Math.max(1, max * 0.05) : (max - min) / GRID_LINES
  const low = min - step
  const high = max + step / 2

  const firstX = Math.min(...xs)
  const lastX = Math.max(...xs)
  const spanX = lastX - firstX || 1
  const usable = width - INSET * 2
  const usableY = height - INSET * 2

  return {
    low,
    high,
    toX: (x) => INSET + ((x - firstX) / spanX) * usable,
    toY: (y) => INSET + (1 - (y - low) / (high - low)) * usableY,
  }
}

export function ProgressChart({
  points,
  title,
  value,
  valueUnit,
  axisLabels,
  recordIndex,
  accessibilityLabel,
}: ProgressChartProps) {
  const s = useStyles()
  const [width, setWidth] = useState(0)
  const measure = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)

  if (points.length < MIN_POINTS) return null

  const height = theme.size.chartH
  const scale = width > 0 ? scaleFor(points, width, height) : null
  const last = points[points.length - 1]
  const record = recordIndex === undefined ? undefined : points[recordIndex]

  return (
    <View accessibilityLabel={accessibilityLabel} accessibilityRole="image" style={s.root}>
      {title || value !== undefined ? (
        <View style={s.heading}>
          {value === undefined ? null : (
            <Text variant="numericXl" tone="ink">
              {value}
              {valueUnit ? (
                <Text variant="numericUnit" tone="inkMuted">
                  {` ${valueUnit}`}
                </Text>
              ) : null}
            </Text>
          )}
          {title ? (
            <Text variant="body" tone="inkSoft">
              {title}
            </Text>
          ) : null}
        </View>
      ) : null}

      <View onLayout={measure} style={s.plot}>
        {scale && width > 0 ? (
          <Svg height={height} width={width}>
            {Array.from({ length: GRID_LINES }, (_, index) => {
              const y = INSET + ((height - INSET * 2) / (GRID_LINES - 1)) * index
              return (
                <Line
                  key={y}
                  stroke={theme.color.lineSoft}
                  strokeWidth={theme.border.hairline}
                  x1={0}
                  x2={width}
                  y1={y}
                  y2={y}
                />
              )
            })}

            <Path
              d={points
                .map(
                  (point, index) =>
                    `${index === 0 ? 'M' : 'L'}${scale.toX(point.x)} ${scale.toY(point.y)}`,
                )
                .join(' ')}
              fill="none"
              stroke={theme.color.accent}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={LINE_WIDTH}
            />

            {record ? (
              <Circle
                cx={scale.toX(record.x)}
                cy={scale.toY(record.y)}
                fill={theme.color.bg}
                r={DOT_RADIUS}
                stroke={theme.color.accent}
                strokeWidth={LINE_WIDTH}
              />
            ) : null}

            {last ? (
              <Circle
                cx={scale.toX(last.x)}
                cy={scale.toY(last.y)}
                fill={theme.color.accent}
                r={DOT_RADIUS}
              />
            ) : null}
          </Svg>
        ) : null}
      </View>

      {axisLabels?.length ? (
        <View style={s.axis}>
          {axisLabels.map((label) => (
            <Text key={label} variant="caption" tone="inkMuted">
              {label}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  )
}
