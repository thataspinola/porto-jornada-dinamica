export function toSnakeCase(input: string): string
export function toSnakeCase(
  input: Record<string, unknown>
): Record<string, unknown>
export function toSnakeCase(
  input: string | Record<string, unknown>
): string | Record<string, unknown> {
  if (typeof input === 'string') {
    return input
      .replace(/([A-Z])/g, '_$1')
      .replace(/^_/, '')
      .toLowerCase()
  }

  const result: Record<string, unknown> = {}

  for (const key in input) {
    if (Object.hasOwn(input, key)) {
      result[toSnakeCase(key)] = input[key]
    }
  }

  return result
}
