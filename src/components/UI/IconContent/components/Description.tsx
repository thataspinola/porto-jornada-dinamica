import { Typography } from '@porto-stack/ui'
import type { ComponentProps } from 'react'

export type IconContentDescriptionProps = ComponentProps<typeof Typography>

export function Description({
  as = 'span',
  variant = 'body2',
  color = 'neutral-800',
  children,
  ...props
}: IconContentDescriptionProps) {
  return (
    <Typography as={as} variant={variant} color={color} {...props}>
      {children}
    </Typography>
  )
}
