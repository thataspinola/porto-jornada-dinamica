import Cookies from 'js-cookie'

import { collectCookiePlaceholders } from '../collectCookiePlaceholders'

export function readReferencedCookies(
  payload: Record<string, unknown>
): Record<string, string> {
  const result: Record<string, string> = {}
  for (const name of collectCookiePlaceholders(payload)) {
    const value = Cookies.get(name)
    console.debug(
      JSON.stringify({
        event: 'cookie_read',
        cookieName: name,
        present: !!value
      })
    )
    if (value) result[name] = value
  }
  return result
}
