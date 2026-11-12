import * as SecureStore from 'expo-secure-store'

/** FR-1: the session survives a relaunch, so the token outlives the process. */
const TOKEN_KEY = 'gymlog.session.token'

export async function readToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY)
  } catch {
    // A keychain that refuses to open is an anonymous launch, never a crash.
    return null
  }
}

/**
 * Never throws. Storage is how the session survives a relaunch, not how signing in works:
 * a keychain that refuses to write costs the user their next launch, and failing the
 * sign-in over it would cost them this one too.
 */
export async function writeToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token)
  } catch {
    return
  }
}

export async function clearToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY)
  } catch {
    return
  }
}
