import { getByPath } from '../getByPath';

/**
 * Resolve o valor padrão de um campo.
 * Pode vir diretamente da config ou ser buscado num serviço (API/Contexto) via path.
 */
export function resolveDefaultValue(
  config: Record<string, unknown>,
  services: Record<string, unknown>,
): string | undefined {
  // 1. Tenta valor estático
  if (config.defaultValue) return String(config.defaultValue);

  // 2. Se não houver, tenta buscar nos serviços disponíveis usando um caminho (ex: user.profile.name)
  const from = config.defaultValueFrom as { service?: string; path?: string } | undefined;
  if (!from?.service || !from?.path) return undefined;

  const value = getByPath(services[from.service], from.path);
  return value != null ? String(value) : undefined;
}
