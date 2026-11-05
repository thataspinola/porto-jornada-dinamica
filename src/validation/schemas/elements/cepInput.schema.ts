import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { inputUiFields } from './elementUi.schemas'

export const cepInputElementSchema = baseElementSchema.extend({
  type: z.literal('CEP_INPUT'),
  config: z.object({
    label: z.string().default('CEP'),
    placeholder: z.string().default(''),
    required: z.boolean().default(false),
    name: z.string().default('addressZipCode'),
    defaultValue: z.string().default(''),
    defaultValueFrom: z.any().optional(),
    ...inputUiFields
  })
})
