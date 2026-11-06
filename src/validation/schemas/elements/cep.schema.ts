import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { inputUiFields } from './elementUi.schemas'

export const cepElementSchema = baseElementSchema.extend({
  type: z.literal('CEP'),
  config: z.object({
    required: z.boolean().default(true),
    ...inputUiFields
  })
})
