import { useEffect, useState } from 'react'
import { Animated, Easing, Keyboard, Platform } from 'react-native'
import type { KeyboardEvent } from 'react-native'

/**
 * Share of the keyboard's own duration the content takes.
 *
 * Not lower, and the reason is frames rather than taste. The keyboard reports 250 ms on iOS;
 * at a third of that the move gets eight frames to cross some 330 px, which is 40 px a frame
 * and reads as stepping rather than sliding. What makes it feel quick is the curve below, not
 * a shorter clock: `out(cubic)` is already two thirds of the way across in the first third of
 * the time, so the eye sees a fast move that still has frames in it.
 */
const SPEED = 1

/** Below this there are not enough frames left for any curve to save it. */
const MIN_DURATION = 320

/** Android reports no duration with its events. */
const ANDROID_DURATION = 220

/**
 * How far the content has to rise to clear the keyboard, as an animated value, and whether
 * the keyboard is up.
 *
 * This exists because `KeyboardAvoidingView` cannot do the job on either platform here. On
 * Android, where Expo draws edge to edge, the window never resizes and the view's `behavior`
 * has nothing to act on, so the fields simply stay under the keyboard. On iOS it waits for
 * the keyboard before it starts, so the content lands a few hundred milliseconds late.
 *
 * The value is already negative, so a screen uses it as `translateY` with nothing in between:
 * one native node, no derived arithmetic to keep on the native thread.
 */
export function useKeyboardRise() {
  /** Lazily initialised through state, which is what keeps one instance across renders. */
  const [offset] = useState(() => new Animated.Value(0))
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const isIos = Platform.OS === 'ios'

    const animate = (to: number, event: KeyboardEvent) => {
      Animated.timing(offset, {
        toValue: to,
        duration: Math.max((event.duration || ANDROID_DURATION) * SPEED, MIN_DURATION),
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start()
    }

    const shown = Keyboard.addListener(isIos ? 'keyboardWillShow' : 'keyboardDidShow', (event) => {
      setIsOpen(true)
      animate(-event.endCoordinates.height, event)
    })
    const hidden = Keyboard.addListener(isIos ? 'keyboardWillHide' : 'keyboardDidHide', (event) => {
      setIsOpen(false)
      animate(0, event)
    })

    return () => {
      shown.remove()
      hidden.remove()
    }
  }, [offset])

  return { offset, isOpen }
}
