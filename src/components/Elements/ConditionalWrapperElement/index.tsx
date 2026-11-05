'use client'

import { Fragment } from 'react'

import { renderJourneyElement } from '@/components/Core/JourneyRenderElements/renderJourneyElement'
import type { JourneyElement } from '@/components/Core/JourneyRenderElements/types'

import styles from './styles.module.scss'
import type { ConditionalWrapperElementProps } from './types'
import { useConditionalVisibility } from './useConditionalVisibility'

export function ConditionalWrapperElement({
  element
}: ConditionalWrapperElementProps) {
  const { checks, children, cssProperties } = element.config
  const isVisible = useConditionalVisibility(checks)

  if (!isVisible) {
    return null
  }

  return (
    <div className={styles.wrapper} style={cssProperties}>
      {children.map((child) => (
        <Fragment key={child.id}>
          {renderJourneyElement(child as JourneyElement)}
        </Fragment>
      ))}
    </div>
  )
}
