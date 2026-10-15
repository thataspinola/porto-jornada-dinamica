import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'

export const locationBoxElementSchema = baseElementSchema.extend({
  type: z.literal('LOCATION_BOX'),
  config: z.object({
    firstLine: z.string(),
    secondLine: z.string(),
    redirectTo: z.string().optional(),
  }),
})
