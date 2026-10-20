import type { HTMLAttributes } from 'react'

// Test double for the external design system; production builds use the real package.
export function Tag(props: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} />
}
