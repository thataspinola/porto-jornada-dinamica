'use client'

import { Notification } from '@porto-stack/ui'

import { Icon, type IconProps } from '@/components/UI/Icon'

import styles from './NotificationElement.module.scss'
import type { NotificationElementProps } from './types'

export function NotificationElement({ element }: NotificationElementProps) {
  const {
    text,
    icon,
    iconSize,
    variant,
    styles: notificationStyles,
    cssProperties
  } = element.config
  const iconName = icon as IconProps['icon']

  return (
    <Notification.Root
      variant={variant}
      styles={notificationStyles}
      style={cssProperties}>
      <div className={styles.content}>
        <Icon icon={iconName} size={iconSize} />
        <Notification.Description>{text}</Notification.Description>
      </div>
    </Notification.Root>
  )
}
