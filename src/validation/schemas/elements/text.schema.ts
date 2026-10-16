import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { typographyUiSchema } from './elementUi.schemas'

export const textElementSchema = baseElementSchema.extend({
  type: z.literal('TEXT'),
  config: z.object({ text: z.string(), ...typographyUiSchema.unwrap().shape }),
})
