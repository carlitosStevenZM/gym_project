import type { ReactNode } from 'react'
import { Modal, View } from 'react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

import { makeStyles } from '@/shared/theme/styles'
import { theme } from '@/shared/theme/theme'

import { Text } from './Text'
import { Touchable } from './Touchable'
import { Icon } from './icons/Icon'

const HANDLE_HEIGHT = 4
/** How far down the sheet has to travel, or how fast, before the drag counts as a dismissal. */
const DISMISS_DISTANCE = 120
const DISMISS_VELOCITY = 800

/** Never full screen: something that covers everything is a screen and gets navigation. */
const HEIGHTS = { content: undefined, half: '50%', tall: '92%' } as const

const useStyles = makeStyles((t) => ({
  root: { flex: 1, justifyContent: 'flex-end' },
  veil: {
    backgroundColor: t.color.overlay,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  sheet: {
    backgroundColor: t.color.sheetBg,
    borderTopLeftRadius: t.radius.sheet,
    borderTopRightRadius: t.radius.sheet,
    paddingBottom: t.space.s5,
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: t.color.inkMuted,
    borderRadius: t.radius.pill,
    height: HANDLE_HEIGHT,
    marginVertical: t.space.s3,
    width: t.size.sheetHandle,
  },
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: t.space.s3,
    paddingBottom: t.space.s3,
    paddingHorizontal: t.space.s5,
  },
  title: { flex: 1 },
  body: { flexShrink: 1 },
  action: { paddingHorizontal: t.space.s5, paddingTop: t.space.s4 },
}))

export type BottomSheetProps = {
  visible: boolean
  onClose: () => void
  title: string
  closeLabel: string
  /** `content` for three to six options, `half` for a long list, `tall` only for a form. */
  height?: keyof typeof HEIGHTS
  /**
   * There are unsaved changes, so the veil and the drag stop closing and the caller raises a
   * Dialog from its own close affordance instead.
   */
  lockClose?: boolean
  children: ReactNode
  /** A PillButton when the sheet decides something, anchored under the content. */
  action?: ReactNode
}

/**
 * The selection container of the system. It rises from the bottom, where the thumb already
 * is, which is why a dropdown on this app opens a sheet and not a floating menu (NF-3).
 */
export function BottomSheet({
  visible,
  onClose,
  title,
  closeLabel,
  height = 'content',
  lockClose = false,
  children,
  action,
}: BottomSheetProps) {
  const s = useStyles()
  const offset = useSharedValue(0)

  const drag = Gesture.Pan()
    .enabled(!lockClose)
    .onChange((event) => {
      offset.value = Math.max(0, offset.value + event.changeY)
    })
    .onEnd((event) => {
      const dismissed = offset.value > DISMISS_DISTANCE || event.velocityY > DISMISS_VELOCITY
      offset.value = withSpring(0)
      if (dismissed) runOnJS(onClose)()
    })

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: offset.value }] }))

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <GestureHandlerRootView style={s.root}>
        <Touchable
          accessibilityElementsHidden
          disabled={lockClose}
          onPress={onClose}
          style={s.veil}
        />
        <GestureDetector gesture={drag}>
          <Animated.View
            accessibilityViewIsModal
            style={[s.sheet, sheetStyle, { maxHeight: HEIGHTS[height] }]}
          >
            <View style={s.handle} />
            <View style={s.heading}>
              <Text accessibilityRole="header" variant="displayMd" tone="ink" style={s.title}>
                {title}
              </Text>
              <Touchable
                accessibilityLabel={closeLabel}
                accessibilityRole="button"
                onPress={onClose}
              >
                <Icon name="close" size={theme.size.iconMd} tone="inkSoft" />
              </Touchable>
            </View>
            <View style={s.body}>{children}</View>
            {action ? <View style={s.action}>{action}</View> : null}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  )
}
