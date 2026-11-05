import { IconCheck } from '@porto-stack/icons'

import { Text } from '@/components/UI/Text/Text'

import styles from './ChecklistElement.module.scss'
import type { ChecklistElementProps } from './ChecklistElement.types'

export function ChecklistElement({ element }: ChecklistElementProps) {
  const { items, cssProperties } = element.config

  return (
    <ul className={styles.container} style={cssProperties}>
      {items.map((requirement) => (
        <li key={requirement}>
          <Text as="p" variant="body1" color="neutral-800" text={requirement} />
          <IconCheck size={24} color="neutral-black" />
        </li>
      ))}
    </ul>
  )
}
