'use client'

import { Typography } from '@porto-stack/ui'

import type { IconName } from '@/components/UI/Icon'
import { IconContent, IconContentList } from '@/components/UI/IconContentList'

import s from './styles.module.scss'
import type { WelcomeElementProps } from './types'
import { highlightTitle } from './utils/highlightTitle'

export function WelcomeElement({ element }: WelcomeElementProps) {
  const { title, titlePartToHighlight, subtitle, iconContentList } =
    element.config

  return (
    <div className={s.welcomeContainer}>
      <div className={s.content}>
        <div className={s.welcomeHeader}>
          <Typography
            as="h1"
            weight="bold"
            variant="title3"
            className={s.title}>
            {highlightTitle({
              title,
              highlight: titlePartToHighlight,
              highlightClassName: s.highlight
            })}
          </Typography>

          {subtitle && (
            <Typography as="p" variant="title5" className={s.subtitle}>
              {subtitle}
            </Typography>
          )}
        </div>

        {iconContentList && (
          <IconContentList.Root className={s.icons}>
            {iconContentList.items.map((item) => (
              <IconContentList.Item key={`${item.iconName}-${item.title}`}>
                <IconContent.Root align="center">
                  <IconContent.Icon icon={item.iconName as IconName} />
                  <IconContent.Content>
                    <IconContent.Title weight="regular">
                      {item.title}
                    </IconContent.Title>
                  </IconContent.Content>
                </IconContent.Root>
              </IconContentList.Item>
            ))}
          </IconContentList.Root>
        )}
      </div>
    </div>
  )
}
