import type { TagProps } from '../Tag/Tag.types'

type ComparableValue = string | boolean | number

export type ConditionalTagRule = {
  label: string
  variant?: TagProps['variant']
  negative?: TagProps['negative']
  when: {
    field: string
    equals?: ComparableValue
    notEquals?: ComparableValue
  }
}

export type ResolvedConditionalTag = Pick<
  ConditionalTagRule,
  'label' | 'variant' | 'negative'
>

export type ConditionalTagProps = TagProps & {
  conditionalRules?: ConditionalTagRule[]
  fields?: Record<string, unknown>
  resolveLabel?: (template: string | undefined) => string | undefined
}
