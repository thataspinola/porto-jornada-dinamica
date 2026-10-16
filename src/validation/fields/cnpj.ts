import { z } from 'zod'

import { sanitize } from '@/utils'

import { isMaskedCnpj } from './maskedValue'

// Valor numérico oficial p/ cálculo do DV: ASCII do caractere menos 48 (Receita Federal).
const caractereValor = (char: string) => char.charCodeAt(0) - 48

const calcularDigito = (base: string, pesos: number[]) => {
  const soma = base
    .split('')
    .reduce(
      (acc: number, char: string, i: number) =>
        acc + caractereValor(char) * pesos[i],
      0,
    )
  const resto = soma % 11
  return resto < 2 ? 0 : 11 - resto
}

const validateCNPJ = (cnpj: string) => {
  if (cnpj.length !== 14 || /^(.)\1{13}$/.test(cnpj)) return false

  const base = cnpj.slice(0, 12)
  const primeiroDV = calcularDigito(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const segundoDV = calcularDigito(
    base + primeiroDV,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  )

  return cnpj.slice(12) === `${primeiroDV}${segundoDV}`
}

export const cnpj = (required: boolean) => {
  const baseValidation = z.preprocess((value: unknown) => {
    if (typeof value !== 'string') return value
    if (value.includes('*')) return value
    return sanitize.alphanumericUpper(value)
  }, z.string().optional())

  if (required) {
    return baseValidation
      .refine(
        (val: string) => val !== undefined && val.length > 0,
        'Insira o seu CNPJ.',
      )
      .refine(
        (val: string) => isMaskedCnpj(val) || (val && val.length === 14),
        'Informe um número de CNPJ válido.',
      )
      .refine(
        (val: string) => isMaskedCnpj(val) || (val && validateCNPJ(val)),
        'Informe um número de CNPJ válido.',
      )
  }

  return baseValidation
    .refine(
      (val: string) => !val || isMaskedCnpj(val) || val.length === 14,
      'Informe um número de CNPJ válido.',
    )
    .refine(
      (val: string) => !val || isMaskedCnpj(val) || validateCNPJ(val),
      'Informe um número de CNPJ válido.',
    )
}
