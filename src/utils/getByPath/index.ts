export function getByPath(value: unknown, path: string): unknown {
  if (!path) return value
  if (value == null) return undefined

  const parts = path.split('.').filter(Boolean)
  let currentPath: unknown = value

  for (const part of parts) {
    if (currentPath == null) return undefined
    if (typeof currentPath !== 'object') return undefined
    currentPath = (currentPath as Record<string, unknown>)[part]
  }

  return currentPath
}
