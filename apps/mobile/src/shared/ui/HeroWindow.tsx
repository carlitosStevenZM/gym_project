import { Image, type ImageProps } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import type { ReactNode } from 'react'
import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'

import { GlassChip } from './GlassChip'
import { Text } from './Text'

/** The text box stops short of the right edge so it never runs under the disc. */
const TEXT_RIGHT_INSET = 120

/** Where the gradient is allowed to be see-through: the text never lands this high. */
const CLEAR_STOP = 0.34

const useStyles = makeStyles((t) => ({
  root: { marginHorizontal: t.space.s5 },
  frame: {
    backgroundColor: t.color.surface,
    borderRadius: t.radius.xl,
    height: t.size.heroWindowH,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  fill: { bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 },
  content: { gap: t.space.s2, padding: t.space.s5, paddingRight: TEXT_RIGHT_INSET },
  chips: { flexDirection: 'row', gap: t.space.s2 },
  disc: { bottom: -52, position: 'absolute', right: 36, zIndex: t.z.overlap },
}))

export type HeroWindowProps = {
  /** «RUTINA DE 4 DÍAS · HOY TOCA» */
  kicker: string
  /** Two lines at most. */
  title: string
  /** «5 ejercicios · 18 series» */
  meta?: string
  /** Three at most, or the photograph disappears under the labels. */
  chips?: readonly string[]
  /** Without a photograph the window is a `surface` block with the same title and disc. */
  source?: ImageProps['source']
  /** Mounted half in, half out of the lower right corner. */
  disc?: ReactNode
}

/**
 * The single image of the app and the impact zone of the Hoy screen. The gradient is not
 * decoration: it is the only thing that guarantees the text's contrast over an arbitrary
 * photograph, so there is no variant without it.
 */
export function HeroWindow({ kicker, title, meta, chips, source, disc }: HeroWindowProps) {
  const s = useStyles()

  return (
    <View style={s.root}>
      <View style={s.frame}>
        {source ? (
          <>
            <Image accessible={false} contentFit="cover" source={source} style={s.fill} />
            <LinearGradient
              colors={[theme.color.scrimTop, 'transparent', theme.color.scrimBottom]}
              locations={[0, CLEAR_STOP, 1]}
              style={s.fill}
            />
          </>
        ) : null}

        <View style={s.content}>
          <Text variant="label" tone="accent">
            {kicker}
          </Text>
          <Text accessibilityRole="header" variant="displayXl" tone="ink" numberOfLines={2}>
            {title}
          </Text>
          {meta ? (
            <Text variant="caption" tone="ink">
              {meta}
            </Text>
          ) : null}
          {chips?.length ? (
            <View style={s.chips}>
              {chips.map((chip) => (
                <GlassChip key={chip} label={chip} />
              ))}
            </View>
          ) : null}
        </View>
      </View>

      {disc ? <View style={s.disc}>{disc}</View> : null}
    </View>
  )
}
