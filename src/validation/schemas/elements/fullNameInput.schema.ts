import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { inputUiFields } from './elementUi.schemas'
import { validationsSchema } from './validations.schema'

export const fullNameInputElementSchema = baseElementSchema.extend({
  type: z.literal('FULL_NAME_INPUT'),
  config: z.object({
    label: z.string().default('Nome completo'),
    placeholder: z.string().default(''),
    required: z.boolean().default(false),
    name: z.string().default('name'),
    validations: validationsSchema,
    defaultValue: z.string().default(''),
    defaultValueFrom: z.any().optional(),
    ...inputUiFields
  })
})
