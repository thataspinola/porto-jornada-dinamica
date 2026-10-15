import { z } from 'zod'

export const cep = (required: boolean) => {
  if (required) {
    return z
      .preprocess(
        (value: unknown) =>
          typeof value === 'string' ? value.replace(/\D/g, '') : '',
        z.string()
      )
      .refine((val: string) => val.length > 0, 'Insira um CEP.')
      .refine((val: string) => val.length === 8, 'CEP inválido')
  }

  return z
    .preprocess(
      (value: unknown) =>
        typeof value === 'string' ? value.replace(/\D/g, '') : value,
      z.string().optional()
    )
    .refine((val: string) => !val || val.length === 8, 'CEP inválido')
}
