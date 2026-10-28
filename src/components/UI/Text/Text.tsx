import { Typography } from '@porto-stack/ui'
import type { ComponentProps } from 'react'
type TextProps = ComponentProps<typeof Typography> & {
  text?: string
  dangerousHtml?: boolean
}
export function Text({
  text,
  children,
  dangerousHtml = false,
  ...props
}: TextProps) {
  return (
    <Typography
      {...props}
      {...(dangerousHtml
        ? { dangerouslySetInnerHTML: { __html: text ?? '' } }
        : { children: text ?? children })}
    />
  )
}
