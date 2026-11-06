'use client'

import { IconCircleQuestion } from '@porto-stack/icons'
import { Typography } from '@porto-stack/ui'

import { Button, Dialog } from '@/components/UI'

import styles from '../BiologicalSexElement.module.scss'

export function DialogLimitedOptions() {
  return (
    <Dialog.Root>
      <Dialog.Trigger type="button" className={styles.trigger}>
        <IconCircleQuestion size={16} color="seguro-900" />
        <Typography variant="caption" color="seguro-900">
          Por que não há mais opções?
        </Typography>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Body>
          <Dialog.Title>Por que não há mais opções?</Dialog.Title>
          <Dialog.Description>
            As opções são limitadas porque o Banco Central exige dados iguais ao
            documento de identidade. Mas você pode informar seu nome social logo
            acima.
          </Dialog.Description>
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button type="button">Entendi</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
