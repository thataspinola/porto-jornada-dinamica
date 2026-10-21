import Cookies from 'js-cookie'

import { collectCookiesPlaceholders } from '../collectCookiesPlaceholders'

export function readReferencedCookies(
  payload: Record<string, unknown>
): Record<string, string> {
  const result: Record<string, string> = {}

  for (const name of collectCookiesPlaceholders(payload)) {
    const value = Cookies.get(name)
    if (value !== undefined) result[name] = value
  }

  return result
}
