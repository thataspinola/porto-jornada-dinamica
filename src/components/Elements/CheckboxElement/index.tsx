'use client'

import { Checkbox } from '@porto-stack/ui'
import { Controller, useFormContext } from 'react-hook-form'

import { buildGtmAttrs, pushEvent } from '@/utils'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import { Text } from '@/components/UI/Text/Text'

import type { JourneyDefinition } from '@/validation/schemas'

import styles from './CheckboxElement.module.scss'

type CheckboxElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'CHECKBOX' }
>

type CheckboxElementProps = {
  element: CheckboxElementType
}

export function CheckboxElement({ element }: CheckboxElementProps) {
  const { control } = useFormContext()
  const { stepTitle } = useJourneyStepForm()
  const { name, label, cssProperties } = element.config
  const { text, ...labelProps } = label
  const gtmAttrs = buildGtmAttrs({
    kind: 'click-component',
    stepTitle,
    componentName: 'checkbox',
    label: name
  })

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        // biome-ignore lint/a11y/noLabelWithoutControl: </>
        <label {...gtmAttrs} className={styles.checkbox} style={cssProperties}>
          <Checkbox
            checked={field.value}
            onCheckedChange={(checked) => {
              const isChecked =
                checked === 'indeterminate' ? false : Boolean(checked)

              field.onChange(isChecked)

              pushEvent({
                event: 'select_content',
                evLabel: typeof text === 'string' ? text : String(text ?? name),
                evAction: `${isChecked ? 'check' : 'uncheck'}:${stepTitle}`
              })
            }}
          />
          <Text
            className={styles.label}
            variant="body2"
            {...labelProps}
            text={text}
            dangerousHtml
          />
        </label>
      )}
    />
  )
}
