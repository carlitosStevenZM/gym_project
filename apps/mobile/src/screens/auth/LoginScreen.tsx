import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { credentialsSchema, useLogin, type Credentials } from '@/domain/auth'
import { makeStyles } from '@/shared/theme/styles'
import { Banner } from '@/shared/ui/Banner'
import { GoogleMark } from '@/shared/ui/GoogleMark'
import { PillButton } from '@/shared/ui/PillButton'
import { Text } from '@/shared/ui/Text'
import { TextField, type TextFieldHandle } from '@/shared/ui/TextField'
import { Touchable } from '@/shared/ui/Touchable'

import { AuthScreenLayout } from './components/AuthScreenLayout'
import { authErrorKey } from './components/auth-error'

const useStyles = makeStyles((t) => ({
  fields: { gap: t.space.s4 },
  forgot: { alignSelf: 'flex-end' },
  alternative: { gap: t.space.s4 },
}))

export function LoginScreen() {
  const s = useStyles()
  const { t } = useTranslation()
  const router = useRouter()
  const login = useLogin()

  const password = useRef<TextFieldHandle>(null)

  const { control, handleSubmit, formState } = useForm<Credentials>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: '', password: '' },
  })

  /** FR-1's one-tap Google sign-in needs the real backend; nothing is wired yet. */
  const googleSignInNotWired = () => {}
  const passwordRecoveryNotWired = () => {}

  const submit = handleSubmit((credentials) => login.mutate(credentials))

  return (
    <AuthScreenLayout
      footerAction={t('auth.login.goSignup')}
      footerLabel={t('auth.login.noAccount')}
      kicker={t('auth.login.kicker')}
      onFooterPress={() => router.push('/signup')}
      title={t('auth.login.title')}
    >
      {login.isError ? <Banner message={t(authErrorKey(login.error))} tone="error" /> : null}

      <View style={s.fields}>
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <TextField
              autoCapitalize="none"
              autoComplete="email"
              error={fieldState.error ? t(fieldState.error.message ?? '') : undefined}
              inputMode="email"
              label={t('auth.field.email')}
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              onSubmitEditing={() => password.current?.focus()}
              returnKeyType="next"
              submitBehavior="submit"
              value={field.value}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <TextField
              autoCapitalize="none"
              autoComplete="current-password"
              error={fieldState.error ? t(fieldState.error.message ?? '') : undefined}
              label={t('auth.field.password')}
              onBlur={field.onBlur}
              ref={password}
              onChangeText={field.onChange}
              onSubmitEditing={() => void submit()}
              returnKeyType="go"
              secureTextEntry
              value={field.value}
            />
          )}
        />
        <Touchable accessibilityRole="link" onPress={passwordRecoveryNotWired} style={s.forgot}>
          <Text variant="link" tone="inkMuted">
            {t('auth.login.forgot')}
          </Text>
        </Touchable>
      </View>

      <View style={s.alternative}>
        <PillButton
          block
          label={t('auth.login.submit')}
          loading={login.isPending || formState.isSubmitting}
          large
          onPress={() => void submit()}
        />
        <PillButton
          block
          label={t('auth.login.google')}
          leading={<GoogleMark />}
          onPress={googleSignInNotWired}
          variant="outline"
        />
      </View>
    </AuthScreenLayout>
  )
}
