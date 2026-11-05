import { z } from 'zod'

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

const toDayMonthYearDigits = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined

  const iso = value.match(ISO_DATE_PATTERN)
  if (iso) return `${iso[3]}${iso[2]}${iso[1]}`

  return value.replace(/\D/g, '')
}

const isValidDate = (digits: string): boolean => {
  const day = parseInt(digits.slice(0, 2), 10)
  const month = parseInt(digits.slice(2, 4), 10)
  const year = parseInt(digits.slice(4, 8), 10)

  if (month < 1 || month > 12) return false
  if (day < 1 || day > 31) return false
  if (year < 1900) return false

  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

const isFutureDate = (digits: string): boolean => {
  const day = parseInt(digits.slice(0, 2), 10)
  const month = parseInt(digits.slice(2, 4), 10)
  const year = parseInt(digits.slice(4, 8), 10)

  const inputDate = new Date(year, month - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return inputDate > today
}

export const birthDate = (required: boolean) => {
  const base = z.string().optional()

  const digits = (val: string | undefined) => toDayMonthYearDigits(val) ?? ''

  if (required) {
    return base
      .refine((val) => !!val, 'Insira a sua data de nascimento.')
      .refine(
        (val) => digits(val).length === 8,
        'Por favor, insira uma data completa (DD/MM/AAAA).'
      )
      .refine(
        (val) => isValidDate(digits(val)),
        'Data inválida. Por favor, verifique os dados.'
      )
      .refine(
        (val) => !isFutureDate(digits(val)),
        'A data de nascimento não pode ser uma data futura.'
      )
  }

  return base
    .refine(
      (val) => !val || digits(val).length === 8,
      'Por favor, insira uma data completa (DD/MM/AAAA).'
    )
    .refine(
      (val) => !val || isValidDate(digits(val)),
      'Data inválida. Por favor, verifique os dados.'
    )
    .refine(
      (val) => !val || !isFutureDate(digits(val)),
      'A data de nascimento não pode ser uma data futura.'
    )
}
