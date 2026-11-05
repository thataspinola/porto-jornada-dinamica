import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { typographyUiFields } from './elementUi.schemas'

const checkboxLabelSchema = z.object({
  text: z.string(),
  ...typographyUiFields
})

export const checkboxElementSchema = baseElementSchema.extend({
  type: z.literal('CHECKBOX'),
  config: z.object({
    label: checkboxLabelSchema,
    required: z.boolean().default(false),
    defaultValue: z.boolean().default(false),
    name: z.string()
  })
})
