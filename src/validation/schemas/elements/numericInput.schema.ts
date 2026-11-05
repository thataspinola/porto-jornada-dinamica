import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { inputUiFields } from './elementUi.schemas'
import { validationsSchema } from './validations.schema'

export const numericInputElementSchema = baseElementSchema.extend({
  type: z.literal('NUMERIC_INPUT'),
  config: z.object({
    label: z.string(),
    placeholder: z.string().optional(),
    required: z.boolean().default(false),
    name: z.string(),
    validations: validationsSchema,
    defaultValue: z.string().default(''),
    defaultValueFrom: z.any().optional(),
    ...inputUiFields
  })
})
