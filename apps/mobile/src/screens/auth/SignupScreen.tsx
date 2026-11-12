import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, usePreventRemove } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { signupSchema, useSignup, type SignupInput } from '@/domain/auth'
import { makeStyles } from '@/shared/theme/styles'
import { Banner } from '@/shared/ui/Banner'
import { GoogleMark } from '@/shared/ui/GoogleMark'
import { PillButton } from '@/shared/ui/PillButton'
import { TextField } from '@/shared/ui/TextField'

import { AuthBackButton } from './components/AuthBackButton'
import { AuthScreenLayout } from './components/AuthScreenLayout'
import { authErrorKey } from './components/auth-error'

const useStyles = makeStyles((t) => ({
  fields: { gap: t.space.s4 },
  alternative: { gap: t.space.s4 },
}))

export function SignupScreen() {
  const s = useStyles()
  const { t } = useTranslation()
  const router = useRouter()
  const signup = useSignup()

  const { control, handleSubmit, formState } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { displayName: '', email: '', password: '' },
  })

  const googleSignInNotWired = () => {}

  const submit = handleSubmit((input) => signup.mutate(input))

  /**
   * Going back mid request would leave the account created and the app on the login screen.
   * It covers the swipe, the Android back button and the header's own arrow in one place.
   */
  usePreventRemove(signup.isPending, () => {})

  return (
    <AuthScreenLayout
      footerAction={t('auth.signup.goLogin')}
      footerLabel={t('auth.signup.hasAccount')}
      header={
        <AuthBackButton
          label={t('ui.action.back')}
          onPress={signup.isPending ? undefined : () => router.back()}
        />
      }
      kicker={t('auth.signup.kicker')}
      onFooterPress={() => router.back()}
      title={t('auth.signup.title')}
    >
      {signup.isError ? <Banner message={t(authErrorKey(signup.error))} tone="error" /> : null}

      <View style={s.fields}>
        <Controller
          control={control}
          name="displayName"
          render={({ field, fieldState }) => (
            <TextField
              autoComplete="name"
              error={fieldState.error ? t(fieldState.error.message ?? '') : undefined}
              help={t('auth.field.displayNameHelp')}
              label={t('auth.field.displayName')}
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              value={field.value}
            />
          )}
        />
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
              autoComplete="new-password"
              error={fieldState.error ? t(fieldState.error.message ?? '') : undefined}
              help={t('auth.field.passwordHelp')}
              label={t('auth.field.password')}
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              onSubmitEditing={() => void submit()}
              returnKeyType="go"
              secureTextEntry
              value={field.value}
            />
          )}
        />
      </View>

      <View style={s.alternative}>
        <PillButton
          block
          label={t('auth.signup.submit')}
          large
          loading={signup.isPending || formState.isSubmitting}
          onPress={() => void submit()}
        />
        <PillButton
          block
          label={t('auth.signup.google')}
          leading={<GoogleMark />}
          onPress={googleSignInNotWired}
          variant="outline"
        />
      </View>
    </AuthScreenLayout>
  )
}
