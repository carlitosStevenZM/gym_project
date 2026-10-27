import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import { color, fontSize, space } from './tokens'

type Props = {
  title: string
}

export function Placeholder({ title }: Props) {
  const { t } = useTranslation()

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.note}>{t('placeholder.note')}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    padding: space.lg,
    backgroundColor: color.bg,
  },
  title: {
    fontSize: fontSize.display,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: color.ink,
  },
  note: {
    fontSize: fontSize.body,
    textAlign: 'center',
    color: color.inkMuted,
  },
})
