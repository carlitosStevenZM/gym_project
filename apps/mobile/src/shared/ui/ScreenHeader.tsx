import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'

import { Text } from './Text'
import { Touchable } from './Touchable'
import { Icon, type IconName } from './icons/Icon'

const HEADER_HEIGHT = 56
const BACK_ICON = 24

const useStyles = makeStyles((t) => ({
  header: {
    alignItems: 'center',
    backgroundColor: t.color.bg,
    flexDirection: 'row',
    gap: t.space.s3,
    minHeight: HEADER_HEIGHT,
    paddingHorizontal: t.space.s5,
  },
  back: {
    alignItems: 'center',
    height: t.size.touchMin,
    justifyContent: 'center',
    width: BACK_ICON,
  },
  title: { flex: 1 },
  badge: {
    backgroundColor: t.color.surfaceAlt,
    borderRadius: t.radius.pill,
    paddingHorizontal: t.space.s3,
    paddingVertical: t.space.s1,
  },
}))

export type ScreenHeaderAction = {
  label: string
  onPress: () => void
  icon?: IconName
}

export type ScreenHeaderProps = {
  title: string
  /** Omit on the root of a tab. Back always goes back; it never saves. */
  onBack?: () => void
  backLabel?: string
  /** One at most. A second action belongs in the body or in a sheet. */
  action?: ScreenHeaderAction
  /** The date pill, as on Hoy. */
  badge?: string
}

export function ScreenHeader({ title, onBack, backLabel, action, badge }: ScreenHeaderProps) {
  const s = useStyles()
  const insets = useSafeAreaInsets()

  return (
    <View style={[s.header, { paddingTop: insets.top + theme.space.s2 }]}>
      {onBack ? (
        <Touchable
          accessibilityLabel={backLabel}
          accessibilityRole="button"
          onPress={onBack}
          style={s.back}
        >
          <Icon name="chevronLeft" size={BACK_ICON} tone="ink" />
        </Touchable>
      ) : null}

      <Text accessibilityRole="header" variant="displayMd" tone="ink" style={s.title}>
        {title}
      </Text>

      {badge ? (
        <View style={s.badge}>
          <Text variant="caption" tone="inkSoft">
            {badge}
          </Text>
        </View>
      ) : null}

      {action ? (
        <Touchable
          accessibilityLabel={action.label}
          accessibilityRole="button"
          onPress={action.onPress}
        >
          {action.icon ? (
            <Icon name={action.icon} size={theme.size.iconMd} tone="ink" />
          ) : (
            <Text variant="link" tone="accent">
              {action.label}
            </Text>
          )}
        </Touchable>
      ) : null}
    </View>
  )
}
