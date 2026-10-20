import Cookies from 'js-cookie'

import { getCookieOptions } from '../getCookieOptions'
import { interpolateTemplate } from '../interpolateTemplate'

/**
 * Resolves each `{{...}}` template and sets the resulting value as a cookie,
 * skipping entries whose template can't be fully resolved.
 */
export function setCookiesFromTemplates(
  templates: Record<string, string> | undefined,
  context: Record<string, unknown>
): void {
  if (!templates) return

  const options = getCookieOptions()

  for (const [name, template] of Object.entries(templates)) {
    const value = interpolateTemplate(template, context)
    if (value !== undefined) Cookies.set(name, value, options)
  }
}
