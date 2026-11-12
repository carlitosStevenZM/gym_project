import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import { useAuth } from '@/domain/auth'
import { makeStyles } from '@/shared/theme/styles'
import { Dialog } from '@/shared/ui/Dialog'
import { OptionRow } from '@/shared/ui/OptionRow'
import { ScreenHeader } from '@/shared/ui/ScreenHeader'
import { Text } from '@/shared/ui/Text'

const useStyles = makeStyles((t) => ({
  body: { paddingBottom: t.space.s10, paddingHorizontal: t.space.s5 },
  section: { gap: t.space.s2, paddingTop: t.space.s6 },
}))

/**
 * Still a placeholder for most of FR-9: the weekly training selector and the rest value are
 * not here. Sign out is, because without it there is no way back to the login screen.
 */
export function SettingsScreen() {
  const s = useStyles()
  const { t } = useTranslation()
  const { user, signOut } = useAuth()
  const [confirming, setConfirming] = useState(false)

  return (
    <>
      <ScrollView contentContainerStyle={s.body}>
        <ScreenHeader title={t('tabs.settings')} />

        <View style={s.section}>
          <Text variant="label" tone="inkMuted">
            {t('settings.account')}
          </Text>
          {user ? (
            <Text variant="body" tone="inkSoft">
              {user.email}
            </Text>
          ) : null}
        </View>

        <View style={s.section}>
          <OptionRow
            description={t('settings.signOutDescription')}
            label={t('settings.signOut')}
            onPress={() => setConfirming(true)}
            variant="destructive"
          />
        </View>
      </ScrollView>

      <Dialog
        body={t('settings.confirmSignOut.body')}
        cancelLabel={t('ui.action.cancel')}
        confirmLabel={t('settings.confirmSignOut.confirm')}
        destructive
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false)
          void signOut()
        }}
        title={t('settings.confirmSignOut.title')}
        visible={confirming}
      />
    </>
  )
}
