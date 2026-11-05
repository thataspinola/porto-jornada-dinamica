import { z } from 'zod'

import { baseElementSchema } from '@/validation/schemas/elements/baseElement.schema'

export const fcdcUnknownLicensePlateElementSchema = baseElementSchema.extend({
  type: z.literal('FCDC_UNKNOWN_PLATE'),
  config: z.object({
    required: z.boolean()
  })
})
