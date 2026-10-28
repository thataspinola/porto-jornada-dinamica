import { clsx } from '@porto-stack/ui/utils'
import type { HTMLAttributes } from 'react'

import s from '../IconContent.module.scss'

export type IconContentRootProps = HTMLAttributes<HTMLDivElement> & {
  align?: 'center' | 'start'
}

export function Root({
  align = 'center',
  className,
  children,
  ...props
}: IconContentRootProps) {
  return (
    <div
      className={clsx(
        s.iconContent,
        align === 'start' && s.alignStart,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
