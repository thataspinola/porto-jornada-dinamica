import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { typographyUiFields } from './elementUi.schemas'

export const titleElementSchema = baseElementSchema.extend({
  type: z.literal('TITLE'),
  config: z.object({
    text: z.string(),
    ...typographyUiFields
  })
})
