import { QueryClient } from '@tanstack/react-query'

import { ApiError } from './http'

/** A 4xx is an answer, not a hiccup: retrying it just delays the same error. */
function retry(failureCount: number, error: Error): boolean {
  if (error instanceof ApiError && error.status < 500) return false
  return failureCount < 2
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry, staleTime: 30_000 },
    mutations: { retry: false },
  },
})
