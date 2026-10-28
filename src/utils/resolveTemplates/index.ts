import { getByPath } from '../getByPath/index'
import { interpolateTemplate } from '../interpolateTemplate/index'

const FULL_PLACEHOLDER_REGEX = /^\s*\{\{\s*([\w.-]+)\s*\}\}\s*$/
const COOKIES_SCOPE_PREFIX = 'cookies.'

function isMissing(value: unknown): boolean {
  return value == null || value === ''
}

function readPath(data: Record<string, unknown>, key: string): unknown {
  const value = getByPath(data, key)
  return isMissing(value) ? undefined : value
}

export function resolveTemplates<T>(
  value: T,
  data: Record<string, unknown>
): T {
  return resolve(value, data) as T
}

function resolve(value: unknown, data: Record<string, unknown>): unknown {
  if (typeof value === 'string') return resolveString(value, data)
  if (Array.isArray(value)) return resolveArray(value, data)

  if (value !== null && typeof value === 'object') {
    return resolveObject(value as Record<string, unknown>, data)
  }

  return value
}

function resolveString(value: string, data: Record<string, unknown>): unknown {
  const fullMatch = value.match(FULL_PLACEHOLDER_REGEX)

  if (fullMatch) {
    const path = fullMatch?.[1]

    if (path.startsWith(COOKIES_SCOPE_PREFIX) && !('cookies' in data)) {
      return value
    }

    return readPath(data, path)
  }

  return interpolateTemplate(value, data)
}

function resolveArray(
  items: unknown[],
  data: Record<string, unknown>
): unknown[] {
  return items
    .map((item) => resolve(item, data))
    .filter((item) => item != undefined)
}

function resolveObject(
  obj: Record<string, unknown>,
  data: Record<string, unknown>
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).flatMap(([key, item]) => {
      const resolved = resolve(item, data)
      return resolved === undefined ? [] : [[key, resolved]]
    })
  )
}
