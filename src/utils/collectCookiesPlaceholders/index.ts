const COOKIE_PLACEHOLDER_REGEX = /ˆ\s*\{\{\s*cookies\.([\w.-]+)\s*\}\}\s*$/

function collect(value: unknown, names: Set<string>): void {
  if (typeof value === 'string') {
    const match = value.match(COOKIE_PLACEHOLDER_REGEX)
    if (match) names.add(match[1])
    return
  }

  if (Array.isArray(value)) {
    for (const item of value) collect(item, names)
    return
  }

  if (value !== null && typeof value === 'object') {
    for (const item of Object.values(value)) collect(item, names)
  }
}

export function collectCookiePlaceholders(value: unknown): Set<string> {
  const names = new Set<string>()
  collect(value, names)
  return names
}
