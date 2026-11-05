'use client'
import { IconCircleQuestion } from '@porto-stack/icons'
import { Checkbox, Notification, Tooltip, Typography } from '@porto-stack/ui'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { buildGtmAttrs, resolveValidationAttributes, sanitize } from '@/utils'

import { useDataQuality } from '@/hooks/useDataQuality'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import { Input } from '@/components/UI'

import { DialogSocialName } from './DialogSocialName'
import styles from './SocialNameElement.module.scss'
import type { SocialNameElementProps } from './types'

export const SocialNamElement = ({ element }: SocialNameElementProps) => {
  const { control } = useFormContext()
  const { stepTitle } = useJourneyStepForm()
  const config = element.config
  const [isChecked, setIsChecked] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [hasSocialName, setHasSocialName] = useState(false)
  const { prefetch } = useDataQuality()

  const { minLength, maxLength, pattern } = resolveValidationAttributes(
    config.validations
  )

  function onConfirmSocialName() {
    setShowDialog(false)
    setHasSocialName(true)
  }

  function onCloseSocialName() {
    setShowDialog(false)
    setIsChecked(false)
    setHasSocialName(false)
  }

  return (
    <div className={styles.wrapper}>
      <Controller
        control={control}
        name="hasSocialName"
        render={({ field }) => {
          return (
            <div className={styles.checkboxWrapper}>
              {/** biome-ignore lint/a11y/noLabelWithoutControl: </> */}
              <label className={styles.checkbox}>
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    if (!checked) {
                      setHasSocialName(false)
                      field.onChange(false)
                      return setIsChecked(false)
                    }

                    if (checked === 'indeterminate') {
                      field.onChange(false)
                      return setIsChecked(false)
                    }

                    setIsChecked(checked)
                    field.onChange(true)
                    setShowDialog(true)
                  }}
                />

                <Typography variant="body2">
                  {config.label || 'Tenho nome social'}
                </Typography>
              </label>

              <Tooltip.Root>
                <Tooltip.Trigger
                  type="button"
                  aria-label="Informações sobre nome social">
                  <IconCircleQuestion size={20} />
                </Tooltip.Trigger>
                <Tooltip.Content
                  side="bottom"
                  className={styles.tooltipContent}>
                  <Tooltip.Description>
                    Nome social é o nome pelo qual a pessoa travesti ou trans se
                    identifica e é socialmente reconhecida.
                  </Tooltip.Description>
                </Tooltip.Content>
              </Tooltip.Root>
            </div>
          )
        }}
      />

      {hasSocialName && (
        <>
          <Controller
            control={control}
            name={config.name}
            render={({ field: inputField, fieldState }) => (
              <Input
                {...inputField}
                {...buildGtmAttrs({
                  kind: 'form-input',
                  stepTitle,
                  label: config.label
                })}
                minLength={minLength}
                maxLength={maxLength}
                pattern={pattern}
                label={config.label}
                value={String(inputField.value)}
                onChange={(e) =>
                  inputField.onChange(sanitize.text(e.target.value))
                }
                onBlur={() => {
                  inputField.onBlur()

                  const value = String(inputField.value ?? '').trim()

                  if (value.length >= 2) {
                    prefetch('socialName', value)
                  }
                }}
                variant="default"
                errorMessage={fieldState.error?.message ?? ''}
              />
            )}
          />

          <Notification.Root>
            <Notification.Icon>
              <IconCircleQuestion />
            </Notification.Icon>

            <Notification.Description>
              O nome social será utilizado para sua identificação na Porto. Em
              caso de ajuste em apólice e contratos vigentes, entre em contato
              com o(a) Corretor(a) responsável ou com nosso canal de
              atendimento.
            </Notification.Description>
          </Notification.Root>
        </>
      )}

      <DialogSocialName
        isOpen={showDialog}
        handleCloseSocialNameDialog={onCloseSocialName}
        handleSetSocialNameToTrue={onConfirmSocialName}
      />
    </div>
  )
}
