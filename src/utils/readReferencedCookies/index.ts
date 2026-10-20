import Cookies from 'js-cookie'

import { collectCookiesPlaceholders } from '../collectCookiesPlaceholders'

export function readReferenceCookies(
  payload: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, string> = {}

  for (const name of collectCookiesPlaceholders(payload)) {
    const value = Cookies.get(name)
    if (value !== undefined) result[name] = value
  }

  return result
}
