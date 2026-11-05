import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { typographyUiFields } from './elementUi.schemas'

const labelValueTextSchema = z.object({
  text: z.string(),
  ...typographyUiFields
})

export const labelValueElementSchema = baseElementSchema.extend({
  type: z.literal('LABEL_VALUE'),
  config: z.object({
    label: labelValueTextSchema,
    value: labelValueTextSchema
  })
})
