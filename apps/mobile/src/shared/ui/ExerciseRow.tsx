import { Image } from 'expo-image'
import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'

import { RingBadge } from './RingBadge'
import { Text } from './Text'
import { Touchable } from './Touchable'
import { ExerciseGlyph } from './icons/ExerciseGlyph'
import { Icon } from './icons/Icon'

const INDEX_COLUMN = 32

const useStyles = makeStyles((t) => ({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: t.size.rowH,
    paddingVertical: t.space.s1,
  },
  /** Tight between the illustration and the name, wider before the figure: a circle's ink
      runs to its bounding box, so the same gap reads smaller on that side. */
  leading: { marginRight: t.space.s3 },
  trailing: { marginLeft: t.space.s4 },
  ruled: { borderBottomColor: t.color.lineSoft, borderBottomWidth: t.border.hairline },
  thumb: {
    alignItems: 'center',
    backgroundColor: t.color.surfaceAlt,
    borderRadius: t.radius.circle,
    height: t.size.thumb,
    justifyContent: 'center',
    overflow: 'hidden',
    width: t.size.thumb,
  },
  done: { opacity: t.opacity.photoDim },
  illustration: { height: '100%', width: '100%' },
  index: { textAlign: 'center', width: INDEX_COLUMN },
  labels: { flex: 1, gap: 2 },
}))

export type ExerciseRowProps = {
  name: string
  /** «4 series · 8-12 reps» */
  detail?: string
  /** Last time's weight by default (D21); `null` when there is no history yet. */
  weight?: number | null
  unit?: string
  /** Rings the badge in `accent`: this figure is the personal best. */
  isRecord?: boolean
  /** Logged in this session: the illustration dims and a mark replaces the badge. */
  done?: boolean
  /** Turns the row into the compact numbered variant: no illustration, no badge. */
  index?: number
  illustrationUri?: string
  withRule?: boolean
  onPress?: () => void
  /** The whole sentence: «Press de banca, 4 series de 8 a 12 repeticiones, la vez pasada 67.5 kilos». */
  accessibilityLabel: string
}

export function ExerciseRow({
  name,
  detail,
  weight = null,
  unit,
  isRecord = false,
  done = false,
  index,
  illustrationUri,
  withRule = false,
  onPress,
  accessibilityLabel,
}: ExerciseRowProps) {
  const s = useStyles()
  const compact = index !== undefined

  return (
    <Touchable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={onPress ? 'button' : 'text'}
      onPress={onPress}
      style={[s.row, withRule ? s.ruled : null]}
    >
      {compact ? (
        <Text variant="numericSm" tone="inkMuted" style={[s.index, s.leading]}>
          {index}
        </Text>
      ) : (
        <View style={[s.thumb, s.leading, done ? s.done : null]}>
          {illustrationUri ? (
            <Image contentFit="cover" source={{ uri: illustrationUri }} style={s.illustration} />
          ) : (
            <ExerciseGlyph />
          )}
        </View>
      )}

      <View style={s.labels}>
        <Text variant="bodyStrong" tone="ink">
          {name}
        </Text>
        {detail ? (
          <Text variant="caption" tone="inkMuted">
            {detail}
          </Text>
        ) : null}
      </View>

      {compact ? null : (
        <View style={s.trailing}>
          {done ? (
            <Icon name="check" size={theme.size.iconMd} tone="ok" />
          ) : (
            <RingBadge unit={unit} value={weight} variant={isRecord ? 'record' : 'reference'} />
          )}
        </View>
      )}
    </Touchable>
  )
}
