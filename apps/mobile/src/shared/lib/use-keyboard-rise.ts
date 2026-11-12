import { useEffect, useState } from 'react'
import { Animated, Keyboard, Platform } from 'react-native'
import type { KeyboardEvent } from 'react-native'

/**
 * How much of the keyboard's own duration the content takes. Below 1 the content arrives
 * before the keyboard finishes, which reads as the screen keeping up rather than following.
 */
const SPEED = 0.5

/** Below this the move stops reading as a move and starts reading as a jump. */
const MIN_DURATION = 90

/** Android reports no duration with its events. */
const ANDROID_DURATION = 220

/**
 * The keyboard's height as an animated value, and whether it is up.
 *
 * This exists because `KeyboardAvoidingView` cannot do the job on either platform here. On
 * Android, where Expo draws edge to edge, the window never resizes and the view's `behavior`
 * has nothing to act on, so the fields simply stay under the keyboard. On iOS it waits for
 * the keyboard before it starts, so the content lands a few hundred milliseconds late.
 *
 * Driving it from `keyboardWillShow` starts the move with the keyboard instead of after it,
 * and the height animates on the native thread as a transform.
 */
export function useKeyboardRise() {
  /** Lazily initialised through state, which is what keeps one instance across renders. */
  const [height] = useState(() => new Animated.Value(0))
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const isIos = Platform.OS === 'ios'

    const animate = (to: number, event: KeyboardEvent) => {
      Animated.timing(height, {
        toValue: to,
        duration: Math.max((event.duration || ANDROID_DURATION) * SPEED, MIN_DURATION),
        useNativeDriver: true,
      }).start()
    }

    const shown = Keyboard.addListener(isIos ? 'keyboardWillShow' : 'keyboardDidShow', (event) => {
      setIsOpen(true)
      animate(event.endCoordinates.height, event)
    })
    const hidden = Keyboard.addListener(isIos ? 'keyboardWillHide' : 'keyboardDidHide', (event) => {
      setIsOpen(false)
      animate(0, event)
    })

    return () => {
      shown.remove()
      hidden.remove()
    }
  }, [height])

  return { height, isOpen }
}
