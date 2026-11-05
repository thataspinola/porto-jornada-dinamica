import { resolveStyle } from '@/utils'

import { UnregisteredComponent } from '../UnregisteredComponent'
import { renderers } from '.'
import type { ElementRenderer, JourneyElement } from './types'

function resolveElementStyle<T extends JourneyElement>(element: T): T {
  if (!('cssProperties' in element.config) || !element.config.cssProperties) {
    return element
  }

  return {
    ...element,
    config: {
      ...element.config,
      cssProperties: resolveStyle(element.config.cssProperties)
    }
  } as T
}

export function renderJourneyElement(element: JourneyElement) {
  const renderer = renderers[element.type]

  if (!renderer) {
    return <UnregisteredComponent type={element.type} data={element} />
  }

  return (renderer as ElementRenderer)(resolveElementStyle(element)) ?? null
}
