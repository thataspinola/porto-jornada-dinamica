import { clsx } from '@porto-stack/ui/utils'
import type { CSSProperties } from 'react'
import { Fragment } from 'react'

import { renderJourneyElement } from '@/components/Core/JourneyRenderElements/renderJourneyElement'
import type { JourneyElement } from '@/components/Core/JourneyRenderElements/types'

import styles from './styles.module.scss'
import type { GridElementProps } from './types'

export function GridElement({ element }: GridElementProps) {
  const {
    gap = 24,
    columns = 12,
    stretchItems = false,
    children,
    cssProperties
  } = element.config

  const gridStyle = {
    ...cssProperties,
    '--grid-columns': String(columns),
    '--grid-gap': `var(--ui-spacing-${gap})`
  } as CSSProperties

  return (
    <div
      className={clsx(styles.grid, stretchItems && styles.gridStretch)}
      style={gridStyle}>
      {children.map((item) => {
        const { colSpan } = item.config
        const colSpanDesktop =
          typeof colSpan === 'object' ? colSpan.desktop : colSpan
        const colSpanMobile =
          typeof colSpan === 'object' ? colSpan.mobile : colSpan

        return (
          <div
            key={item.id}
            className={clsx(
              styles.gridItem,
              stretchItems && styles.gridItemStretch
            )}
            style={
              {
                '--col-span-desktop': String(colSpanDesktop),
                '--col-span-mobile': String(colSpanMobile)
              } as CSSProperties
            }>
            {item.config.children.map((child) => (
              <Fragment key={child.id}>
                {renderJourneyElement(child as JourneyElement)}
              </Fragment>
            ))}
          </div>
        )
      })}
    </div>
  )
}
