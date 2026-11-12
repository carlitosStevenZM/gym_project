/**
 * The only place in the app that knows a network exists.
 *
 * It returns `unknown` on purpose. A generic `get<T>()` would be a type
 * assertion with extra steps: nothing in the body checks `T`, so the compiler
 * ends up more confident than the response. The schema at the edge is what
 * produces the type (rule 7).
 */

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? ''

/** The envelope the API answers with on every failure: `{ error: { code, message } }`. */
export class ApiError extends Error {
  readonly code: string
  readonly status: number

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

/** A dead server, airplane mode, a wrong LAN address. No status, nothing to read. */
export class NetworkError extends Error {
  constructor() {
    super('network')
    this.name = 'NetworkError'
  }
}

type Options = {
  token?: string | null
  body?: unknown
}

async function request(method: string, path: string, options: Options = {}): Promise<unknown> {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        ...(options.body === undefined ? {} : { 'content-type': 'application/json' }),
        ...(options.token ? { authorization: `Bearer ${options.token}` } : {}),
      },
      ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
    })
  } catch {
    throw new NetworkError()
  }

  if (response.status === 204) return null
  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) throw toApiError(response.status, payload)
  return payload
}

function toApiError(status: number, payload: unknown): ApiError {
  const envelope =
    typeof payload === 'object' && payload !== null && 'error' in payload
      ? (payload as { error: unknown }).error
      : null

  if (typeof envelope === 'object' && envelope !== null && 'code' in envelope) {
    const { code, message } = envelope as { code?: unknown; message?: unknown }
    return new ApiError(
      status,
      typeof code === 'string' ? code : 'error',
      typeof message === 'string' ? message : '',
    )
  }
  return new ApiError(status, 'error', '')
}

export const get = (path: string, options?: Options) => request('GET', path, options)
export const post = (path: string, options?: Options) => request('POST', path, options)
export const patch = (path: string, options?: Options) => request('PATCH', path, options)
export const del = (path: string, options?: Options) => request('DELETE', path, options)
