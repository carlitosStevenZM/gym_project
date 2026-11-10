import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'

const TRACK_WIDTH = 52
const TRACK_HEIGHT = 32
const THUMB = 26

const useStyles = makeStyles((t) => ({
  track: {
    borderRadius: t.radius.pill,
    height: TRACK_HEIGHT,
    justifyContent: 'center',
    padding: (TRACK_HEIGHT - THUMB) / 2,
    width: TRACK_WIDTH,
  },
  off: { alignItems: 'flex-start', backgroundColor: t.color.surfaceAlt },
  on: { alignItems: 'flex-end', backgroundColor: t.color.accent },
  thumb: { borderRadius: t.radius.circle, height: THUMB, width: THUMB },
  thumbOff: { backgroundColor: t.color.inkMuted },
  thumbOn: { backgroundColor: t.color.accentInk },
  busy: { opacity: t.opacity.press },
}))

export type SwitchProps = {
  value: boolean
  /** True while the server has not confirmed. On failure the caller puts the value back. */
  busy?: boolean
}

/**
 * Presentational on purpose: the whole OptionRow is the target, not these 52 px, so the press
 * belongs to the row.
 */
export function Switch({ value, busy = false }: SwitchProps) {
  const s = useStyles()

  return (
    <View style={[s.track, value ? s.on : s.off, busy ? s.busy : null]}>
      <View style={[s.thumb, value ? s.thumbOn : s.thumbOff]} />
    </View>
  )
}
