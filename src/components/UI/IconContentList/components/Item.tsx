import type { LiHTMLAttributes } from 'react'

export function Item({ children, ...props }: LiHTMLAttributes<HTMLLIElement>) {
  return <li {...props}>{children}</li>
}
