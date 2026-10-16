import { z } from 'zod'

import { OCCUPATION_FIELD_NAMES } from '@/components/Elements/OccupationElement/constants'

import {
  optionalNumber,
  optionalString,
  requiredString,
} from '@/validation/primitives'

import type { ElementHandler } from './types'

export const occupation: ElementHandler<'OCCUPATION'> = ({
  name,
  required,
  professionsRequiredFor,
}) => ({
  schema: {
    [name]: required
      ? requiredString('Insira a sua ocupação.')
      : optionalString(),
    [OCCUPATION_FIELD_NAMES.occupationIncome]: optionalNumber(),
    [OCCUPATION_FIELD_NAMES.occupationProfession]: optionalString(),
  },
  defaultValues: {
    [name]: '',
    [OCCUPATION_FIELD_NAMES.occupationIncome]: undefined,
    [OCCUPATION_FIELD_NAMES.occupationProfession]: '',
  },
  refine: (data: Record<string, unknown>, ctx: z.RefinementCtx) => {
    const occupation = data[name] as string
    if (!occupation) return

    const income = data[OCCUPATION_FIELD_NAMES.occupationIncome]
    if (typeof income !== 'number' || income <= 0) {
      ctx.addIssue({
        path: [OCCUPATION_FIELD_NAMES.occupationIncome],
        code: 'custom',
        message: 'Insira o valor da sua renda.',
      })
    }

    const showProfession = professionsRequiredFor.includes(occupation)
    const profession = data[OCCUPATION_FIELD_NAMES.occupationProfession]
    if (showProfession && (!profession || String(profession).trim() === '')) {
      ctx.addIssue({
        path: [OCCUPATION_FIELD_NAMES.occupationProfession],
        code: 'custom',
        message: 'Insira a sua profissão.',
      })
    }
  },
})
