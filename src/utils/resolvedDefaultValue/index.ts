import { getByPath } from '../getByPath'

export function resolveDefaultValue(
  config: Record<string, unknown>,
  services: Record<string, unknown>,
  parameters: Record<string, unknown> = {}
): string | undefined {
  if (config.defaultValue) return String(config.defaultValue)

  const from = config.defaultValueFrom as
    | { service?: string; path?: string }
    | undefined
  if (!from?.service || !from?.path) return undefined

  const source = { ...services, parameters }[from.service]
  const value = getByPath(source, from.path)
  return value != null ? String(value) : undefined
}
