export type User = {
  id: string
  email: string
  displayName: string
}

export type Session = {
  token: string
  user: User
}

/** `loading` only covers reading the stored token at launch, never a request. */
export type AuthStatus = 'loading' | 'anonymous' | 'authenticated'

export type Credentials = {
  email: string
  password: string
}

export type SignupInput = Credentials & {
  displayName: string
}
