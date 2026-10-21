import type { LiHTMLAttributes } from 'react'

export function Item({ children, ...props }: LiHTMLAttributes) {
  return <li {...props}>{children}</li>
}
