import { Modal, View } from 'react-native'

import { makeStyles } from '@/shared/theme/styles'

import { PillButton } from './PillButton'
import { Text } from './Text'
import { Touchable } from './Touchable'

const MAX_WIDTH = 320

const useStyles = makeStyles((t) => ({
  root: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: t.space.s5,
  },
  veil: {
    backgroundColor: t.color.overlay,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  box: {
    backgroundColor: t.color.sheetBg,
    borderRadius: t.radius.xl,
    gap: t.space.s4,
    maxWidth: MAX_WIDTH,
    padding: t.space.s5,
    width: '100%',
  },
  actions: { gap: t.space.s2 },
}))

export type DialogProps = {
  visible: boolean
  /** One line. */
  title: string
  /** Two lines at most, and it says the exact consequence, with numbers if there are any. */
  body: string
  /** Says the verb: «Borrar cuenta», «Descartar sesión». Never «Aceptar». */
  confirmLabel: string
  onConfirm: () => void
  cancelLabel: string
  onCancel: () => void
  /** Paints the confirmation in `danger` and stops the veil from closing anything. */
  destructive?: boolean
}

/**
 * Stops everything to ask one thing, and only when something is irreversible or work is
 * lost. A dialog that does not ask is a Toast in the wrong place.
 */
export function Dialog({
  visible,
  title,
  body,
  confirmLabel,
  onConfirm,
  cancelLabel,
  onCancel,
  destructive = false,
}: DialogProps) {
  const s = useStyles()

  return (
    <Modal animationType="fade" onRequestClose={onCancel} transparent visible={visible}>
      <View style={s.root}>
        <Touchable
          accessibilityElementsHidden
          disabled={destructive}
          importantForAccessibility="no-hide-descendants"
          onPress={onCancel}
          style={s.veil}
        />
        <View accessibilityRole="alert" accessibilityViewIsModal style={s.box}>
          <Text accessibilityRole="header" variant="displayMd" tone="ink">
            {title}
          </Text>
          <Text variant="body" tone="inkSoft">
            {body}
          </Text>
          <View style={s.actions}>
            <PillButton
              block
              label={confirmLabel}
              onPress={onConfirm}
              variant={destructive ? 'danger' : 'accent'}
            />
            <PillButton block label={cancelLabel} onPress={onCancel} variant="outline" />
          </View>
        </View>
      </View>
    </Modal>
  )
}
