import { z } from 'zod'

export const fullName = (required: boolean) => {
  if (required) {
    return z
      .string()
      .trim()
      .min(2, 'Insira o nome completo.')
      .refine(
        (value) => value.split(' ').length >= 2,
        'Insira o nome completo.'
      )
  }

  return z.string().trim().or(z.literal(''))
}
