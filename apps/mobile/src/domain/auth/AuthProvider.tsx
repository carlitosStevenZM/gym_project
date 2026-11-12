import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import * as api from './api'
import { clearToken, readToken, writeToken } from './storage'
import type { AuthStatus, Credentials, Session, SignupInput, User } from './types'

type AuthValue = {
  status: AuthStatus
  user: User | null
  token: string | null
  signIn: (session: Session) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

/**
 * The one Provider at the root, because the session is genuinely global (rule 4).
 * It holds the session and nothing else: everything that comes from the server
 * belongs to TanStack Query and is never copied in here (rule 3).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')
  const queryClient = useQueryClient()

  useEffect(() => {
    let active = true

    void (async () => {
      const token = await readToken()
      if (token === null) {
        if (active) setStatus('anonymous')
        return
      }
      try {
        const user = await api.fetchMe(token)
        if (!active) return
        setSession({ token, user })
        setStatus('authenticated')
      } catch {
        // A token the server no longer honours is not an error the user caused.
        await clearToken()
        if (active) setStatus('anonymous')
      }
    })()

    return () => {
      active = false
    }
  }, [])

  const signIn = useCallback(async (next: Session) => {
    await writeToken(next.token)
    setSession(next)
    setStatus('authenticated')
  }, [])

  const signOut = useCallback(async () => {
    await clearToken()
    setSession(null)
    setStatus('anonymous')
    // Another account must never read the cache the previous one filled.
    queryClient.clear()
  }, [queryClient])

  const value = useMemo<AuthValue>(
    () => ({
      status,
      user: session?.user ?? null,
      token: session?.token ?? null,
      signIn,
      signOut,
    }),
    [status, session, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/** Guards, so a missing Provider fails loudly instead of handing back undefined (rule 5). */
export function useAuth(): AuthValue {
  const value = useContext(AuthContext)
  if (value === null) throw new Error('useAuth was called outside AuthProvider')
  return value
}

export function useLogin() {
  const { signIn } = useAuth()
  return useMutation({
    mutationFn: (credentials: Credentials) => api.login(credentials),
    onSuccess: signIn,
  })
}

export function useSignup() {
  const { signIn } = useAuth()
  return useMutation({
    mutationFn: (input: SignupInput) => api.signup(input),
    onSuccess: signIn,
  })
}
