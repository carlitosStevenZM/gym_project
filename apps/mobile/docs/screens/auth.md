# Login y Signup

Status: Current
Last verified: 2026-11-11 against feat/fake-api@aa3887d, bundled for Android and exercised against a local API
Source of truth: `src/screens/auth/components/AuthScreenLayout.tsx` · `src/domain/auth/AuthProvider.tsx` · `src/app/_layout.tsx`

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

### The composition, and why the keyboard does not tear it

A photograph covers the top 56 % of the screen, with the one gradient the system allows closing it
into `bg`. The form sits over it, anchored to the **bottom** edge.

That anchoring is load-bearing, not taste. With the content centred, opening the keyboard moves it
by half the keyboard's height while the ScrollView drags the focused field the whole way, and the
two disagreeing is exactly what reads as the inputs rising faster than everything else. Anchored to
the bottom both move 1:1, so there is one movement and nothing to desync — on Android the window
resize does it, on iOS `KeyboardAvoidingView` does, and either way the content keeps its distance
from the bottom edge.

The references for this shape are Gymshark and Hevy, which both put a dark gym photograph behind a
bottom-anchored form.

### The two screens are a stack

Login is the first screen. Signup is **pushed** onto it, so it slides in and the back gesture takes
you back; replacing it, which is what this used to do, gave no way back and no transition worth the
name.

Going back is blocked **only while the signup request is in flight**, through `usePreventRemove`,
which covers the swipe, the Android button and the screen's own arrow at once. After a successful
signup there is nothing to go back to: the account is authenticated, so the guard below swaps the
whole anonymous group for the tabs.

The back control is `AuthBackButton` rather than `ScreenHeader`, because these screens carry their
title in the body and the system pins no header anyway (**DS6**).

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
- `src/screens/auth/components/AuthScreenLayout.tsx` — the backdrop, the gradient and the bottom-anchored scroll
- `src/screens/auth/components/AuthBackButton.tsx` — the back control, absent while a request is in flight
- `src/shared/ui/GoogleMark.tsx` — the four-colour G (**DS9**)
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

- **The form is anchored to the bottom edge, never centred.** Centred content and the ScrollView's
  own scroll-to-focused-field move by different amounts, which is what makes the screen look like
  it is coming apart when the keyboard opens.
- **The splash is held until `status` leaves `loading`.** Removing that shows a login frame to a
  signed-in user on every cold start.

## Known caveats

- **Only verified through a bundle and against a local API.** The screens have not been seen on a
  device, on iOS, or at the largest system text size — and the keyboard behaviour above is the one
  thing that most wants a real device, since it is a claim about motion.
- **The backdrop is filler.** `auth-sample.webp` comes from the same unlicensed Unsplash bank as
  the Hoy photograph; see `../../assets/README.md`.
- **`expo-secure-store` is unavailable on web**, where every call throws and the catches turn the
  session into an in-memory one. Web is out of scope (SRS §8), so this is recorded, not fixed.
- **There is no sign-out control yet.** `useAuth().signOut` exists and nothing calls it; it belongs
  to Ajustes (FR-9).

## Related

- `../agents/architecture.md` — the layers and why `domain/` exists
- `../agents/design-system.md` — the components these screens compose
- `../../../../design-system/DECISIONS.md` — **DS9**, the Google mark exception
- SRS **FR-1**, **NF-4**, **D43**, **D44**
