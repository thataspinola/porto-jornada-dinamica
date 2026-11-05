import { Button as ButtonPrimitive } from '@porto-stack/ui'
import { clsx } from '@porto-stack/ui/utils'
import type { ComponentProps } from 'react'

import { Loader } from '../Loader'

type ButtonProps = ComponentProps<typeof ButtonPrimitive> & {
  isLoading?: boolean
}

export const Button = ({
  children,
  disabled,
  isLoading,
  className,
  ...props
}: ButtonProps) => {
  return (
    <ButtonPrimitive
      disabled={disabled || isLoading}
      className={clsx('journeyButton', className)}
      {...props}>
      {isLoading ? <Loader /> : children}
    </ButtonPrimitive>
  )
}
