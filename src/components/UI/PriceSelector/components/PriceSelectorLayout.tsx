import { clsx } from '@porto-stack/ui/utils'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import styles from '../PriceSelector.module.scss'

type PriceSelectorRootProps = {
  children: ReactNode
  className?: string
}

function Root({ children, className }: PriceSelectorRootProps) {
  return <div className={clsx(styles.container, className)}>{children}</div>
}

type PriceSelectorStepperProps = {
  children: ReactNode
  className?: string
}

function Stepper({ children, className }: PriceSelectorStepperProps) {
  return <div className={clsx(styles.stepper, className)}>{children}</div>
}

type PriceSelectorBottomProps = {
  children: ReactNode
  className?: string
}

function Bottom({ children, className }: PriceSelectorBottomProps) {
  return (
    <div className={clsx(styles.bottomContainer, className)}>{children}</div>
  )
}

type PriceSelectorBoundsProps = ComponentPropsWithoutRef<'div'>

function Bounds({ children, className, ...props }: PriceSelectorBoundsProps) {
  return (
    <div className={clsx(styles.bounds, className)} {...props}>
      {children}
    </div>
  )
}

export const PriceSelectorLayout = {
  Root,
  Stepper,
  Bottom,
  Bounds
}
