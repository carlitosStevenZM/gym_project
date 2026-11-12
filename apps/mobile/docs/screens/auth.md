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

**Nothing on these screens scrolls, and that is deliberate.** A `TextInput` inside a scrollable
container makes the platform scroll it above the keyboard the instant it takes focus, while
whatever lifts the rest animates on its own clock. Two movements, two durations, and the gap
between them is what reads as the field jumping ahead of the screen.

**`KeyboardAvoidingView` is not used either**, because it could not do the job on either platform.
On Android, where Expo draws edge to edge, the window never resizes, so the view's `behavior` had
nothing to act on and the fields simply stayed under the keyboard. On iOS it starts only once the
keyboard is on its way, so the content landed about 300 ms late — measured off a 120 fps screen
recording, where the keyboard was up by frame 16 and the content was still settling at frame 22.

`useKeyboardRise` (`src/shared/lib/`) replaces it. It listens to `keyboardWillShow` on iOS and
`keyboardDidShow` on Android, and animates one `translateY` on the native thread. The whole body is
one animated piece; nothing inside it moves on its own, and nothing in the tree changes size while
it moves.

**What makes it feel quick is the curve, not a short clock.** It first ran at half the keyboard's
duration, which on iOS is 125 ms: eight frames to cross some 330 px, 44 px a frame, and it read as
stepping rather than sliding. It now takes 85 % of that duration with `Easing.out(Easing.cubic)`,
which is two thirds of the way across in the first third of the time — thirteen frames, 26 px
apiece, and a move that still starts fast. Shortening the duration below `MIN_DURATION` trades
frames for nothing.

The title is **dropped outright while the keyboard is up**, not squeezed. Two earlier attempts tried
to clip it — `justifyContent: 'flex-end'`, then absolute positioning inside an `overflow: 'hidden'`
box — and on iOS the clip did not hold at all: the kicker ended up drawn over the first field.
A title that cannot fit is a title that should not be there.

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

- **Tapping anywhere that is not a control dismisses the keyboard.** The root is a `Pressable`
  calling `Keyboard.dismiss`; the inputs and buttons win the touch first because the responder
  system gives it to the innermost view that wants it.
- **No scroll view may wrap these inputs.** The platform's scroll-to-focused-field is instant and
  nothing else is; putting the fields back inside a `ScrollView` brings the desync back.
- **One value moves everything.** The body is a single `Animated.View`. Anything that moves on its
  own schedule — a second animation, a `KeyboardAvoidingView`, a clipping box that reflows — is how
  this screen broke the last three times. The panel's `paddingBottom` is constant for that reason:
  dropping the safe-area inset when the keyboard opened put a 34 px jump at frame one.
- **The value is stored already negative** and used as `translateY` directly. An
  `Animated.multiply` in the style is one more node to keep on the native thread for no gain.
- **The panel is bottom-anchored and never shrinks.** The head absorbs instead.
- **The splash is held until `status` leaves `loading`.** Removing that shows a login frame to a
  signed-in user on every cold start.

## Known caveats

- **The keyboard behaviour has been wrong once already.** The first attempt blamed the layout's
  centring and only changed that, and the desync survived on a device. If it survives again the
  remaining cause is the platform's own two-stage move, and the fix is
  `react-native-keyboard-controller`, which drives both platforms from one frame-synced value and
  needs a development build: it is not in Expo Go.
- **Android moves after the keyboard, not with it.** It has no `keyboardWillShow`, so the rise
  starts once the keyboard is already up. `react-native-keyboard-controller` is what closes that
  gap, and it needs a development build: it is not in Expo Go.
- **The panel has to fit above the keyboard on its own**, since nothing scrolls and the title is
  already gone by then. Signup's is about 512 dp, which is why the name field carries no help line.
  Adding a field to either screen means checking that number again.
- **The backdrop is filler.** `auth-sample.webp` comes from the same unlicensed Unsplash bank as
  the Hoy photograph; see `../../assets/README.md`.
- **`expo-secure-store` is unavailable on web**, where every call throws and the catches turn the
  session into an in-memory one. Web is out of scope (SRS §8), so this is recorded, not fixed.
- **Signing out lives in Ajustes**, which is otherwise still a placeholder: the weekly training
  selector and the rest value from FR-9 are not built.

## Related

- `../agents/architecture.md` — the layers and why `domain/` exists
- `../agents/design-system.md` — the components these screens compose
- `../../../../design-system/DECISIONS.md` — **DS9**, the Google mark exception
- SRS **FR-1**, **NF-4**, **D43**, **D44**
