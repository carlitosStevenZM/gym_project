import { View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'

import { Text } from './Text'

const useStyles = makeStyles((t) => ({
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: t.color.glassFill,
    borderColor: t.color.glassLine,
    borderRadius: t.radius.pill,
    borderWidth: t.border.hairline,
    paddingHorizontal: t.space.s3,
    paddingVertical: t.space.s2,
  },
}))

export type GlassChipProps = {
  label: string
}

/**
 * Only ever on top of a photograph, and only in its lower third: the contrast comes from the
 * window's gradient underneath, not from the chip. On a solid background this is a grey
 * rectangle with no reason to exist.
 */
export function GlassChip({ label }: GlassChipProps) {
  const s = useStyles()

  return (
    <View style={s.chip}>
      <Text variant="caption" tone="ink">
        {label}
      </Text>
    </View>
  )
}
