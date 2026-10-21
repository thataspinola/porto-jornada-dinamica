
import { clsx } from '@porto-stack/ui/utils'
import type { ComponentProps, CSSProperties } from 'react'

import styles from './FixedWrapper.module.scss'

export type FixedMode = 'none' | 'mobile' | 'all'

export type FixedPosition = 'bottom-center'

type FixedWrapperProps = ComponentProps<'div'> & {
  fixedMode?: FixedMode
  fixedPosition?: FixedPosition
  zIndex?: number
  fillHeight?: boolean
}

export function FixedWrapper({
  fixedMode = 'none',
  fixedPosition = 'bottom-center',
  zIndex = 20,
  fillHeight = false,
  className,
  style,
  ...props
}: FixedWrapperProps) {
  const isFixed = fixedMode !== 'none'

  return (
    <div
      className={clsx(
        styles.wrapper,
        fillHeight && styles.fillHeight,
        fixedMode === 'mobile' && styles.fixedMobile,
        fixedMode === 'all' && styles.fixedAll,
        isFixed && fixedPosition === 'bottom-center' && styles.bottomCenter,
        className
      )}
      style={
        {
          ...style,
          '--fixed-wrapper-z-index': String(zIndex)
        } as CSSProperties
      }
      {...props}
    />
  )
}
