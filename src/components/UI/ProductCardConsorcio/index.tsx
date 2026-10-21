'use client'

import { clsx } from '@porto-stack/ui/utils'
import type { CSSProperties } from 'react'

import { Icon, type IconName } from '@/components/UI/Icon'
import { Tag } from '@/components/UI/Tag/Tag'
import type { TagVariant } from '@/components/UI/Tag/Tag.types'
import { Text } from '@/components/UI/Text/Text'

import styles from './styles.module.scss'

type LabelValue = {
  label: string
  value: string
}

export type ProductCardConsorcioProps = {
  badge?: string
  label?: string
  value: string
  tag?: {
    text: string
    variant?: TagVariant
  }
  info?: {
    text: string
    icon?: IconName
  }
  highlight?: LabelValue
  details?: LabelValue[]
  className?: string
  style?: CSSProperties
}

export function ProductCardConsorcio({
  badge,
  label,
  value,
  tag,
  info,
  highlight,
  details,
  className,
  style,
}: ProductCardConsorcioProps) {
  const hasDetails = !!details?.length
  const hasFooter = !!highlight || hasDetails

  return (
    <article className={clsx(styles.card, className)} style={style}>
      {badge && (
        <div className={styles.badge}>
          <Text
            text={badge}
            as='span'
            variant='caption'
            weight='bold'
            color='neutral-white'
          />
        </div>
      )}

      {label && (
        <Text
          text={label}
          variant='body2'
          color='neutral-700'
          className={styles.label}
        />
      )}

      <div className={styles.valueRow}>
        <Text
          text={value}
          as='span'
          variant='title4'
          weight='bold'
          color='neutral-black'
        />
        {tag && (
          <Tag variant={tag.variant ?? 'seguro'} negative>
            {tag.text}
          </Tag>
        )}
      </div>

      {info && (
        <div className={styles.info}>
          <Icon icon={info.icon ?? 'calendar'} size={20} color='seguro-900' />
          <Text text={info.text} variant='body2' color='neutral-700' />
        </div>
      )}

      {hasFooter && (
        <div className={styles.footer}>
          {highlight && (
            <div className={styles.highlight}>
              <Text
                text={highlight.label}
                variant='body2'
                color='neutral-700'
              />
              <Text
                text={highlight.value}
                variant='title6'
                weight='bold'
                color='neutral-black'
              />
            </div>
          )}

          {hasDetails && (
            <div className={styles.details}>
              {details.map((detail: LabelValue) => (
                <div key={detail.label} className={styles.detail}>
                  <Text
                    text={`${detail.label}:`}
                    as='span'
                    variant='body2'
                    color='neutral-700'
                  />
                  <Text
                    text={detail.value}
                    as='span'
                    variant='body2'
                    weight='bold'
                    color='neutral-black'
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  )
}
