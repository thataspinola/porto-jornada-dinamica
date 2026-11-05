'use client'

import { Fragment, useEffect, useRef } from 'react'

import { buildRecommendedProductsPromotion } from '@/utils/buildRecommendedProductsPromotion'
import { pushEvent } from '@/utils/pushEvent'

import { useJourneyStore } from '@/store/journeyStore'

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
  const journeySlug = useJourneyStore((state) => state.business.journeySlug)
  const promotionSent = useRef(false)

  useEffect(() => {
    if (!isVisible || promotionSent.current) return
    const event = buildRecommendedProductsPromotion(element, journeySlug)
    if (!event) return

    promotionSent.current = true
    pushEvent(event)
  }, [element, isVisible, journeySlug])

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
