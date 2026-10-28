import { resolveTemplates } from '../resolveTemplates'
import { collectCookiesPlaceholders } from '../collectCookiesPlaceholders'

type CookieReader = {
  get: (name: string) => { value: string } | undefined
}

/**
 * Resolves `{{cookies.NAME}}` placeholders in a payload using only the cookies referenced by it.
 * For each name, a client-read value (when provided) takes precedence over the server cookie store, which matters in WebViews where the browser mau not attach the cookie to the request.
 * Never throws: falls back to the original payload if reading cookies or resolving templates fails, so a cookie issue never breaks the request.
 */
export function resolveCookiePayload(
  payload: Record<string, unknown>,
  cookieStore: CookieReader,
  clientCookies?: Record<string, unknown>,
  userAgent?: string
): Record<string, unknown> {
  try {
    const cookieNames = collectCookiesPlaceholders(payload)
    if (cookieNames.size === 0) return payload
    const cookieValues: Record<string, string> = {}

    for (const name of cookieNames) {
      const value = clientCookies?.[name] ?? cookieStore.get(name)?.value

      console.warn(
        `[resolveCookiePayload] cookie '${name}': ${value ? 'resolved' : 'MISSING'}; userAgent: ${userAgent ?? 'unknown'}`
      )

      if (typeof value !== 'string') continue
      cookieValues[name] = value
    }

    return resolveTemplates(payload, { cookies: cookieValues })
  } catch {
    return payload
  }
}
