import { z } from 'zod'

import type { ElementHandler } from './types'

export const biologicalSex: ElementHandler<'BIOLOGICAL_SEX'> = ({
  name,
  required,
  showIntersex = true,
}: {
  name: string
  label: string
  required: boolean
  showIntersex?: boolean
}) => {
  const allowedValues = showIntersex
    ? (['BIO_GENDER_MALE', 'BIO_GENDER_FEMALE', 'BIO_GENDER_INTERSEX'] as const)
    : (['BIO_GENDER_MALE', 'BIO_GENDER_FEMALE'] as const)

  const enumSchema = z.enum(allowedValues, {
    message: 'Insira o seu sexo biológico.',
  })

  return {
    schema: {
      [name]: required
        ? enumSchema.refine((val) => Boolean(val), {
            message: 'Insira o seu sexo biológico.',
          })
        : z.union([z.literal(''), enumSchema]).optional(),
    },
    defaultValues: { [name]: '' },
  }
}
