/**
 * Percorre os elementos da etapa atual para descobrir quais campos podem ser
 * pré-preenchidos automaticamente com dados externos.
 */
import type { JourneyDefinition } from '@/validation/schemas'

import { resolveDefaultValue } from '../resolvedDefaultValue'

type FormValues = Record<string, unknown>
type JourneyStep = JourneyDefinition['steps'][number]
type JourneyElement = JourneyStep['elements'][number]

export function computePrefillValues(
  elements: JourneyElement[],
  currentValues: FormValues,
  services: Record<string, unknown>,
  parameters: Record<string, unknown> = {}
): Record<string, unknown> {
  const prefill: Record<string, unknown> = {}

  for (const element of elements) {
    const config = element.config as Record<string, unknown>
    const name = config.name as string

    const isFieldFilled =
      currentValues[name] != null && currentValues[name] !== ''

    if (!name || isFieldFilled) continue

    const defaultValue = resolveDefaultValue(config, services, parameters)
    if (defaultValue) prefill[name] = defaultValue
  }

  return prefill
}
