import { getByPath } from '@/utils'

import type { ConditionalTagProps, ResolvedConditionalTag } from './types'

const normalizeCompare = (value: unknown) =>
  String(value ?? '')
    .trim()
    .toLowerCase()

export function resolveConditionalTag({
  conditionalRules,
  fields,
  resolveLabel
}: Pick<ConditionalTagProps, 'conditionalRules' | 'fields' | 'resolveLabel'>):
  | ResolvedConditionalTag
  | undefined {
  if (!conditionalRules || conditionalRules.length === 0 || !fields) {
    return undefined
  }

  const matched = conditionalRules.find((rule) => {
    const current = normalizeCompare(getByPath(fields, rule.when.field))

    if (rule.when.equals !== undefined) {
      return current === normalizeCompare(rule.when.equals)
    }

    if (rule.when.notEquals !== undefined) {
      return current !== normalizeCompare(rule.when.notEquals)
    }

    return false
  })

  if (!matched) return undefined

  const label = resolveLabel?.(matched.label) ?? matched.label

  if (!label) return undefined

  return {
    label,
    variant: matched.variant,
    negative: matched.negative
  }
}
