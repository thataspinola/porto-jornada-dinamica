import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { inputUiSchema } from './elementUi.schemas'

export const birthDateInputElementSchema = baseElementSchema.extend({
  type: z.literal('BIRTH_DATE_INPUT'),
  config: z.object({
    label: z.string().default('Data de nascimento'),
    placeholder: z.string().default(''),
    required: z.boolean().default(false),
    name: z.string().default('birthDate'),
    defaultValue: z.string().default(''),
    defaultValueFrom: z.any().optional(),
    ...inputUiSchema,
  }),
})
