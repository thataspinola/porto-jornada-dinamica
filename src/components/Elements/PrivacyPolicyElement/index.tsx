import { Typography } from '@porto-stack/ui'

import styles from './styles.module.scss'
import type { PrivacyPolicyElementProps } from './types'

export function PrivacyPolicyElement({ element }: PrivacyPolicyElementProps) {
  const { text } = element.config

  return (
    <Typography
      color="neutral-700"
      variant="body2"
      className={styles.container}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: </>
      dangerouslySetInnerHTML={{ __html: text }}
    />
  )
}
