'use client'

import { Typography } from '@porto-stack/ui'
import type { ComponentProps } from 'react'
import { useShallow } from 'zustand/shallow'

import { interpolateTemplate } from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

type TypographyProps = ComponentProps<typeof Typography>

export type TextProps = TypographyProps & {
  text: string
  dangerousHtml?: boolean
}

export function Text({ text, style, dangerousHtml, ...props }: TextProps) {
  const { fields, services, business, parameters } = useJourneyStore(
    useShallow((state) => ({
      fields: state.fields,
      services: state.services,
      business: state.business,
      parameters: state.parameters
    }))
  )

  const resolvedText =
    interpolateTemplate(
      text,
      {
        fields: { ...parameters, ...fields },
        services,
        business,
        parameters
      },
      {
        keepMissing: true
      }
    ) ?? text

  const baseProps = {
    as: props.as ?? 'p',
    variant: props.variant ?? 'body1',
    color: props.color ?? 'neutral-800',
    weight: props.weight ?? 'regular',
    ...props,
    style
  } as const

  if (dangerousHtml) {
    return (
      <Typography
        {...baseProps}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: supports inline HTML configured via JSON
        dangerouslySetInnerHTML={{ __html: resolvedText }}
      />
    )
  }

  return <Typography {...baseProps}>{resolvedText}</Typography>
}
