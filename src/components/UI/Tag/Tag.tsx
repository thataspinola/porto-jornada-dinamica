import { Tag as TagPrimitive, Typography } from '@porto-stack/ui'
import { clsx } from '@porto-stack/ui/utils'
import type { ReactNode } from 'react'

import { Icon } from '@/components/UI/Icon'

import styles from './Tag.module.scss'
import {
  type TagDescriptionProps,
  type TagIconProps,
  type TagProps,
  type TagRootProps,
  tagVariants,
} from './Tag.types'

export type { TagProps } from './Tag.types'
export { tagVariants }

function TagRoot({ className, children, variant, ...props }: TagRootProps) {
  return (
    <div
      className={clsx(styles.root, className)}
      data-variant={variant}
      {...props}
    >
      {children}
    </div>
  )
}

function TagIcon({ size = 16, ...props }: TagIconProps) {
  return <Icon size={size} {...props} />
}

function TagDescription({
  as = 'p',
  color = 'neutral-800',
  variant = 'body1',
  children,
  ...props
}: TagDescriptionProps) {
  return (
    <Typography as={as} color={color} variant={variant} {...props}>
      {children}
    </Typography>
  )
}

type TagComponent = ((props: TagProps) => ReactNode) & {
  Root: typeof TagRoot
  Icon: typeof TagIcon
  Description: typeof TagDescription
}

function TagComponent({
  negative = false,
  className,
  styles: tagStyles,
  variant,
  ...props
}: TagProps) {
  const resolvedVariant = tagStyles ?? variant

  return (
    <TagPrimitive
      className={clsx(negative && styles.negative, className)}
      variant={resolvedVariant}
      {...props}
    />
  )
}

export const Tag: TagComponent = Object.assign(TagComponent, {
  Root: TagRoot,
  Icon: TagIcon,
  Description: TagDescription,
})
