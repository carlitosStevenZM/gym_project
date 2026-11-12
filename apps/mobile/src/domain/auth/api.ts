import { get, post } from '@/shared/api/http'

import { toSession, toUser } from './schemas'
import type { Credentials, Session, SignupInput, User } from './types'

export async function login(credentials: Credentials): Promise<Session> {
  return toSession(await post('/auth/login', { body: credentials }))
}

export async function signup(input: SignupInput): Promise<Session> {
  return toSession(
    await post('/auth/signup', {
      body: { email: input.email, password: input.password, display_name: input.displayName },
    }),
  )
}

/** Proves a stored token still resolves to somebody before the app trusts it. */
export async function fetchMe(token: string): Promise<User> {
  return toUser(await get('/auth/me', { token }))
}
