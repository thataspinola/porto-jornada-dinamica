import { z } from 'zod'

import { baseElementSchema } from '@/validation/schemas/elements/baseElement.schema'

export const reffSimulationElementSchema = baseElementSchema.extend({
  type: z.literal('REFF_SIMULATION'),
  config: z.object()
})
