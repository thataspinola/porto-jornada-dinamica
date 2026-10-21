import { clsx } from '@porto-stack/ui/utils'
import HTMLAttributes from 'react'

import s from '../IconContent.module.scss'

export type IconContentContentProps = HTMLAttributes<HTMLDivElement>

export function Content({
  className,
  children,
  ...props
}: IconContextContextProps) {
  return (
    <div className={clsx(s.text, className)} {...props}>
      {children}
    </div>
  )
}
