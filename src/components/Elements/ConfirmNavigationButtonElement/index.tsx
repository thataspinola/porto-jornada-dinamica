'use client'

import { useState } from 'react'

import { buildGtmAttrs } from '@/utils'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import { Button, Dialog } from '@/components/UI'

import type { ConfirmNavigationButtonElementProps } from './types'

export function ConfirmNavigationButtonElement({
  element
}: ConfirmNavigationButtonElementProps) {
  const {
    label,
    url,
    variant,
    styles: btnStyles,
    size,
    className,
    dialog
  } = element.config
  const { commitFields, navigateTo, stepTitle } = useJourneyStepForm()
  const [isOpen, setIsOpen] = useState(false)
  const gtmAttrs = buildGtmAttrs({
    kind: 'button',
    stepTitle,
    label
  })
  const confirmGtmAttrs = buildGtmAttrs({
    kind: 'button',
    stepTitle,
    label: dialog.confirmLabel
  })
  const cancelGtmAttrs = buildGtmAttrs({
    kind: 'button',
    stepTitle,
    label: dialog.cancelLabel
  })

  function handleConfirm() {
    setIsOpen(false)
    commitFields()
    navigateTo(url)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button
          type="button"
          {...gtmAttrs}
          variant={variant}
          styles={btnStyles}
          size={size}
          fluid
          className={className}>
          {label}
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Body>
          <Dialog.Title weight="semibold">{dialog.title}</Dialog.Title>

          {dialog.description && (
            <Dialog.Description>{dialog.description}</Dialog.Description>
          )}
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button type="button" {...cancelGtmAttrs} styles="stroke" size="sm">
              {dialog.cancelLabel}
            </Button>
          </Dialog.Close>

          <Button
            type="button"
            {...confirmGtmAttrs}
            size="sm"
            onClick={handleConfirm}>
            {dialog.confirmLabel}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
