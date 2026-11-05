'use client'

import { Text } from '@/components/UI/Text/Text'

import styles from './styles.module.scss'
import type { LabelValueElementProps } from './types'

export function LabelValueElement({ element }: LabelValueElementProps) {
  const { label, value, cssProperties } = element.config

  const { text: labelText, ...labelProps } = label
  const { text: valueText, ...valueProps } = value

  return (
    <div className={styles.container} style={cssProperties}>
      <Text text={labelText} {...labelProps} />
      <Text text={valueText} {...valueProps} />
    </div>
  )
}
