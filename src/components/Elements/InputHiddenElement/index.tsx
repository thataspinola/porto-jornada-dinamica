'use client'

export type { FormValues } from './types'

import { useFormContext } from 'react-hook-form'

import type { InputHiddenElementProps } from './types'

export function InputHiddenElement({ element }: InputHiddenElementProps) {
  const { register } = useFormContext()
  const config = element.config

  return <input type="hidden" {...register(config.name)} />
}
