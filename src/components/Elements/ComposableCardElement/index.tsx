'use client'

import { Fragment } from 'react'

import { buildGtmAttrs } from '@/utils'

import { useJourneyNavigation } from '@/hooks/useJourneyNavigation'

import { renderJourneyElement } from '@/components/Core/JourneyRenderElements/renderJourneyElement'
import type { JourneyElement } from '@/components/Core/JourneyRenderElements/types'
import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import { Icon } from '@/components/UI/Icon'

import styles from './ComposableCardElement.module.scss'
import type { ComposableCardElementProps } from './types'

export function ComposableCardElement({ element }: ComposableCardElementProps) {
  const { navigateTo } = useJourneyNavigation()
  const { stepTitle } = useJourneyStepForm()
  const { children, url, cssProperties, analytics } = element.config
  const gtmAttrs = buildGtmAttrs({
    kind: 'button',
    stepTitle: analytics?.gtmName ?? stepTitle,
    label: analytics?.gtmSubname ?? ''
  })

  return (
    <div className={styles.card} style={cssProperties}>
      {url && (
        <button
          className={styles.cardAction}
          type="button"
          aria-label="Abrir card"
          onClick={() => navigateTo(url)}
          {...gtmAttrs}>
          <Icon icon="short-arrow-right" color="neutral-700" size={16} />
        </button>
      )}

      {children.map((child) => (
        <Fragment key={child.id}>
          {renderJourneyElement(child.element as JourneyElement)}
        </Fragment>
      ))}
    </div>
  )
}
