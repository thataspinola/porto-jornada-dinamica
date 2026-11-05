import { collectCookiePlaceholders } from '../collectCookiePlaceholders'
import { resolveTemplates } from '../resolveTemplates'

type CookieReader = {
  get: (name: string) => { value: string } | undefined
}

/**
 * Resolves `{{cookies.NAME}}` placeholders in a payload using only the
 * cookies referenced by it. For each name, a client-read value (when
 * non-empty) takes precedence over the server cookie store, which matters
 * in WebViews where the browser may not attach the cookie to the request.
 * Never throws: falls back to the original payload if reading cookies or
 * resolving templates fails, so a cookie issue never breaks the request.
 */
export function resolveCookiePayload(
  payload: Record<string, unknown>,
  cookieStore: CookieReader,
  clientCookies?: Record<string, string>,
  userAgent?: string
): Record<string, unknown> {
  try {
    const cookieNames = collectCookiePlaceholders(payload)
    if (cookieNames.size === 0) return payload

    const cookieValues: Record<string, string> = {}
    for (const name of cookieNames) {
      const clientValue = clientCookies?.[name]
      const serverValue = cookieStore.get(name)?.value
      const value = clientValue || serverValue
      console.warn(
        JSON.stringify({
          event: 'cookie_resolution',
          cookieName: name,
          clientPresent: !!clientValue,
          serverPresent: !!serverValue,
          valuesDiffer:
            !!clientValue && !!serverValue && clientValue !== serverValue,
          source: clientValue ? 'client' : serverValue ? 'server' : 'missing',
          userAgent: userAgent ?? 'unknown'
        })
      )
      if (value === undefined) continue
      cookieValues[name] = value
    }

    return resolveTemplates(payload, { cookies: cookieValues })
  } catch {
    return payload
  }
}
