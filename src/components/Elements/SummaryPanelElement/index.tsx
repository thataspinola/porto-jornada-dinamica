'use client'

import type { CSSProperties } from 'react'
import { Fragment } from 'react'

import { renderJourneyElement } from '@/components/Core/JourneyRenderElements/renderJourneyElement'
import type { JourneyElement } from '@/components/Core/JourneyRenderElements/types'
import { FixedWrapper } from '@/components/UI'

import { usePanelHeight } from './hooks/usePanelHeight'
import styles from './SummaryPanelElement.module.scss'
import type { SummaryPanelElementProps } from './types'

export function SummaryPanelElement({ element }: SummaryPanelElementProps) {
  const { children } = element.config
  const { panelRef, panelHeight } = usePanelHeight()

  return (
    <>
      <FixedWrapper fixedMode="mobile" fixedPosition="bottom-center">
        <div ref={panelRef} className={styles.panelMeasure}>
          <div className={styles.panel}>
            {children.map((child) => (
              <Fragment key={child.id}>
                {renderJourneyElement(child as JourneyElement)}
              </Fragment>
            ))}
          </div>
        </div>
      </FixedWrapper>

      <div
        aria-hidden
        className={styles.scrollSpacer}
        style={
          {
            '--content-panel-spacer-height': `${panelHeight}px`
          } as CSSProperties
        }
      />
    </>
  )
}
