import { z } from 'zod'

import { isMaskedCpf } from './maskedValue'

const validateCPF = (cpf: string) => {
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false

  const digits = cpf.split('').map((el: string) => +el)

  const rest = (count: number) =>
    ((digits
      .slice(0, count - 1)
      .reduce(
        (soma: number, el: number, i: number) => soma + el * (count - i),
        0
      ) *
      10) %
      11) %
    10

  return rest(10) === digits[9] && rest(11) === digits[10]
}

export const cpf = (required: boolean) => {
  const baseValidation = z.preprocess((value: unknown) => {
    if (typeof value !== 'string') return value
    if (value.includes('*')) return value
    return value.replace(/\D/g, '')
  }, z.string().optional())

  if (required) {
    return baseValidation
      .refine(
        (val: string) => val !== undefined && val.length > 0,
        'Insira o seu CPF.'
      )
      .refine(
        (val: string) => isMaskedCpf(val) || (val && val.length === 11),
        'Informe um número de CPF válido.'
      )
      .refine(
        (val: string) => isMaskedCpf(val) || (val && validateCPF(val)),
        'Informe um número de CPF válido.'
      )
  }

  return baseValidation
    .refine(
      (val: string) => !val || isMaskedCpf(val) || val.length === 11,
      'Informe um número de CPF válido.'
    )
    .refine(
      (val: string) => !val || isMaskedCpf(val) || validateCPF(val),
      'Informe um número de CPF válido.'
    )
}
