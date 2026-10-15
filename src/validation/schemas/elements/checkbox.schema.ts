import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { typographyUiSchema } from './elementUi.schemas'

const checkboxLabelSchema = z.object({
  text: z.string(),
  ...typographyUiSchema,
})

export const checkboxElementSchema = baseElementSchema.extend({
  type: z.literal('CHECKBOX'),
  config: z.object({
    label: checkboxLabelSchema,
    required: z.boolean().default(false),
    defaultValue: z.boolean().default(false),
    name: z.string(),
  }),
})
