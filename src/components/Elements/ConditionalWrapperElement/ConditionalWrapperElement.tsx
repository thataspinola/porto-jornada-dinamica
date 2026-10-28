'use client'

import { useEffect, useRef } from 'react'

import { pushEvent } from '@/utils/pushEvent'
import { buildRecommendedProductsPromotion } from '@/utils/buildRecommendedProductsPromotion'

import styles from './ConditionalWrapperElement.module.scss'
import type { ConditionalWrapperElementProps } from './types'
import { useConditionalVisibility } from './useConditionalVisibility'

export function ConditionalWrapperElement({
  element,
  context,
  journeySlug,
  renderElement,
}: ConditionalWrapperElementProps) {
  const isVisible = useConditionalVisibility(element, context)
  const sent = useRef(false)

  useEffect(() => {
    if (
      !isVisible ||
      sent.current ||
      typeof window === 'undefined' ||
      !window.dataLayer
    )
      return
    const event = buildRecommendedProductsPromotion({
      wrapperId: element.id,
      journeySlug,
      children: element.config.children,
    })
    if (!event) return
    pushEvent(event)
    sent.current = true
  }, [isVisible, element.id, element.config.children, journeySlug])

  if (!isVisible) return null
  return (
    <div
      id={element.id}
      className={styles.wrapper}
      style={element.config.cssProperties}
    >
      {element.config.children.map((child) => (
        <div key={child.id}>{renderElement(child)}</div>
      ))}
    </div>
  )
}
