'use client'

import { Dialog as DialogPrimitive } from '@porto-stack/ui'
import { clsx } from '@porto-stack/ui/utils'
import type { ComponentProps } from 'react'

import styles from './Dialog.module.scss'

type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content>

const Content = ({ className, ...props }: DialogContentProps) => (
  <DialogPrimitive.Content
    className={clsx(styles.maxWidth, className)}
    {...props}
  />
)

type DialogFooterProps = ComponentProps<typeof DialogPrimitive.Footer> & {
  flexDirectionRow?: boolean
}

const Footer = ({
  className,
  flexDirectionRow = true,
  ...props
}: DialogFooterProps) => (
  <DialogPrimitive.Footer
    className={clsx(flexDirectionRow && styles.flexDirectionRow, className)}
    {...props}
  />
)

export const Dialog = {
  ...DialogPrimitive,
  Content,
  Footer
}
