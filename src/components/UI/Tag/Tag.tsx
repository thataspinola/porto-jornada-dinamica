import { Tag as TagPrimitive } from '@porto-stack/ui'
import { clsx } from '@porto-stack/ui/utils'

import styles from './Tag.module.scss'
import { type TagProps, tagVariants } from './Tag.types'

export type { TagProps } from './Tag.types'
export { tagVariants }

export const Tag = ({
  negative = false,
  className,
  styles: tagStyles,
  variant,
  ...props
}: TagProps) => {
  const resolvedVariant = tagStyles ?? variant

  return (
    <TagPrimitive
      className={clsx(negative && styles.negative, className)}
      variant={resolvedVariant}
      {...props}
    />
  )
}
