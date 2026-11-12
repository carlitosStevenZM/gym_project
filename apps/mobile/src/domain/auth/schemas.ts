import { z } from 'zod'

import type { Session, User } from './types'

/** The API answers in snake_case. It stops here: nothing above this file sees it. */
const UserResponse = z.object({
  id: z.string(),
  email: z.string(),
  display_name: z.string(),
})

const SessionResponse = z.object({
  token: z.string(),
  user: UserResponse,
})

export function toUser(raw: unknown): User {
  const { id, email, display_name } = UserResponse.parse(raw)
  return { id, email, displayName: display_name }
}

export function toSession(raw: unknown): Session {
  const { token, user } = SessionResponse.parse(raw)
  return { token, user: { id: user.id, email: user.email, displayName: user.display_name } }
}

/** FR-1: eight characters minimum. The messages are keys, resolved by the screen. */
export const credentialsSchema = z.object({
  email: z.email({ error: 'auth.validation.email' }),
  password: z.string().min(8, { error: 'auth.validation.password' }),
})

export const signupSchema = credentialsSchema.extend({
  displayName: z.string().trim().min(1, { error: 'auth.validation.displayName' }),
})
