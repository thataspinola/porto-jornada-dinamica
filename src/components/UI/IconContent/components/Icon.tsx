import { clsx } from '@porto-stack/ui/utils'

import { Icon as BaseIcon, type IconProps } from '@/components/UI/Icon'

import s from '../IconContent.module.scss'

export function Icon({ className, size, ...props }: IconProps) {
  return (
    <BaseIcon
      size={size ?? 32}
      className={clsx(s.icon, className)}
      {...props}
    />
  )
}
