import { ApiError, NetworkError } from '@/shared/api/http'

const KNOWN = ['unauthenticated', 'email_taken', 'invalid_input'] as const

/**
 * Turns a thrown error into an i18n key. The API already answers in Spanish, but a screen
 * that renders whatever the server sends has no control over its own copy, and no way to
 * say something different when the server says nothing at all.
 */
export function authErrorKey(error: unknown): string {
  if (error instanceof NetworkError) return 'auth.error.network'
  if (error instanceof ApiError) {
    const known = KNOWN.find((code) => code === error.code)
    if (known) return `auth.error.${known}`
  }
  return 'auth.error.unknown'
}
