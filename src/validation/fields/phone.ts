import { z } from 'zod'

import { isMaskedPhone } from './maskedValue'

export const phone = (required: boolean) => {
  const base = z.preprocess((value: unknown) => {
    if (typeof value !== 'string') return value
    if (value.includes('*')) return value
    return value.replace(/\D/g, '')
  }, z.string().optional())

  const isValidLength = (val: string) => val.length === 10 || val.length === 11

  if (required) {
    return base
      .refine(
        (val) => val !== undefined && val.length > 0,
        'Insira o seu celular.'
      )
      .refine(
        (val) =>
          isMaskedPhone(val) || (val !== undefined && isValidLength(val)),
        'Insira um número de celular válido.'
      )
  }

  return base.refine(
    (val) => !val || isMaskedPhone(val) || isValidLength(val),
    'Insira um número de celular válido.'
  )
}
