'use client'

import { useFormContext } from 'react-hook-form'

import { buildGtmAttrs } from '@/utils'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import { Icon, type IconProps } from '@/components/UI/Icon'
import { IconContent } from '@/components/UI/IconContent'

import s from './styles.module.scss'
import type { OptionCardListElementProps } from './types'

type OptionCard = {
  icon: IconProps
  title: string
  description: string
  value?: string
  url: string
}

export function OptionCardListElement({ element }: OptionCardListElementProps) {
  const { name, options } = element.config
  const { setValue } = useFormContext()
  const { commitFields, navigateTo, stepTitle } = useJourneyStepForm()

  function handleSelect(option: OptionCard) {
    if (name && option.value !== undefined) {
      setValue(name, option.value)
      commitFields()
    }

    navigateTo(option.url.trim())
  }

  return (
    <ul className={s.list}>
      {(options as OptionCard[])?.map((option) => (
        <li key={`${option.icon.icon}-${option.title}`}>
          <button
            type="button"
            {...buildGtmAttrs({
              kind: 'click-component',
              stepTitle,
              componentName: 'option-card',
              title: option.title,
              subtitle: option.description
            })}
            className={s.card}
            onClick={() => handleSelect(option)}>
            <IconContent.Root className={s.cardContent}>
              <IconContent.Icon {...option.icon} />
              <IconContent.Content>
                <IconContent.Title variant="title6">
                  {option.title}
                </IconContent.Title>
                <IconContent.Description>
                  {option.description}
                </IconContent.Description>
              </IconContent.Content>
              <IconContent.Trailing>
                <Icon icon="short-arrow-right" size={24} color="seguro-900" />
              </IconContent.Trailing>
            </IconContent.Root>
          </button>
        </li>
      ))}
    </ul>
  )
}
