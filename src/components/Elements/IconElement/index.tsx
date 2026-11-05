import { Icon, type IconProps } from '@/components/UI/Icon'

import type { IconElementProps } from './types'

export function IconElement({ element }: IconElementProps) {
  const { icon, size, color, cssProperties } = element.config
  const iconName = icon as IconProps['icon']
  const iconColor = color as IconProps['color']

  return (
    <Icon icon={iconName} size={size} color={iconColor} style={cssProperties} />
  )
}
