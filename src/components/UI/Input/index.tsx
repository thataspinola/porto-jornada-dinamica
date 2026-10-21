import { InputBig, Input as InputPrimitive } from '@porto-stack/ui'
import type { ComponentProps, ReactNode } from 'react'

import styles from './Input.module.scss'

type TrailingIconProps = {
  trailingIcon?: ReactNode
}

type InputBigProps = ComponentProps<typeof InputBig> & {
  variant: 'big'
} & TrailingIconProps

type InputNormalProps = ComponentProps<typeof InputPrimitive> & {
  variant: ComponentProps<typeof InputPrimitive>['variant']
} & TrailingIconProps

export type InputProps = InputNormalProps | InputBigProps

export const Input = (props: InputProps) => {
  const { trailingIcon, ...inputProps } = props

  const field =
    inputProps.variant === 'big' ? (
      <InputBig {...omitVariant(inputProps)} />
    ) : (
      <InputPrimitive {...inputProps} />
    )

  if (!trailingIcon) {
    return field
  }

  return (
    <div className={styles.withIcon}>
      {field}
      <span className={styles.trailingIcon} aria-hidden>
        {trailingIcon}
      </span>
    </div>
  )
}

function omitVariant(
  props: Omit<InputBigProps, 'trailingIcon'>
): ComponentProps<typeof InputBig> {
  const { variant: _variant, ...rest } = props

  return rest
}
