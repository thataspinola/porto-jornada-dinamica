'use client'

import { Fragment } from 'react'

import { renderJourneyElement } from '@/components/Core/JourneyRenderElements/renderJourneyElement'
import type { JourneyElement } from '@/components/Core/JourneyRenderElements/types'

import type { JourneyDefinition } from '@/validation/schemas'

type BoxElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'BOX' }
>

type BoxElementProps = {
  element: BoxElementType
}

export function BoxElement({ element }: BoxElementProps) {
  const { children, cssProperties } = element.config

  return (
    <div style={cssProperties}>
      {children.map((child) => (
        <Fragment key={child.id}>
          {renderJourneyElement(child as JourneyElement)}
        </Fragment>
      ))}
    </div>
  )
}
