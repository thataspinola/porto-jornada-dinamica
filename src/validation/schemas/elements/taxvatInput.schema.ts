import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { inputUiFields } from './elementUi.schemas'

export const taxvatInputElementSchema = baseElementSchema.extend({
  type: z.literal('TAXVAT_INPUT'),
  config: z.object({
    label: z.string().default('000.000.000-00'),
    placeholder: z.string().default(''),
    required: z.boolean().default(false),
    name: z.string().default('taxvat'),
    defaultValue: z.string().default(''),
    defaultValueFrom: z.any().optional(),
    ...inputUiFields
  })
})
