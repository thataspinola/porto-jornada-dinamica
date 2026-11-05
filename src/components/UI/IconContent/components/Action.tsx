import { Link } from '@porto-stack/ui'
import { clsx } from '@porto-stack/ui/utils'

import s from '../IconContent.module.scss'

export type IconContentActionProps = {
  text: string
  onClick?: () => void
  align?: 'start' | 'end'
}

export function Action({
  text,
  onClick,
  align = 'start'
}: IconContentActionProps) {
  return (
    <Link asChild className={clsx(s.action, align === 'end' && s.actionEnd)}>
      <button type="button" onClick={onClick}>
        {text}
      </button>
    </Link>
  )
}
