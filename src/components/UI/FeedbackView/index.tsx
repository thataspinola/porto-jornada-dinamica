'use client'

import { Notification } from '@porto-stack/ui'
import { clsx } from '@porto-stack/ui/utils'
import type { ComponentProps, CSSProperties, ReactNode } from 'react'

import { FixedButtonWrapper } from '@/components/UI/FixedButtonWrapper/FixedButtonWrapper'
import { Icon, type IconName } from '@/components/UI/Icon'
import { Text } from '@/components/UI/Text/Text'

import styles from './styles.module.scss'
import type { FeedbackViewStyles, FeedbackViewTone } from './types'

type NotificationRootProps = ComponentProps<typeof Notification.Root>
type TextProps = ComponentProps<typeof Text>

const toneTitle: Record<
  FeedbackViewTone,
  Pick<TextProps, 'variant' | 'weight'> & {
    color: 'seguro-900' | 'neutral-black'
  }
> = {
  positive: {
    variant: 'title4',
    weight: 'bold',
    color: 'seguro-900',
  },
  'super-positive': {
    variant: 'title4',
    weight: 'bold',
    color: 'seguro-900',
  },
  negative: {
    variant: 'title4',
    weight: 'semibold',
    color: 'neutral-black',
  },
}

export type FeedbackViewProps = {
  styles?: FeedbackViewStyles
  tone?: FeedbackViewTone
  icon?: IconName
  iconSize?: number
  title: string
  description?: string
  notification?: {
    title?: string
    text: string
    variant?: NotificationRootProps['variant']
    styles?: NotificationRootProps['styles']
  }
  disclaimer?: string
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export function FeedbackView({
  styles: feedbackStyles = 'porto-holding',
  tone = 'positive',
  icon,
  iconSize = 64,
  title,
  description,
  notification,
  disclaimer,
  children,
  className,
  style,
}: FeedbackViewProps) {
  const titleProps = toneTitle[tone]

  return (
    <section
      className={clsx(styles.root, className)}
      style={style}
      data-styles={feedbackStyles}
      data-tone={tone}
    >
      <div className={styles.content}>
        {icon && (
          <Icon
            icon={icon}
            size={iconSize}
            color={titleProps.color}
            className={styles.icon}
          />
        )}

        <div className={styles.header}>
          <Text text={title} as='h1' {...titleProps} />

          {description && (
            <Text text={description} variant='body1' color='neutral-800' />
          )}
        </div>

        {disclaimer && (
          <Text
            text={disclaimer}
            variant='caption'
            color='neutral-800'
            className={styles.disclaimer}
            dangerousHtml
          />
        )}

        {notification && (
          <Notification.Root
            variant={notification.variant}
            styles={notification.styles}
            className={styles.notification}
          >
            {notification.title && (
              <Notification.Title>{notification.title}</Notification.Title>
            )}

            <Notification.Description>
              {notification.text}
            </Notification.Description>
          </Notification.Root>
        )}
      </div>

      {children && (
        <FixedButtonWrapper className={styles.cta}>
          {children}
        </FixedButtonWrapper>
      )}
    </section>
  )
}
