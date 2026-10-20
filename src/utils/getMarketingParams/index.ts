const EXTRA_KEYS = [
  'link_uuid',
  'susep',
  'social_media',
  'id_google',
  'id_link',
  'gclid',
  'fbclid',
  'msclkid',
] as const

const EXTRA_KEY_SET = new Set<string>(EXTRA_KEYS)

function snakeToCamel(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase())
}

export function getMarketingParams(search: string): Record<string, string> {
  const params = new URLSearchParams(search)
  const result: Record<string, string> = {}

  for (const [key, value] of params.entries()) {
    if (!value) continue
    const isUtm = key.startsWith('utm_')
    const isExtra = EXTRA_KEY_SET.has(key)
    if (!isUtm && !isExtra) continue
    result[snakeToCamel(key)] = value
  }

  return result
}
