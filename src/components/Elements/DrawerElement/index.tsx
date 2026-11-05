'use client'

import { Modal } from '@porto-stack/ui'
import { useEffect, useRef } from 'react'

import { pushEvent } from '@/utils'

import { useSearchParam } from '@/hooks/useSearchParam'

import { renderJourneyElement } from '@/components/Core/JourneyRenderElements/renderJourneyElement'

import styles from './styles.module.scss'
import type { DrawerElementProps } from './types'

function buildBasePageLocation(): string {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}${window.location.pathname}`
}

export function DrawerElement({ element }: DrawerElementProps) {
  const { slug, headerChildren, bodyChildren, footerChildren } = element.config
  const [activeDrawer, setActiveDrawer] = useSearchParam('drawer')
  const isOpen = activeDrawer === slug
  const wasOpenRef = useRef(false)

  const hasHeader = headerChildren.length > 0
  const hasBody = bodyChildren.length > 0
  const hasFooter = footerChildren.length > 0

  useEffect(() => {
    if (isOpen) {
      pushEvent({
        event: 'page_view',
        pageLocation: `${buildBasePageLocation()}/modal/${slug}`
      })
      wasOpenRef.current = true
      return
    }

    if (wasOpenRef.current) {
      pushEvent({
        event: 'page_view',
        pageLocation: buildBasePageLocation()
      })
      wasOpenRef.current = false
    }
  }, [isOpen, slug])

  function handleOpenChange(open: boolean) {
    if (open) return
    setActiveDrawer(null)
  }

  const renderChildren = (children: typeof bodyChildren) =>
    children.map((child) => (
      <div key={child.id}>{renderJourneyElement(child)}</div>
    ))

  return (
    <Modal.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Content mobileSheet>
        {hasHeader && (
          <Modal.Header>{renderChildren(headerChildren)}</Modal.Header>
        )}

        {hasBody && (
          <Modal.Body>
            <div className={styles.content}>{renderChildren(bodyChildren)}</div>
          </Modal.Body>
        )}

        {hasFooter && (
          <Modal.Footer>{renderChildren(footerChildren)}</Modal.Footer>
        )}
      </Modal.Content>
    </Modal.Root>
  )
}
