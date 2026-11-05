import { Typography } from '@porto-stack/ui'

import type { TitleElementProps } from './types'

export const TitleElement = ({ element }: TitleElementProps) => {
  const { variant, color, weight, text } = element.config

  return (
    <Typography
      as="h2"
      variant={variant ?? 'title4'}
      color={color ?? 'neutral-black'}
      weight={weight ?? 'semibold'}
      style={{ marginBottom: '32px' }}>
      {text}
    </Typography>
  )
}
