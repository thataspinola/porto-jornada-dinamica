import {
  OCCUPATION_FIELD_NAMES,
  OCCUPATIONS_WITH_PROFESSION
} from '@/components/Elements/OccupationElement/constants'

import {
  optionalNumber,
  optionalString,
  requiredString
} from '@/validation/primitives'

import type { ElementHandler } from './types'

export const occupation: ElementHandler<'OCCUPATION'> = ({ required }) => ({
  schema: {
    [OCCUPATION_FIELD_NAMES.occupation]: required
      ? requiredString('Insira a sua ocupação.')
      : optionalString(),
    [OCCUPATION_FIELD_NAMES.occupationIncome]: optionalNumber(),
    [OCCUPATION_FIELD_NAMES.occupationProfession]: optionalString()
  },
  defaultValues: {
    [OCCUPATION_FIELD_NAMES.occupation]: '',
    [OCCUPATION_FIELD_NAMES.occupationIncome]: undefined,
    [OCCUPATION_FIELD_NAMES.occupationProfession]: ''
  },
  refine: (data, ctx) => {
    const occupation = data[OCCUPATION_FIELD_NAMES.occupation] as string
    if (!occupation) return

    const income = data[OCCUPATION_FIELD_NAMES.occupationIncome]
    if (typeof income !== 'number' || income <= 0) {
      ctx.addIssue({
        path: [OCCUPATION_FIELD_NAMES.occupationIncome],
        code: 'custom',
        message: 'Insira o valor da sua renda.'
      })
    }

    const showProfession = OCCUPATIONS_WITH_PROFESSION.includes(occupation)
    const profession = data[OCCUPATION_FIELD_NAMES.occupationProfession]
    if (showProfession && (!profession || String(profession).trim() === '')) {
      ctx.addIssue({
        path: [OCCUPATION_FIELD_NAMES.occupationProfession],
        code: 'custom',
        message: 'Insira a sua profissão.'
      })
    }
  }
})
