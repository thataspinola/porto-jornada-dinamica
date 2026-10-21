import { clsx } from '@porto-stack/ui/utils'
import type { HTMLAttributes } from 'react'

import s from '../styles.module.scss'

export type IconContentListRootProps = HTMLAttributes<HTMLUListElement> & {
  divider?: boolean
}

export function Root({
  divider,
  className,
  children,
  ...props
}: IconContentListRootProps) {
  return (
    <ul
      className={clsx(s.iconContentList, divider && s.withDivider, className)}
      {...props}
    >
      {children}
    </ul>
  )
}
