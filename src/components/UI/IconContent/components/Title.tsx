import { Typography } from '@porto-stack/ui'
import type { ComponentProps } from 'react'

export type IconContentTitleProps = ComponentProps<typeof Typography>

export function Title({
  as = 'span',
  variant = 'body1',
  weight = 'bold',
  children,
  ...props
}: IconContentTitleProps) {
  return (
    <Typography as={as} variant={variant} weight={weight} {...props}>
      {children}
    </Typography>
  )
}
