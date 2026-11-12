import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'
import { Touchable } from '@/shared/ui/Touchable'
import { Icon } from '@/shared/ui/icons/Icon'

const BACK_ICON = 24

const useStyles = makeStyles((t) => ({
  row: { paddingHorizontal: t.space.s5 },
  target: {
    alignItems: 'center',
    height: t.size.touchMin,
    justifyContent: 'center',
    width: t.size.touchMin,
    /** Pulled left so the glyph lines up with the gutter, not its touch target. */
    marginLeft: -t.space.s3,
  },
}))

export type AuthBackButtonProps = {
  label: string
  /** Absent while a request is in flight, so leaving cannot strand it. */
  onPress?: () => void
}

/**
 * Not `ScreenHeader`: these screens carry their title in the body, so the header would be an
 * empty bar, and the system does not pin a header anyway (**DS6**).
 */
export function AuthBackButton({ label, onPress }: AuthBackButtonProps) {
  const s = useStyles()
  const insets = useSafeAreaInsets()

  return (
    <View style={[s.row, { paddingTop: insets.top + theme.space.s2 }]}>
      <Touchable
        accessibilityLabel={label}
        accessibilityRole="button"
        disabled={onPress === undefined}
        onPress={onPress ?? (() => {})}
        style={s.target}
      >
        <Icon name="chevronLeft" size={BACK_ICON} tone="ink" />
      </Touchable>
    </View>
  )
}
