# Login y Signup

Status: Current
Last verified: 2026-11-11 against feat/fake-api@aa3887d, bundled for Android and exercised against a local API
Source of truth: `src/screens/auth/LoginScreen.tsx` · `src/domain/auth/AuthProvider.tsx` · `src/app/_layout.tsx:45`

## Purpose

The two screens FR-1 asks for, and the session they produce. They are also the app's first wiring
to a real HTTP API: everything before them reads a fixture.

## How it works today

### The layers

```
app/login.tsx  ──►  screens/auth/LoginScreen  ──►  domain/auth  ──►  shared/api/http
```

The screen never names a URL. It calls `useLogin()` from `@/domain/auth`, and that module owns the
request, the Zod schema and the shape the screen sees.

**`shared/api/http.ts` returns `unknown`.** There is no `get<T>()`, deliberately: nothing in such a
function's body checks `T`, so it is a type assertion wearing a generic, and it leaves the compiler
more confident than the response. The schema at the edge is what produces the type (rule 7).

**snake_case dies in `domain/auth/schemas.ts`.** The API answers `display_name`; nothing above that
file has heard of it. That mapping is the seam — if the backend renames a field, one file moves.

### The session

`AuthProvider` is the single Provider at the root (rule 4), and it holds **only** the session:
token, user, status. Nothing that comes from the server is copied into it (rule 3).

| `status` | When |
|---|---|
| `loading` | Reading the stored token at launch, and proving it against `/auth/me` |
| `anonymous` | No token, or a token the server no longer honours |
| `authenticated` | A token that resolved to a user |

The token lives in `expo-secure-store` so the session survives a relaunch (FR-1). On launch the
provider does not trust it blindly: it calls `/auth/me` first, and a rejected token is cleared and
treated as an anonymous launch, never as an error the user caused.

Signing out clears the keychain **and** `queryClient.clear()`. Without that second line the next
account to sign in on the device reads the previous one's cached queries.

### The routing gate

`src/app/_layout.tsx` renders `Stack.Protected` on `status`. The splash is held until the status
stops being `loading`, because routing on `loading` shows the login screen for a frame to somebody
who is already signed in.

### Forms and errors

`react-hook-form` with `zodResolver`, per the settled stack. The Zod messages are **i18n keys**, not
sentences (`auth.validation.password`), and the screen resolves them — which is what keeps rule 10
true inside a validation schema.

API failures go through `screens/auth/components/auth-error.ts`, which maps an error **code** to a
key. The API already answers in Spanish, and the screen deliberately ignores that text: a screen
that renders whatever the server sends has no control over its own copy, and nothing to say when the
server says nothing at all. Three codes are mapped — `unauthenticated`, `email_taken`,
`invalid_input` — plus a network case and a catch-all.

## Key files

- `src/screens/auth/LoginScreen.tsx` — the form, the Google button, the recovery link
- `src/screens/auth/SignupScreen.tsx` — the same with a name field and the 8-character rule
- `src/screens/auth/components/AuthScreenLayout.tsx` — the chrome both share
- `src/screens/auth/components/auth-error.ts` — error code to i18n key
- `src/domain/auth/` — `index.ts` is the only importable file; the rest is private
- `src/shared/api/http.ts` — the wrapper, `ApiError` and `NetworkError`
- `src/app/_layout.tsx` — providers and the `Stack.Protected` gate

## Gotchas and edge cases

- **Google sign-in goes nowhere.** `googleSignInNotWired` is an empty function, as is
  `passwordRecoveryNotWired`. Both are FR-1 and both need the real backend. They follow the naming
  the Hoy screen already uses, so a grep for `NotWired` finds everything still waiting on a route.
- **Account linking is not modelled.** FR-1 says signing up with a password on an address that
  already signed in with Google links the two. Here a taken address is simply `email_taken`.
- **`writeToken` never throws.** A keychain that refuses to write costs the user their next launch;
  failing the sign-in over it would cost them this one too.
- **The API base URL comes from `EXPO_PUBLIC_API_URL`**, inlined at build time. Changing it needs
  `yarn start --clear`, and an empty value makes every request a relative one that fails.

## Design constraints

- **The layout centres the form instead of hanging it from a header.** There is no content above it
  to anchor it, and a top-aligned form leaves the screen bottom-heavy once the keyboard is up.
- **The splash is held until `status` leaves `loading`.** Removing that shows a login frame to a
  signed-in user on every cold start.

## Known caveats

- **Only verified through a bundle and against a local API.** The screens have not been seen on a
  device, on iOS, or at the largest system text size.
- **`expo-secure-store` is unavailable on web**, where every call throws and the catches turn the
  session into an in-memory one. Web is out of scope (SRS §8), so this is recorded, not fixed.
- **There is no sign-out control yet.** `useAuth().signOut` exists and nothing calls it; it belongs
  to Ajustes (FR-9).

## Related

- `../agents/architecture.md` — the layers and why `domain/` exists
- `../agents/design-system.md` — the components these screens compose
- SRS **FR-1**, **NF-4**, **D43**, **D44**
