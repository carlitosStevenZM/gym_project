import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'

import { Text } from './Text'
import { Touchable } from './Touchable'

const TRACK_HEIGHT = 4
const SECONDS_IN_MINUTE = 60

const useStyles = makeStyles((t) => ({
  bar: {
    backgroundColor: t.color.surface,
    borderRadius: t.radius.lg,
    bottom: t.size.tabbarH + t.space.s4,
    gap: t.space.s3,
    left: t.space.s4,
    padding: t.space.s4,
    position: 'absolute',
    right: t.space.s4,
    zIndex: t.z.overlap,
  },
  row: { alignItems: 'center', flexDirection: 'row', gap: t.space.s4 },
  count: { flex: 1 },
  track: { backgroundColor: t.color.ringTrack, borderRadius: t.radius.pill, height: TRACK_HEIGHT },
  fill: { backgroundColor: t.color.accent, borderRadius: t.radius.pill, height: TRACK_HEIGHT },
}))

export type RestTimerProps = {
  /** Counted against the clock by the caller, so the rest survives leaving the app. */
  remainingSeconds: number
  totalSeconds: number
  /** «Descanso terminado» */
  finishedLabel: string
  /** «Saltar» */
  skipLabel: string
  /** «+30 s» */
  addLabel: string
  onSkip: () => void
  onAdd: () => void
  /** Announced at the start and at the end only, never second by second. */
  accessibilityLabel: string
}

function clock(seconds: number): string {
  const whole = Math.max(0, Math.ceil(seconds))
  const minutes = Math.floor(whole / SECONDS_IN_MINUTE)
  const rest = whole % SECONDS_IN_MINUTE
  return `${minutes}:${String(rest).padStart(2, '0')}`
}

/**
 * Informative and nothing more (D15, D35): it blocks nothing, it can always be skipped, and
 * when it reaches zero nothing happens beyond the optional notice.
 */
export function RestTimer({
  remainingSeconds,
  totalSeconds,
  finishedLabel,
  skipLabel,
  addLabel,
  onSkip,
  onAdd,
  accessibilityLabel,
}: RestTimerProps) {
  const s = useStyles()
  const finished = remainingSeconds <= 0
  const elapsed = totalSeconds <= 0 ? 1 : 1 - remainingSeconds / totalSeconds

  return (
    <View accessibilityLabel={accessibilityLabel} accessibilityRole="timer" style={s.bar}>
      <View style={s.row}>
        {finished ? (
          <Text variant="body" tone="inkSoft" style={s.count}>
            {finishedLabel}
          </Text>
        ) : (
          <Text variant="numericLg" tone="ink" style={s.count}>
            {clock(remainingSeconds)}
          </Text>
        )}
        {finished ? null : (
          <>
            <Touchable accessibilityRole="button" onPress={onAdd}>
              <Text variant="body" tone="inkSoft">
                {addLabel}
              </Text>
            </Touchable>
            <Touchable accessibilityRole="button" onPress={onSkip}>
              <Text variant="link" tone="accent">
                {skipLabel}
              </Text>
            </Touchable>
          </>
        )}
      </View>
      {finished ? null : (
        <View style={s.track}>
          <View style={[s.fill, { width: `${Math.min(100, Math.max(0, elapsed * 100))}%` }]} />
        </View>
      )}
    </View>
  )
}
