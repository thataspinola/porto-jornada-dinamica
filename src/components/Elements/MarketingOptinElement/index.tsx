'use client'

import { Checkbox, Typography } from '@porto-stack/ui'
import { Controller, useFormContext } from 'react-hook-form'

import { useJourneyStore } from '@/store/journeyStore'

import styles from './styles.module.scss'
import type { MarketingOptinElementProps } from './types'

export function MarketingOptinElement({ element }: MarketingOptinElementProps) {
  const { control } = useFormContext()

  const services = useJourneyStore((state) => state.services)

  const isMarketingOptinAccepted = services?.optinStatus === 'ACCEPTED'

  if (isMarketingOptinAccepted) {
    return null
  }

  const { name, label } = element.config

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        // biome-ignore lint/a11y/noLabelWithoutControl: </>
        <label className={styles.container}>
          <Checkbox
            onCheckedChange={(checked) =>
              checked === 'indeterminate'
                ? field.onChange(false)
                : field.onChange(checked)
            }
          />

          <Typography
            variant="body2"
            color="neutral-800"
            className={styles.label}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: </>
            dangerouslySetInnerHTML={{ __html: label }}
          />
        </label>
      )}
    />
  )
}
