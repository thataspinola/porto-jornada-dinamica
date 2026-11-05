'use client'

import { Modal } from '@porto-stack/ui'
import { useEffect, useRef } from 'react'

import { pushEvent } from '@/utils'

import { useSearchParam } from '@/hooks/useSearchParam'

import type { PlanViewModel } from '@/components/Elements/PlanCardElement/hooks'
import { Text } from '@/components/UI'

import styles from './PlanCoverageDrawer.module.scss'

type PlanCoverageDrawerProps = {
  plan: PlanViewModel
  slug: string
}

export function PlanCoverageDrawer({ plan, slug }: PlanCoverageDrawerProps) {
  const [activeDrawer, setActiveDrawer] = useSearchParam('drawer')
  const isOpen = activeDrawer === slug
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const base = `${window.location.origin}${window.location.pathname}`

    if (isOpen) {
      pushEvent({
        event: 'page_view',
        pageLocation: `${base}/modal/${slug}`
      })
      wasOpenRef.current = true
      return
    }

    if (wasOpenRef.current) {
      pushEvent({ event: 'page_view', pageLocation: base })
      wasOpenRef.current = false
    }
  }, [isOpen, slug])

  function handleOpenChange(open: boolean) {
    if (open) return

    setActiveDrawer(null)
  }

  return (
    <Modal.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Content mobileSheet>
        <Modal.Body>
          <div className={styles.content}>
            <Text text={plan.title} variant="title6" weight="medium" />

            {plan.coverageDetails.map((coverage, index) => (
              <div
                key={`${coverage.title}-${index}`}
                className={styles.coverage}>
                <div className={styles.coverageHeader}>
                  <Text text={coverage.title} variant="body2" weight="bold" />
                  {coverage.value && (
                    <Text text={coverage.value} variant="body2" weight="bold" />
                  )}
                </div>

                {coverage.description && (
                  <Text text={coverage.description} variant="body2" />
                )}
              </div>
            ))}

            {plan.serviceDetails && (
              <div className={styles.services}>
                <Text
                  text={plan.serviceDetails.title}
                  variant="body2"
                  weight="bold"
                />

                {plan.serviceDetails.description && (
                  <Text
                    text={plan.serviceDetails.description}
                    variant="body2"
                  />
                )}

                <div className={styles.serviceList}>
                  {plan.serviceDetails.items.map((service, index) => (
                    <Text
                      key={`${service}-${index}`}
                      text={`• ${service}`}
                      variant="body2"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  )
}
