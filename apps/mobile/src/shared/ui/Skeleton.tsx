import { View, type DimensionValue } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'

const useStyles = makeStyles((t) => ({
  block: { backgroundColor: t.color.skeleton, borderRadius: t.radius.md },
}))

export type SkeletonProps = {
  height: number
  width?: DimensionValue
  radius?: number
}

/**
 * A loading block the size of what is coming. It never carries text, and it is hidden from
 * the screen reader: the region announces itself once, the blocks say nothing.
 */
export function Skeleton({ height, width = '100%', radius }: SkeletonProps) {
  const s = useStyles()

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[s.block, { height, width }, radius === undefined ? null : { borderRadius: radius }]}
    />
  )
}
