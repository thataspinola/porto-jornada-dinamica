import { Tag } from '../Tag/Tag'
import { resolveConditionalTag } from './resolveConditionalTag'
import type { ConditionalTagProps } from './types'

export function ConditionalTag({
  fields,
  variant,
  negative,
  children,
  resolveLabel,
  conditionalRules,
  ...props
}: ConditionalTagProps) {
  const resolvedTag = resolveConditionalTag({
    fields,
    resolveLabel,
    conditionalRules
  })

  const content = resolvedTag?.label ?? children

  if (!content) return null

  return (
    <Tag
      {...props}
      variant={resolvedTag?.variant ?? variant}
      negative={resolvedTag?.negative ?? negative}>
      {content}
    </Tag>
  )
}
