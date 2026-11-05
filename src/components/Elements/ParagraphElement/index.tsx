import { Typography } from '@porto-stack/ui'

import type { ParagraphElementProps } from './types'

export function ParagraphElement({ element }: ParagraphElementProps) {
  const { variant, color, weight, text, cssProperties } = element.config

  return (
    <Typography
      as="p"
      variant={variant ?? 'title6'}
      color={color ?? 'neutral-800'}
      weight={weight ?? 'medium'}
      style={{ marginBottom: '32px', ...cssProperties }}>
      {text}
    </Typography>
  )
}
