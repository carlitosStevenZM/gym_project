import { Pressable, View } from 'react-native'
import { Circle, Svg } from 'react-native-svg'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'

import { Text } from './Text'

const CAPTION_OPACITY = 0.7

const RING_RADIUS = (theme.size.discCore + theme.border.ringDisc) / 2
const RING_CENTRE = theme.size.disc / 2
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

const useStyles = makeStyles((t) => ({
  /** The gap ring is this view's own background: it lifts the disc off the photograph. */
  gap: {
    alignItems: 'center',
    backgroundColor: t.color.ringGap,
    borderRadius: t.radius.circle,
    height: t.size.disc,
    justifyContent: 'center',
    width: t.size.disc,
  },
  ring: { position: 'absolute' },
  core: {
    alignItems: 'center',
    backgroundColor: t.color.accent,
    borderRadius: t.radius.circle,
    height: t.size.discCore,
    justifyContent: 'center',
    paddingHorizontal: t.space.s1,
    width: t.size.discCore,
  },
  pressed: { backgroundColor: t.color.accentPress },
  caption: { opacity: CAPTION_OPACITY, textAlign: 'center' },
}))

export type ActionDiscProps = {
  /** «EMPEZAR» */
  label: string
  onPress: () => void
  /** «Empezar, press de banca». Never «botón naranja». */
  accessibilityLabel: string
  /** The first exercise, when it adds something. Dropped when it does not fit on one line. */
  caption?: string
  /** 0 to 1. Omit when there is no weekly training to count and the ring disappears. */
  progress?: number
  /** «dos de cuatro entrenamientos de la semana», announced apart from the action. */
  progressLabel?: string
  loading?: boolean
  /** Replaces the label while opening. */
  loadingLabel?: string
}

/**
 * The primary action of the Hoy screen, and the largest target of the system. It does two
 * jobs with one object: start the session, and say how far into the week you are.
 */
export function ActionDisc({
  label,
  onPress,
  accessibilityLabel,
  caption,
  progress,
  progressLabel,
  loading = false,
  loadingLabel,
}: ActionDiscProps) {
  const s = useStyles()
  const shown = loading ? (loadingLabel ?? label) : label

  return (
    <View style={s.gap}>
      {progress === undefined ? null : (
        <Svg
          accessibilityLabel={progressLabel}
          height={theme.size.disc}
          style={s.ring}
          width={theme.size.disc}
        >
          <Circle
            cx={RING_CENTRE}
            cy={RING_CENTRE}
            fill="none"
            r={RING_RADIUS}
            stroke={theme.color.ringTrack}
            strokeWidth={theme.border.ringDisc}
          />
          <Circle
            cx={RING_CENTRE}
            cy={RING_CENTRE}
            fill="none"
            origin={`${RING_CENTRE}, ${RING_CENTRE}`}
            r={RING_RADIUS}
            rotation={-90}
            stroke={loading ? theme.color.inkMuted : theme.color.accent}
            strokeDasharray={RING_LENGTH}
            strokeDashoffset={
              RING_LENGTH * (1 - (loading ? 1 : Math.min(1, Math.max(0, progress))))
            }
            strokeLinecap="round"
            strokeWidth={theme.border.ringDisc}
          />
        </Svg>
      )}

      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ busy: loading }}
        disabled={loading}
        onPress={onPress}
        style={({ pressed }) => [s.core, pressed ? s.pressed : null]}
      >
        <Text variant="displaySm" tone="accentInk" numberOfLines={1}>
          {shown}
        </Text>
        {caption && !loading ? (
          <Text variant="caption" tone="accentInk" numberOfLines={1} style={s.caption}>
            {caption}
          </Text>
        ) : null}
      </Pressable>
    </View>
  )
}
