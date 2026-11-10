import { useCallback, useEffect, useRef } from 'react'

/** Holding a key accelerates: the design system asks for a ×4 jump, not twenty taps. */
export const HOLD_MULTIPLIER = 4

const HOLD_DELAY_MS = 400
const REPEAT_EVERY_MS = 110

/**
 * Starts repeating `onRepeat` once a key has been held down, and stops on release or on
 * unmount. Leaving the timer running after unmount keeps firing into a dead component.
 */
export function useHoldRepeat(onRepeat: () => void) {
  const delay = useRef<ReturnType<typeof setTimeout> | null>(null)
  const repeat = useRef<ReturnType<typeof setInterval> | null>(null)
  const latest = useRef(onRepeat)

  useEffect(() => {
    latest.current = onRepeat
  }, [onRepeat])

  const stop = useCallback(() => {
    if (delay.current !== null) clearTimeout(delay.current)
    if (repeat.current !== null) clearInterval(repeat.current)
    delay.current = null
    repeat.current = null
  }, [])

  const start = useCallback(() => {
    stop()
    delay.current = setTimeout(() => {
      repeat.current = setInterval(() => latest.current(), REPEAT_EVERY_MS)
    }, HOLD_DELAY_MS)
  }, [stop])

  useEffect(() => stop, [stop])

  return { start, stop }
}
