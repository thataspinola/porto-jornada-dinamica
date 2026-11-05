import { clsx } from '@porto-stack/ui/utils'
import type { HTMLAttributes } from 'react'

import s from '../IconContent.module.scss'

export type IconContentTrailingProps = HTMLAttributes<HTMLDivElement>

export function Trailing({
  className,
  children,
  ...props
}: IconContentTrailingProps) {
  return (
    <div className={clsx(s.trailing, className)} {...props}>
      {children}
    </div>
  )
}
