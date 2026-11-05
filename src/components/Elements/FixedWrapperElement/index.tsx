'use client'

import { Fragment } from 'react'

import { renderJourneyElement } from '@/components/Core/JourneyRenderElements/renderJourneyElement'
import type { JourneyElement } from '@/components/Core/JourneyRenderElements/types'
import { FixedWrapper } from '@/components/UI'

import type { FixedWrapperElementProps } from './types'

export function FixedWrapperElement({ element }: FixedWrapperElementProps) {
  const {
    fixedMode,
    fixedPosition,
    zIndex,
    fillHeight,
    children,
    cssProperties
  } = element.config

  return (
    <FixedWrapper
      fixedMode={fixedMode}
      fixedPosition={fixedPosition}
      zIndex={zIndex}
      style={cssProperties}
      fillHeight={fillHeight}>
      {children.map((child) => (
        <Fragment key={child.id}>
          {renderJourneyElement(child as JourneyElement)}
        </Fragment>
      ))}
    </FixedWrapper>
  )
}
